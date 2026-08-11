import {AzureFunction, Context} from "@azure/functions";

import {GetOrdersQuery} from "../GenerateReport/application/get-orders.query";
import {GetOrdersUseCase} from "../GenerateReport/application/get-orders.use-case";

export interface GetOrdersHandlerDependencies {
    useCase: GetOrdersUseCase;
}

export function createGetOrdersHandler(dependencies: GetOrdersHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as GetOrdersQuery;

        return dependencies.useCase.execute(input);
    };
}