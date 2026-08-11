import {ReportData} from "./report-data.types";

export interface ReportGeneratorInput {
    reportId: string;
    customerId: string;
    data: ReportData;
}

export interface ReportGenerator {

    generate(
        input: ReportGeneratorInput
    ): Promise<Uint8Array>;
}