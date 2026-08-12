import {AzureFunction, Context, HttpRequest} from "@azure/functions";

import {RequestReportUseCase} from "./application/request-report.use-case";
import {RequestReportHttpRequest, RequestReportHttpResponse} from "./api/request-report.http.types";
import {RequestReportValidationError} from "./application/request-report-validation.error";
import {RequestReportConflictError} from "./domain/request-report-conflict.error";

export interface RequestReportHandlerDependencies {
  useCase: RequestReportUseCase;
  now: () => string;
}

export function createRequestReportHandler(dependencies: RequestReportHandlerDependencies): AzureFunction {

  return async function (context: Context, req: HttpRequest): Promise<void> {

    try {

      const body = req.body as RequestReportHttpRequest | undefined;

      if (!body) {

        context.res = {
          status: 400,
          body: {
            code: "INVALID_REQUEST",
            message: "Request body is required"
          }
        };

        return;
      }

      const idempotencyKey = req.headers["x-idempotency-key"];

      if (typeof idempotencyKey !== "string" || !idempotencyKey.trim()) {

        context.res = {
          status: 400,
          body: {
            code: "INVALID_REQUEST",
            message: "x-idempotency-key header is required"
          }
        };

        return;
      }

      const result = await dependencies
        .useCase
        .execute({
          idempotencyKey,
          customerId: body.customerId,
          from: body.from,
          to: body.to,
          requestedAt: dependencies.now()
        });

      const response: RequestReportHttpResponse = {

        reportId: result.reportId,
        status: result.status
      };

      context.res = {
        status: result.created ? 202 : 200,
        body: response
      };

    } catch (error: unknown) {

      if (error instanceof RequestReportValidationError) {

        context.res = {
          status: 400,
          body: {
            code: "INVALID_REQUEST",
            message: error.message
          }
        };

        return;
      }

      if (error instanceof RequestReportConflictError) {

        context.res = {
          status: 409,
          body: {
            code: "IDEMPOTENCY_CONFLICT",
            message: error.message
          }
        };

        return;
      }

      context.log.error("Unexpected error requesting report", error);

      context.res = {
        status: 500,
        body: {
          code: "INTERNAL_ERROR",
          message: "Unable to request report"
        }
      };
    }
  };
}
