import {OutboxDocument} from "../outbox-document.types";
import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";

export interface DispatchOutboxResult {
  published: number;
  failed: number;
  ignored: number;
}

export class DispatchOutboxUseCase {

  constructor(
    private readonly publisher: OutboxPublisher,
    private readonly repository: OutboxRepository,
    private readonly now: () => string
  ) {
  }

  async execute(documents: OutboxDocument[]): Promise<DispatchOutboxResult> {

    let published = 0;
    let failed = 0;
    let ignored = 0;

    for (const document of documents) {

      if (document.docType !== "OUTBOX") {
        ignored++;
        continue;
      }

      if (document.status !== "PENDING") {
        ignored++;
        continue;
      }

      /*
       * Si attemptCount > 0 significa que el evento
       * ya está bajo responsabilidad del reconciliador.
       *
       * Evitamos que una actualización PENDING del
       * propio retry vuelva a disparar inmediatamente
       * el fast path del Change Feed.
       */
      if ((document.attemptCount ?? 0) > 0) {
        ignored++;
        continue;
      }

      try {

        await this.publisher.publish(document);

        await this.repository.markPublished(document.reportId, document.id, this.now());

        published++;

      } catch {

        /*
         * No cambiamos el documento.
         *
         * PENDING queda como evidencia durable
         * de que todavía existe trabajo pendiente.
         *
         * OutboxRetry lo recuperará.
         */
        failed++;
      }
    }

    return {
      published,
      failed,
      ignored
    };
  }
}
