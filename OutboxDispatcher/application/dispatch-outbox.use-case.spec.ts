import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";
import {DispatchOutboxUseCase} from "./dispatch-outbox.use-case";

describe("DispatchOutboxUseCase", () => {
  let publisher: jest.Mocked<OutboxPublisher>;
  let repository: jest.Mocked<OutboxRepository>;
  let useCase: DispatchOutboxUseCase;

  beforeEach(() => {
    publisher = {
      publish: jest.fn(),
    };

    repository = {
      findPending: jest.fn(),
      markPublished: jest.fn(),
      recordFailure: jest.fn(),
    };

    useCase = new DispatchOutboxUseCase(
      publisher,
      repository,
      () => "2026-08-11T20:00:00.000Z",
    );
  });

  it("should publish pending outbox event and mark it as published", async () => {
    const document = {
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX" as const,
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-11T20:00:00.000Z",
      status: "PENDING" as const,
      payload: {
        reportId: "REP-100",
      },
    };

    const result = await useCase.execute([document]);

    expect(publisher.publish).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledWith(document);

    expect(repository.markPublished).toHaveBeenCalledTimes(1);
    expect(repository.markPublished).toHaveBeenCalledWith(
      "REP-100",
      "REP-100:ReportRequested",
      "2026-08-11T20:00:00.000Z",
    );

    expect(result.failed).toBe(0);
  });

  it("should ignore already published events", async () => {
    const document = {
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX" as const,
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-11T20:00:00.000Z",
      status: "PUBLISHED" as const,
      payload: {},
    };

    const result = await useCase.execute([document]);

    expect(publisher.publish).not.toHaveBeenCalled();
    expect(repository.markPublished).not.toHaveBeenCalled();
    expect(repository.recordFailure).not.toHaveBeenCalled();

    expect(result.failed).toBe(0);
  });

  it("should leave event pending when publication fails", async () => {
    publisher.publish.mockRejectedValue(
      new Error("Service Bus unavailable"),
    );

    const document = {
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX" as const,
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-12T14:00:00.000Z",
      status: "PENDING" as const,
      payload: {
        reportId: "REP-100",
      },
    };

    const result = await useCase.execute([document]);

    expect(publisher.publish).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledWith(document);

    expect(repository.markPublished).not.toHaveBeenCalled();
    expect(result.failed).toBe(1);
  });
});
