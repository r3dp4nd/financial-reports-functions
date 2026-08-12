import {Context} from "@azure/functions";

import {RetryOutboxUseCase} from "../OutboxDispatcher/application/retry-outbox.use-case";
import {OutboxPublisher} from "../OutboxDispatcher/application/outbox.publisher";
import {OutboxRepository} from "../OutboxDispatcher/application/outbox.repository";
import {createOutboxRetryHandler} from "./handler";

describe("OutboxRetry handler", () => {

  it("should execute outbox reconciliation", async () => {

    const publisher: jest.Mocked<OutboxPublisher> = {
      publish: jest.fn()
    };

    const repository: jest.Mocked<OutboxRepository> = {
      findPending: jest.fn()
        .mockResolvedValue([]),
      markPublished: jest.fn(),
      recordFailure: jest.fn()
    };

    const useCase = new RetryOutboxUseCase(publisher, repository, () => "2026-08-12T15:00:00.000Z");

    const handler = createOutboxRetryHandler({
      useCase
    });

    const log = jest.fn();

    const context = {
      log
    } as unknown as Context;

    await handler(context);

    expect(log).toHaveBeenCalledWith("Outbox reconciliation completed", {
      processed: 0,
      published: 0,
      pending: 0,
      failed: 0
    });
  });
});
