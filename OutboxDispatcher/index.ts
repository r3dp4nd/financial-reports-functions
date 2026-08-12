import {DispatchOutboxUseCase} from "./application/dispatch-outbox.use-case";
import {CosmosOutboxRepository} from "./infrastructure/cosmos-outbox.repository";
import {ServiceBusOutboxPublisher} from "./infrastructure/service-bus-outbox.publisher";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {
  reportGeneratedSender,
  reportRequestsSender
} from "../shared/infrastructure/azure/service-bus/service-bus.client";
import {createOutboxDispatcherHandler} from "./handler";

const repository = new CosmosOutboxRepository(reportsContainer);

const publisher = new ServiceBusOutboxPublisher({
  reportRequested: reportRequestsSender,
  reportGenerated: reportGeneratedSender
});

const useCase = new DispatchOutboxUseCase(
  publisher,
  repository
);

const outboxDispatcher = createOutboxDispatcherHandler({useCase});

export default outboxDispatcher;
