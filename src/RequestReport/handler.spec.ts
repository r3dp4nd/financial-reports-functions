import {HttpRequest, InvocationContext} from "@azure/functions";

import {createRequestReportHandler} from "./handler";
import {RequestReportUseCase} from "./application/request-report.use-case";
import {ReportRepository} from "./domain/report.repository";
import {RequestReportConflictError} from "./domain/request-report-conflict.error";

describe("RequestReport handler", () => {

  let repository: jest.Mocked<ReportRepository>;
  let useCase: RequestReportUseCase;

  beforeEach(() => {

    repository = {
      saveRequested: jest.fn()
    };

    useCase = new RequestReportUseCase(repository);
  });

  it("should return 202 for a new request", async () => {

    repository
      .saveRequested
      .mockResolvedValue({
        reportId: "REP-100",
        status: "REQUESTED",
        created: true
      });

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const request = createRequest("request-100", {
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const context = new InvocationContext();

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 202,
      jsonBody: {
        reportId: "REP-100",
        status: "REQUESTED"
      }
    });
  });

  it("should return 200 for an idempotent retry", async () => {

    repository
      .saveRequested
      .mockResolvedValue({
        reportId: "REP-100",
        status: "PROCESSING",
        created: false
      });

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:05:00.000Z"
    });

    const request = createRequest("request-100", {
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const context = new InvocationContext();

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 200,
      jsonBody: {
        reportId: "REP-100",
        status: "PROCESSING"
      }
    });
  });

  it("should return 400 when idempotency key is missing", async () => {

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const request = createRequest(undefined, {
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const context = new InvocationContext();

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 400,
      jsonBody: {
        code: "INVALID_REQUEST",
        message: "x-idempotency-key header is required"
      }
    });
  });

  it("should return 400 when request body is missing", async () => {

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const request = new HttpRequest({
      method: "POST",
      url: "http://localhost/api/reports",
      headers: {
        "x-idempotency-key": "request-100"
      }
    });

    const context = new InvocationContext();

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 400,
      jsonBody: {
        code: "INVALID_REQUEST",
        message: "Request body is required"
      }
    });
  });

  it("should return 409 for idempotency conflict", async () => {

    repository
      .saveRequested
      .mockRejectedValue(new RequestReportConflictError());

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const request = createRequest("request-100", {
      customerId: "CUS-DIFFERENT",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const context = new InvocationContext();

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 409,
      jsonBody: {
        code: "IDEMPOTENCY_CONFLICT",
        message: "Idempotency key was already used with a different request"
      }
    });
  });

  it("should return 500 for unexpected error", async () => {

    repository
      .saveRequested
      .mockRejectedValue(new Error("Cosmos unavailable"));

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const request = createRequest("request-100", {
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const context = new InvocationContext();

    const errorSpy = jest
      .spyOn(context, "error")
      .mockImplementation();

    const response = await handler(request, context);

    expect(errorSpy).toHaveBeenCalled();

    expect(response).toEqual({
      status: 500,
      jsonBody: {
        code: "INTERNAL_ERROR",
        message: "Unable to request report"
      }
    });
  });
});

function createRequest(idempotencyKey: string | undefined, body: {
  customerId: string; from: string; to: string;
}): HttpRequest {

  const headers: Record<string, string> = {
    "content-type": "application/json"
  };

  if (idempotencyKey) {
    headers["x-idempotency-key"] = idempotencyKey;
  }

  return new HttpRequest({
    method: "POST",
    url: "http://localhost/api/reports",
    headers,
    body: {
      string: JSON.stringify(body)
    }
  });
}
