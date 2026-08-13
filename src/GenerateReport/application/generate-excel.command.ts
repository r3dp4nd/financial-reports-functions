import {ReportData} from "../domain/report-data.types";

export interface GenerateExcelCommand {
    reportId: string;
    customerId: string;
    data: ReportData;
}