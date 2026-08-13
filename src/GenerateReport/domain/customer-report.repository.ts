import {CustomerReportData} from "./customer-report.types";

export interface CustomerReportRepository {

    findById(
        customerId: string
    ): Promise<CustomerReportData | null>;
}