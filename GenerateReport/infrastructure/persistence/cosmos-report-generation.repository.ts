import {Container, OperationInput} from "@azure/cosmos";

import {ReportStatus} from "../../../Report/domain/report-status";
import {CompleteGeneratedReport, ReportGenerationRepository} from "../../domain/report-generation.repository";
import {ReportGenerationSnapshot} from "../../domain/report-generation.types";
import {ReportGenerationConcurrencyError} from "../../domain/report-generation-concurrency.error";

type CosmosReportGenerationDocument = {
  id: string;
  reportId: string;
  status: ReportStatus;
  blobName?: string;
  generatedAt?: string;
}

type CosmosReportGeneratedOutboxDocument = {
  id: string;
  reportId: string;
  docType: "OUTBOX";
  eventType: "ReportGenerated";
  eventVersion: number;
  occurredAt: string;
  status: "PENDING";
  payload: {
    eventId: string; occurredAt: string; reportId: string; blobName: string;
  };
}

export class CosmosReportGenerationRepository implements ReportGenerationRepository {

  constructor(private readonly container: Container) {
  }

  async findById(reportId: string): Promise<ReportGenerationSnapshot | null> {

    try {

      const response = await this.container
        .item(reportId, reportId)
        .read<CosmosReportGenerationDocument>();

      if (!response.resource || !response.etag) {
        return null;
      }

      return {
        state: {
          reportId: response.resource.reportId,
          status: response.resource.status,
          blobName: response.resource.blobName,
          generatedAt: response.resource.generatedAt
        },
        version: response.etag
      };

    } catch (error: unknown) {

      if (this.hasStatusCode(error, 404)) {
        return null;
      }

      throw error;
    }
  }

  async completeGeneration(input: CompleteGeneratedReport): Promise<void> {

    const outboxDocument: CosmosReportGeneratedOutboxDocument = {
      id: input.event.eventId,
      reportId: input.reportId,
      docType: "OUTBOX",
      eventType: "ReportGenerated",
      eventVersion: 1,
      occurredAt: input.event.occurredAt,
      status: "PENDING",
      payload: input.event
    };

    const operations: OperationInput[] = [
      {
        operationType: "Patch",
        id: input.reportId,
        partitionKey: input.reportId,
        ifMatch: input.expectedVersion,
        resourceBody: [{
          op: "set",
          path: "/status",
          value: "GENERATED"
        }, {
          op: "set",
          path: "/blobName",
          value: input.blobName
        }, {
          op: "set",
          path: "/generatedAt",
          value: input.generatedAt
        }]
      },
      {
        operationType: "Create",
        resourceBody: outboxDocument
      }];

    const response = await this.container
      .items
      .batch(operations, input.reportId);

    const concurrencyFailure = response.result?.find(
      operation => operation.statusCode === 412);

    if (concurrencyFailure) {
      throw new ReportGenerationConcurrencyError(input.reportId);
    }

    const failedOperation = response.result?.find(
      operation => operation.statusCode < 200 || operation.statusCode >= 300);

    if (failedOperation) {
      throw new Error(`Complete generation transaction failed with status ${failedOperation.statusCode}`);
    }
  }

  private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {

    return (typeof error === "object" && error !== null &&
      (("code" in error && error.code === expectedStatusCode) || ("statusCode" in error && error.statusCode === expectedStatusCode)));
  }
}
