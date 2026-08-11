import * as df from "durable-functions";

import {
    GenerateExcelActivityInput,
    GenerateExcelActivityResult,
    ReportDataResult,
    ReportOrchestrationInput
} from "./report-orchestration.types";

const GET_ORDERS_ACTIVITY = "GetOrders";

const GET_PAYMENTS_ACTIVITY = "GetPayments";

const GET_CUSTOMERS_ACTIVITY = "GetCustomers";

const GENERATE_EXCEL_ACTIVITY = "GenerateExcel";

const COMPLETE_GENERATION_ACTIVITY = "CompleteGeneration";

const reportOrchestrator = df.orchestrator(function* (context) {

        const input = context.df.getInput() as ReportOrchestrationInput;

        const dataRequest = {
            reportId:
            input.reportId,
            customerId:
            input.customerId,
            period:
            input.period
        };

        const tasks = [
            context.df.callActivity(
                GET_ORDERS_ACTIVITY,
                dataRequest
            ),

            context.df.callActivity(
                GET_PAYMENTS_ACTIVITY,
                dataRequest
            ),

            context.df.callActivity(
                GET_CUSTOMERS_ACTIVITY,
                dataRequest
            )
        ];

        const results =
            yield context.df.Task.all(
                tasks
            );

        const reportData:
            ReportDataResult = {
            orders:
                results[0],
            payments:
                results[1],
            customers:
                results[2]
        };

        const generateExcelInput:
            GenerateExcelActivityInput = {
            reportId:
            input.reportId,
            customerId:
            input.customerId,
            data:
            reportData
        };

        const generatedReport: GenerateExcelActivityResult = yield context.df.callActivity(
            GENERATE_EXCEL_ACTIVITY,
            generateExcelInput
        );

        yield context.df.callActivity(COMPLETE_GENERATION_ACTIVITY, generatedReport);

        return {
            reportId:
            generatedReport.reportId,
            status: "GENERATED",
            blobName:
            generatedReport.blobName
        };
    }
);

export default reportOrchestrator;