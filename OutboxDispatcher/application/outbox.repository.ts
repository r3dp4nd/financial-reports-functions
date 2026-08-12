export interface OutboxRepository {

  markPublished(
    reportId: string,
    eventId: string
  ): Promise<void>;
}
