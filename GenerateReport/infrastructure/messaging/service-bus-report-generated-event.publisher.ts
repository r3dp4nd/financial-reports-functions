import {ServiceBusSender} from "@azure/service-bus";

import {ReportGeneratedEventPublisher} from "../../application/report-generated-event.publisher";
import {ReportGeneratedIntegrationEvent} from "../../application/report-generated.integration-event";

export class ServiceBusReportGeneratedEventPublisher implements ReportGeneratedEventPublisher {

    constructor(private readonly sender: ServiceBusSender) {
    }

    async publish(event: ReportGeneratedIntegrationEvent): Promise<void> {

        await this.sender
            .sendMessages({
                body: event,
                messageId: event.eventId,
                subject: "ReportGenerated",
                contentType: "application/json",
                correlationId: event.reportId,
                applicationProperties: {
                    eventType: "ReportGenerated",
                    eventVersion: "1"
                }
            });
    }
}