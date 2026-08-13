import {InvocationContext} from "@azure/functions";

import {DispatchOutboxUseCase} from "./application/dispatch-outbox.use-case";
import {OutboxPublisher} from "./application/outbox.publisher";
import {OutboxRepository} from "./application/outbox.repository";
import {createOutboxDispatcherHandler} from "./handler";

describe("OutboxDispatcher handler", () => {

  let publisher: jest.Mocked<OutboxPublisher>;
  let repository: jest.Mocked<OutboxRepository>;
  let useCase: DispatchOutboxUseCase;

  beforeEach(() => {

    publisher = {
      publish: jest.fn()
    };

    repository = {
      findPending: jest.fn(),
      markPublished: jest.fn(),
      recordFailure: jest.fn()
    };

    useCase = new DispatchOutboxUseCase(publisher, repository, () => "2026-08-12T22:00:00.000Z");
  });

  it("should dispatch pending outbox documents", async () => {

    publisher.publish.mockResolvedValue();
    repository.markPublished.mockResolvedValue();

    const handler = createOutboxDispatcherHandler({
      useCase
    });

    const context = new InvocationContext();

    const logSpy = jest.spyOn(context, "log").mockImplementation();

    await handler([{
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-12T21:00:00.000Z",
      status: "PENDING",
      payload: {
        eventId: "REP-100:ReportRequested",
        reportId: "REP-100"
      }
    }], context);

    expect(publisher.publish).toHaveBeenCalledTimes(1);

    expect(repository.markPublished).toHaveBeenCalledWith("REP-100", "REP-100:ReportRequested", "2026-08-12T22:00:00.000Z");

    expect(logSpy).toHaveBeenCalledWith("Outbox batch processed", {
      received: 1,
      published: 1,
      failed: 0,
      ignored: 0
    });
  });

  it("should ignore non-outbox documents", async () => {

    const handler = createOutboxDispatcherHandler({
      useCase
    });

    const context = new InvocationContext();

    jest.spyOn(context, "log").mockImplementation();

    await handler([{
      id: "REP-100",
      reportId: "REP-100",
      docType: "REPORT",
      status: "REQUESTED"
    }], context);

    expect(publisher.publish).not.toHaveBeenCalled();

    expect(repository.markPublished).not.toHaveBeenCalled();
  });

  it("should leave publication recovery to the outbox retry flow", async () => {

    publisher.publish.mockRejectedValue(new Error("Service Bus unavailable"));

    const handler = createOutboxDispatcherHandler({
      useCase
    });

    const context = new InvocationContext();

    jest.spyOn(context, "log").mockImplementation();

    await expect(handler([{
      id: "REP-100:ReportRequested",
      reportId: "REP-100",
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: "2026-08-12T21:00:00.000Z",
      status: "PENDING",
      payload: {}
    }], context)).resolves.toBeUndefined();

    expect(repository.markPublished).not.toHaveBeenCalled();
  });
});
