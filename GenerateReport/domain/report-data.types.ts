import {OrderReportItem} from "./order-report.types";
import {PaymentReportItem} from "./payment-report.types";
import {CustomerReportData} from "./customer-report.types";

export interface ReportData {
    orders: OrderReportItem[];
    payments: PaymentReportItem[];
    customer: CustomerReportData;
}