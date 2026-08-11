import {PaymentReportItem} from "../domain/payment-report.types";
import {PaymentReportRepository} from "../domain/payment-report.repository";
import {GetPaymentsQuery} from "./get-payments.query";

export class GetPaymentsUseCase {

    constructor(private readonly paymentReportRepository: PaymentReportRepository) {
    }

    async execute(query: GetPaymentsQuery): Promise<PaymentReportItem[]> {

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

        return this.paymentReportRepository
            .findByCriteria({
                customerId: query.customerId,
                period: query.period
            });
    }
}