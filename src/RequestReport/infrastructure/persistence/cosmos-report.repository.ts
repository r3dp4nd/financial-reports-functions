import {BulkOperationType, Container, JSONObject, OperationInput} from "@azure/cosmos";

import {ReportStatus} from "../../../Report/domain/report-status";
import {ReportRepository, SaveRequestedReport, SaveRequestedReportResult} from "../../domain/report.repository";
import {RequestReportConflictError} from "../../domain/request-report-conflict.error";
import {ReportRequestedIntegrationEvent} from "../../application/report-requested.integration-event";

type CosmosReportDocument = {
  id: string;
  reportId: string;
  docType: "REPORT";
  customerId: string;
  period: {
    from: string; to: string;
  };
  status: ReportStatus;
  requestedAt: string;
  idempotencyKeyHash: string;
  requestHash: string;
  processingAt?: string;
  blobName?: string;
  generatedAt?: string;
  completedAt?: string;
  failedAt?: string;
  failureCode?: string;
  failureReason?: string;
}

type CosmosOutboxDocument = {
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

  async saveRequested(input: SaveRequestedReport): Promise<SaveRequestedReportResult> {

    const reportDocument: CosmosReportDocument = {
      id: input.report.reportId,
      reportId: input.report.reportId,
      docType: "REPORT",
      customerId: input.report.customerId,
      period: {
        from: input.report.period.from,
        to: input.report.period.to
      },
      status: input.report.status,
      requestedAt: input.report.requestedAt,
      idempotencyKeyHash: input.idempotencyKeyHash,
      requestHash: input.requestHash,
      processingAt: input.report.processingAt,
      blobName: input.report.blobName,
      generatedAt: input.report.generatedAt,
      completedAt: input.report.completedAt,
      failedAt: input.report.failedAt,
      failureCode: input.report.failureCode,
      failureReason: input.report.failureReason
    };

    const outboxDocument: CosmosOutboxDocument = {
      id: input.event.eventId,
      reportId: input.report.reportId,
      docType: "OUTBOX",
      eventType: "ReportRequested",
      eventVersion: 1,
      occurredAt: input.event.occurredAt,
      status: "PENDING",
      payload: input.event
    };

    const operations: OperationInput[] = [
      {
        operationType: BulkOperationType.Create,
        resourceBody: reportDocument
      },
      {
        operationType: BulkOperationType.Create,
        resourceBody: outboxDocument as unknown as JSONObject
      }];

    const response = await this.container
      .items
      .batch(operations, input.report.reportId);

    const conflict = response.result?.some(operation => operation.statusCode === 409);

    if (conflict) {

      return this.resolveExistingRequest(input);
    }

    const failedOperation = response
      .result?.find(operation => operation.statusCode < 200 || operation.statusCode >= 300);

    if (failedOperation) {
      throw new Error(`Request report transaction failed with status ${failedOperation.statusCode}`);
    }

    return {
      reportId: input.report.reportId,
      status: "REQUESTED",
      created: true
    };
  }

  private async resolveExistingRequest(input: SaveRequestedReport): Promise<SaveRequestedReportResult> {

    const response = await this.container
      .item(input.report.reportId, input.report.reportId)
      .read<CosmosReportDocument>();

    const existing = response.resource;

    if (!existing) {
      throw new Error(`Report ${input.report.reportId} could not be resolved after conflict`);
    }

    const sameIdempotencyKey = existing.idempotencyKeyHash === input.idempotencyKeyHash;

    const sameRequest = existing.requestHash === input.requestHash;

    if (!sameIdempotencyKey || !sameRequest) {
      throw new RequestReportConflictError();
    }

    return {
      reportId: existing.reportId,
      status: existing.status,
      created: false
    };
  }
}
