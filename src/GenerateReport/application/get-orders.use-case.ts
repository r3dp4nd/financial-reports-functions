import {ReportPeriod} from "../../Report/domain/report-period";
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

    const period: ReportPeriod = ReportPeriod.create(query.period?.from, query.period?.to);

    return this.orderReportRepository
      .findByCriteria({
        customerId: query.customerId,
        period: {
          from: period.from,
          to: period.to
        }
      });
  }
}
