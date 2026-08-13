import {ReportRequestedIntegrationEvent} from "./report-requested.integration-event";

export interface ReportEventPublisher {

    publishRequested(event: ReportRequestedIntegrationEvent): Promise<void>;
}