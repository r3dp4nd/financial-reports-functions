export interface ReportGeneratedIntegrationEvent {
    eventId: string;
    occurredAt: string;

    reportId: string;
    blobName: string;
}