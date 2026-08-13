import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";
import {CompleteGenerationCommand} from "../GenerateReport/application/complete-generation.command";

export interface CompleteGenerationHandlerDependencies {
  useCase: CompleteGenerationUseCase;
  now: () => string;
}

export function createCompleteGenerationHandler(dependencies: CompleteGenerationHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: CompleteGenerationCommand = parseActivityInput(input);

    return dependencies
      .useCase
      .execute({
        reportId: command.reportId,
        blobName: command.blobName,
        generatedAt: dependencies.now()
      });
  };
}

function parseActivityInput(input: unknown): CompleteGenerationCommand {

  if (typeof input !== "object" || input === null) {
    throw new Error("CompleteGeneration activity input is invalid");
  }

  const candidate = input as Partial<CompleteGenerationCommand>;

  if (typeof candidate.reportId !== "string" || typeof candidate.blobName !== "string" || typeof candidate.generatedAt !== "string") {
    throw new Error("CompleteGeneration activity input is invalid");
  }

  return {
    reportId: candidate.reportId,
    blobName: candidate.blobName,
    generatedAt: candidate.generatedAt
  };
}
