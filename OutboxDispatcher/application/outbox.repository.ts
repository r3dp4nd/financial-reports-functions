import {OutboxDocument, OutboxStatus} from "../outbox-document.types";

export interface RecordOutboxFailure {
  reportId: string;
  eventId: string;

  attemptCount: number;
  lastAttemptAt: string;
  lastError: string;

  status: OutboxStatus;
}

export interface OutboxRepository {

  findPending(
    occurredBefore: string
  ): Promise<OutboxDocument[]>;

  markPublished(
    reportId: string,
    eventId: string,
    publishedAt: string
  ): Promise<void>;

  recordFailure(
    failure: RecordOutboxFailure
  ): Promise<void>;
}
