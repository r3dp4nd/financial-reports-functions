import {Container, SqlQuerySpec} from "@azure/cosmos";

import {FindPaymentsCriteria, PaymentReportRepository} from "../../domain/payment-report.repository";
import {PaymentReportItem} from "../../domain/payment-report.types";

interface CosmosPaymentDocument {
    id: string;
    paymentId: string;
    customerId: string;
    paymentDate: string;
    amount: number;
    currency: string;
    status: string;
}

export class CosmosPaymentReportRepository implements PaymentReportRepository {

    constructor(private readonly container: Container) {
    }

    async findByCriteria(criteria: FindPaymentsCriteria): Promise<PaymentReportItem[]> {

        const query: SqlQuerySpec = {
            query: `
                SELECT c.paymentId,
                       c.customerId,
                       c.paymentDate,
                       c.amount,
                       c.currency,
                       c.status
                FROM c
                WHERE c.customerId = @customerId
                  AND c.paymentDate >= @from
                  AND c.paymentDate <= @to
                ORDER BY c.paymentDate ASC
            `,
            parameters: [{
                name: "@customerId",
                value: criteria.customerId
            }, {
                name: "@from",
                value: criteria.period.from
            }, {
                name: "@to",
                value: criteria.period.to
            }]
        };

        const {
            resources
        } = await this.container
            .items
            .query<CosmosPaymentDocument>(query, {
                partitionKey: criteria.customerId
            })
            .fetchAll();

        return resources.map(document => this.toDomain(document));
    }

    private toDomain(document: CosmosPaymentDocument): PaymentReportItem {

        return {
            paymentId: document.paymentId,
            customerId: document.customerId,
            paymentDate: document.paymentDate,
            amount: document.amount,
            currency: document.currency,
            status: document.status
        };
    }
}