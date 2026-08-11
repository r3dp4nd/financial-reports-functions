import {ReportCompletionSnapshot} from "./report-completion.types";

export interface CompleteReportUpdate {
    reportId: string;
    completedAt: string;
    expectedVersion: string;
}

export interface ReportCompletionRepository {

    findById(
        reportId: string
    ): Promise<ReportCompletionSnapshot | null>;

    complete(
        update: CompleteReportUpdate
    ): Promise<void>;
}