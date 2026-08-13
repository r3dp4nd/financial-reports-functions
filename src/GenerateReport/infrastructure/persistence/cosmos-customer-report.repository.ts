import {Container} from "@azure/cosmos";

import {CustomerReportRepository} from "../../domain/customer-report.repository";

import {CustomerReportData} from "../../domain/customer-report.types";

interface CosmosCustomerDocument {
    id: string;
    customerId: string;
    name: string;
    documentNumber: string;
    segment: string;
    email: string;
}

export class CosmosCustomerReportRepository implements CustomerReportRepository {

    constructor(private readonly container: Container) {
    }

    async findById(customerId: string): Promise<CustomerReportData | null> {

        try {
            const response = await this.container
                .item(customerId, customerId)
                .read<CosmosCustomerDocument>();

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

    private toDomain(document: CosmosCustomerDocument): CustomerReportData {

        return {
            customerId: document.customerId,
            name: document.name,
            documentNumber: document.documentNumber,
            segment: document.segment,
            email: document.email
        };
    }

    private isNotFound(error: unknown): boolean {
        return (typeof error === "object" && error !== null && "code" in error && error.code === 404);
    }
}