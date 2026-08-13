import {Container, SqlQuerySpec} from "@azure/cosmos";

import {FindOrdersCriteria, OrderReportRepository} from "../../domain/order-report.repository";
import {OrderReportItem} from "../../domain/order-report.types";

interface CosmosOrderDocument {
    id: string;
    orderId: string;
    customerId: string;
    orderDate: string;
    total: number;
    currency: string;
    status: string;
}

export class CosmosOrderReportRepository implements OrderReportRepository {

    constructor(private readonly container: Container) {
    }

    async findByCriteria(criteria: FindOrdersCriteria): Promise<OrderReportItem[]> {

        const query: SqlQuerySpec = {
            query: `
                SELECT c.orderId,
                       c.customerId,
                       c.orderDate,
                       c.total,
                       c.currency,
                       c.status
                FROM c
                WHERE c.customerId = @customerId
                  AND c.orderDate >= @from
                  AND c.orderDate <= @to
                ORDER BY c.orderDate ASC
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
            .query<CosmosOrderDocument>(query, {
                partitionKey: criteria.customerId
            })
            .fetchAll();

        return resources.map((document: CosmosOrderDocument): OrderReportItem => this.toDomain(document));
    }

    private toDomain(document: CosmosOrderDocument): OrderReportItem {

        return {
            orderId: document.orderId,
            customerId: document.customerId,
            orderDate: document.orderDate,
            total: document.total,
            currency: document.currency,
            status: document.status
        };
    }
}