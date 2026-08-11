import {ServiceBusSender} from "@azure/service-bus";

import {ServiceBusReportGeneratedEventPublisher} from "./service-bus-report-generated-event.publisher";

describe("ServiceBusReportGeneratedEventPublisher", () => {

    it("should publish ReportGenerated", async () => {

        const sendMessages = jest.fn();

        const sender = {
            sendMessages
        } as unknown as jest.Mocked<ServiceBusSender>;

        const publisher = new ServiceBusReportGeneratedEventPublisher(sender);

        const event = {
            eventId: "REP-100:ReportGenerated",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        };

        await publisher.publish(event);

        expect(sendMessages).toHaveBeenCalledWith({
            body: event,
            messageId: "REP-100:ReportGenerated",
            subject: "ReportGenerated",
            contentType: "application/json",
            correlationId: "REP-100",
            applicationProperties: {
                eventType: "ReportGenerated",
                eventVersion: "1"
            }
        });
    });
});