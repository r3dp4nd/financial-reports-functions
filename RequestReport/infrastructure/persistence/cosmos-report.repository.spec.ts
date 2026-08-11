import {Container} from "@azure/cosmos";

import {CosmosReportRepository} from "./cosmos-report.repository";

describe("CosmosReportRepository", () => {

    let container: jest.Mocked<Container>;
    let repository: CosmosReportRepository;
    let upsert: jest.Mock;
    let read: jest.Mock;
    let item: jest.Mock;

    beforeEach(() => {
        upsert = jest.fn();
        read = jest.fn();
        item = jest.fn(() => ({
            read
        }));
        container = {
            items: {
                upsert
            },
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportRepository(container);
    });

    it("should save report as Cosmos document", async () => {

        const report = {
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED" as const,
            requestedAt: "2026-08-11T15:00:00.000Z"
        };

        await repository.save(report);

        expect(upsert).toHaveBeenCalledTimes(1);

        expect(upsert).toHaveBeenCalledWith({
            id: "REP-100",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });
    });

    it("should retrieve report by id", async () => {

        read.mockResolvedValue({
            resource: {
                id: "REP-100",
                reportId: "REP-100",
                customerId: "CUS-100",
                period: {
                    from: "2026-08-01",
                    to: "2026-08-31"
                },
                status: "REQUESTED",
                requestedAt: "2026-08-11T15:00:00.000Z"
            }
        });

        const result = await repository.findById("REP-100");

        expect(item).toHaveBeenCalledWith("REP-100", "REP-100");

        expect(result).toEqual({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });
    });

    it("should return null when report does not exist", async () => {

        read.mockRejectedValue({
            code: 404
        });

        const result = await repository.findById("REP-NOT-FOUND");

        expect(result).toBeNull();
    });

    it("should return null when Cosmos response has no resource", async () => {

        read.mockResolvedValue({
            resource: undefined
        });

        const result = await repository.findById("REP-100");

        expect(result).toBeNull();
    });

    it("should propagate unexpected Cosmos errors", async () => {

        read.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.findById("REP-100")).rejects.toThrow("Cosmos unavailable");
    });
});