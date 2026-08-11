import * as df from "durable-functions";

import {
    GenerateExcelActivityInput,
    GenerateExcelActivityResult,
    ReportDataResult,
    ReportOrchestrationInput
} from "./report-orchestration.types";
import {OrderReportItem} from "../GenerateReport/domain/order-report.types";
import {PaymentReportItem} from "../GenerateReport/domain/payment-report.types";
import {CustomerReportData} from "../GenerateReport/domain/customer-report.types";

const GET_ORDERS_ACTIVITY = "GetOrders";

const GET_PAYMENTS_ACTIVITY = "GetPayments";

const GET_CUSTOMERS_ACTIVITY = "GetCustomers";

const GENERATE_EXCEL_ACTIVITY = "GenerateExcel";

const COMPLETE_GENERATION_ACTIVITY = "CompleteGeneration";

const reportOrchestrator = df.orchestrator(function* (context) {

        const input = context.df.getInput() as ReportOrchestrationInput;

        const dataRequest = {
            reportId: input.reportId,
            customerId: input.customerId,
            period: input.period
        };

        const tasks = [
            context.df.callActivity(GET_ORDERS_ACTIVITY, dataRequest),
            context.df.callActivity(GET_PAYMENTS_ACTIVITY, dataRequest),
            context.df.callActivity(GET_CUSTOMERS_ACTIVITY, {
                customerId:
                input.customerId
            })
        ];

        const results = yield context.df.Task.all(tasks);

        const reportData: ReportDataResult = {
            orders: results[0] as OrderReportItem[],
            payments: results[1] as PaymentReportItem[],
            customer: results[2] as CustomerReportData
        };

        const generateExcelInput: GenerateExcelActivityInput = {
            reportId: input.reportId,
            customerId: input.customerId,
            data: reportData
        };

        const generatedReport: GenerateExcelActivityResult = yield context.df.callActivity(GENERATE_EXCEL_ACTIVITY, generateExcelInput);

        yield context.df.callActivity(COMPLETE_GENERATION_ACTIVITY, generatedReport);

        return {
            reportId: generatedReport.reportId,
            status: "GENERATED",
            blobName: generatedReport.blobName
        };
    }
);

export default reportOrchestrator;