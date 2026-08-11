import {CompleteReportUseCase} from "./application/complete-report.use-case";
import {CosmosReportCompletionRepository} from "./infrastructure/persistence/cosmos-report-completion.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createCompleteReportHandler} from "./handler";

const repository = new CosmosReportCompletionRepository(reportsContainer);

const useCase = new CompleteReportUseCase(repository);

const completeReport = createCompleteReportHandler({
    useCase,
    now: () => new Date().toISOString()
});

export default completeReport;