import {Context} from "@azure/functions";

import {GenerateExcelUseCase} from "../GenerateReport/application/generate-excel.use-case";
import {ReportGenerator} from "../GenerateReport/domain/report.generator";
import {ReportStorage} from "../GenerateReport/domain/report.storage";
import {createGenerateExcelHandler} from "./handler";

describe("GenerateExcel handler", () => {

    let generator: jest.Mocked<ReportGenerator>;
    let storage: jest.Mocked<ReportStorage>;
    let useCase: GenerateExcelUseCase;

    beforeEach(() => {

        generator = {
            generate: jest.fn()
        };

        storage = {
            save: jest.fn()
        };

        useCase = new GenerateExcelUseCase(generator, storage);
    });

    it("should generate report", async () => {

        generator.generate
            .mockResolvedValue(new Uint8Array([1, 2, 3]));

        storage.save
            .mockResolvedValue({
                blobName: "REP-100/financial-report.xlsx"
            });

        const handler = createGenerateExcelHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    reportId: "REP-100",
                    customerId: "CUS-100",
                    data: {
                        customer: {
                            customerId: "CUS-100",
                            name: "Olek Customer",
                            documentNumber: "DOC-100",
                            segment: "PREMIUM",
                            email: "customer@example.com"
                        },
                        orders: [],
                        payments: []
                    }
                }
            }
        } as unknown as Context;

        const result = await handler(context);

        expect(result).toEqual({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        });
    });

    it("should propagate application errors", async () => {

        const handler = createGenerateExcelHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    reportId: "",
                    customerId: "CUS-100",
                    data: {
                        customer: {
                            customerId: "CUS-100",
                            name: "Customer",
                            documentNumber: "DOC-100",
                            segment: "STANDARD",
                            email: "customer@example.com"
                        },
                        orders: [],
                        payments: []
                    }
                }
            }
        } as unknown as Context;

        await expect(handler(context)).rejects.toThrow("reportId is required");
    });
});