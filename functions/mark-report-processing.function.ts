import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {
  CosmosReportProcessingRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-processing.repository";
import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";
import {createMarkReportProcessingHandler} from "../MarkReportProcessing/handler";

const repository = new CosmosReportProcessingRepository(reportsContainer);

const useCase = new MarkReportProcessingUseCase(repository);

const markReportProcessingHandler = createMarkReportProcessingHandler({
  useCase
});

const handler: ActivityHandler = markReportProcessingHandler;

df.app.activity("MarkReportProcessing", {
  handler
});
