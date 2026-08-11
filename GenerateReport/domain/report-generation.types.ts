export type ReportGenerationStatus =
    | "REQUESTED"
    | "PROCESSING"
    | "GENERATED"
    | "COMPLETED"
    | "FAILED";

export interface ReportGenerationState {
    reportId: string;
    status: ReportGenerationStatus;
    blobName?: string;
    generatedAt?: string;
}

export interface ReportGenerationSnapshot {
    state: ReportGenerationState;
    version: string;
}