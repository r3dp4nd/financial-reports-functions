import {ReportData} from "../GenerateReport/domain/report-data.types";

export interface ReportOrchestrationInput {
    reportId: string;
    customerId: string;
    period: {
        from: string; to: string;
    };
}

export type ReportDataResult = ReportData;

export interface GenerateExcelActivityInput {
    reportId: string;
    customerId: string;
    data: ReportDataResult;
}

export interface GenerateExcelActivityResult {
    reportId: string;
    blobName: string;
}