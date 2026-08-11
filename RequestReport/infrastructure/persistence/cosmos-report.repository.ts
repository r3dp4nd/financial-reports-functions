import {Container, ItemResponse} from "@azure/cosmos";

import {Report} from "../../domain/report.types";
import {ReportRepository} from "../../domain/report.repository";

interface CosmosReportDocument {
    id: string;
    reportId: string;
    customerId: string;
    period: {
        from: string; to: string;
    };
    status: | "REQUESTED" | "PROCESSING" | "GENERATED" | "COMPLETED" | "FAILED";
    requestedAt: string;
}

export class CosmosReportRepository implements ReportRepository {

    constructor(private readonly container: Container) {
    }

    async save(report: Report): Promise<void> {

        const document: CosmosReportDocument = this.toDocument(report);

        await this.container
            .items
            .upsert(document);
    }

    async findById(reportId: string): Promise<Report | null> {

        try {

            const response: ItemResponse<CosmosReportDocument> = await this.container
                .item(reportId, reportId)
                .read<CosmosReportDocument>();

            if (!response.resource) {
                return null;
            }

            return this.toDomain(response.resource);

        } catch (error: unknown) {

            if (this.isNotFound(error)) {
                return null;
            }

            throw error;
        }
    }

    private toDocument(report: Report): CosmosReportDocument {

        return {
            id: report.reportId,
            reportId: report.reportId,
            customerId: report.customerId,
            period: report.period,
            status: report.status,
            requestedAt: report.requestedAt
        };
    }

    private toDomain(document: CosmosReportDocument): Report {

        return {
            reportId: document.reportId,
            customerId: document.customerId,
            period: document.period,
            status: document.status,
            requestedAt: document.requestedAt
        };
    }

    private isNotFound(error: unknown): boolean {
        return (typeof error === "object" && error !== null && "code" in error && error.code === 404);
    }
}