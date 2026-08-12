import {ReportStatus} from "../domain/report.types";

export interface RequestReportHttpRequest {
  customerId: string;
  from: string;
  to: string;
}

export interface RequestReportHttpResponse {
  reportId: string;
  status: ReportStatus;
}
