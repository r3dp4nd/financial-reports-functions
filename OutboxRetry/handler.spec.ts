import {InvocationContext, Timer} from "@azure/functions";

import {RetryOutboxUseCase} from "../OutboxDispatcher/application/retry-outbox.use-case";
import {OutboxPublisher} from "../OutboxDispatcher/application/outbox.publisher";
import {OutboxRepository} from "../OutboxDispatcher/application/outbox.repository";
import {createOutboxRetryHandler} from "./handler";

describe("OutboxRetry handler", () => {

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

  it("should execute outbox reconciliation", async () => {

    repository
      .findPending
      .mockResolvedValue([]);

    const handler = createOutboxRetryHandler({
      useCase
    });

    const timer = createTimer();

    const context = new InvocationContext();

    const logSpy = jest
      .spyOn(context, "log")
      .mockImplementation();

    await handler(timer, context);

    expect(repository.findPending).toHaveBeenCalledTimes(1);

    expect(logSpy).toHaveBeenCalledWith("Outbox reconciliation completed", {
      processed: 0,
      published: 0,
      pending: 0,
      failed: 0
    });
  });

  it("should propagate unexpected reconciliation failure", async () => {

    repository
      .findPending
      .mockRejectedValue(new Error("Cosmos unavailable"));

    const handler = createOutboxRetryHandler({
      useCase
    });

    const timer = createTimer();

    const context = new InvocationContext();

    await expect(handler(timer, context)).rejects.toThrow("Cosmos unavailable");
  });
});

function createTimer(): Timer {

  return {
    isPastDue: false,
    schedule: {adjustForDST: true},
    scheduleStatus: {
      last: "2026-08-12T14:59:00.000Z",
      next: "2026-08-12T15:01:00.000Z",
      lastUpdated: "2026-08-12T15:00:00.000Z"
    }
  };
}
