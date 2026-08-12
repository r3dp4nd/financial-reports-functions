import {ReportFailureSnapshot} from "./report-failure.types";

export interface MarkReportFailedUpdate {
    reportId: string;
    failedAt: string;
    failureCode: string;
    failureReason: string;
    expectedVersion: string;
}

export interface ReportFailureRepository {

    findById(
        reportId: string
    ): Promise<ReportFailureSnapshot | null>;

    markFailed(
        update: MarkReportFailedUpdate
    ): Promise<void>;
}