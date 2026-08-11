import {ReportPeriod} from "./report-period";
import {ReportStatus} from "./report-status";

export interface Report {
    reportId: string;
    customerId: string;
    period: ReportPeriod;
    status: ReportStatus;
    requestedAt: string;

    blobName?: string;
    generatedAt?: string;
    completedAt?: string;
}