export type ReportCompletionStatus =
    | "REQUESTED"
    | "PROCESSING"
    | "GENERATED"
    | "COMPLETED"
    | "FAILED";

export interface ReportCompletionState {
    reportId: string;
    status: ReportCompletionStatus;
    blobName?: string;
    generatedAt?: string;
    completedAt?: string;
}

export interface ReportCompletionSnapshot {
    state: ReportCompletionState;
    version: string;
}