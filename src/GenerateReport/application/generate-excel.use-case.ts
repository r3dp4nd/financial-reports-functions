import {ReportGenerator} from "../domain/report.generator";
import {ReportStorage} from "../domain/report.storage";
import {GenerateExcelCommand} from "./generate-excel.command";
import {GenerateExcelResult} from "./generate-excel.result";

const EXCEL_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export class GenerateExcelUseCase {

    constructor(private readonly reportGenerator: ReportGenerator, private readonly reportStorage: ReportStorage) {
    }

    async execute(command: GenerateExcelCommand): Promise<GenerateExcelResult> {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.customerId?.trim()) {
            throw new Error("customerId is required");
        }

        if (!command.data) {
            throw new Error("report data is required");
        }

        const content = await this.reportGenerator
            .generate({
                reportId: command.reportId,
                customerId: command.customerId,
                data: command.data
            });

        const storedReport = await this.reportStorage
            .save({
                reportId: command.reportId,
                content,
                contentType: EXCEL_CONTENT_TYPE
            });

        return {
            reportId: command.reportId,
            blobName: storedReport.blobName
        };
    }
}