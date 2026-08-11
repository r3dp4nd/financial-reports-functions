import {ReportGenerationSnapshot} from "./report-generation.types";

export interface UpdateGeneratedReport {
    reportId: string;
    blobName: string;
    generatedAt: string;
    expectedVersion: string;
}

export interface ReportGenerationRepository {

    findById(
        reportId: string
    ): Promise<ReportGenerationSnapshot | null>;

    updateGenerated(
        input: UpdateGeneratedReport
    ): Promise<void>;
}