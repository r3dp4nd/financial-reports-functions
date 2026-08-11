import {AzureFunction, Context} from "@azure/functions";

import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";
import {GenerateExcelActivityResult} from "../ReportOrchestrator/report-orchestration.types";

export interface CompleteGenerationHandlerDependencies {
    useCase: CompleteGenerationUseCase;
    now: () => string;
}

export function createCompleteGenerationHandler(dependencies: CompleteGenerationHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as GenerateExcelActivityResult;

        return dependencies
            .useCase
            .execute({
                reportId: input.reportId, blobName: input.blobName, generatedAt: dependencies.now()
            });
    };
}