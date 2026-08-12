import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";
import {
    CosmosReportProcessingRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-processing.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createMarkReportProcessingHandler} from "./handler";

const repository = new CosmosReportProcessingRepository(reportsContainer);

const useCase = new MarkReportProcessingUseCase(repository);

const markReportProcessing = createMarkReportProcessingHandler({
    useCase
});

export default markReportProcessing;