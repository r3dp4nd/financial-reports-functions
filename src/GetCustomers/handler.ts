import {GetCustomerQuery} from "../GenerateReport/application/get-customer.query"
import {GetCustomerUseCase} from "../GenerateReport/application/get-customer.use-case";

export interface GetCustomersHandlerDependencies {
  useCase: GetCustomerUseCase;
}

export function createGetCustomersHandler(dependencies: GetCustomersHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: GetCustomerQuery = parseActivityInput(input);

    return dependencies
      .useCase
      .execute({
        customerId: command.customerId
      });
  };
}

function parseActivityInput(input: unknown): GetCustomerQuery {

  if (typeof input !== "object" || input === null) {
    throw new Error("GetCustomers activity input is invalid");
  }

  const candidate = input as Partial<GetCustomerQuery>;

  if (typeof candidate.customerId !== "string") {
    throw new Error("GetCustomers activity input is invalid");
  }

  return {
    customerId: candidate.customerId
  };
}
