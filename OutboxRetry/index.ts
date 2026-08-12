import {RetryOutboxUseCase} from "../OutboxDispatcher/application/retry-outbox.use-case";
import {CosmosOutboxRepository} from "../OutboxDispatcher/infrastructure/cosmos-outbox.repository";
import {ServiceBusOutboxPublisher} from "../OutboxDispatcher/infrastructure/service-bus-outbox.publisher";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {
  reportGeneratedSender,
  reportRequestsSender
} from "../shared/infrastructure/azure/service-bus/service-bus.client";
import {createOutboxRetryHandler} from "./handler";

const repository = new CosmosOutboxRepository(reportsContainer);

const publisher = new ServiceBusOutboxPublisher({
  reportRequested: reportRequestsSender,
  reportGenerated: reportGeneratedSender
});

const useCase = new RetryOutboxUseCase(
  publisher,
  repository,
  () => new Date().toISOString()
);

const outboxRetry = createOutboxRetryHandler({
  useCase
});

export default outboxRetry;
