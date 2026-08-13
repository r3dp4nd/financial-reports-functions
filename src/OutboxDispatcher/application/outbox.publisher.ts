import {OutboxDocument} from "../outbox-document.types";

export interface OutboxPublisher {

  publish(
    document: OutboxDocument
  ): Promise<void>;
}
