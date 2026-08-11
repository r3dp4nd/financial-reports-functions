export interface ReportRequestedIntegrationEvent {
    eventId: string;
    occurredAt: string;
    reportId: string;
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}