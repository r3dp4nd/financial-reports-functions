import {GetOrdersUseCase} from "../GenerateReport/application/get-orders.use-case";
import {OrderReportRepository} from "../GenerateReport/domain/order-report.repository";
import {createGetOrdersHandler} from "./handler";

describe("GetOrders handler", () => {

  let repository: jest.Mocked<OrderReportRepository>;
  let useCase: GetOrdersUseCase;

  beforeEach(() => {

    repository = {
      findByCriteria: jest.fn()
    };

    useCase = new GetOrdersUseCase(repository);
  });


  it("should return orders", async () => {

    const orders = [{
      orderId: "ORD-100",
      customerId: "CUS-100",
      orderDate: "2026-08-10T10:00:00.000Z",
      total: 250,
      currency: "PEN",
      status: "COMPLETED"
    }];

    repository
      .findByCriteria
      .mockResolvedValue(orders);

    const handler = createGetOrdersHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: {
        from: "2026-08-01", to: "2026-08-31"
      }
    };

    const result = await handler(input);

    expect(result).toEqual(orders);

    expect(repository.findByCriteria)
      .toHaveBeenCalledTimes(1);

    expect(repository.findByCriteria)
      .toHaveBeenCalledWith({
        customerId: "CUS-100", period: {
          from: "2026-08-01", to: "2026-08-31"
        }
      });
  });


  it("should propagate application errors", async () => {

    const handler = createGetOrdersHandler({
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

    const handler = createGetOrdersHandler({
      useCase
    });

    await expect(handler(undefined)).rejects.toThrow("GetOrders activity input is invalid");
  });


  it("should reject null input", async () => {

    const handler = createGetOrdersHandler({
      useCase
    });

    await expect(handler(null)).rejects.toThrow("GetOrders activity input is invalid");
  });


  it("should reject input without customerId", async () => {

    const handler = createGetOrdersHandler({
      useCase
    });

    const input = {
      period: {
        from: "2026-08-01", to: "2026-08-31"
      }
    };

    await expect(handler(input)).rejects.toThrow("GetOrders activity input is invalid");
  });


  it("should reject input without period", async () => {

    const handler = createGetOrdersHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100"
    };

    await expect(handler(input)).rejects.toThrow("GetOrders activity input is invalid");
  });


  it("should reject input with invalid period", async () => {

    const handler = createGetOrdersHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: {
        from: "2026-08-01"
      }
    };

    await expect(handler(input)).rejects.toThrow("GetOrders activity input is invalid");
  });


  it("should reject input with null period", async () => {

    const handler = createGetOrdersHandler({
      useCase
    });

    const input = {
      customerId: "CUS-100", period: null
    };

    await expect(handler(input)).rejects.toThrow("GetOrders activity input is invalid");
  });

});
