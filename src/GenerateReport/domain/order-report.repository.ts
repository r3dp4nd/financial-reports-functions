import {OrderReportItem} from "./order-report.types";

export interface FindOrdersCriteria {
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}

export interface OrderReportRepository {

    findByCriteria(criteria: FindOrdersCriteria): Promise<OrderReportItem[]>;
}