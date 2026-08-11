import {AzureFunction, Context} from "@azure/functions";

import {GetCustomerQuery} from "../GenerateReport/application/get-customer.query"
import {GetCustomerUseCase} from "../GenerateReport/application/get-customer.use-case";

export interface GetCustomersHandlerDependencies {
    useCase: GetCustomerUseCase;
}

export function createGetCustomersHandler(dependencies: GetCustomersHandlerDependencies): AzureFunction {

    return async function (context: Context): Promise<unknown> {

        const input = context.bindings.input as GetCustomerQuery;

        return dependencies
            .useCase
            .execute(input);
    };
}