import {OrchestrationContext, OrchestrationHandler, RetryOptions} from "durable-functions";

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

export const reportOrchestratorWorkflow: OrchestrationHandler = function* reportOrchestrator(context: OrchestrationContext) {

  const input = context.df.getInput<ReportOrchestrationInput>();
  validateInput(input);

  const activityRetryOptions = createActivityRetryOptions();
  const failureRetryOptions = createFailureRetryOptions();

  try {

    yield context.df.callActivityWithRetry(MARK_PROCESSING_ACTIVITY, activityRetryOptions, {
      reportId: input.reportId,
      processingAt: context.df.currentUtcDateTime.toISOString()
    });

    const dataRequest = {
      reportId: input.reportId,
      customerId: input.customerId,
      period: input.period
    };

    const tasks = [
      context.df.callActivityWithRetry(GET_ORDERS_ACTIVITY, activityRetryOptions, dataRequest),
      context.df.callActivityWithRetry(GET_PAYMENTS_ACTIVITY, activityRetryOptions, dataRequest),
      context.df.callActivityWithRetry(GET_CUSTOMERS_ACTIVITY, activityRetryOptions, {
        customerId:
        input.customerId
      })
    ];

    const results = yield context.df.Task.all(tasks);

    const reportData: ReportDataResult = {
      orders: (results as unknown[])[0] as OrderReportItem[],
      payments: (results as unknown[])[1] as PaymentReportItem[],
      customer: (results as unknown[])[2] as CustomerReportData
    };

    const generateExcelInput: GenerateExcelActivityInput = {
      reportId: input.reportId,
      customerId: input.customerId,
      data: reportData
    };

    const generatedReport = (
      yield context.df.callActivityWithRetry(GENERATE_EXCEL_ACTIVITY, activityRetryOptions, generateExcelInput)
    ) as GenerateExcelActivityResult;

    yield context.df.callActivityWithRetry(COMPLETE_GENERATION_ACTIVITY, activityRetryOptions, generatedReport);

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

    try {

      yield context.df.callActivityWithRetry(MARK_FAILED_ACTIVITY, failureRetryOptions, {
          reportId: input.reportId,
          failedAt: context.df.currentUtcDateTime.toISOString(),
          failureCode: FAILURE_CODE,
          failureReason
        }
      );

    } catch {
      // Preservamos el fallo original del workflow.
    }

    throw error;
  }
}

function createActivityRetryOptions(): RetryOptions {
  const retry = new RetryOptions(
    5_000,
    3
  );

  retry.backoffCoefficient = 2;
  retry.maxRetryIntervalInMilliseconds = 30_000;

  return retry;
}

function createFailureRetryOptions(): RetryOptions {

  const retry = new RetryOptions(
    2_000,
    5
  );

  retry.backoffCoefficient = 2;
  retry.maxRetryIntervalInMilliseconds = 30_000;

  return retry;
}

function validateInput(input: ReportOrchestrationInput | undefined): asserts input is ReportOrchestrationInput {

  if (
    !input ||
    typeof input.reportId !==
    "string" ||
    !input.reportId.trim() ||
    typeof input.customerId !==
    "string" ||
    !input.customerId.trim() ||
    typeof input.period !==
    "object" ||
    input.period ===
    null ||
    typeof input.period.from !==
    "string" ||
    typeof input.period.to !==
    "string"
  ) {
    throw new Error(
      "ReportOrchestrator input is invalid"
    );
  }
}
