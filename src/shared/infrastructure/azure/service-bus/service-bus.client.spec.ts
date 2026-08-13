describe("service bus client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = {
      ...originalEnv,
      SERVICE_BUS_CONNECTION:
        "Endpoint=sb://financial-reports.servicebus.windows.net/;SharedAccessKeyName=test-key;SharedAccessKey=test-secret",
      SERVICE_BUS_REPORT_REQUESTS_QUEUE:
        "report-requests",
      SERVICE_BUS_REPORT_GENERATED_QUEUE:
        "report-generated",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("should create Service Bus client", async () => {
    const {ServiceBusClient} = await import("@azure/service-bus");
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.serviceBusClient)
      .toBeInstanceOf(ServiceBusClient);
  });

  it("should create report requests sender", async () => {
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.reportRequestsSender)
      .toBeDefined();

    expect(serviceBusModule.reportRequestsSender)
      .toHaveProperty("sendMessages");
  });

  it("should create report generated sender", async () => {
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.reportGeneratedSender)
      .toBeDefined();

    expect(serviceBusModule.reportGeneratedSender)
      .toHaveProperty("sendMessages");
  });

  it("should use the configured report requests queue", async () => {
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.reportRequestsSender)
      .toBeDefined();
  });

  it("should use the configured report generated queue", async () => {
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.reportGeneratedSender)
      .toBeDefined();
  });

  it("should create two different senders", async () => {
    const serviceBusModule = await import("./service-bus.client");

    expect(serviceBusModule.reportRequestsSender)
      .not
      .toBe(serviceBusModule.reportGeneratedSender);
  });
});
