import {BulkOperationType, Container} from "@azure/cosmos";

import {ReportPeriod} from "../../../Report/domain/report-period";
import {CosmosReportRepository} from "./cosmos-report.repository";
import {RequestReportConflictError} from "../../domain/request-report-conflict.error";

describe("CosmosReportRepository", () => {
  let container: jest.Mocked<Container>;
  let batch: jest.Mock;
  let read: jest.Mock;
  let repository: CosmosReportRepository;

  beforeEach(() => {
    batch = jest.fn();
    read = jest.fn();

    container = {
      items: {
        batch,
      },
      item: jest.fn(() => ({
        read,
      })),
    } as unknown as jest.Mocked<Container>;

    repository = new CosmosReportRepository(container);
  });

  it("should atomically save report and outbox event", async () => {
    batch.mockResolvedValue({
      result: [
        {statusCode: 201},
        {statusCode: 201},
      ],
    });

    const period = ReportPeriod.create(
      "2026-08-01",
      "2026-08-31",
    );

    const result = await repository.saveRequested({
      report: {
        reportId: "REP-100",
        customerId: "CUS-100",
        period,
        status: "REQUESTED",
        requestedAt: "2026-08-11T20:00:00.000Z",
      },
      event: {
        eventId: "REP-100:ReportRequested",
        occurredAt: "2026-08-11T20:00:00.000Z",
        reportId: "REP-100",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
      },
      idempotencyKeyHash: "key-hash",
      requestHash: "request-hash",
    });

    expect(batch).toHaveBeenCalledTimes(1);

    const [operations, partitionKey] = batch.mock.calls[0];

    expect(partitionKey).toBe("REP-100");

    expect(operations).toEqual([
      {
        operationType: BulkOperationType.Create,
        resourceBody: {
          id: "REP-100",
          reportId: "REP-100",
          docType: "REPORT",
          customerId: "CUS-100",
          period: {
            from: "2026-08-01",
            to: "2026-08-31",
          },
          status: "REQUESTED",
          requestedAt: "2026-08-11T20:00:00.000Z",
          idempotencyKeyHash: "key-hash",
          requestHash: "request-hash",
          processingAt: undefined,
          blobName: undefined,
          generatedAt: undefined,
          completedAt: undefined,
          failedAt: undefined,
          failureCode: undefined,
          failureReason: undefined,
        },
      },
      {
        operationType: BulkOperationType.Create,
        resourceBody: {
          id: "REP-100:ReportRequested",
          reportId: "REP-100",
          docType: "OUTBOX",
          eventType: "ReportRequested",
          eventVersion: 1,
          occurredAt: "2026-08-11T20:00:00.000Z",
          status: "PENDING",
          payload: {
            eventId: "REP-100:ReportRequested",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
              from: "2026-08-01",
              to: "2026-08-31",
            },
          },
        },
      },
    ]);

    expect(result).toEqual({
      reportId: "REP-100",
      status: "REQUESTED",
      created: true,
    });
  });

  it("should fail when transactional batch fails", async () => {
    batch.mockResolvedValue({
      result: [
        {statusCode: 400},
        {statusCode: 424},
      ],
    });

    await expect(
      repository.saveRequested({
        report: {
          reportId: "REP-100",
          customerId: "CUS-100",
          period: ReportPeriod.create(
            "2026-08-01",
            "2026-08-31",
          ),
          status: "REQUESTED",
          requestedAt: "2026-08-11T20:00:00.000Z",
        },
        event: {
          eventId: "REP-100:ReportRequested",
          occurredAt: "2026-08-11T20:00:00.000Z",
          reportId: "REP-100",
          customerId: "CUS-100",
          period: {
            from: "2026-08-01",
            to: "2026-08-31",
          },
        },
        idempotencyKeyHash: "key-hash",
        requestHash: "request-hash",
      }),
    ).rejects.toThrow(
      "Request report transaction failed",
    );

    expect(read).not.toHaveBeenCalled();
  });

  it("should return existing report for an idempotent retry", async () => {
    batch.mockResolvedValue({
      result: [
        {statusCode: 409},
        {statusCode: 424},
      ],
    });

    read.mockResolvedValue({
      resource: {
        id: "REP-100",
        reportId: "REP-100",
        docType: "REPORT",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
        status: "PROCESSING",
        requestedAt: "2026-08-12T16:00:00.000Z",
        idempotencyKeyHash: "key-hash",
        requestHash: "request-hash",
      },
    });

    const result = await repository.saveRequested({
      report: {
        reportId: "REP-100",
        customerId: "CUS-100",
        period: ReportPeriod.create(
          "2026-08-01",
          "2026-08-31",
        ),
        status: "REQUESTED",
        requestedAt: "2026-08-12T16:05:00.000Z",
      },
      event: {
        eventId: "REP-100:ReportRequested",
        occurredAt: "2026-08-12T16:05:00.000Z",
        reportId: "REP-100",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
      },
      idempotencyKeyHash: "key-hash",
      requestHash: "request-hash",
    });

    expect(result).toEqual({
      reportId: "REP-100",
      status: "PROCESSING",
      created: false,
    });

    expect(container.item).toHaveBeenCalledWith(
      "REP-100",
      "REP-100",
    );

    expect(read).toHaveBeenCalledTimes(1);
  });

  it("should reject reuse of idempotency key with different request", async () => {
    batch.mockResolvedValue({
      result: [
        {statusCode: 409},
        {statusCode: 424},
      ],
    });

    read.mockResolvedValue({
      resource: {
        id: "REP-100",
        reportId: "REP-100",
        docType: "REPORT",
        customerId: "CUS-100",
        period: {
          from: "2026-08-01",
          to: "2026-08-31",
        },
        status: "REQUESTED",
        requestedAt: "2026-08-12T16:00:00.000Z",
        idempotencyKeyHash: "key-hash",
        requestHash: "ORIGINAL-HASH",
      },
    });

    await expect(
      repository.saveRequested({
        report: {
          reportId: "REP-100",
          customerId: "CUS-200",
          period: ReportPeriod.create(
            "2026-08-01",
            "2026-08-31",
          ),
          status: "REQUESTED",
          requestedAt: "2026-08-12T16:05:00.000Z",
        },
        event: {
          eventId: "REP-100:ReportRequested",
          occurredAt: "2026-08-12T16:05:00.000Z",
          reportId: "REP-100",
          customerId: "CUS-200",
          period: {
            from: "2026-08-01",
            to: "2026-08-31",
          },
        },
        idempotencyKeyHash: "key-hash",
        requestHash: "DIFFERENT-HASH",
      }),
    ).rejects.toBeInstanceOf(RequestReportConflictError);

    expect(read).toHaveBeenCalledTimes(1);
  });
});
