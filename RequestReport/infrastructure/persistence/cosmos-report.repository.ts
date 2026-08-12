import {Container} from "@azure/cosmos";

import {Report} from "../../../Report/domain/report";
import {ReportRepository} from "../../domain/report.repository";

interface CosmosReportDocument {
    id: string;
    reportId: string;
    customerId: string;
    period: {
        from: string;
        to: string;
    };
    status: string;
    requestedAt: string;

    blobName?: string;
    generatedAt?: string;
    completedAt?: string;
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

    private toDocument(report: Report): CosmosReportDocument {

        return {
            id: report.reportId,
            reportId: report.reportId,
            customerId: report.customerId,
            period: {
                from: report.period.from,
                to: report.period.to
            },
            status: report.status,
            requestedAt: report.requestedAt,
            blobName: report.blobName,
            generatedAt: report.generatedAt,
            completedAt: report.completedAt
        };
    }
}