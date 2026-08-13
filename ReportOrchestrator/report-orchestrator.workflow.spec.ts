import {OrchestrationContext} from "durable-functions";

import {reportOrchestratorWorkflow} from "./report-orchestrator.workflow";

describe("ReportOrchestrator workflow", () => {

  it("should execute the generation workflow", () => {

    const context = createContext();

    const generator = reportOrchestratorWorkflow(context);


    // 1. MarkReportProcessing
    const markProcessing = generator.next();

    expectActivity(markProcessing.value, "MarkReportProcessing");


    // 2. Fan-out + fan-in
    //
    // GetOrders, GetPayments and GetCustomers are created
    // before Task.all() yields.
    const fanIn = generator.next();

    expect(fanIn.value).toEqual({
      type: "all", tasks: expect.any(Array)
    });


    const fanInValue = fanIn.value as MockTaskAll;

    expect(fanInValue.tasks).toHaveLength(3);

    expectActivity(fanInValue.tasks[0], "GetOrders");

    expectActivity(fanInValue.tasks[1], "GetPayments");

    expectActivity(fanInValue.tasks[2], "GetCustomers");


    // 3. Return results from Task.all()
    const generateExcel = generator.next([[{
      orderId: "ORD-100"
    }], [{
      paymentId: "PAY-100"
    }], {
      customerId: "CUS-100"
    }]);


    expectActivity(generateExcel.value, "GenerateExcel");


    // 4. Return result from GenerateExcel
    const completeGeneration = generator.next({
      reportId: "REP-100", blobName: "REP-100/financial-report.xlsx"
    });


    expectActivity(completeGeneration.value, "CompleteGeneration");


    // 5. Workflow completed
    const completed = generator.next();

    expect(completed.done).toBe(true);

    expect(completed.value).toEqual({
      reportId: "REP-100", status: "GENERATED", blobName: "REP-100/financial-report.xlsx"
    });
  });


  it("should use retry policy for normal activities", () => {

    const context = createContext();

    const generator = reportOrchestratorWorkflow(context);


    // MarkReportProcessing is the first activity.
    const result = generator.next();

    const activity = asActivity(result.value);


    expect(activity.retryOptions?.firstRetryIntervalInMilliseconds).toBe(5000);

    expect(activity.retryOptions?.maxNumberOfAttempts).toBe(3);

    expect(activity.retryOptions?.backoffCoefficient).toBe(2);

    expect(activity.retryOptions?.maxRetryIntervalInMilliseconds).toBe(30000);
  });


  it("should mark report failed and rethrow original error", () => {

    const context = createContext();

    const generator = reportOrchestratorWorkflow(context);


    // First yield: MarkReportProcessing
    generator.next();


    const originalError = new Error("Orders unavailable");


    // Inject error into the workflow.
    const markFailed = generator.throw(originalError);


    const activity = asActivity(markFailed.value);


    expectActivity(activity, "MarkReportFailed");


    expect(activity.input).toEqual({
      reportId: "REP-100",
      failedAt: "2026-08-12T22:00:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Orders unavailable"
    });


    // Resume MarkReportFailed successfully.
    // The original error must be rethrown.
    expect(() => generator.next()).toThrow(originalError);
  });


  it("should preserve original error when MarkReportFailed also fails", () => {

    const context = createContext();

    const generator = reportOrchestratorWorkflow(context);


    // First yield: MarkReportProcessing
    generator.next();


    const originalError = new Error("GenerateExcel failed");


    // Workflow catches original error and yields MarkReportFailed.
    const markFailed = generator.throw(originalError);


    expectActivity(markFailed.value, "MarkReportFailed");


    // MarkReportFailed fails too.
    //
    // The original error must still be thrown.
    expect(() => generator.throw(new Error("Unable to persist FAILED"))).toThrow(originalError);
  });


  it("should reject invalid orchestration input", () => {

    const context = createContext(undefined);

    const generator = reportOrchestratorWorkflow(context);


    expect(() => generator.next()).toThrow("ReportOrchestrator input is invalid");
  });

});


type MockActivity = {
  type: "activity";

  name: string;

  retryOptions?: {
    firstRetryIntervalInMilliseconds: number;
    maxNumberOfAttempts: number;
    backoffCoefficient: number;
    maxRetryIntervalInMilliseconds: number;
  };

  input?: unknown;
};


type MockTaskAll = {
  type: "all";

  tasks: unknown[];
};


function asActivity(value: unknown): MockActivity {

  return value as MockActivity;
}


function createContext(input?: unknown): OrchestrationContext {

  const orchestrationInput = arguments.length === 0 ? {
    reportId: "REP-100", customerId: "CUS-100", period: {
      from: "2026-08-01", to: "2026-08-31"
    }
  } : input;


  const callActivityWithRetry = jest.fn((name, retryOptions, activityInput) => ({
    type: "activity", name, retryOptions, input: activityInput
  }));


  const taskAll = jest.fn(tasks => ({
    type: "all", tasks
  }));


  return {
    df: {
      getInput: () => orchestrationInput,

      currentUtcDateTime: new Date("2026-08-12T22:00:00.000Z"),

      callActivityWithRetry,

      Task: {
        all: taskAll
      }
    }
  } as unknown as OrchestrationContext;
}


function expectActivity(value: unknown, expectedName: string): void {

  expect(value).toEqual(expect.objectContaining({
    type: "activity", name: expectedName
  }));
}
