import {AzureFunction, Context} from "@azure/functions";

import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";

export interface MarkReportProcessingActivityInput {
    reportId: string;
    processingAt: string;
}

export interface MarkReportProcessingHandlerDependencies {
    useCase: MarkReportProcessingUseCase;
}

export function createMarkReportProcessingHandler(dependencies: MarkReportProcessingHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as MarkReportProcessingActivityInput;

        return dependencies
            .useCase
            .execute(input);
    };
}