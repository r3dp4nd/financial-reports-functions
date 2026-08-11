import {PaymentReportItem} from "./payment-report.types";

export interface FindPaymentsCriteria {
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}

export interface PaymentReportRepository {
    findByCriteria(
        criteria: FindPaymentsCriteria
    ): Promise<PaymentReportItem[]>;
}