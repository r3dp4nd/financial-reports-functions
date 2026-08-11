import {Context} from "@azure/functions";

import {CompleteReportUseCase} from "./application/complete-report.use-case";
import {ReportCompletionRepository} from "./domain/report-completion.repository";
import {createCompleteReportHandler} from "./handler";

describe("CompleteReport handler", () => {

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
                    blobName: "REP-100/financial-report.xlsx"
                },
                version: "\"version-1\""
            });

        const handler = createCompleteReportHandler({
            useCase,
            now: () => "2026-08-11T20:01:00.000Z"
        });

        const log = jest.fn();

        const context = {
            log
        } as unknown as Context;

        await handler(context, {
            eventId: "REP-100:ReportGenerated",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        });

        expect(repository.complete).toHaveBeenCalledWith({
            reportId: "REP-100",
            completedAt: "2026-08-11T20:01:00.000Z",
            expectedVersion: "\"version-1\""
        });

        expect(log).toHaveBeenCalledWith("Report completed", {
            reportId: "REP-100",
            status: "COMPLETED"
        });
    });

    it("should propagate processing errors", async () => {

        repository.findById
            .mockRejectedValue(new Error("Cosmos unavailable"));

        const handler = createCompleteReportHandler({
            useCase,
            now: () => "2026-08-11T20:01:00.000Z"
        });

        const context = {
            log: jest.fn()
        } as unknown as Context;

        await expect(handler(context, {
            eventId: "REP-100:ReportGenerated",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        })).rejects.toThrow("Cosmos unavailable");
    });
});