import {CustomerReportData} from "../domain/customer-report.types";
import {CustomerReportRepository} from "../domain/customer-report.repository";
import {GetCustomerQuery} from "./get-customer.query";

export class GetCustomerUseCase {

    constructor(private readonly customerReportRepository: CustomerReportRepository) {
    }

    async execute(query: GetCustomerQuery): Promise<CustomerReportData> {

        if (!query.customerId?.trim()) {
            throw new Error("customerId is required");
        }

        const customer: CustomerReportData | null = await this.customerReportRepository
            .findById(query.customerId);

        if (!customer) {
            throw new Error(`Customer ${query.customerId} was not found`);
        }

        return customer;
    }
}