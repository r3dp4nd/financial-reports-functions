import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {GenerateExcelUseCase} from "../GenerateReport/application/generate-excel.use-case";
import {ExcelJsReportGenerator} from "../GenerateReport/infrastructure/document/exceljs-report.generator";
import {BlobReportStorage} from "../GenerateReport/infrastructure/storage/blob-report.storage";
import {reportsBlobContainer} from "../shared/infrastructure/azure/blob-storage/blob-storage.client";
import {createGenerateExcelHandler} from "../GenerateExcel/handler";

const reportGenerator = new ExcelJsReportGenerator();

const reportStorage = new BlobReportStorage(reportsBlobContainer);

const useCase = new GenerateExcelUseCase(reportGenerator, reportStorage);

const generateExcelHandler = createGenerateExcelHandler({useCase});

const handler: ActivityHandler = generateExcelHandler;

df.app.activity("GenerateExcel", {
  handler
});
