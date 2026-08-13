import {app} from "@azure/functions";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {
  CosmosReportCompletionRepository
} from "../CompleteReport/infrastructure/persistence/cosmos-report-completion.repository";
import {CompleteReportUseCase} from "../CompleteReport/application/complete-report.use-case";
import {createCompleteReportHandler} from "../CompleteReport/handler";

const repository = new CosmosReportCompletionRepository(reportsContainer);

const useCase = new CompleteReportUseCase(repository);

const handler = createCompleteReportHandler({
  useCase,
  now: () => new Date().toISOString()
});

app.serviceBusQueue("CompleteReport", {
    queueName: "%SERVICE_BUS_REPORT_GENERATED_QUEUE%",
    connection: "SERVICE_BUS_CONNECTION",
    handler
  }
);
