import {BulkOperationType, Container, JSONObject, OperationInput, OperationResponse, Response} from "@azure/cosmos";

import {Report} from "../../../Report/domain/report";
import {ReportRepository} from "../../domain/report.repository";
import {ReportRequestedIntegrationEvent} from "../../application/report-requested.integration-event";

type CosmosReportDocument = JSONObject & {
  id: string;
  reportId: string;
  docType: "REPORT";

  customerId: string;

  period: {
    from: string; to: string;
  };

  status: string;

  requestedAt: string;

  processingAt?: string;

  blobName?: string;
  generatedAt?: string;

  completedAt?: string;

  failedAt?: string;
  failureCode?: string;
  failureReason?: string;
}

type CosmosOutboxDocument = JSONObject & {
  id: string;
  reportId: string;
  docType: "OUTBOX";

  eventType: "ReportRequested";
  eventVersion: number;

  occurredAt: string;

  status: "PENDING";

  payload: ReportRequestedIntegrationEvent;
}

export class CosmosReportRepository implements ReportRepository {

  constructor(private readonly container: Container) {
  }

  async saveRequested(report: Report, event: ReportRequestedIntegrationEvent): Promise<void> {
    const reportDocument = this.toReportDocument(report);

    const outboxDocument = this.toOutboxDocument(event);

    const operations: OperationInput[] = [{
      operationType: BulkOperationType.Create, resourceBody: reportDocument
    }, {
      operationType: BulkOperationType.Create, resourceBody: outboxDocument
    }];

    const response: Response<OperationResponse[]> = await this.container.items.batch(operations, report.reportId);

    const failedOperation: OperationResponse | undefined = response.result?.find(
      (operation: OperationResponse): boolean => operation.statusCode < 200 || operation.statusCode >= 300);

    if (failedOperation) {
      throw new Error(`Request report transaction failed with status ${failedOperation.statusCode}`);
    }
  }

  private toReportDocument(
    report: Report
  ): CosmosReportDocument {

    return {
      id: report.reportId,
      reportId: report.reportId,
      docType: "REPORT",
      customerId: report.customerId,
      period: {
        from: report.period.from,
        to: report.period.to
      },
      status: report.status,
      requestedAt: report.requestedAt,
      ...(report.processingAt !== undefined && {
        processingAt: report.processingAt
      }),
      ...(report.blobName !== undefined && {
        blobName: report.blobName
      }),
      ...(report.generatedAt !== undefined && {
        generatedAt: report.generatedAt
      }),
      ...(report.completedAt !== undefined && {
        completedAt: report.completedAt
      }),
      ...(report.failedAt !== undefined && {
        failedAt: report.failedAt
      }),
      ...(report.failureCode !== undefined && {
        failureCode: report.failureCode
      }),
      ...(report.failureReason !== undefined && {
        failureReason: report.failureReason
      })
    };
  }

  private toOutboxDocument(
    event: ReportRequestedIntegrationEvent
  ): CosmosOutboxDocument {

    return {
      id: event.eventId,
      reportId: event.reportId,
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: event.occurredAt,
      status: "PENDING",
      payload: {
        ...event
      }
    };
  }
}


