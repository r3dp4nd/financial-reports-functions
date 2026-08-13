import {DurableClient} from "durable-functions";

import {DurableGenerateReportClient} from "./durable-generate-report.client";

describe("DurableGenerateReportClient", () => {

  it("should start ReportOrchestrator using reportId as instanceId", async () => {

    const startNew = jest
      .fn()
      .mockResolvedValue("REP-100");

    const durableClient = {
      startNew
    } as unknown as DurableClient;

    const client = new DurableGenerateReportClient(durableClient);

    const instanceId = await client.start("REP-100", {
      eventId: "REP-100:ReportRequested",
      occurredAt: "2026-08-13T10:00:00.000Z",
      reportId: "REP-100",
      customerId: "CUS-100",
      period: {
        from: "2026-08-01",
        to: "2026-08-31"
      }
    });

    expect(startNew).toHaveBeenCalledWith("ReportOrchestrator", {
      instanceId: "REP-100",
      input: {
        reportId: "REP-100",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31"
        }
      }
    });

    expect(instanceId).toBe("REP-100");
  });
});
