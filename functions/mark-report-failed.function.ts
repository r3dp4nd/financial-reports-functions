import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";
import {
  CosmosReportFailureRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-failure.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createMarkReportFailedHandler} from "../MarkReportFailed/handler";

const repository = new CosmosReportFailureRepository(reportsContainer);

const useCase = new MarkReportFailedUseCase(repository);

const markReportFailedHandler = createMarkReportFailedHandler({
  useCase
});

const handler: ActivityHandler = markReportFailedHandler;

df.app.activity("MarkReportFailed", {
  handler
});
