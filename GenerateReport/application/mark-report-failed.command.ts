export interface MarkReportFailedCommand {
    reportId: string;
    failedAt: string;
    failureCode: string;
    failureReason: string;
}