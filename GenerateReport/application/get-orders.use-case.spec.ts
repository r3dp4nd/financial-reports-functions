import {GetOrdersUseCase} from "./get-orders.use-case";

import {OrderReportRepository} from "../domain/order-report.repository";

describe("GetOrdersUseCase", () => {

    let repository: jest.Mocked<OrderReportRepository>;
    let useCase: GetOrdersUseCase;

    beforeEach(() => {
        repository = {
            findByCriteria: jest.fn()
        };

        useCase = new GetOrdersUseCase(repository);
    });

    it("should retrieve orders", async () => {

        repository
            .findByCriteria
            .mockResolvedValue([{
                orderId: "ORD-100",
                customerId: "CUS-100",
                orderDate: "2026-08-10T10:00:00.000Z",
                total: 250,
                currency: "PEN",
                status: "COMPLETED"
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

        expect(repository.findByCriteria).not.toHaveBeenCalled();
    });

    it("should reject empty period.from", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "",
                to: "2026-08-31"
            }
        })).rejects.toThrow("period.from is required");
    });

    it("should reject empty period.to", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: ""
            }
        })).rejects.toThrow("period.to is required");
    });

    it("should reject invalid period.from", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "invalid",
                to: "2026-08-31"
            }
        })).rejects.toThrow("period.from is invalid");
    });

    it("should reject invalid period.to", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "invalid"
            }
        })).rejects.toThrow("period.to is invalid");
    });

    it("should reject reversed period", async () => {

        await expect(useCase.execute({
            customerId: "CUS-100",
            period: {
                from: "2026-08-31",
                to: "2026-08-01"
            }
        })).rejects.toThrow("period.from must be before or equal to period.to");
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