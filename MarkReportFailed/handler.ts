import {AzureFunction, Context} from "@azure/functions";

import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";

export interface MarkReportFailedActivityInput {
    reportId: string;
    failedAt: string;
    failureCode: string;
    failureReason: string;
}

export interface MarkReportFailedHandlerDependencies {
    useCase: MarkReportFailedUseCase;
}

export function createMarkReportFailedHandler(dependencies: MarkReportFailedHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as MarkReportFailedActivityInput;

        return dependencies
            .useCase
            .execute(input);
    };
}