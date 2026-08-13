import {MarkReportProcessingUseCase} from "./mark-report-processing.use-case";
import {ReportProcessingRepository} from "../domain/report-processing.repository";
import {ReportProcessingConcurrencyError} from "../domain/report-processing-concurrency.error";

describe("MarkReportProcessingUseCase", () => {

    let repository: jest.Mocked<ReportProcessingRepository>;
    let useCase: MarkReportProcessingUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn(),
            markProcessing: jest.fn()
        };

        useCase = new MarkReportProcessingUseCase(repository);
    });

    it("should mark requested report as processing", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "REQUESTED"
                },
                version: "\"version-1\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:30:00.000Z"
        });

        expect(repository.markProcessing).toHaveBeenCalledWith({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:30:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(result).toEqual({
            reportId: "REP-100",
            status: "PROCESSING"
        });
    });

    it("should be idempotent when already processing", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "PROCESSING",
                    processingAt: "2026-08-11T20:30:00.000Z"
                },
                version: "\"version-2\""
            });

        const result = await useCase.execute({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:35:00.000Z"
        });

        expect(repository.markProcessing).not.toHaveBeenCalled();

        expect(result.status).toBe("PROCESSING");
    });

    it("should retry after concurrency conflict", async () => {

        repository.findById
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "REQUESTED"
                },
                version: "\"version-1\""
            })
            .mockResolvedValueOnce({
                state: {
                    reportId: "REP-100",
                    status: "PROCESSING",
                    processingAt: "2026-08-11T20:30:00.000Z"
                },
                version: "\"version-2\""
            });

        repository.markProcessing
            .mockRejectedValueOnce(new ReportProcessingConcurrencyError("REP-100"));

        const result = await useCase.execute({
            reportId: "REP-100",
            processingAt: "2026-08-11T20:30:00.000Z"
        });

        expect(repository.findById).toHaveBeenCalledTimes(2);

        expect(result.status).toBe("PROCESSING");
    });

    it("should fail when report does not exist", async () => {

        repository.findById
            .mockResolvedValue(null);

        await expect(useCase.execute({
            reportId: "REP-404",
            processingAt: "2026-08-11T20:30:00.000Z"
        })).rejects.toThrow("Report REP-404 was not found");
    });
});