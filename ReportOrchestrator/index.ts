import * as df from "durable-functions";

import {
    GenerateExcelActivityInput,
    GenerateExcelActivityResult,
    ReportDataResult,
    ReportOrchestrationInput
} from "./report-orchestration.types";
import {OrderReportItem} from "../GenerateReport/domain/order-report.types";
import {PaymentReportItem} from "../GenerateReport/domain/payment-report.types";
import {CustomerReportData} from "../GenerateReport/domain/customer-report.types";

const MARK_PROCESSING_ACTIVITY = "MarkReportProcessing";

const MARK_FAILED_ACTIVITY = "MarkReportFailed";

const GET_ORDERS_ACTIVITY = "GetOrders";

const GET_PAYMENTS_ACTIVITY = "GetPayments";

const GET_CUSTOMERS_ACTIVITY = "GetCustomers";

const GENERATE_EXCEL_ACTIVITY = "GenerateExcel";

const COMPLETE_GENERATION_ACTIVITY = "CompleteGeneration";

const FAILURE_CODE = "REPORT_GENERATION_FAILED";

const ACTIVITY_RETRY_OPTIONS = createActivityRetryOptions();

const FAILURE_RETRY_OPTIONS = createFailureRetryOptions();

function createActivityRetryOptions(): df.RetryOptions {
    const retryOptions = new df.RetryOptions(
        5000,
        3
    );

    retryOptions.backoffCoefficient = 2;
    retryOptions.maxRetryIntervalInMilliseconds = 30000;

    return retryOptions;
}

function createFailureRetryOptions(): df.RetryOptions {

    const retryOptions = new df.RetryOptions(
        2000,
        5
    );

    retryOptions.backoffCoefficient = 2;
    retryOptions.maxRetryIntervalInMilliseconds = 30000;

    return retryOptions;
}

const reportOrchestrator = df.orchestrator(function* (context) {

        const input = context.df.getInput() as ReportOrchestrationInput;

        try {

            yield context.df.callActivityWithRetry(MARK_PROCESSING_ACTIVITY, ACTIVITY_RETRY_OPTIONS, {
                reportId: input.reportId,
                processingAt: context.df.currentUtcDateTime.toISOString()
            });

            const dataRequest = {
                reportId: input.reportId,
                customerId: input.customerId,
                period: input.period
            };

            const tasks = [
                context.df.callActivityWithRetry(GET_ORDERS_ACTIVITY, ACTIVITY_RETRY_OPTIONS, dataRequest),
                context.df.callActivityWithRetry(GET_PAYMENTS_ACTIVITY, ACTIVITY_RETRY_OPTIONS, dataRequest),
                context.df.callActivityWithRetry(GET_CUSTOMERS_ACTIVITY, ACTIVITY_RETRY_OPTIONS, {
                    customerId:
                    input.customerId
                })
            ];

            const results = yield context.df.Task.all(tasks);

            const reportData: ReportDataResult = {
                orders: results[0] as OrderReportItem[],
                payments: results[1] as PaymentReportItem[],
                customer: results[2] as CustomerReportData
            };

            const generateExcelInput: GenerateExcelActivityInput = {
                reportId: input.reportId,
                customerId: input.customerId,
                data: reportData
            };

            const generatedReport: GenerateExcelActivityResult = yield context.df
                .callActivityWithRetry(GENERATE_EXCEL_ACTIVITY, ACTIVITY_RETRY_OPTIONS, generateExcelInput);

            yield context.df.callActivityWithRetry(COMPLETE_GENERATION_ACTIVITY, ACTIVITY_RETRY_OPTIONS, generatedReport);

            return {
                reportId: generatedReport.reportId,
                status: "GENERATED",
                blobName: generatedReport.blobName
            };

        } catch (error: unknown) {

            const failureReason: string =
                error instanceof Error
                    ? error.message
                    : "Unknown report generation failure";

            try {
                yield context.df.callActivityWithRetry(MARK_FAILED_ACTIVITY, FAILURE_RETRY_OPTIONS, {
                    reportId: input.reportId,
                    failedAt: context.df.currentUtcDateTime.toISOString(),
                    failureCode: FAILURE_CODE,
                    failureReason
                });
            } catch (error) {
            }

            throw error;

        }
    }
);

export default reportOrchestrator;