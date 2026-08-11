import {Container} from "@azure/cosmos";

import {CosmosCustomerReportRepository} from "./cosmos-customer-report.repository";

describe("CosmosCustomerReportRepository", () => {

    let container: jest.Mocked<Container>;
    let item: jest.Mock;
    let read: jest.Mock;
    let repository: CosmosCustomerReportRepository;

    beforeEach(() => {

        read = jest.fn();
        item = jest.fn(() => ({
            read
        }));
        container = {
            item
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosCustomerReportRepository(container);
    });

    it("should retrieve customer by id", async () => {

        read.mockResolvedValue({
            resource: {
                id: "CUS-100",
                customerId: "CUS-100",
                name: "Olek Customer",
                documentNumber: "DOC-100",
                segment: "PREMIUM",
                email: "customer@example.com"
            }
        });

        const result = await repository.findById("CUS-100");

        expect(item).toHaveBeenCalledWith("CUS-100", "CUS-100");

        expect(result).toEqual({
            customerId: "CUS-100",
            name: "Olek Customer",
            documentNumber: "DOC-100",
            segment: "PREMIUM",
            email: "customer@example.com"
        });
    });

    it("should return null when customer does not exist", async () => {

        read.mockRejectedValue({
            code: 404
        });

        const result = await repository.findById("CUS-404");

        expect(result).toBeNull();
    });

    it("should return null when response has no resource", async () => {

        read.mockResolvedValue({
            resource: undefined
        });

        const result = await repository.findById("CUS-100");

        expect(result).toBeNull();
    });

    it("should propagate Cosmos errors", async () => {

        read.mockRejectedValue(new Error("Cosmos unavailable"));

        await expect(repository.findById("CUS-100")).rejects.toThrow("Cosmos unavailable");
    });
});