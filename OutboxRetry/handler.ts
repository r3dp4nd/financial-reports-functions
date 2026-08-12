import {AzureFunction, Context} from "@azure/functions";

import {RetryOutboxUseCase} from "../OutboxDispatcher/application/retry-outbox.use-case";

export interface OutboxRetryHandlerDependencies {
  useCase: RetryOutboxUseCase;
}

export function createOutboxRetryHandler(dependencies: OutboxRetryHandlerDependencies): AzureFunction {

  return async function (context: Context): Promise<void> {

    const result = await dependencies.useCase.execute();

    context.log("Outbox reconciliation completed", {
      processed: result.processed,
      published: result.published,
      pending: result.pending,
      failed: result.failed
    });
  };
}
