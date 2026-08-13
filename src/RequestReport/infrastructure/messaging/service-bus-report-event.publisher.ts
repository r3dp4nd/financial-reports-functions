import {ServiceBusSender} from "@azure/service-bus";

import {ReportEventPublisher} from "../../application/report-event.publisher";
import {ReportRequestedIntegrationEvent} from "../../application/report-requested.integration-event";

export class ServiceBusReportEventPublisher implements ReportEventPublisher {

    constructor(private readonly sender: ServiceBusSender) {
    }

    async publishRequested(event: ReportRequestedIntegrationEvent): Promise<void> {

        await this.sender.sendMessages({
            body: event,
            messageId: event.eventId,
            subject: "ReportRequested",
            contentType: "application/json",
            correlationId: event.reportId,
            applicationProperties: {
                eventType: "ReportRequested",
                eventVersion: "1"
            }
        });
    }
}