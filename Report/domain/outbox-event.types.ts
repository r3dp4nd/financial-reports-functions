export type OutboxEventStatus = | "PENDING" | "PUBLISHED";

export interface OutboxEvent<TPayload> {
    eventId: string;
    aggregateId: string;
    eventType: string;
    occurredAt: string;
    status: OutboxEventStatus;
    payload: TPayload;
}