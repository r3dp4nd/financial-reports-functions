import {Container} from "@azure/cosmos";

import {OutboxDocument} from "../outbox-document.types";
import {OutboxRepository, RecordOutboxFailure} from "../application/outbox.repository";

export class CosmosOutboxRepository implements OutboxRepository {

  constructor(private readonly container: Container) {
  }

  async findPending(occurredBefore: string): Promise<OutboxDocument[]> {

    const query = {
      query: `
        SELECT TOP 50 *
        FROM c
        WHERE c.docType = "OUTBOX"
          AND c.status = "PENDING"
          AND c.occurredAt <= @occurredBefore
        ORDER BY c.occurredAt ASC
      `,

      parameters: [{
        name: "@occurredBefore",
        value: occurredBefore
      }]
    };

    const response = await this.container
      .items
      .query<OutboxDocument>(query)
      .fetchAll();

    return response.resources;
  }

  async markPublished(reportId: string, eventId: string, publishedAt: string): Promise<void> {

    await this.container
      .item(eventId, reportId)
      .patch([{
        op: "set",
        path: "/status",
        value: "PUBLISHED"
      }, {
        op: "set",
        path: "/publishedAt",
        value: publishedAt
      }]);
  }

  async recordFailure(failure: RecordOutboxFailure): Promise<void> {

    await this.container
      .item(failure.eventId, failure.reportId)
      .patch([{
        op: "set",
        path: "/status",
        value: failure.status
      }, {
        op: "set",
        path: "/attemptCount",
        value: failure.attemptCount
      }, {
        op: "set",
        path: "/lastAttemptAt",
        value: failure.lastAttemptAt
      }, {
        op: "set",
        path: "/lastError",
        value: failure.lastError
      }]);
  }
}
