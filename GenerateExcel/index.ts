import {GenerateExcelUseCase} from "../GenerateReport/application/generate-excel.use-case";
import {ExcelJsReportGenerator} from "../GenerateReport/infrastructure/document/exceljs-report.generator";
import {BlobReportStorage} from "../GenerateReport/infrastructure/storage/blob-report.storage";
import {reportsBlobContainer} from "../shared/infrastructure/azure/blob-storage/blob-storage.client";
import {createGenerateExcelHandler} from "./handler";

const reportGenerator = new ExcelJsReportGenerator();

const reportStorage = new BlobReportStorage(reportsBlobContainer);

const useCase = new GenerateExcelUseCase(reportGenerator, reportStorage);

const generateExcel = createGenerateExcelHandler({useCase});

export default generateExcel;