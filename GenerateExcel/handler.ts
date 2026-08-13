import {GenerateExcelUseCase} from "../GenerateReport/application/generate-excel.use-case";
import {GenerateExcelCommand} from "../GenerateReport/application/generate-excel.command";

export interface GenerateExcelHandlerDependencies {
  useCase: GenerateExcelUseCase;
}

export function createGenerateExcelHandler(dependencies: GenerateExcelHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: GenerateExcelCommand = parseActivityInput(input);

    return dependencies
      .useCase
      .execute(command);
  };
}

function parseActivityInput(input: unknown): GenerateExcelCommand {

  if (typeof input !== "object" || input === null) {
    throw new Error("GetCustomers activity input is invalid");
  }

  const candidate = input as Partial<GenerateExcelCommand>;

  if (typeof candidate.customerId !== "string" || typeof candidate.reportId !== "string" || typeof candidate.data !== "object") {
    throw new Error("GetCustomers activity input is invalid");
  }

  return {
    customerId: candidate.customerId,
    data: candidate.data,
    reportId: candidate.reportId,
  };
}
