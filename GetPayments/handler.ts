import {AzureFunction, Context} from "@azure/functions";

import {GetPaymentsQuery} from "../GenerateReport/application/get-payments.query";
import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";

export interface GetPaymentsHandlerDependencies {
    useCase: GetPaymentsUseCase;
}

export function createGetPaymentsHandler(dependencies: GetPaymentsHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as GetPaymentsQuery;

        return dependencies
            .useCase
            .execute(input);
    };
}