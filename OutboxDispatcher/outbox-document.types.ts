export interface OutboxDocument {
  id: string;
  reportId: string;
  docType: "OUTBOX";
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  status: "PENDING" | "PUBLISHED";
  payload: unknown;
}
