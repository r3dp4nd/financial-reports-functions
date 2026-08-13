import {getCosmosConfig} from "./cosmos.config";

describe("getCosmosConfig", () => {

  const originalEnv = process.env;

  beforeEach(() => {

    process.env = {
      ...originalEnv,
      COSMOS_ENDPOINT: "https://localhost:8081",
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
  });


  it("should return Cosmos configuration", () => {

    const result = getCosmosConfig();

    expect(result).toEqual({
      endpoint: "https://localhost:8081",
      key: "cosmos-test-key",
      databaseName: "financial-reports",
      reportsContainerName: "reports",
      ordersContainerName: "orders",
      paymentsContainerName: "payments",
      customersContainerName: "customers"
    });
  });


  it("should reject missing COSMOS_ENDPOINT", () => {

    delete process.env.COSMOS_ENDPOINT;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_ENDPOINT is required");
  });


  it("should reject missing COSMOS_KEY", () => {

    delete process.env.COSMOS_KEY;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_KEY is required");
  });


  it("should reject missing COSMOS_DATABASE", () => {

    delete process.env.COSMOS_DATABASE;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_DATABASE is required");
  });


  it("should reject missing COSMOS_REPORTS_CONTAINER", () => {

    delete process.env.COSMOS_REPORTS_CONTAINER;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_REPORTS_CONTAINER is required");
  });


  it("should reject missing COSMOS_ORDERS_CONTAINER", () => {

    delete process.env.COSMOS_ORDERS_CONTAINER;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_ORDERS_CONTAINER is required");
  });


  it("should reject missing COSMOS_PAYMENTS_CONTAINER", () => {

    delete process.env.COSMOS_PAYMENTS_CONTAINER;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_PAYMENTS_CONTAINER is required");
  });


  it("should reject missing COSMOS_CUSTOMERS_CONTAINER", () => {

    delete process.env.COSMOS_CUSTOMERS_CONTAINER;

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_CUSTOMERS_CONTAINER is required");
  });


  it("should reject invalid COSMOS_ENDPOINT", () => {

    process.env.COSMOS_ENDPOINT = "invalid-url";

    expect(() => getCosmosConfig())
      .toThrow("COSMOS_ENDPOINT must be a valid URL");
  });


  it("should accept a valid Cosmos endpoint URL", () => {

    process.env.COSMOS_ENDPOINT = "https://financial-reports.documents.azure.com:443/";

    const result = getCosmosConfig();

    expect(result.endpoint)
      .toBe("https://financial-reports.documents.azure.com:443/");
  });

});
