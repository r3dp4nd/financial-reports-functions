import {Container} from "@azure/cosmos";

import {OutboxRepository} from "../application/outbox.repository";

export class CosmosOutboxRepository implements OutboxRepository {

  constructor(private readonly container: Container) {
  }

  async markPublished(reportId: string, eventId: string): Promise<void> {

    await this.container
      .item(eventId, reportId)
      .patch([
        {
          op: "set",
          path: "/status",
          value: "PUBLISHED"
        },
        {
          op: "set",
          path: "/publishedAt",
          value: new Date().toISOString()
        }
      ]);
  }
}
