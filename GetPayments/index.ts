import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";
import {
    CosmosPaymentReportRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-payment-report.repository";
import {paymentsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createGetPaymentsHandler} from "./handler";

const repository = new CosmosPaymentReportRepository(paymentsContainer);

const useCase = new GetPaymentsUseCase(repository);

const getPayments = createGetPaymentsHandler({useCase});

export default getPayments;