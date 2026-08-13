import {CosmosClient} from "@azure/cosmos";

describe("cosmos client", () => {

  const originalEnv = process.env;

  beforeEach(() => {

    jest.resetModules();

    process.env = {
      ...originalEnv,
      COSMOS_ENDPOINT: "https://financial-reports.documents.azure.com:443/",
      COSMOS_KEY: "cosmos-test-key",
      COSMOS_DATABASE: "financial-reports",
      COSMOS_REPORTS_CONTAINER: "reports",
      COSMOS_ORDERS_CONTAINER: "orders",
      COSMOS_PAYMENTS_CONTAINER: "payments",
      COSMOS_CUSTOMERS_CONTAINER: "customers"
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });


  it("should create Cosmos client", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.cosmosClient)
      .toBeInstanceOf(CosmosClient);
  });


  it("should create reports container", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.reportsContainer)
      .toBeDefined();

    expect(cosmosModule.reportsContainer.id)
      .toBe("reports");
  });


  it("should create orders container", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.ordersContainer)
      .toBeDefined();

    expect(cosmosModule.ordersContainer.id)
      .toBe("orders");
  });


  it("should create payments container", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.paymentsContainer)
      .toBeDefined();

    expect(cosmosModule.paymentsContainer.id)
      .toBe("payments");
  });


  it("should create customers container", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.customersContainer)
      .toBeDefined();

    expect(cosmosModule.customersContainer.id)
      .toBe("customers");
  });


  it("should use the configured database and containers", async () => {

    const cosmosModule = await import("./cosmos.client");

    expect(cosmosModule.reportsContainer.id)
      .toBe(process.env.COSMOS_REPORTS_CONTAINER);

    expect(cosmosModule.ordersContainer.id)
      .toBe(process.env.COSMOS_ORDERS_CONTAINER);

    expect(cosmosModule.paymentsContainer.id)
      .toBe(process.env.COSMOS_PAYMENTS_CONTAINER);

    expect(cosmosModule.customersContainer.id)
      .toBe(process.env.COSMOS_CUSTOMERS_CONTAINER);
  });

});
