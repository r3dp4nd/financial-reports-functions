import {AzureFunction, Context} from "@azure/functions";

import {DispatchOutboxUseCase} from "./application/dispatch-outbox.use-case";
import {OutboxDocument} from "./outbox-document.types";

export interface OutboxDispatcherDependencies {
  useCase: DispatchOutboxUseCase;
}

export function createOutboxDispatcherHandler(dependencies: OutboxDispatcherDependencies): AzureFunction {

  return async function (context: Context, documents: unknown[]): Promise<void> {

    const outboxDocuments = documents
      .filter((document): document is OutboxDocument => typeof document === "object" &&
        document !== null && "docType" in document && document.docType === "OUTBOX");

    const result = await dependencies.useCase.execute(outboxDocuments);

    context.log("Outbox batch processed", {
      received: documents.length,
      published: result.published,
      failed: result.failed,
      ignored: result.ignored
    });
  };
}
