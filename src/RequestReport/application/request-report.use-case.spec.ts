import {RequestReportUseCase} from "./request-report.use-case";
import {ReportRepository} from "../domain/report.repository";

describe("RequestReportUseCase", () => {
  let repository: jest.Mocked<ReportRepository>;
  let useCase: RequestReportUseCase;

  beforeEach(() => {
    repository = {
      saveRequested: jest.fn(),
    };

    useCase = new RequestReportUseCase(repository);
  });

  it("should request a report", async () => {
    repository.saveRequested.mockResolvedValue({
      reportId: "REP-100",
      status: "REQUESTED",
      created: true,
    });

    const result = await useCase.execute({
      customerId: "CUS-100",
      from: "2026-08-01",
      to: "2026-08-31",
      requestedAt: "2026-08-11T15:00:00.000Z",
      idempotencyKey: "request-100",
    });

    expect(repository.saveRequested).toHaveBeenCalledTimes(1);

    expect(repository.saveRequested).toHaveBeenCalledWith({
      report: expect.objectContaining({
        reportId: "REP-67c879504d31e389ba37858ca9148ef6069255dd7ccf3a19d46a5de823a85b97",
        customerId: "CUS-100",
        status: "REQUESTED",
        requestedAt: "2026-08-11T15:00:00.000Z",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
      }),

      event: {
        eventId: "REP-67c879504d31e389ba37858ca9148ef6069255dd7ccf3a19d46a5de823a85b97:ReportRequested",
        occurredAt: "2026-08-11T15:00:00.000Z",
        reportId: "REP-67c879504d31e389ba37858ca9148ef6069255dd7ccf3a19d46a5de823a85b97",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
      },

      idempotencyKeyHash: "67c879504d31e389ba37858ca9148ef6069255dd7ccf3a19d46a5de823a85b97",
      requestHash: "48fd8313d87dee8c079b3389d9245575655be42b1207a56d88433afacc1c937f",
    });

    expect(result).toEqual({
      reportId: "REP-100",
      status: "REQUESTED",
      created: true,
    });
  });
});
