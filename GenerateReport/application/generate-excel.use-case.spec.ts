import {GenerateExcelUseCase} from "./generate-excel.use-case";
import {ReportGenerator} from "../domain/report.generator";
import {ReportStorage} from "../domain/report.storage";

describe("GenerateExcelUseCase", () => {

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

    it("should generate and store report", async () => {

        const content = new Uint8Array([1, 2, 3]);

        generator.generate
            .mockResolvedValue(content);

        storage.save
            .mockResolvedValue({
                blobName: "REP-100/financial-report.xlsx"
            });

        const data = {
            customer: {
                customerId: "CUS-100",
                name: "Olek Customer",
                documentNumber: "DOC-100",
                segment: "PREMIUM",
                email: "customer@example.com"
            },
            orders: [],
            payments: []
        };

        const result = await useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            data
        });

        expect(generator.generate).toHaveBeenCalledWith({
            reportId: "REP-100",
            customerId: "CUS-100",
            data
        });

        expect(storage.save).toHaveBeenCalledWith({
            reportId: "REP-100",
            content,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        expect(result).toEqual({
            reportId: "REP-100",
            blobName: "REP-100/financial-report.xlsx"
        });
    });

    it("should reject empty reportId", async () => {

        await expect(useCase.execute({
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
        })).rejects.toThrow("reportId is required");

        expect(generator.generate).not.toHaveBeenCalled();
    });

    it("should reject empty customerId", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "",
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
        })).rejects.toThrow("customerId is required");
    });

    it("should propagate generator errors", async () => {

        generator.generate
            .mockRejectedValue(new Error("Excel generation failed"));

        await expect(useCase.execute({
            reportId: "REP-100",
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
        })).rejects.toThrow("Excel generation failed");

        expect(storage.save).not.toHaveBeenCalled();
    });

    it("should propagate storage errors", async () => {

        generator.generate
            .mockResolvedValue(new Uint8Array([1, 2, 3]));

        storage.save
            .mockRejectedValue(new Error("Blob unavailable"));

        await expect(useCase.execute({
            reportId: "REP-100",
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
        })).rejects.toThrow("Blob unavailable");
    });
});