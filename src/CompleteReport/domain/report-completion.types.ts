import {Report} from "../../Report/domain/report";

export type ReportCompletionState =
  Pick<
    Report,
    | "reportId"
    | "status"
    | "blobName"
    | "generatedAt"
    | "completedAt"
  >;

export interface ReportCompletionSnapshot {
  state: ReportCompletionState;
  version: string;
}
