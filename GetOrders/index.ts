import {GetOrdersUseCase} from "../GenerateReport/application/get-orders.use-case";

import {CosmosOrderReportRepository} from "../GenerateReport/infrastructure/persistence/cosmos-order-report.repository";
import {ordersContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";

import {createGetOrdersHandler} from "./handler";

const repository = new CosmosOrderReportRepository(ordersContainer);

const useCase = new GetOrdersUseCase(repository);

const getOrders = createGetOrdersHandler({useCase});

export default getOrders;