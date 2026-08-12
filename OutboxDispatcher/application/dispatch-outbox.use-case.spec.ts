import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";
import {DispatchOutboxUseCase} from "./dispatch-outbox.use-case";

describe("DispatchOutboxUseCase", () => {
  let publisher: jest.Mocked<OutboxPublisher>;
  let repository: jest.Mocked<OutboxRepository>;
  let useCase: DispatchOutboxUseCase;

  beforeEach(() => {

    publisher = {
      publish: jest.fn()
    };
    repository = {
      markPublished: jest.fn()
    };

    useCase = new DispatchOutboxUseCase(publisher, repository);
  });

  it("should publish pending outbox event and mark it published", async () => {

    const document = {
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX" as const,
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-11T20:00:00.000Z",
      status: "PENDING" as const,
      payload: {
        reportId: "REP-100"
      }
    };

    await useCase.execute([document]);

    expect(publisher.publish).toHaveBeenCalledWith(document);
    expect(repository.markPublished).toHaveBeenCalledWith("REP-100", "REP-100:ReportRequested");
  });

  it("should ignore already published events", async () => {

    await useCase.execute([{
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-11T20:00:00.000Z",
      status: "PUBLISHED",
      payload: {}
    }]);

    expect(publisher.publish).not.toHaveBeenCalled();
    expect(repository.markPublished).not.toHaveBeenCalled();
  });

  it("should not mark event published when Service Bus fails", async () => {

    publisher.publish
      .mockRejectedValue(new Error("Service Bus unavailable"));

    await expect(useCase.execute([{
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-11T20:00:00.000Z",
      status: "PENDING",
      payload: {}
    }])).rejects.toThrow("Service Bus unavailable");

    expect(repository.markPublished).not.toHaveBeenCalled();
  });
});
