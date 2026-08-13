import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";

export interface CompleteGenerationInput {
  reportId: string;
  blobName: string;
  generatedAt?: string;
}


export interface CompleteGenerationHandlerDependencies {
  useCase: CompleteGenerationUseCase;
  now: () => string;
}

export function createCompleteGenerationHandler(dependencies: CompleteGenerationHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: CompleteGenerationInput = parseActivityInput(input);

    return dependencies
      .useCase
      .execute({
        reportId: command.reportId,
        blobName: command.blobName,
        generatedAt: dependencies.now()
      });
  };
}

function parseActivityInput(input: unknown): CompleteGenerationInput {

  if (typeof input !== "object" || input === null) {
    throw new Error("CompleteGeneration activity input is invalid");
  }

  const candidate = input as Partial<CompleteGenerationInput>;

  if (
    typeof candidate.reportId !== "string" ||
    typeof candidate.blobName !== "string"
  ) {
    throw new Error("CompleteGeneration activity input is invalid");
  }

  return {
    reportId: candidate.reportId,
    blobName: candidate.blobName,
  };
}
