import {Container} from "@azure/cosmos";

import {CosmosReportCompletionRepository} from "./cosmos-report-completion.repository";
import {ReportCompletionConcurrencyError} from "../../domain/report-completion-concurrency.error";

describe("CosmosReportCompletionRepository", () => {

    let container: jest.Mocked<Container>;
    let item: jest.Mock;
    let read: jest.Mock;
    let patch: jest.Mock;
    let repository: CosmosReportCompletionRepository;

    beforeEach(() => {

        read = jest.fn();
        patch = jest.fn();
        item = jest.fn(() => ({
            read, patch
        }));
        container = {
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportCompletionRepository(container);
    });

    it("should retrieve report with version", async () => {

        read.mockResolvedValue({
            resource: {
                id: "REP-100",
                reportId: "REP-100",
                status: "GENERATED",
                blobName: "REP-100/financial-report.xlsx",
                generatedAt: "2026-08-11T20:00:00.000Z"
            },
            etag: "\"version-1\""
        });

        const result = await repository.findById("REP-100");

        expect(item).toHaveBeenCalledWith("REP-100", "REP-100");

        expect(result).toEqual({
            state: {
                reportId: "REP-100",
                status: "GENERATED",
                blobName: "REP-100/financial-report.xlsx",
                generatedAt: "2026-08-11T20:00:00.000Z"
            },
            version: "\"version-1\""
        });
    });

    it("should complete report using optimistic concurrency", async () => {

        await repository.complete({
            reportId: "REP-100",
            completedAt: "2026-08-11T20:01:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(patch).toHaveBeenCalledWith([{
            op: "set",
            path: "/status",
            value: "COMPLETED"
        }, {
            op: "set",
            path: "/completedAt",
            value: "2026-08-11T20:01:00.000Z"
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

        await expect(repository.complete({
            reportId: "REP-100",
            completedAt: "2026-08-11T20:01:00.000Z",
            expectedVersion: "\"version-1\""
        })).rejects.toBeInstanceOf(ReportCompletionConcurrencyError);
    });

    it("should return null for missing report", async () => {

        read.mockRejectedValue({
            code: 404
        });

        const result = await repository.findById("REP-404");

        expect(result).toBeNull();
    });

    it("should propagate unexpected errors", async () => {

        read.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.findById("REP-100")).rejects.toThrow("Cosmos unavailable");
    });
});