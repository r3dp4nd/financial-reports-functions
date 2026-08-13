import {InvocationContext} from "@azure/functions";

export interface ReportRequestedMessage {
  eventId: string;
  occurredAt: string;
  reportId: string;
  customerId: string;

  period: {
    from: string; to: string;
  };
}

export interface StartGenerateReportClient {
  start(reportId: string, input: ReportRequestedMessage): Promise<string>;
}

export interface StartGenerateReportHandlerDependencies {
  client: StartGenerateReportClient;
}

export function createStartGenerateReportHandler(dependencies: StartGenerateReportHandlerDependencies) {

  return async function startGenerateReportHandler(message: unknown, context: InvocationContext): Promise<void> {

    const reportRequestedMessage = parseMessage(message);

    const instanceId = await dependencies
      .client
      .start(reportRequestedMessage.reportId, reportRequestedMessage);

    context.log("Report generation orchestration started", {
      reportId: reportRequestedMessage.reportId,
      instanceId
    });
  };
}

function parseMessage(message: unknown): ReportRequestedMessage {

  if (typeof message !== "object" || message === null) {
    throw new Error("ReportRequested message is invalid");
  }

  const candidate = message as Partial<ReportRequestedMessage>;

  if (
    typeof candidate.eventId !== "string" || !candidate.eventId.trim() ||
    typeof candidate.occurredAt !== "string" || !candidate.occurredAt.trim() ||
    typeof candidate.reportId !== "string" || !candidate.reportId.trim() ||
    typeof candidate.customerId !== "string" || !candidate.customerId.trim() ||
    typeof candidate.period !== "object" || candidate.period === null ||
    typeof candidate.period.from !== "string" || typeof candidate.period.to !== "string"
  ) {
    throw new Error("ReportRequested message is invalid");
  }

  return {
    eventId: candidate.eventId,
    occurredAt: candidate.occurredAt,
    reportId: candidate.reportId,
    customerId: candidate.customerId,
    period: {
      from: candidate.period.from,
      to: candidate.period.to
    }
  };
}
