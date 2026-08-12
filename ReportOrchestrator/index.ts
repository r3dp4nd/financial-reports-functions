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

const MARK_PROCESSING_ACTIVITY = "MarkReportProcessing";

const MARK_FAILED_ACTIVITY = "MarkReportFailed";

const GET_ORDERS_ACTIVITY = "GetOrders";

const GET_PAYMENTS_ACTIVITY = "GetPayments";

const GET_CUSTOMERS_ACTIVITY = "GetCustomers";

const GENERATE_EXCEL_ACTIVITY = "GenerateExcel";

const COMPLETE_GENERATION_ACTIVITY = "CompleteGeneration";

const FAILURE_CODE = "REPORT_GENERATION_FAILED";

const reportOrchestrator = df.orchestrator(function* (context) {

        const input = context.df.getInput() as ReportOrchestrationInput;

        try {

            yield context.df.callActivity(MARK_PROCESSING_ACTIVITY, {
                reportId: input.reportId,
                processingAt: context.df.currentUtcDateTime.toISOString()
            });

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

        } catch (error: unknown) {

            const failureReason: string =
                error instanceof Error
                    ? error.message
                    : "Unknown report generation failure";

            yield context.df.callActivity(MARK_FAILED_ACTIVITY, {
                    reportId: input.reportId,
                    failedAt: context.df.currentUtcDateTime.toISOString(),
                    failureCode: FAILURE_CODE,
                    failureReason
                }
            );

            throw error;

        }
    }
);

export default reportOrchestrator;