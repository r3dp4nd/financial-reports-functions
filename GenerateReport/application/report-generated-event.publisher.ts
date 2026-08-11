import {ReportGeneratedIntegrationEvent} from "./report-generated.integration-event";

export interface ReportGeneratedEventPublisher {

    publish(
        event: ReportGeneratedIntegrationEvent
    ): Promise<void>;
}