import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";
import {ReportFailureRepository} from "../GenerateReport/domain/report-failure.repository";
import {ReportFailureConcurrencyError} from "../GenerateReport/domain/report-failure-concurrency.error";
import {createMarkReportFailedHandler} from "./handler";

describe("MarkReportFailed handler", () => {

  let repository: jest.Mocked<ReportFailureRepository>;
  let useCase: MarkReportFailedUseCase;

  beforeEach(() => {

    repository = {
      findById: jest.fn(),
      markFailed: jest.fn()
    };

    useCase = new MarkReportFailedUseCase(repository);
  });


  it("should mark report failed", async () => {

    repository.findById.mockResolvedValue({
      state: {
        reportId: "REP-100",
        status: "PROCESSING"
      },
      version: "\"version-1\""
    });

    repository.markFailed.mockResolvedValue(undefined);

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    const result = await handler(input);

    expect(result).toEqual({
      reportId: "REP-100",
      status: "FAILED"
    });

    expect(repository.findById).toHaveBeenCalledTimes(1);

    expect(repository.findById).toHaveBeenCalledWith("REP-100");

    expect(repository.markFailed).toHaveBeenCalledTimes(1);

    expect(repository.markFailed).toHaveBeenCalledWith({
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable",
      expectedVersion: "\"version-1\""
    });
  });


  it("should propagate application errors", async () => {

    repository.findById.mockRejectedValue(
      new Error("Cosmos unavailable")
    );

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    await expect(handler(input))
      .rejects
      .toThrow("Cosmos unavailable");

    expect(repository.markFailed).not.toHaveBeenCalled();
  });


  it("should reject invalid input", async () => {

    const handler = createMarkReportFailedHandler({
      useCase
    });

    await expect(handler(undefined))
      .rejects
      .toThrow("MarkReportFailed activity input is invalid");

    expect(repository.findById).not.toHaveBeenCalled();

    expect(repository.markFailed).not.toHaveBeenCalled();
  });


  it("should propagate application validation errors", async () => {

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    await expect(handler(input))
      .rejects
      .toThrow("reportId is required");

    expect(repository.findById).not.toHaveBeenCalled();

    expect(repository.markFailed).not.toHaveBeenCalled();
  });


  it("should retry when a concurrency error occurs", async () => {

    repository.findById
      .mockResolvedValueOnce({
        state: {
          reportId: "REP-100",
          status: "PROCESSING"
        },
        version: "\"version-1\""
      })
      .mockResolvedValueOnce({
        state: {
          reportId: "REP-100",
          status: "PROCESSING"
        },
        version: "\"version-2\""
      });

    repository.markFailed
      .mockRejectedValueOnce(
        new ReportFailureConcurrencyError("REP-100")
      )
      .mockResolvedValueOnce(undefined);

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    const result = await handler(input);

    expect(result).toEqual({
      reportId: "REP-100",
      status: "FAILED"
    });

    expect(repository.findById).toHaveBeenCalledTimes(2);

    expect(repository.markFailed).toHaveBeenCalledTimes(2);

    expect(repository.markFailed).toHaveBeenNthCalledWith(1, {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable",
      expectedVersion: "\"version-1\""
    });

    expect(repository.markFailed).toHaveBeenNthCalledWith(2, {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable",
      expectedVersion: "\"version-2\""
    });
  });


  it("should propagate concurrency error after maximum attempts", async () => {

    repository.findById
      .mockResolvedValue({
        state: {
          reportId: "REP-100",
          status: "PROCESSING"
        },
        version: "\"version-1\""
      });

    const concurrencyError = new ReportFailureConcurrencyError("REP-100");

    repository.markFailed
      .mockRejectedValue(concurrencyError);

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    await expect(handler(input))
      .rejects
      .toThrow(concurrencyError);

    expect(repository.findById).toHaveBeenCalledTimes(2);

    expect(repository.markFailed).toHaveBeenCalledTimes(2);
  });


  it("should return FAILED when report is already failed", async () => {

    repository.findById.mockResolvedValue({
      state: {
        reportId: "REP-100",
        status: "FAILED"
      },
      version: "\"version-1\""
    });

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      reportId: "REP-100",
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    const result = await handler(input);

    expect(result).toEqual({
      reportId: "REP-100",
      status: "FAILED"
    });

    expect(repository.findById).toHaveBeenCalledTimes(1);

    expect(repository.markFailed).not.toHaveBeenCalled();
  });


  it("should reject null input", async () => {

    const handler = createMarkReportFailedHandler({
      useCase
    });

    await expect(handler(null))
      .rejects
      .toThrow("MarkReportFailed activity input is invalid");

    expect(repository.findById).not.toHaveBeenCalled();

    expect(repository.markFailed).not.toHaveBeenCalled();
  });


  it("should reject input without reportId", async () => {

    const handler = createMarkReportFailedHandler({
      useCase
    });

    const input = {
      failedAt: "2026-08-12T00:30:00.000Z",
      failureCode: "REPORT_GENERATION_FAILED",
      failureReason: "Cosmos unavailable"
    };

    await expect(handler(input))
      .rejects
      .toThrow("MarkReportFailed activity input is invalid");

    expect(repository.findById).not.toHaveBeenCalled();
  });

});
