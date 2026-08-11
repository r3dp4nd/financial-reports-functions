import {AzureFunction, Context, HttpRequest} from "@azure/functions";

import {RequestReportUseCase} from "./application/request-report.use-case";

import {RequestReportValidationError} from "./application/request-report-validation.error";

import {RequestReportHttpRequest} from "./api/request-report.http";

export interface RequestReportHandlerDependencies {
    useCase: RequestReportUseCase;
    generateReportId: () => string;
    now: () => string;
}

export function createRequestReportHandler(dependencies: RequestReportHandlerDependencies): AzureFunction {

    return async function (context: Context, request: HttpRequest): Promise<void> {

        try {
            const body = request.body as RequestReportHttpRequest;

            if (!body) {
                throw new RequestReportValidationError("request body is required");
            }

            const result = await dependencies.useCase.execute({
                reportId: dependencies.generateReportId(),
                customerId: body.customerId,
                from: body.from,
                to: body.to,
                requestedAt: dependencies.now()
            });

            context.res = {
                status: 202,
                body: {
                    reportId: result.reportId,
                    status: result.status
                }
            };

        } catch (error: unknown) {

            if (error instanceof RequestReportValidationError) {

                context.res = {
                    status: 400,
                    body: {
                        error: error.message
                    }
                };

                return;
            }

            context.log.error("Request report failed", error);

            context.res = {
                status: 500,
                body: {
                    error: "Unable to request report"
                }
            };
        }
    };
}