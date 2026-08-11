import {Context} from "@azure/functions";

import {GetCustomerUseCase} from "../GenerateReport/application/get-customer.use-case";
import {CustomerReportRepository} from "../GenerateReport/domain/customer-report.repository";
import {createGetCustomersHandler} from "./handler";

describe("GetCustomers handler", () => {

    let repository: jest.Mocked<CustomerReportRepository>;
    let useCase: GetCustomerUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn()
        };

        useCase = new GetCustomerUseCase(repository);
    });

    it("should return customer", async () => {

        repository
            .findById
            .mockResolvedValue({
                customerId: "CUS-100",
                name: "Olek Customer",
                documentNumber: "DOC-100",
                segment: "PREMIUM",
                email: "customer@example.com"
            });

        const handler = createGetCustomersHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    customerId: "CUS-100"
                }
            }
        } as unknown as Context;

        const result = await handler(context);

        expect(result).toEqual({
            customerId: "CUS-100",
            name: "Olek Customer",
            documentNumber: "DOC-100",
            segment: "PREMIUM",
            email: "customer@example.com"
        });
    });

    it("should propagate application errors", async () => {

        const handler = createGetCustomersHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    customerId: ""
                }
            }
        } as unknown as Context;

        await expect(handler(context)).rejects.toThrow("customerId is required");
    });
});