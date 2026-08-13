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

    const customer = {
      customerId: "CUS-100",
      name: "Olek Customer",
      documentNumber: "DOC-100",
      segment: "PREMIUM",
      email: "customer@example.com"
    };

    repository
      .findById
      .mockResolvedValue(customer);

    const handler = createGetCustomersHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100"
    };

    const result = await handler(input);

    expect(result).toEqual(customer);

    expect(repository.findById)
      .toHaveBeenCalledTimes(1);

    expect(repository.findById)
      .toHaveBeenCalledWith("CUS-100");
  });


  it("should propagate application errors", async () => {

    const handler = createGetCustomersHandler({
      useCase
    });

    const input = {
      customerId: ""
    };

    await expect(handler(input)).rejects.toThrow("customerId is required");
  });


  it("should reject undefined input", async () => {

    const handler = createGetCustomersHandler({
      useCase
    });

    await expect(handler(undefined)).rejects.toThrow("GetCustomers activity input is invalid");
  });


  it("should reject null input", async () => {

    const handler = createGetCustomersHandler({
      useCase
    });

    await expect(handler(null)).rejects.toThrow("GetCustomers activity input is invalid");
  });


  it("should reject input without customerId", async () => {

    const handler = createGetCustomersHandler({
      useCase
    });

    const input = {};

    await expect(handler(input)).rejects.toThrow("GetCustomers activity input is invalid");
  });

});
