import {MarkReportFailedUseCase} from "./mark-report-failed.use-case";
import {ReportFailureRepository} from "../domain/report-failure.repository";
import {ReportFailureConcurrencyError} from "../domain/report-failure-concurrency.error";

describe("MarkReportFailedUseCase", () => {

    let repository: jest.Mocked<ReportFailureRepository>;
    let useCase: MarkReportFailedUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn(),
            markFailed: jest.fn()
        };

        useCase = new MarkReportFailedUseCase(repository);
    });

    it("should mark processing report as failed", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "PROCESSING"
                },
                version: "\"version-1\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable"
        });

        expect(repository.markFailed).toHaveBeenCalledWith({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable",
            expectedVersion: "\"version-1\""
        });

        expect(result).toEqual({
            reportId: "REP-100",
            status: "FAILED"
        });
    });

    it("should be idempotent when already failed", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "FAILED",
                    failedAt: "2026-08-12T00:30:00.000Z",
                    failureCode: "REPORT_GENERATION_FAILED",
                    failureReason: "Cosmos unavailable"
                },
                version: "\"version-2\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:35:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable"
        });

        expect(repository.markFailed).not.toHaveBeenCalled();

        expect(result.status).toBe("FAILED");
    });

    it("should retry after concurrency conflict", async () => {

        repository.findById
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "PROCESSING"
                },
                version: "\"version-1\""
            })
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "FAILED"
                },
                version: "\"version-2\""
            });

        repository.markFailed
            .mockRejectedValueOnce(new ReportFailureConcurrencyError("REP-100"));

        const result = await useCase.execute({
            reportId: "REP-100",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable"
        });

        expect(repository.findById).toHaveBeenCalledTimes(2);

        expect(result.status).toBe("FAILED");
    });

    it("should fail when report does not exist", async () => {

        repository.findById
            .mockResolvedValue(null);

        await expect(useCase.execute({
            reportId: "REP-404",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Failure"
        })).rejects.toThrow("Report REP-404 was not found");
    });
});