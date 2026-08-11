import {Container} from "@azure/cosmos";

import {ReportGenerationRepository, UpdateGeneratedReport} from "../../domain/report-generation.repository";
import {ReportGenerationSnapshot, ReportGenerationStatus} from "../../domain/report-generation.types";
import {ReportGenerationConcurrencyError} from "../../domain/report-generation-concurrency.error";

interface CosmosReportGenerationDocument {
    id: string;
    reportId: string;
    status: ReportGenerationStatus;
    blobName?: string;
    generatedAt?: string;
    _etag?: string;
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

    async updateGenerated(input: UpdateGeneratedReport): Promise<void> {

        try {

            await this.container
                .item(input.reportId, input.reportId)
                .patch([{
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
                }], {
                    accessCondition: {
                        type: "IfMatch",
                        condition: input.expectedVersion
                    }
                });

        } catch (error: unknown) {

            if (this.hasStatusCode(error, 412)) {
                throw new ReportGenerationConcurrencyError(input.reportId);
            }

            throw error;
        }
    }

    private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {

        return (typeof error === "object" && error !== null && (("code" in error && error.code === expectedStatusCode) || ("statusCode" in error && error.statusCode === expectedStatusCode)));
    }
}