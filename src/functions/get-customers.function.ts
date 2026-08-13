import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {GetCustomerUseCase} from "../GenerateReport/application/get-customer.use-case";
import {
  CosmosCustomerReportRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-customer-report.repository";
import {customersContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createGetCustomersHandler} from "../GetCustomers/handler";

const repository = new CosmosCustomerReportRepository(customersContainer);

const useCase = new GetCustomerUseCase(repository);

const getCustomersHandler = createGetCustomersHandler({useCase});

const handler: ActivityHandler = getCustomersHandler;

df.app.activity("GetCustomers", {
  handler
});
