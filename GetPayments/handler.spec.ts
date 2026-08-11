import {Context} from "@azure/functions";

import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";
import {PaymentReportRepository} from "../GenerateReport/domain/payment-report.repository";
import {createGetPaymentsHandler} from "./handler";

describe("GetPayments handler", () => {

    let repository: jest.Mocked<PaymentReportRepository>;
    let useCase: GetPaymentsUseCase;

    beforeEach(() => {

        repository = {
            findByCriteria: jest.fn()
        };

        useCase = new GetPaymentsUseCase(repository);
    });

    it("should return payments", async () => {

        repository
            .findByCriteria
            .mockResolvedValue([{
                paymentId: "PAY-100",
                customerId: "CUS-100",
                paymentDate: "2026-08-10T12:00:00.000Z",
                amount: 250,
                currency: "PEN",
                status: "SETTLED"
            }]);

        const handler = createGetPaymentsHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    customerId: "CUS-100",
                    period: {
                        from: "2026-08-01",
                        to: "2026-08-31"
                    }
                }
            }
        } as unknown as Context;

        const result = await handler(context);

        expect(result).toEqual([{
            paymentId: "PAY-100",
            customerId: "CUS-100",
            paymentDate: "2026-08-10T12:00:00.000Z",
            amount: 250,
            currency: "PEN",
            status: "SETTLED"
        }]);
    });

    it("should propagate application errors", async () => {

        const handler = createGetPaymentsHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    customerId: "",
                    period: {
                        from: "2026-08-01",
                        to: "2026-08-31"
                    }
                }
            }
        } as unknown as Context;

        await expect(handler(context)).rejects.toThrow("customerId is required");
    });
});