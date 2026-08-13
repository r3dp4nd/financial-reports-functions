import {GetPaymentsUseCase} from "./get-payments.use-case";

import {PaymentReportRepository} from "../domain/payment-report.repository";

describe("GetPaymentsUseCase", () => {

    let repository: jest.Mocked<PaymentReportRepository>;
    let useCase: GetPaymentsUseCase;

    beforeEach(() => {

        repository = {
            findByCriteria: jest.fn()
        };

        useCase = new GetPaymentsUseCase(repository);
    });

    it("should retrieve payments", async () => {

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

        const result = await useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        });

        expect(repository.findByCriteria).toHaveBeenCalledWith({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        });

        expect(result).toHaveLength(1);
    });

    it("should reject empty customerId", async () => {

        await expect(useCase.execute({
            customerId: "",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        })).rejects.toThrow("customerId is required");
    });

    it("should reject invalid period", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-31",
                to: "2026-08-01"
            }
        })).rejects.toThrow("from must be before or equal to to");
    });

    it("should propagate repository errors", async () => {

        repository
            .findByCriteria
            .mockRejectedValue(new Error("Repository unavailable"));

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        })).rejects.toThrow("Repository unavailable");
    });
});