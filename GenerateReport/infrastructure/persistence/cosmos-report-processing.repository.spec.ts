import {Container} from "@azure/cosmos";

import {CosmosReportProcessingRepository} from "./cosmos-report-processing.repository";
import {ReportProcessingConcurrencyError} from "../../domain/report-processing-concurrency.error";

describe("CosmosReportProcessingRepository", () => {

    let container: jest.Mocked<Container>;
    let item: jest.Mock;
    let read: jest.Mock;
    let patch: jest.Mock;
    let repository: CosmosReportProcessingRepository;

    beforeEach(() => {

        read = jest.fn();
        patch = jest.fn();
        item = jest.fn(() => ({
            read, patch
        }));
        container = {
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportProcessingRepository(container);
    });

    it("should read report with version", async () => {

        read.mockResolvedValue({
            resource: {
                id: "REP-100",
                reportId: "REP-100",
                status: "REQUESTED"
            },
            etag: "\"version-1\""
        });

        const result = await repository.findById("REP-100");

        expect(result).toEqual({
            state: {
                reportId: "REP-100",
                status: "REQUESTED",
                processingAt: undefined
            },
            version: "\"version-1\""
        });
    });

    it("should mark processing using optimistic concurrency", async () => {

        await repository.markProcessing({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:30:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(patch).toHaveBeenCalledWith([{
            op: "set",
            path: "/status",
            value: "PROCESSING"
        }, {
            op: "set",
            path: "/processingAt",
            value: "2026-08-11T20:30:00.000Z"
        }], {
            accessCondition: {
                type: "IfMatch",
                condition: "\"version-1\""
            }
        });
    });

    it("should translate 412 into concurrency error", async () => {

        patch.mockRejectedValue({
            code: 412
        });

        await expect(repository.markProcessing({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:30:00.000Z",
            expectedVersion: "\"version-1\""
        })).rejects.toBeInstanceOf(ReportProcessingConcurrencyError);
    });

    it("should return null for missing report", async () => {

        read.mockRejectedValue({
            code: 404
        });

        const result = await repository.findById("REP-404");

        expect(result).toBeNull();
    });
});