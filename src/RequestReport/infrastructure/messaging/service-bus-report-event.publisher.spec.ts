import {ServiceBusSender} from "@azure/service-bus";

import {ServiceBusReportEventPublisher} from "./service-bus-report-event.publisher";

describe("ServiceBusReportEventPublisher", () => {

    let sender: jest.Mocked<ServiceBusSender>;
    let publisher: ServiceBusReportEventPublisher;

    beforeEach(() => {
        sender = {
            sendMessages: jest.fn()
        } as unknown as jest.Mocked<ServiceBusSender>;

        publisher = new ServiceBusReportEventPublisher(sender);
    });

    it("should publish ReportRequested event", async () => {

        const event = {
            eventId: "REP-100",
            occurredAt: "2026-08-11T15:00:00.000Z",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        };

        await publisher.publishRequested(event);

        expect(sender.sendMessages).toHaveBeenCalledTimes(1);

        expect(sender.sendMessages).toHaveBeenCalledWith({
            body: event,
            messageId: "REP-100",
            subject: "ReportRequested",
            contentType: "application/json",
            correlationId: "REP-100",
            applicationProperties: {
                eventType: "ReportRequested",
                eventVersion: "1"
            }
        });
    });

    it("should propagate Service Bus errors", async () => {

        sender.sendMessages
            .mockRejectedValue(new Error("Service Bus unavailable"));

        await expect(publisher.publishRequested({
            eventId: "REP-100",
            occurredAt: "2026-08-11T15:00:00.000Z",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        })).rejects.toThrow("Service Bus unavailable");
    });
});