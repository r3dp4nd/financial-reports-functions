import {createRequestReportIdentity} from "./request-report-idempotency";

describe("createRequestReportIdentity", () => {

  it("should generate the same report id for the same idempotency key", () => {

    const first = createRequestReportIdentity({
      idempotencyKey: "request-100",
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const second = createRequestReportIdentity({
      idempotencyKey: "request-100",
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    expect(first.reportId).toBe(second.reportId);

    expect(first.requestHash).toBe(second.requestHash);
  });

  it("should generate different request hashes for different payloads", () => {

    const first = createRequestReportIdentity({
      idempotencyKey: "request-100",
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    const second = createRequestReportIdentity({
      idempotencyKey: "request-100",
      customerId: "CUS-200",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    expect(first.reportId).toBe(second.reportId);

    expect(first.requestHash).not.toBe(second.requestHash);
  });

  it("should not expose idempotency key in report id", () => {

    const result = createRequestReportIdentity({
      idempotencyKey: "secret-client-reference",
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31"
    });

    expect(result.reportId).not.toContain("secret-client-reference");
  });
});
