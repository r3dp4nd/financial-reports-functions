import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";
import {MarkReportFailedCommand} from "../GenerateReport/application/mark-report-failed.command";

export interface MarkReportFailedHandlerDependencies {
  useCase: MarkReportFailedUseCase;
}

export function createMarkReportFailedHandler(dependencies: MarkReportFailedHandlerDependencies) {

  return async function (input: unknown): Promise<unknown> {

    const command: MarkReportFailedCommand = parseActivityInput(input);

    return dependencies
      .useCase
      .execute(command);
  };
}

function parseActivityInput(input: unknown): MarkReportFailedCommand {

  if (typeof input !== "object" || input === null) {
    throw new Error("MarkReportFailed activity input is invalid");
  }

  const candidate = input as Partial<MarkReportFailedCommand>;

  if (typeof candidate.reportId !== "string" || typeof candidate.failedAt !== "string" || typeof candidate.failureCode !== "string" || typeof candidate.failureReason !== "string") {
    throw new Error("MarkReportFailed activity input is invalid");
  }

  return {
    reportId: candidate.reportId,
    failedAt: candidate.failedAt,
    failureCode: candidate.failureCode,
    failureReason: candidate.failureReason
  };
}
