import {CompleteReportUseCase} from "./complete-report.use-case";
import {ReportCompletionRepository} from "../domain/report-completion.repository";
import {ReportCompletionConcurrencyError} from "../domain/report-completion-concurrency.error";

describe("CompleteReportUseCase", () => {

    let repository: jest.Mocked<ReportCompletionRepository>;
    let useCase: CompleteReportUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn(),
            complete: jest.fn()
        };

        useCase = new CompleteReportUseCase(repository);
    });

    it("should complete generated report", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "GENERATED",
                    blobName: "REP-100/financial-report.xlsx",
                    generatedAt: "2026-08-11T20:00:00.000Z"
                },
                version: "\"version-1\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            completedAt: "2026-08-11T20:01:00.000Z"
        });

        expect(repository.complete).toHaveBeenCalledWith({
            reportId: "REP-100",
            completedAt: "2026-08-11T20:01:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(result).toEqual({
            reportId: "REP-100",
            status: "COMPLETED",
            blobName: "REP-100/financial-report.xlsx"
        });
    });

    it("should be idempotent when already completed", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "COMPLETED",
                    blobName: "REP-100/financial-report.xlsx",
                    completedAt: "2026-08-11T20:01:00.000Z"
                },

                version: "\"version-2\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            completedAt: "2026-08-11T20:10:00.000Z"
        });

        expect(repository.complete).not.toHaveBeenCalled();

        expect(result.status).toBe("COMPLETED");
    });

    it("should retry after concurrency conflict", async () => {

        repository.findById
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "GENERATED",
                    blobName: "REP-100/financial-report.xlsx"
                },
                version: "\"version-1\""
            })
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "COMPLETED",
                    blobName: "REP-100/financial-report.xlsx"
                },
                version: "\"version-2\""
            });

        repository.complete
            .mockRejectedValueOnce(new ReportCompletionConcurrencyError("REP-100"));

        const result = await useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            completedAt: "2026-08-11T20:01:00.000Z"
        });

        expect(repository.findById).toHaveBeenCalledTimes(2);

        expect(result.status).toBe("COMPLETED");
    });

    it("should fail when report does not exist", async () => {

        repository.findById
            .mockResolvedValue(null);

        await expect(useCase.execute({
            reportId: "REP-404",
            blobName: "REP-404/financial-report.xlsx",
            completedAt: "2026-08-11T20:01:00.000Z"
        })).rejects.toThrow("Report REP-404 was not found");
    });

    it("should reject invalid lifecycle transition", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "REQUESTED"
                },
                version: "\"version-1\""
            });

        await expect(useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            completedAt: "2026-08-11T20:01:00.000Z"
        })).rejects.toThrow("Cannot complete report from status REQUESTED");

        expect(repository.complete).not.toHaveBeenCalled();
    });
});