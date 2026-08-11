import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";
import {
    CosmosReportGenerationRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-report-generation.repository";
import {
    ServiceBusReportGeneratedEventPublisher
} from "../GenerateReport/infrastructure/messaging/service-bus-report-generated-event.publisher";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {reportGeneratedSender} from "../shared/infrastructure/azure/service-bus/service-bus.client";
import {createCompleteGenerationHandler} from "./handler";

const repository = new CosmosReportGenerationRepository(reportsContainer);

const eventPublisher = new ServiceBusReportGeneratedEventPublisher(reportGeneratedSender);

const useCase = new CompleteGenerationUseCase(repository, eventPublisher);

const completeGeneration = createCompleteGenerationHandler({
    useCase,
    now: () => new Date().toISOString()
});

export default completeGeneration;