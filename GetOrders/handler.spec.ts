import {Context} from "@azure/functions";

import {GetOrdersUseCase} from "../GenerateReport/application/get-orders.use-case";
import {OrderReportRepository} from "../GenerateReport/domain/order-report.repository";
import {createGetOrdersHandler} from "./handler";

describe("GetOrders handler", () => {

    let repository: jest.Mocked<OrderReportRepository>;
    let useCase: GetOrdersUseCase;

    beforeEach(() => {

        repository = {
            findByCriteria: jest.fn()
        };

        useCase = new GetOrdersUseCase(repository);
    });

    it("should return orders", async () => {

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

        const handler = createGetOrdersHandler({
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
            orderId: "ORD-100",
            customerId: "CUS-100",
            orderDate: "2026-08-10T10:00:00.000Z",
            total: 250,
            currency: "PEN",
            status: "COMPLETED"
        }]);
    });

    it("should propagate application errors", async () => {

        const handler = createGetOrdersHandler({
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