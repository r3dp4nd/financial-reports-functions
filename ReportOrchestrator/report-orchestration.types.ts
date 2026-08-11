import {OrderReportItem} from "../GenerateReport/domain/order-report.types";
import {PaymentReportItem} from "../GenerateReport/domain/payment-report.types";
import {CustomerReportData} from "../GenerateReport/domain/customer-report.types";

export interface ReportOrchestrationInput {
    reportId: string;
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}

export interface ReportDataResult {
    orders: OrderReportItem[];
    payments: PaymentReportItem[];
    customer: CustomerReportData;
}

export interface GenerateExcelActivityInput {
    reportId: string;
    customerId: string;
    data: ReportDataResult;
}

export interface GenerateExcelActivityResult {
    reportId: string;
    blobName: string;
}