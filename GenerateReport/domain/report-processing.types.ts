import {Report} from "../../Report/domain/report";

export type ReportProcessingState =
    Pick<
        Report,
        | "reportId"
        | "status"
        | "processingAt"
    >;

export interface ReportProcessingSnapshot {
    state: ReportProcessingState;
    version: string;
}