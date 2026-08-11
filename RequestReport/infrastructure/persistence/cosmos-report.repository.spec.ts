import {Container} from "@azure/cosmos";

import {CosmosReportRepository} from "./cosmos-report.repository";

describe("CosmosReportRepository", () => {

    let container: jest.Mocked<Container>;
    let upsert: jest.Mock;
    let repository: CosmosReportRepository;

    beforeEach(() => {

        upsert = jest.fn();

        container = {
            items: {
                upsert
            }
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportRepository(container);
    });

    it("should save report as Cosmos document", async () => {

        await repository.save({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });

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
            requestedAt: "2026-08-11T15:00:00.000Z",
            blobName: undefined,
            generatedAt: undefined,
            completedAt: undefined
        });
    });

    it("should propagate Cosmos errors", async () => {

        upsert.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.save({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("Cosmos unavailable");
    });
});