import {Report} from "../../Report/domain/report";
import {ReportStatus} from "./report.types";
import {ReportRequestedIntegrationEvent} from "../application/report-requested.integration-event";

export interface SaveRequestedReport {
  report: Report;
  event: ReportRequestedIntegrationEvent;
  idempotencyKeyHash: string;
  requestHash: string;
}

export interface SaveRequestedReportResult {
  reportId: string;
  status: ReportStatus;
  created: boolean;
}

export interface ReportRepository {

  saveRequested(
    input: SaveRequestedReport
  ): Promise<SaveRequestedReportResult>;
}
