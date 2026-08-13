import {Container} from "@azure/cosmos";

import {CosmosReportGenerationRepository} from "./cosmos-report-generation.repository";

import {ReportGenerationConcurrencyError} from "../../domain/report-generation-concurrency.error";

describe("CosmosReportGenerationRepository", () => {

  let container: jest.Mocked<Container>;
  let item: jest.Mock;
  let read: jest.Mock;
  let batch: jest.Mock;
  let repository: CosmosReportGenerationRepository;

  beforeEach(() => {

    read = jest.fn();
    batch = jest.fn();
    item = jest.fn(() => ({
      read
    }));
    container = {
      item,
      items: {
        batch
      }
    } as unknown as jest.Mocked<Container>;

    repository = new CosmosReportGenerationRepository(container);
  });

  it("should read report with version", async () => {

    read.mockResolvedValue({
      resource: {
        id: "REP-100",
        reportId: "REP-100",
        status: "PROCESSING"
      },
      etag: "\"version-1\""
    });

    const result = await repository.findById("REP-100");

    expect(result).toEqual({
      state: {
        reportId: "REP-100",
        status: "PROCESSING",
        blobName: undefined,
        generatedAt: undefined
      },
      version: "\"version-1\""
    });
  });

  it("should atomically mark generated and create outbox event", async () => {

    batch.mockResolvedValue({
      result: [{
        statusCode: 200
      }, {
        statusCode: 201
      }]
    });

    await repository
      .completeGeneration({
        reportId: "REP-100",
        blobName: "REP-100/financial-report.xlsx",
        generatedAt: "2026-08-12T02:00:00.000Z",
        expectedVersion: "\"version-1\"",
        event: {
          eventId: "REP-100:ReportGenerated",
          occurredAt: "2026-08-12T02:00:00.000Z",
          reportId: "REP-100",
          blobName: "REP-100/financial-report.xlsx"
        }
      });

    expect(batch).toHaveBeenCalledTimes(1);

    const [operations, partitionKey] = batch.mock.calls[0];

    expect(partitionKey).toBe("REP-100");

    expect(operations).toEqual([{
      operationType: "Patch",
      id: "REP-100",
      partitionKey: "REP-100",
      ifMatch: "\"version-1\"",
      resourceBody: [{
        op: "set",
        path: "/status",
        value: "GENERATED"
      }, {
        op: "set",
        path: "/blobName",
        value: "REP-100/financial-report.xlsx"
      }, {
        op: "set",
        path: "/generatedAt",
        value: "2026-08-12T02:00:00.000Z"
      }]
    }, {
      operationType: "Create",
      resourceBody: {
        id: "REP-100:ReportGenerated",
        reportId: "REP-100",
        docType: "OUTBOX",
        eventType: "ReportGenerated",
        eventVersion: 1,
        occurredAt: "2026-08-12T02:00:00.000Z",
        status: "PENDING",
        payload: {
          eventId: "REP-100:ReportGenerated",
          occurredAt: "2026-08-12T02:00:00.000Z",
          reportId: "REP-100",
          blobName: "REP-100/financial-report.xlsx"
        }
      }
    }]);
  });

  it("should translate 412 into concurrency error", async () => {

    batch.mockResolvedValue({
      result: [{
        statusCode: 412
      }, {
        statusCode: 424
      }]
    });

    await expect(repository.completeGeneration({
      reportId: "REP-100",
      blobName: "REP-100/financial-report.xlsx",
      generatedAt: "2026-08-12T02:00:00.000Z",
      expectedVersion: "\"version-1\"",
      event: {
        eventId: "REP-100:ReportGenerated",
        occurredAt: "2026-08-12T02:00:00.000Z",
        reportId: "REP-100",
        blobName: "REP-100/financial-report.xlsx"
      }
    })).rejects.toBeInstanceOf(ReportGenerationConcurrencyError);
  });

  it("should fail when outbox creation fails", async () => {

    batch.mockResolvedValue({
      result: [{
        statusCode: 424
      }, {
        statusCode: 409
      }]
    });

    await expect(repository.completeGeneration({
      reportId: "REP-100",
      blobName: "REP-100/financial-report.xlsx",
      generatedAt: "2026-08-12T02:00:00.000Z",
      expectedVersion: "\"version-1\"",
      event: {
        eventId: "REP-100:ReportGenerated",
        occurredAt: "2026-08-12T02:00:00.000Z",
        reportId: "REP-100",
        blobName: "REP-100/financial-report.xlsx"
      }
    })).rejects.toThrow("Complete generation transaction failed");
  });

  it("should return null when report does not exist", async () => {

    read.mockRejectedValue({
      code: 404
    });

    const result = await repository.findById("REP-404");

    expect(result).toBeNull();
  });
});
