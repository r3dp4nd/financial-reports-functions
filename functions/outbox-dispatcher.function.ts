import {app} from "@azure/functions";

import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {CosmosOutboxRepository} from "../OutboxDispatcher/infrastructure/cosmos-outbox.repository";
import {ServiceBusOutboxPublisher} from "../OutboxDispatcher/infrastructure/service-bus-outbox.publisher";
import {
  reportGeneratedSender,
  reportRequestsSender
} from "../shared/infrastructure/azure/service-bus/service-bus.client";
import {DispatchOutboxUseCase} from "../OutboxDispatcher/application/dispatch-outbox.use-case";
import {createOutboxDispatcherHandler} from "../OutboxDispatcher/handler";

const repository = new CosmosOutboxRepository(reportsContainer);

const publisher = new ServiceBusOutboxPublisher({
  reportRequested: reportRequestsSender,
  reportGenerated: reportGeneratedSender
});

const useCase = new DispatchOutboxUseCase(
  publisher,
  repository,
  () => new Date().toISOString()
);

const handler = createOutboxDispatcherHandler({
  useCase
});

app.cosmosDB("OutboxDispatcher", {
  connection: "COSMOS_CONNECTION",
  databaseName: "%COSMOS_DATABASE%",
  containerName: "%COSMOS_REPORTS_CONTAINER%",
  leaseContainerName: "leases",
  createLeaseContainerIfNotExists: false,
  handler
});
