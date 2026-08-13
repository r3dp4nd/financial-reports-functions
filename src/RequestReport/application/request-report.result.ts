import {ReportStatus} from "../domain/report.types";

export interface RequestReportResult {
  reportId: string;
  status: ReportStatus;

  created: boolean;
}
