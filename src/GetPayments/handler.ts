import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";
import {GetPaymentsQuery} from "../GenerateReport/application/get-payments.query";

export interface GetPaymentsHandlerDependencies {
  useCase: GetPaymentsUseCase;
}

export function createGetPaymentsHandler(dependencies: GetPaymentsHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: GetPaymentsQuery = parseActivityInput(input);

    return dependencies
      .useCase
      .execute({
        customerId: command.customerId,
        period: command.period
      });
  };
}

function parseActivityInput(input: unknown): GetPaymentsQuery {

  if (typeof input !== "object" || input === null) {
    throw new Error("GetPayments activity input is invalid");
  }

  const candidate = input as Partial<GetPaymentsQuery>;

  if (
    typeof candidate.customerId !== "string" ||
    typeof candidate.period !== "object" ||
    candidate.period === null ||
    typeof candidate.period.from !== "string" ||
    typeof candidate.period.to !== "string"
  ) {
    throw new Error("GetPayments activity input is invalid");
  }

  return {
    customerId: candidate.customerId,
    period: {
      from: candidate.period.from,
      to: candidate.period.to
    }
  };
}
