import {GetCustomerUseCase} from "../GenerateReport/application/get-customer.use-case";
import {
    CosmosCustomerReportRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-customer-report.repository";
import {customersContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createGetCustomersHandler} from "./handler";

const repository = new CosmosCustomerReportRepository(customersContainer);

const useCase = new GetCustomerUseCase(repository);

const getCustomers = createGetCustomersHandler({useCase});

export default getCustomers;