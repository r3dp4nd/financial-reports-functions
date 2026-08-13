export interface PaymentReportItem {
    paymentId: string;
    customerId: string;
    paymentDate: string;
    amount: number;
    currency: string;
    status: string;
}