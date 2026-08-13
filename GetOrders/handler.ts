import {GetOrdersUseCase} from "../GenerateReport/application/get-orders.use-case";
import {GetOrdersQuery} from "../GenerateReport/application/get-orders.query";

export interface GetOrdersHandlerDependencies {
  useCase: GetOrdersUseCase;
}

export function createGetOrdersHandler(dependencies: GetOrdersHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: GetOrdersQuery = parseActivityInput(input);

    return dependencies.useCase.execute({
      customerId: command.customerId,
      period: command.period
    });
  };
}


function parseActivityInput(input: unknown): GetOrdersQuery {

  if (typeof input !== "object" || input === null) {
    throw new Error("GetOrders activity input is invalid");
  }

  const candidate = input as Partial<GetOrdersQuery>;

  if (
    typeof candidate.customerId !== "string" ||
    typeof candidate.period !== "object" ||
    candidate.period === null ||
    typeof candidate.period.from !== "string" ||
    typeof candidate.period.to !== "string"
  ) {
    throw new Error("GetOrders activity input is invalid");
  }

  return {
    customerId: candidate.customerId,
    period: {
      from: candidate.period.from,
      to: candidate.period.to
    }
  };
}
