import {ReportPeriod} from "../../Report/domain/report-period";
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

        const period: ReportPeriod = ReportPeriod.create(query.period?.from, query.period?.to);

        return this.paymentReportRepository
            .findByCriteria({
                customerId: query.customerId,
                period: {
                    from: period.from,
                    to: period.to
                }
            });
    }
}