import {Container} from "@azure/cosmos";

import {CosmosReportFailureRepository} from "./cosmos-report-failure.repository";
import {ReportFailureConcurrencyError} from "../../domain/report-failure-concurrency.error";

describe("CosmosReportFailureRepository", () => {

    let container: jest.Mocked<Container>;
    let item: jest.Mock;
    let read: jest.Mock;
    let patch: jest.Mock;
    let repository: CosmosReportFailureRepository;

    beforeEach(() => {

        read = jest.fn();
        patch = jest.fn();
        item = jest.fn(() => ({
            read, patch
        }));
        container = {
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportFailureRepository(container);
    });

    it("should read report failure state with version", async () => {

        read.mockResolvedValue({
            resource: {
                id: "REP-100", reportId: "REP-100", status: "PROCESSING"
            }, etag: "\"version-1\""
        });

        const result = await repository.findById("REP-100");

        expect(result).toEqual({
            state: {
                reportId: "REP-100",
                status: "PROCESSING",
                failedAt: undefined,
                failureCode: undefined,
                failureReason: undefined
            }, version: "\"version-1\""
        });
    });

    it("should mark report failed with optimistic concurrency", async () => {

        await repository.markFailed({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable",
            expectedVersion: "\"version-1\""
        });

        expect(patch).toHaveBeenCalledWith([{
            op: "set", path: "/status", value: "FAILED"
        }, {
            op: "set", path: "/failedAt", value: "2026-08-12T00:30:00.000Z"
        }, {
            op: "set", path: "/failureCode", value: "REPORT_GENERATION_FAILED"
        }, {
            op: "set", path: "/failureReason", value: "Cosmos unavailable"
        }], {
            accessCondition: {
                type: "IfMatch", condition: "\"version-1\""
            }
        });
    });

    it("should translate concurrency conflict", async () => {

        patch.mockRejectedValue({
            code: 412
        });

        await expect(repository.markFailed({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Failure",
            expectedVersion: "\"version-1\""
        })).rejects.toBeInstanceOf(ReportFailureConcurrencyError);
    });

    it("should return null when report does not exist", async () => {

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