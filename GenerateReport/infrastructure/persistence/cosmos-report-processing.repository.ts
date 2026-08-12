import {Container} from "@azure/cosmos";

import {ReportStatus} from "../../../Report/domain/report-status";
import {MarkReportProcessingUpdate, ReportProcessingRepository} from "../../domain/report-processing.repository";
import {ReportProcessingSnapshot} from "../../domain/report-processing.types";
import {ReportProcessingConcurrencyError} from "../../domain/report-processing-concurrency.error";

interface CosmosReportProcessingDocument {
    id: string;
    reportId: string;
    status: ReportStatus;
    processingAt?: string;
}

export class CosmosReportProcessingRepository implements ReportProcessingRepository {

    constructor(private readonly container: Container) {
    }

    async findById(reportId: string): Promise<ReportProcessingSnapshot | null> {

        try {

            const response = await this.container
                .item(reportId, reportId)
                .read<CosmosReportProcessingDocument>();

            if (!response.resource || !response.etag) {
                return null;
            }

            return {
                state: {
                    reportId: response.resource.reportId,
                    status: response.resource.status,
                    processingAt: response.resource.processingAt
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

    async markProcessing(update: MarkReportProcessingUpdate): Promise<void> {

        try {

            await this.container
                .item(update.reportId, update.reportId)
                .patch([{
                    op: "set",
                    path: "/status",
                    value: "PROCESSING"
                }, {
                    op: "set",
                    path: "/processingAt",
                    value: update.processingAt
                }], {
                    accessCondition: {
                        type: "IfMatch",
                        condition: update.expectedVersion
                    }
                });

        } catch (error: unknown) {

            if (this.hasStatusCode(error, 412)) {
                throw new ReportProcessingConcurrencyError(update.reportId);
            }

            throw error;
        }
    }

    private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {

        return (typeof error === "object" && error !== null && (("code" in error && error.code === expectedStatusCode) || ("statusCode" in error && error.statusCode === expectedStatusCode)));
    }
}