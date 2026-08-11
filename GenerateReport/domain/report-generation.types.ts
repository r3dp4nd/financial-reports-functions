import {Report} from "../../Report/domain/report";

export type ReportGenerationState =
    Pick<
        Report,
        | "reportId"
        | "status"
        | "blobName"
        | "generatedAt"
    >;

export interface ReportGenerationSnapshot {
    state: ReportGenerationState;
    version: string;
}