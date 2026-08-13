import {GetPaymentsUseCase} from "../GenerateReport/application/get-payments.use-case";
import {PaymentReportRepository} from "../GenerateReport/domain/payment-report.repository";
import {createGetPaymentsHandler} from "./handler";

describe("GetPayments handler", () => {

  let repository: jest.Mocked<PaymentReportRepository>;
  let useCase: GetPaymentsUseCase;

  beforeEach(() => {

    repository = {
      findByCriteria: jest.fn()
    };

    useCase = new GetPaymentsUseCase(repository);
  });


  it("should return payments", async () => {

    const payments = [{
      paymentId: "PAY-100",
      customerId: "CUS-100",
      paymentDate: "2026-08-10T12:00:00.000Z",
      amount: 250,
      currency: "PEN",
      status: "SETTLED"
    }];

    repository
      .findByCriteria
      .mockResolvedValue(payments);

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: {
        from: "2026-08-01", to: "2026-08-31"
      }
    };

    const result = await handler(input);

    expect(result).toEqual(payments);

    expect(repository.findByCriteria)
      .toHaveBeenCalledTimes(1);
  });


  it("should propagate application errors", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      customerId: "", period: {
        from: "2026-08-01", to: "2026-08-31"
      }
    };

    await expect(handler(input)).rejects.toThrow("customerId is required");
  });


  it("should reject undefined input", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    await expect(handler(undefined)).rejects.toThrow("GetPayments activity input is invalid");
  });


  it("should reject null input", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    await expect(handler(null)).rejects.toThrow("GetPayments activity input is invalid");
  });


  it("should reject input without customerId", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      period: {
        from: "2026-08-01", to: "2026-08-31"
      }
    };

    await expect(handler(input)).rejects.toThrow("GetPayments activity input is invalid");
  });


  it("should reject input without period", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100"
    };

    await expect(handler(input)).rejects.toThrow("GetPayments activity input is invalid");
  });


  it("should reject null period", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: null
    };

    await expect(handler(input)).rejects.toThrow("GetPayments activity input is invalid");
  });


  it("should reject invalid period", async () => {

    const handler = createGetPaymentsHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: {
        from: "2026-08-01"
      }
    };

    await expect(handler(input)).rejects.toThrow("GetPayments activity input is invalid");
  });

});
