import {Container} from "@azure/cosmos";

import {CosmosOrderReportRepository} from "./cosmos-order-report.repository";

describe("CosmosOrderReportRepository", () => {

    let container: jest.Mocked<Container>;
    let query: jest.Mock;
    let fetchAll: jest.Mock;
    let repository: CosmosOrderReportRepository;

    beforeEach(() => {

        fetchAll = jest.fn();
        query = jest.fn(() => ({
            fetchAll
        }));

        container = {
            items: {
                query
            }
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosOrderReportRepository(container);
    });

    it("should query orders by customer and period", async () => {

        fetchAll.mockResolvedValue({
            resources: [{
                id: "ORD-100",
                orderId: "ORD-100",
                customerId: "CUS-100",
                orderDate: "2026-08-10T10:00:00.000Z",
                total: 250,
                currency: "PEN",
                status: "COMPLETED"
            }]
        });

        const result = await repository
            .findByCriteria({
                customerId: "CUS-100",
                period: {
                    from: "2026-08-01T00:00:00.000Z",
                    to: "2026-08-31T23:59:59.999Z"
                }
            });

        expect(query).toHaveBeenCalledTimes(1);

        const [querySpec, options] = query.mock.calls[0];

        expect(querySpec.parameters).toEqual([{
            name: "@customerId",
            value: "CUS-100"
        }, {
            name: "@from",
            value: "2026-08-01T00:00:00.000Z"
        }, {
            name: "@to",
            value: "2026-08-31T23:59:59.999Z"
        }]);

        expect(options).toEqual({
            partitionKey: "CUS-100"
        });

        expect(result).toEqual([{
            orderId: "ORD-100",
            customerId: "CUS-100",
            orderDate: "2026-08-10T10:00:00.000Z",
            total: 250,
            currency: "PEN",
            status: "COMPLETED"
        }]);
    });

    it("should return empty array when no orders exist", async () => {

        fetchAll.mockResolvedValue({
            resources: []
        });

        const result = await repository
            .findByCriteria({
                customerId: "CUS-100",
                period: {
                    from: "2026-08-01",
                    to: "2026-08-31"
                }
            });

        expect(result).toEqual([]);
    });

    it("should propagate Cosmos errors", async () => {

        fetchAll.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.findByCriteria({
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        })).rejects.toThrow("Cosmos unavailable");
    });
});