import {Report} from "../../Report/domain/report";

export type ReportFailureState =
  Pick<
    Report,
    | "reportId"
    | "status"
    | "failedAt"
    | "failureCode"
    | "failureReason"
  >;

export interface ReportFailureSnapshot {
  state: ReportFailureState;
  version: string;
}
