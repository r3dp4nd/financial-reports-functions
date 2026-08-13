import {InvocationContext} from "@azure/functions";

import {DispatchOutboxUseCase} from "./application/dispatch-outbox.use-case";
import {OutboxDocument} from "./outbox-document.types";

export interface OutboxDispatcherDependencies {
  useCase: DispatchOutboxUseCase;
}

export function createOutboxDispatcherHandler(dependencies: OutboxDispatcherDependencies) {

  return async function (documents: unknown[], context: InvocationContext): Promise<void> {

    const outboxDocuments: OutboxDocument[] = documents.filter(isOutboxDocument);

    const result = await dependencies.useCase.execute(outboxDocuments);

    context.log("Outbox batch processed", {
      received: documents.length,
      published: result.published,
      failed: result.failed,
      ignored: result.ignored
    });
  };
}

function isOutboxDocument(document: unknown): document is OutboxDocument {
  return (typeof document === "object" && document !== null && "docType" in document && document.docType === "OUTBOX");
}
