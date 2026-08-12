import {Container} from "@azure/cosmos";

import {ReportStatus} from "../../../Report/domain/report-status";
import {MarkReportFailedUpdate, ReportFailureRepository} from "../../domain/report-failure.repository";
import {ReportFailureSnapshot} from "../../domain/report-failure.types";
import {ReportFailureConcurrencyError} from "../../domain/report-failure-concurrency.error";

interface CosmosReportFailureDocument {
    id: string;
    reportId: string;
    status: ReportStatus;
    failedAt?: string;
    failureCode?: string;
    failureReason?: string;
}

export class CosmosReportFailureRepository implements ReportFailureRepository {

    constructor(private readonly container: Container) {
    }

    async findById(reportId: string): Promise<ReportFailureSnapshot | null> {

        try {

            const response = await this.container
                .item(reportId, reportId)
                .read<CosmosReportFailureDocument>();

            if (!response.resource || !response.etag) {
                return null;
            }

            return {
                state: {
                    reportId: response.resource.reportId,
                    status: response.resource.status,
                    failedAt: response.resource.failedAt,
                    failureCode: response.resource.failureCode,
                    failureReason: response.resource.failureReason
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

    async markFailed(update: MarkReportFailedUpdate): Promise<void> {

        try {

            await this.container
                .item(update.reportId, update.reportId)
                .patch([{
                    op: "set",
                    path: "/status",
                    value: "FAILED"
                }, {
                    op: "set",
                    path: "/failedAt",
                    value: update.failedAt
                }, {
                    op: "set",
                    path: "/failureCode",
                    value: update.failureCode
                }, {
                    op: "set",
                    path: "/failureReason",
                    value: update.failureReason
                }], {
                    accessCondition: {
                        type: "IfMatch",
                        condition: update.expectedVersion
                    }
                });

        } catch (error: unknown) {

            if (this.hasStatusCode(error, 412)) {
                throw new ReportFailureConcurrencyError(update.reportId);
            }

            throw error;
        }
    }

    private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {

        return (typeof error === "object" && error !== null && (("code" in error && error.code === expectedStatusCode) || ("statusCode" in error && error.statusCode === expectedStatusCode)));
    }
}