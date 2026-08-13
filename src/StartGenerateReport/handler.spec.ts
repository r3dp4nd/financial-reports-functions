import {InvocationContext} from "@azure/functions";

import {createStartGenerateReportHandler, StartGenerateReportClient} from "./handler";

describe("StartGenerateReport handler", () => {

  let client: jest.Mocked<StartGenerateReportClient>;

  beforeEach(() => {

    client = {
      start: jest.fn()
    };
  });

  it("should start report generation orchestration", async () => {

    client
      .start
      .mockResolvedValue("REP-100");

    const handler = createStartGenerateReportHandler({
      client
    });

    const context = new InvocationContext();

    const logSpy = jest
      .spyOn(context, "log")
      .mockImplementation();

    const message = {
      eventId: "REP-100:ReportRequested",
      occurredAt: "2026-08-13T10:00:00.000Z",
      reportId: "REP-100",
      customerId: "CUS-100",
      period: {
        from: "2026-08-01",
        to: "2026-08-31"
      }
    };

    await handler(message, context);

    expect(client.start).toHaveBeenCalledWith("REP-100", message);

    expect(logSpy).toHaveBeenCalledWith("Report generation orchestration started", {
      reportId: "REP-100",
      instanceId: "REP-100"
    });
  });

  it("should reject invalid message", async () => {

    const handler = createStartGenerateReportHandler({
      client
    });

    const context = new InvocationContext();

    await expect(handler({
      reportId: "REP-100"
    }, context)).rejects.toThrow("ReportRequested message is invalid");

    expect(client.start).not.toHaveBeenCalled();
  });

  it("should propagate durable client failure", async () => {

    client
      .start
      .mockRejectedValue(new Error("Durable unavailable"));

    const handler = createStartGenerateReportHandler({
      client
    });

    const context = new InvocationContext();

    const message = {
      eventId: "REP-100:ReportRequested",
      occurredAt: "2026-08-13T10:00:00.000Z",
      reportId: "REP-100",
      customerId: "CUS-100",
      period: {
        from: "2026-08-01",
        to: "2026-08-31"
      }
    };

    await expect(handler(message, context)).rejects.toThrow("Durable unavailable");
  });
});
