import {getServiceBusConfig} from "./service-bus.config";

describe("getServiceBusConfig", () => {

  const originalEnv = process.env;

  beforeEach(() => {

    process.env = {
      ...originalEnv,
      SERVICE_BUS_CONNECTION: "Endpoint=sb://localhost/;SharedAccessKeyName=test;SharedAccessKey=key",
      SERVICE_BUS_REPORT_REQUESTS_QUEUE: "report-requests",
      SERVICE_BUS_REPORT_GENERATED_QUEUE: "report-generated"
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });


  it("should return Service Bus configuration", () => {

    const result = getServiceBusConfig();

    expect(result).toEqual({
      connectionString: "Endpoint=sb://localhost/;SharedAccessKeyName=test;SharedAccessKey=key",

      reportRequestsQueueName: "report-requests",

      reportGeneratedQueueName: "report-generated"
    });
  });


  it("should reject missing SERVICE_BUS_CONNECTION", () => {

    delete process.env.SERVICE_BUS_CONNECTION;

    expect(() => getServiceBusConfig())
      .toThrow("SERVICE_BUS_CONNECTION is required");
  });


  it("should reject missing SERVICE_BUS_REPORT_REQUESTS_QUEUE", () => {

    delete process.env.SERVICE_BUS_REPORT_REQUESTS_QUEUE;

    expect(() => getServiceBusConfig())
      .toThrow("SERVICE_BUS_REPORT_REQUESTS_QUEUE is required");
  });


  it("should reject missing SERVICE_BUS_REPORT_GENERATED_QUEUE", () => {

    delete process.env.SERVICE_BUS_REPORT_GENERATED_QUEUE;

    expect(() => getServiceBusConfig())
      .toThrow("SERVICE_BUS_REPORT_GENERATED_QUEUE is required");
  });

});
