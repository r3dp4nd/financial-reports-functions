import {OrderReportItem} from "../domain/order-report.types";
import {OrderReportRepository} from "../domain/order-report.repository";
import {GetOrdersQuery} from "./get-orders.query";

export class GetOrdersUseCase {

    constructor(private readonly orderReportRepository: OrderReportRepository) {
    }

    async execute(query: GetOrdersQuery): Promise<OrderReportItem[]> {

        if (!query.customerId?.trim()) {
            throw new Error("customerId is required");
        }

        if (!query.period?.from?.trim()) {
            throw new Error("period.from is required");
        }

        if (!query.period?.to?.trim()) {
            throw new Error("period.to is required");
        }

        const from = new Date(query.period.from);

        const to = new Date(query.period.to);

        if (Number.isNaN(from.getTime())) {
            throw new Error("period.from is invalid");
        }

        if (Number.isNaN(to.getTime())) {
            throw new Error("period.to is invalid");
        }

        if (from > to) {
            throw new Error("period.from must be before or equal to period.to");
        }

        return this.orderReportRepository
            .findByCriteria({
                customerId: query.customerId,
                period: query.period
            });
    }
}