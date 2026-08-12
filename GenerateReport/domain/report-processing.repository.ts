import {ReportProcessingSnapshot} from "./report-processing.types";

export interface MarkReportProcessingUpdate {
    reportId: string;
    processingAt: string;
    expectedVersion: string;
}

export interface ReportProcessingRepository {

    findById(
        reportId: string
    ): Promise<ReportProcessingSnapshot | null>;

    markProcessing(
        update: MarkReportProcessingUpdate
    ): Promise<void>;
}