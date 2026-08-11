import {CompleteGenerationUseCase} from "./complete-generation.use-case";
import {ReportGenerationRepository} from "../domain/report-generation.repository";
import {ReportGeneratedEventPublisher} from "./report-generated-event.publisher";
import {ReportGenerationConcurrencyError} from "../domain/report-generation-concurrency.error";

describe("CompleteGenerationUseCase", () => {

    let repository: jest.Mocked<ReportGenerationRepository>;
    let publisher: jest.Mocked<ReportGeneratedEventPublisher>;
    let useCase: CompleteGenerationUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn(),
            updateGenerated: jest.fn()
        };

        publisher = {
            publish: jest.fn()
        };

        useCase = new CompleteGenerationUseCase(repository, publisher);
    });

    it("should mark report as generated and publish event", async () => {

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
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        });

        expect(repository.updateGenerated).toHaveBeenCalledWith({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(publisher.publish).toHaveBeenCalledWith({
            eventId: "REP-100:ReportGenerated",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        });

        expect(result.status).toBe("GENERATED");
    });

    it("should publish again without updating when already generated", async () => {

        repository.findById
            .mockResolvedValue({
                state: {
                    reportId: "REP-100",
                    status: "GENERATED",
                    blobName: "REP-100/financial-report.xlsx",
                    generatedAt: "2026-08-11T20:00:00.000Z"
                },
                version: "\"version-2\""
            });

        await useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:05:00.000Z"
        });

        expect(repository.updateGenerated).not.toHaveBeenCalled();

        expect(publisher.publish).toHaveBeenCalledTimes(1);
    });

    it("should retry after optimistic concurrency conflict", async () => {

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
                    status: "GENERATED",
                    blobName: "REP-100/financial-report.xlsx"
                },
                version: "\"version-2\""
            });

        repository.updateGenerated
            .mockRejectedValueOnce(new ReportGenerationConcurrencyError("REP-100"));

        const result = await useCase.execute({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        });

        expect(repository.findById).toHaveBeenCalledTimes(2);

        expect(publisher.publish).toHaveBeenCalledTimes(1);

        expect(result.status).toBe("GENERATED");
    });

    it("should fail when report does not exist", async () => {

        repository.findById
            .mockResolvedValue(null);

        await expect(useCase.execute({
            reportId: "REP-404",
            blobName: "REP-404/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        })).rejects.toThrow("Report REP-404 was not found");
    });
});