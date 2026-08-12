import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";
import {
    CosmosReportFailureRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-failure.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createMarkReportFailedHandler} from "./handler";

const repository = new CosmosReportFailureRepository(reportsContainer);

const useCase = new MarkReportFailedUseCase(repository);

const markReportFailed = createMarkReportFailedHandler({
    useCase
});

export default markReportFailed;