export type OutboxStatus =
  | "PENDING"
  | "PUBLISHED"
  | "FAILED";

export interface OutboxDocument {
  id: string;
  reportId: string;
  docType: "OUTBOX";
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  status: OutboxStatus;
  payload: unknown;
  attemptCount?: number;
  lastAttemptAt?: string;
  lastError?: string;
  publishedAt?: string;
}

