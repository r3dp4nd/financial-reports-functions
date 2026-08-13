import {app} from "@azure/functions";
import {RetryOutboxUseCase} from "../OutboxDispatcher/application/retry-outbox.use-case";
import {CosmosOutboxRepository} from "../OutboxDispatcher/infrastructure/cosmos-outbox.repository";
import {ServiceBusOutboxPublisher} from "../OutboxDispatcher/infrastructure/service-bus-outbox.publisher";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {
  reportGeneratedSender,
  reportRequestsSender
} from "../shared/infrastructure/azure/service-bus/service-bus.client";
import {createOutboxRetryHandler} from "../OutboxRetry/handler";

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

const handler = createOutboxRetryHandler({
  useCase
});

app.timer("OutboxRetry", {
  schedule: "0 */1 * * * *",
  runOnStartup: false,
  retry: {
    strategy: "fixedDelay",
    delayInterval: {
      seconds: 10
    },
    maxRetryCount: 3
  },
  handler
});
