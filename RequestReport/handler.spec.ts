import {Context, HttpRequest} from "@azure/functions";

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

    repository.saveRequested
      .mockResolvedValue({
        reportId: "REP-100",
        status: "REQUESTED",
        created: true
      });

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:00:00.000Z"
    });

    const context = {
      log: {
        error: jest.fn()
      }
    } as unknown as Context;

    const request = {
      headers: {
        "x-idempotency-key": "request-100"
      },
      body: {
        customerId: "CUS-100",
        from: "2026-08-01",
        to: "2026-08-31"
      }
    } as unknown as HttpRequest;

    await handler(context, request);

    expect(context.res).toEqual({
      status: 202,
      body: {
        reportId: "REP-100",
        status: "REQUESTED"
      }
    });
  });

  it("should return 200 for an idempotent retry", async () => {

    repository.saveRequested
      .mockResolvedValue({
        reportId: "REP-100",
        status: "PROCESSING",
        created: false
      });

    const handler = createRequestReportHandler({
      useCase,
      now: () => "2026-08-12T16:05:00.000Z"
    });

    const context = {
      log: {
        error: jest.fn()
      }
    } as unknown as Context;

    const request = {
      headers: {
        "x-idempotency-key": "request-100"
      },
      body: {
        customerId: "CUS-100",
        from: "2026-08-01",
        to: "2026-08-31"
      }
    } as unknown as HttpRequest;

    await handler(context, request);

    expect(context.res).toEqual({
      status: 200,
      body: {
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

    const context = {
      log: {
        error: jest.fn()
      }
    } as unknown as Context;

    const request = {
      headers: {},
      body: {
        customerId: "CUS-100",
        from: "2026-08-01",
        to: "2026-08-31"
      }
    } as unknown as HttpRequest;

    await handler(context, request);

    expect(context.res).toEqual({
      status: 400,
      body: {
        code: "INVALID_REQUEST",
        message: "x-idempotency-key header is required"
      }
    });
  });

  it("should return 409 for idempotency conflict", async () => {

    repository.saveRequested
      .mockRejectedValue(new RequestReportConflictError());

    const handler = createRequestReportHandler({
      useCase,

      now: () => "2026-08-12T16:00:00.000Z"
    });

    const context = {
      log: {
        error: jest.fn()
      }
    } as unknown as Context;

    const request = {
      headers: {
        "x-idempotency-key": "request-100"
      },
      body: {
        customerId: "CUS-DIFFERENT",
        from: "2026-08-01",
        to: "2026-08-31"
      }
    } as unknown as HttpRequest;

    await handler(context, request);

    expect(context.res).toEqual({
      status: 409,
      body: {
        code: "IDEMPOTENCY_CONFLICT",
        message: "Idempotency key was already used with a different request"
      }
    });
  });
});
