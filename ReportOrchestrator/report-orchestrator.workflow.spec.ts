import {reportOrchestratorWorkflow} from "./report-orchestrator.workflow";
import {IOrchestrationFunctionContext} from "durable-functions/lib/src/iorchestrationfunctioncontext";

describe("ReportOrchestrator workflow", () => {

    const orchestrationInput = {
        reportId: "REP-100",
        customerId: "CUS-100",
        period: {
            from: "2026-08-01",
            to: "2026-08-31"
        }
    };

    const currentUtcDateTime = new Date("2026-08-12T01:00:00.000Z");

    let callActivityWithRetry: jest.Mock;
    let taskAll: jest.Mock;
    let context: IOrchestrationFunctionContext;

    beforeEach(() => {

        callActivityWithRetry = jest.fn((activityName: string) => ({
            type: "activity",
            activityName
        }));

        taskAll = jest.fn(tasks => ({
            type: "task-all",
            tasks
        }));

        context = {
            df: {
                getInput: jest.fn(() => orchestrationInput),
                currentUtcDateTime,
                callActivityWithRetry,
                Task: {
                    all: taskAll
                }
            }
        } as unknown as IOrchestrationFunctionContext;
    });

    it("should execute report generation workflow", () => {

        const generator = reportOrchestratorWorkflow(context);

        /*
         * 1. REQUESTED → PROCESSING
         */
        const markProcessing = generator.next();

        expect(markProcessing.done).toBe(false);

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(1, "MarkReportProcessing", expect.objectContaining({
            firstRetryIntervalInMilliseconds: 5000,
            maxNumberOfAttempts: 3,
            backoffCoefficient: 2,
            maxRetryIntervalInMilliseconds: 30000
        }), {
            reportId: "REP-100",
            processingAt: "2026-08-12T01:00:00.000Z"
        });

        /*
         * 2. Fan-out
         */
        const fanOut = generator.next();

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(2, "GetOrders", expect.anything(), {
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        });

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(3, "GetPayments", expect.anything(), {
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        });

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(4, "GetCustomers", expect.anything(), {
            customerId: "CUS-100"
        });

        expect(taskAll).toHaveBeenCalledTimes(1);

        expect(fanOut.done).toBe(false);

        const orders = [{
            orderId: "ORD-100",
            customerId: "CUS-100",
            orderDate: "2026-08-10T10:00:00.000Z",
            total: 250,
            currency: "PEN",
            status: "COMPLETED"
        }];

        const payments = [{
            paymentId: "PAY-100",
            customerId: "CUS-100",
            paymentDate: "2026-08-10T12:00:00.000Z",
            amount: 250,
            currency: "PEN",
            status: "SETTLED"
        }];

        const customer = {
            customerId: "CUS-100",
            name: "Olek Customer",
            documentNumber: "DOC-100",
            segment: "PREMIUM",
            email: "customer@example.com"
        };

        /*
         * 3. Fan-in → GenerateExcel
         */
        const generateExcel = generator.next([orders, payments, customer]);

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(5, "GenerateExcel", expect.anything(), {
            reportId: "REP-100",
            customerId: "CUS-100",
            data: {
                orders, payments, customer
            }
        });

        expect(generateExcel.done).toBe(false);

        /*
         * 4. CompleteGeneration
         */
        const generatedReport = {
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        };

        const completeGeneration = generator.next(generatedReport);

        expect(callActivityWithRetry).toHaveBeenNthCalledWith(6, "CompleteGeneration", expect.anything(), generatedReport);

        expect(completeGeneration.done).toBe(false);

        /*
         * 5. Workflow completo.
         */
        const completed = generator.next();

        expect(completed.done).toBe(true);

        expect(completed.value).toEqual({
            reportId: "REP-100",
            status: "GENERATED",
            blobName: "REP-100/financial-report.xlsx"
        });
    });

    it("should mark report failed and rethrow original error", () => {

        const generator = reportOrchestratorWorkflow(context);

        /*
         * MarkReportProcessing.
         */
        generator.next();

        /*
         * Fan-out.
         */
        generator.next();

        const originalError = new Error("Payments unavailable");

        /*
         * Simulamos que Task.all terminó fallando
         * después de agotar los retries internos
         * de las Activities.
         */
        const failure = generator.throw(originalError);

        expect(failure.done).toBe(false);

        expect(callActivityWithRetry).toHaveBeenLastCalledWith("MarkReportFailed", expect.objectContaining({
            firstRetryIntervalInMilliseconds: 2000,
            maxNumberOfAttempts: 5,
            backoffCoefficient: 2,
            maxRetryIntervalInMilliseconds: 30000
        }), {
            reportId: "REP-100",
            failedAt: "2026-08-12T01:00:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Payments unavailable"
        });

        /*
         * MarkReportFailed terminó correctamente.
         * El workflow debe volver a lanzar
         * el error original.
         */
        expect(() => generator.next()).toThrow(originalError);
    });

    it("should preserve original error when MarkReportFailed also fails", () => {

        const generator = reportOrchestratorWorkflow(context);

        generator.next();
        generator.next();

        const originalError = new Error("Orders unavailable");

        /*
         * Entramos al catch principal.
         */
        generator.throw(originalError);

        /*
         * Simulamos que MarkReportFailed también
         * agotó sus retries.
         *
         * Este throw entra al catch secundario.
         */
        const markFailedError = new Error("Unable to persist FAILED");

        /*
         * Después de capturar el fallo secundario,
         * el workflow debe lanzar el original.
         */
        expect(() => generator.throw(markFailedError)).toThrow(originalError);
    });

    it("should use retry policy for every workflow activity", () => {

        const generator = reportOrchestratorWorkflow(context);

        generator.next();

        generator.next();

        generator.next([[], [], {
            customerId: "CUS-100",
            name: "Customer",
            documentNumber: "DOC-100",
            segment: "STANDARD",
            email: "customer@example.com"
        }]);

        generator.next({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        });

        const workflowCalls = callActivityWithRetry
            .mock.calls
            .map(call => call[0]);

        expect(workflowCalls).toEqual(["MarkReportProcessing", "GetOrders", "GetPayments", "GetCustomers", "GenerateExcel", "CompleteGeneration"]);
    });
});