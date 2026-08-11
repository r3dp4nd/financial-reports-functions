import {Container} from "@azure/cosmos";

import {CosmosReportGenerationRepository} from "./cosmos-report-generation.repository";

import {ReportGenerationConcurrencyError} from "../../domain/report-generation-concurrency.error";

describe("CosmosReportGenerationRepository", () => {

    let container: jest.Mocked<Container>;
    let item: jest.Mock;
    let read: jest.Mock;
    let patch: jest.Mock;
    let repository: CosmosReportGenerationRepository;

    beforeEach(() => {

        read = jest.fn();
        patch = jest.fn();
        item = jest.fn(() => ({
            read, patch
        }));

        container = {
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportGenerationRepository(container);
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

        expect(item).toHaveBeenCalledWith("REP-100", "REP-100");

        expect(result).toEqual({
            state: {
                reportId: "REP-100",
                status: "REQUESTED"
            },
            version: "\"version-1\""
        });
    });

    it("should update generated state using optimistic concurrency", async () => {

        await repository
            .updateGenerated({
                reportId: "REP-100",
                blobName: "REP-100/financial-report.xlsx",
                generatedAt: "2026-08-11T20:00:00.000Z",
                expectedVersion: "\"version-1\""
            });

        expect(patch).toHaveBeenCalledWith([{
            op: "set",
            path: "/status",
            value: "GENERATED"
        }, {
            op: "set",
            path: "/blobName",
            value: "REP-100/financial-report.xlsx"
        }, {
            op: "set",
            path: "/generatedAt",
            value: "2026-08-11T20:00:00.000Z"
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

        await expect(repository.updateGenerated({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z",
            expectedVersion: "\"version-1\""
        })).rejects.toBeInstanceOf(ReportGenerationConcurrencyError);
    });

    it("should return null for missing report", async () => {

        read.mockRejectedValue({
            code: 404
        });

        const result = await repository.findById("REP-404");

        expect(result).toBeNull();
    });

    it("should propagate unexpected Cosmos errors", async () => {

        read.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.findById("REP-100")).rejects.toThrow("Cosmos unavailable");
    });
});