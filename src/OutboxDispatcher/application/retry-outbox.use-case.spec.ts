import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";
import {RetryOutboxUseCase} from "./retry-outbox.use-case";

describe("RetryOutboxUseCase", () => {

  let publisher: jest.Mocked<OutboxPublisher>;
  let repository: jest.Mocked<OutboxRepository>;
  let useCase: RetryOutboxUseCase;

  beforeEach(() => {

    publisher = {
      publish: jest.fn()
    };

    repository = {
      findPending: jest.fn(),
      markPublished: jest.fn(),
      recordFailure: jest.fn()
    };

    useCase = new RetryOutboxUseCase(publisher, repository, () => "2026-08-12T15:00:00.000Z");
  });

  it("should publish pending event", async () => {

    repository.findPending
      .mockResolvedValue([{
        id: "REP-100:ReportRequested",
        reportId: "REP-100",
        docType: "OUTBOX",
        eventType: "ReportRequested",
        eventVersion: 1,
        occurredAt: "2026-08-12T14:00:00.000Z",
        status: "PENDING",
        payload: {}
      }]);

    const result = await useCase.execute();

    expect(publisher.publish).toHaveBeenCalledTimes(1);

    expect(repository.markPublished).toHaveBeenCalledWith("REP-100", "REP-100:ReportRequested", "2026-08-12T15:00:00.000Z");

    expect(result.published).toBe(1);
  });

  it("should keep event pending after recoverable failure", async () => {

    repository.findPending
      .mockResolvedValue([{
        id: "REP-100:ReportRequested",
        reportId: "REP-100",
        docType: "OUTBOX",
        eventType: "ReportRequested",
        eventVersion: 1,
        occurredAt: "2026-08-12T14:00:00.000Z",
        status: "PENDING",
        attemptCount: 1,
        payload: {}
      }]);

    publisher.publish
      .mockRejectedValue(new Error("Service Bus unavailable"));

    const result = await useCase.execute();

    expect(repository.recordFailure).toHaveBeenCalledWith({
      reportId: "REP-100",
      eventId: "REP-100:ReportRequested",
      attemptCount: 2,
      lastAttemptAt: "2026-08-12T15:00:00.000Z",
      lastError: "Service Bus unavailable",
      status: "PENDING"
    });

    expect(result.pending).toBe(1);
  });

  it("should mark event failed after maximum attempts", async () => {

    repository.findPending
      .mockResolvedValue([{
        id: "REP-100:ReportRequested",
        reportId: "REP-100",
        docType: "OUTBOX",
        eventType: "ReportRequested",
        eventVersion: 1,
        occurredAt: "2026-08-12T14:00:00.000Z",
        status: "PENDING",
        attemptCount: 4,
        payload: {}
      }]);

    publisher.publish
      .mockRejectedValue(new Error("Unsupported event"));

    const result = await useCase.execute();

    expect(repository.recordFailure).toHaveBeenCalledWith(expect.objectContaining({
      attemptCount: 5,
      status: "FAILED"
    }));

    expect(result.failed).toBe(1);
  });
});
