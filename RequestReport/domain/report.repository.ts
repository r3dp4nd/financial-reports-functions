import {Report} from "../../Report/domain/report";
import {ReportRequestedIntegrationEvent} from "../application/report-requested.integration-event";

export interface ReportRepository {


    saveRequested(
        report: Report,
        event: ReportRequestedIntegrationEvent
    ): Promise<void>;
}