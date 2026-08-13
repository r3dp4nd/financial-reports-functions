import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";

import {RequestReportUseCase} from "./application/request-report.use-case";
import {RequestReportHttpRequest, RequestReportHttpResponse} from "./api/request-report.http.types";
import {RequestReportValidationError} from "./application/request-report-validation.error";
import {RequestReportConflictError} from "./domain/request-report-conflict.error";

export interface RequestReportHandlerDependencies {
  useCase: RequestReportUseCase;
  now: () => string;
}

export function createRequestReportHandler(dependencies: RequestReportHandlerDependencies) {

  return async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    try {

      const body: RequestReportHttpRequest | undefined = await readRequestBody(request);

      if (!body) {
        return {
          status: 400,
          jsonBody: {
            code: "INVALID_REQUEST",
            message: "Request body is required"
          }
        };
      }

      const idempotencyKey: string | null = request.headers.get("x-idempotency-key");

      if (!idempotencyKey?.trim()) {

        return {
          status: 400,
          jsonBody: {
            code: "INVALID_REQUEST",
            message: "x-idempotency-key header is required"
          }
        };

      }

      const result = await dependencies.useCase.execute({
        idempotencyKey,
        customerId: body.customerId,
        from: body.from,
        to: body.to,
        requestedAt: dependencies.now()
      });

      const response: RequestReportHttpResponse = {

        reportId: result.reportId, status: result.status
      };

      return {
        status: result.created ? 202 : 200,
        jsonBody: response
      };

    } catch (error: unknown) {

      if (error instanceof RequestReportValidationError) {

        return {
          status: 400,
          jsonBody: {
            code: "INVALID_REQUEST",
            message: error.message
          }
        };

      }

      if (error instanceof RequestReportConflictError) {

        return {
          status: 409,
          jsonBody: {
            code: "IDEMPOTENCY_CONFLICT",
            message: error.message
          }
        };
      }

      context.error("Unexpected error requesting report", error);
      
      return {
        status: 500,
        jsonBody: {
          code: "INTERNAL_ERROR",
          message: "Unable to request report"
        }
      };
    }
  };
}

async function readRequestBody(request: HttpRequest): Promise<RequestReportHttpRequest | undefined> {

  try {

    const body = await request.json();

    if (typeof body !== "object" || body === null) {
      return undefined;
    }

    return body as RequestReportHttpRequest;

  } catch {

    return undefined;
  }
}
