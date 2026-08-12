import {OutboxDocument} from "../outbox-document.types";
import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";

export class DispatchOutboxUseCase {

  constructor(private readonly publisher: OutboxPublisher, private readonly repository: OutboxRepository) {
  }

  async execute(documents: OutboxDocument[]): Promise<void> {

    for (const document of documents) {

      if (document.docType !== "OUTBOX") {
        continue;
      }

      if (document.status !== "PENDING") {
        continue;
      }

      await this.publisher
        .publish(document);

      await this.repository
        .markPublished(document.reportId, document.id);
    }
  }
}
