import {ServiceBusSender} from "@azure/service-bus";

import {OutboxDocument} from "../outbox-document.types";
import {OutboxPublisher} from "../application/outbox.publisher";

export interface ServiceBusOutboxSenders {
  reportRequested: ServiceBusSender;
  reportGenerated: ServiceBusSender;
}

export class ServiceBusOutboxPublisher implements OutboxPublisher {

  constructor(private readonly senders: ServiceBusOutboxSenders) {
  }

  async publish(document: OutboxDocument): Promise<void> {

    const sender = this.resolveSender(document.eventType);

    await sender
      .sendMessages({
        body: document.payload,
        messageId: document.id,
        subject: document.eventType,
        contentType: "application/json",
        correlationId: document.reportId,
        applicationProperties: {
          eventType: document.eventType,
          eventVersion: String(document.eventVersion)
        }
      });
  }

  private resolveSender(eventType: string): ServiceBusSender {
    switch (eventType) {
      case "ReportRequested":
        return this.senders.reportRequested;
      case "ReportGenerated":
        return this.senders.reportGenerated;
      default:
        throw new Error(`Unsupported outbox event type ${eventType}`);
    }
  }
}


