import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";
import {
  CosmosReportGenerationRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-generation.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createCompleteGenerationHandler} from "./handler";

const repository = new CosmosReportGenerationRepository(reportsContainer);

const useCase = new CompleteGenerationUseCase(repository);

const completeGeneration = createCompleteGenerationHandler({
  useCase,
  now: () => new Date().toISOString()
});

export default completeGeneration;
