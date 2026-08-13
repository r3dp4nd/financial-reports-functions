import * as df from "durable-functions";
import {ActivityHandler} from "durable-functions";

import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";
import {
  CosmosPaymentReportRepository
} from "../GenerateReport/infrastructure/persistence/cosmos-payment-report.repository";
import {paymentsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {createGetPaymentsHandler} from "../GetPayments/handler";

const repository = new CosmosPaymentReportRepository(paymentsContainer);

const useCase = new GetPaymentsUseCase(repository);

const getPaymentsHandler = createGetPaymentsHandler({useCase});

const handler: ActivityHandler = getPaymentsHandler;

df.app.activity("GetPayments", {
  handler
});
