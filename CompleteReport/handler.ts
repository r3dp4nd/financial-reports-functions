import {InvocationContext} from "@azure/functions";
import {CompleteReportUseCase} from "./application/complete-report.use-case";
import {ReportGeneratedMessage} from "./report-generated.message.types";

export interface CompleteReportHandlerDependencies {
  useCase: CompleteReportUseCase;
  now: () => string;
}

export function createCompleteReportHandler(dependencies: CompleteReportHandlerDependencies) {

  return async function (message: unknown, context: InvocationContext): Promise<void> {

    const reportGeneratedMessage = parseReportGeneratedMessage(message);

    context.log("Completing generated report", {
      reportId: reportGeneratedMessage.reportId,
      eventId: reportGeneratedMessage.eventId
    });

    const result = await dependencies
      .useCase
      .execute({
        reportId: reportGeneratedMessage.reportId,
        blobName: reportGeneratedMessage.blobName,
        completedAt: dependencies.now()
      });

    context.log("Report completed", {
      reportId: result.reportId,
      status: result.status
    });
  };
}

function parseReportGeneratedMessage(message: unknown): ReportGeneratedMessage {

  if (typeof message !== "object" || message === null) {
    throw new Error("ReportGenerated message is invalid");
  }

  const candidate = message as Partial<ReportGeneratedMessage>;

  if (!candidate.eventId?.trim() || !candidate.reportId?.trim() || !candidate.blobName?.trim() || !candidate.occurredAt?.trim()) {
    throw new Error("ReportGenerated message is invalid");
  }

  return {
    eventId: candidate.eventId,
    occurredAt: candidate.occurredAt,
    reportId: candidate.reportId,
    blobName: candidate.blobName
  };
}
