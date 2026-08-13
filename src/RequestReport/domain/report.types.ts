export type ReportStatus =
    | "REQUESTED"
    | "PROCESSING"
    | "GENERATED"
    | "COMPLETED"
    | "FAILED";

export interface ReportPeriod {
    from: string;
    to: string;
}

export interface Report {
    reportId: string;
    customerId: string;
    period: ReportPeriod;
    status: ReportStatus;
    requestedAt: string;
}