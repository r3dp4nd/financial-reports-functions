import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";

export interface MarkReportProcessingActivityInput {
  reportId: string;
  processingAt: string;
}

export interface MarkReportProcessingHandlerDependencies {
  useCase: MarkReportProcessingUseCase;
}

export function createMarkReportProcessingHandler(dependencies: MarkReportProcessingHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: MarkReportProcessingActivityInput = parseActivityInput(input);

    return dependencies
      .useCase
      .execute({
        reportId: command.reportId,
        processingAt: command.processingAt
      });
  };
}

function parseActivityInput(input: unknown): MarkReportProcessingActivityInput {

  if (typeof input !== "object" || input === null) {
    throw new Error("MarkReportProcessing activity input is invalid");
  }

  const candidate = input as Partial<MarkReportProcessingActivityInput>;

  if (typeof candidate.reportId !== "string" || typeof candidate.processingAt !== "string") {
    throw new Error("MarkReportProcessing activity input is invalid");
  }

  return {
    reportId: candidate.reportId,
    processingAt: candidate.processingAt
  };
}
