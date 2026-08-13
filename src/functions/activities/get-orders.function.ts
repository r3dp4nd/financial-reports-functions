import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {GetOrdersUseCase} from "../../GenerateReport/application/get-orders.use-case";
import {
  CosmosOrderReportRepository
} from "../../GenerateReport/infrastructure/persistence/cosmos-order-report.repository";
import {ordersContainer} from "../../shared/infrastructure/azure/cosmos/cosmos.client";
import {createGetOrdersHandler} from "../../GetOrders/handler";

const repository = new CosmosOrderReportRepository(ordersContainer);

const useCase = new GetOrdersUseCase(repository);

const getOrdersHandler = createGetOrdersHandler({useCase});

const handler: ActivityHandler = getOrdersHandler;

df.app.activity("GetOrders", {
  handler
});
