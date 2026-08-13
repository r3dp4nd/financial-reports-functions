import {Container} from "@azure/cosmos";

import {ReportStatus} from "../../../Report/domain/report-status";
import {CompleteReportUpdate, ReportCompletionRepository} from "../../domain/report-completion.repository";
import {ReportCompletionSnapshot} from "../../domain/report-completion.types";
import {ReportCompletionConcurrencyError} from "../../domain/report-completion-concurrency.error";

interface CosmosReportCompletionDocument {
  id: string;
  reportId: string;
  status: ReportStatus;
  blobName?: string;
  generatedAt?: string;
  completedAt?: string;
}

export class CosmosReportCompletionRepository implements ReportCompletionRepository {

  constructor(private readonly container: Container) {
  }

  async findById(reportId: string): Promise<ReportCompletionSnapshot | null> {

    try {

      const response = await this.container
        .item(reportId, reportId)
        .read<CosmosReportCompletionDocument>();

      if (!response.resource || !response.etag) {
        return null;
      }

      return {
        state: {
          reportId: response.resource.reportId,
          status: response.resource.status,
          blobName: response.resource.blobName,
          generatedAt: response.resource.generatedAt,
          completedAt: response.resource.completedAt
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

  async complete(update: CompleteReportUpdate): Promise<void> {

    try {

      await this.container
        .item(update.reportId, update.reportId)
        .patch([{
          op: "set",
          path: "/status",
          value: "COMPLETED"
        }, {
          op: "set",
          path: "/completedAt",
          value: update.completedAt
        }], {
          accessCondition: {
            type: "IfMatch",
            condition: update.expectedVersion
          }
        });

    } catch (error: unknown) {

      if (this.hasStatusCode(error, 412)) {
        throw new ReportCompletionConcurrencyError(update.reportId);
      }

      throw error;
    }
  }

  private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {

    return (typeof error === "object" && error !== null && (("code" in error && error.code === expectedStatusCode) || ("statusCode" in error && error.statusCode === expectedStatusCode)));
  }
}
