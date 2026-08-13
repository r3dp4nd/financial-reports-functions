import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {CompleteGenerationUseCase} from "../../GenerateReport/application/complete-generation.use-case";
import {
  CosmosReportGenerationRepository
} from "../../GenerateReport/infrastructure/persistence/cosmos-report-generation.repository";
import {reportsContainer} from "../../shared/infrastructure/azure/cosmos/cosmos.client";
import {createCompleteGenerationHandler} from "../../CompleteGeneration/handler";

const repository = new CosmosReportGenerationRepository(reportsContainer);

const useCase = new CompleteGenerationUseCase(repository);

const completeGenerationHandler = createCompleteGenerationHandler({
  useCase,
  now: () => new Date().toISOString()
});

const handler: ActivityHandler = completeGenerationHandler;

df.app.activity("CompleteGeneration", {
  handler
});
