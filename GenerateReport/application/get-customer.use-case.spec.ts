import {GetCustomerUseCase} from "./get-customer.use-case";
import {CustomerReportRepository} from "../domain/customer-report.repository";

describe("GetCustomerUseCase", () => {

    let repository: jest.Mocked<CustomerReportRepository>;
    let useCase: GetCustomerUseCase;

    beforeEach(() => {

        repository = {
            findById: jest.fn()
        };

        useCase = new GetCustomerUseCase(repository);
    });

    it("should retrieve customer", async () => {

        repository
            .findById
            .mockResolvedValue({
                customerId: "CUS-100",
                name: "Olek Customer",
                documentNumber: "DOC-100",
                segment: "PREMIUM",
                email: "customer@example.com"
            });

        const result = await useCase.execute({
            customerId: "CUS-100"
        });

        expect(repository.findById).toHaveBeenCalledWith("CUS-100");

        expect(result).toEqual({
            customerId: "CUS-100",
            name: "Olek Customer",
            documentNumber: "DOC-100",
            segment: "PREMIUM",
            email: "customer@example.com"
        });
    });

    it("should reject empty customerId", async () => {

        await expect(useCase.execute({
            customerId: ""
        })).rejects.toThrow("customerId is required");

        expect(repository.findById).not.toHaveBeenCalled();
    });

    it("should fail when customer does not exist", async () => {

        repository
            .findById
            .mockResolvedValue(null);

        await expect(useCase.execute({
            customerId: "CUS-404"
        })).rejects.toThrow("Customer CUS-404 was not found");
    });

    it("should propagate repository errors", async () => {

        repository
            .findById
            .mockRejectedValue(new Error("Repository unavailable"));

        await expect(useCase.execute({
            customerId: "CUS-100"
        })).rejects.toThrow("Repository unavailable");
    });
});