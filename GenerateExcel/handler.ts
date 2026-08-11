import {AzureFunction, Context} from "@azure/functions";

import {GenerateExcelUseCase} from "../GenerateReport/application/generate-excel.use-case";
import {GenerateExcelActivityInput} from "../ReportOrchestrator/report-orchestration.types";

export interface GenerateExcelHandlerDependencies {
    useCase: GenerateExcelUseCase;
}

export function createGenerateExcelHandler(dependencies: GenerateExcelHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as GenerateExcelActivityInput;

        return dependencies
            .useCase
            .execute({
                reportId: input.reportId,
                customerId: input.customerId,
                data: input.data
            });
    };
}