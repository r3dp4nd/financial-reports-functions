import {InvocationContext} from "@azure/functions";

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

    repository
      .findById
      .mockResolvedValue({
        state: {
          reportId: "REP-100",
          status: "GENERATED",
          blobName: "REP-100/financial-report.xlsx",
          generatedAt: "2026-08-12T16:00:00.000Z"
        },
        version: "etag-1"
      });

    const handler = createCompleteReportHandler({
      useCase,
      now: () => "2026-08-12T16:05:00.000Z"
    });

    const context = new InvocationContext();

    const message = {
      eventId: "REP-100:ReportGenerated",
      occurredAt: "2026-08-12T16:00:00.000Z",
      reportId: "REP-100",
      blobName: "REP-100/financial-report.xlsx"
    };

    await handler(message, context);

    expect(repository.complete).toHaveBeenCalledWith({
      reportId: "REP-100",
      completedAt: "2026-08-12T16:05:00.000Z",
      expectedVersion: "etag-1"
    });
  });

  it("should reject invalid message", async () => {

    const handler = createCompleteReportHandler({
      useCase,
      now: () => "2026-08-12T16:05:00.000Z"
    });

    const context = new InvocationContext();

    await expect(handler({
      reportId: "REP-100"
    }, context)).rejects.toThrow("ReportGenerated message is invalid");

    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("should propagate application failure", async () => {

    repository
      .findById
      .mockRejectedValue(new Error("Cosmos unavailable"));

    const handler = createCompleteReportHandler({
      useCase,
      now: () => "2026-08-12T16:05:00.000Z"
    });

    const context = new InvocationContext();

    const message = {
      eventId: "REP-100:ReportGenerated",
      occurredAt: "2026-08-12T16:00:00.000Z",
      reportId: "REP-100",
      blobName: "REP-100/financial-report.xlsx"
    };

    await expect(handler(message, context)).rejects.toThrow("Cosmos unavailable");
  });
});
