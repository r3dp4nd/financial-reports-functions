import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";
import {ReportGenerationRepository} from "../GenerateReport/domain/report-generation.repository";
import {createCompleteGenerationHandler} from "./handler";

describe("CompleteGeneration handler", () => {

  it("should complete generated report", async () => {

    const generatedAt = "2026-08-11T20:00:00.000Z";

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn()
        .mockResolvedValue({
          state: {
            reportId: "REP-100", status: "REQUESTED"
          }, version: "\"version-1\""
        }), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => generatedAt
    });

    const input = {
      reportId: "REP-100", blobName: "REP-100/financial-report.xlsx"
    };

    const result = await handler(input);

    expect(result).toEqual({
      reportId: "REP-100", status: "GENERATED", blobName: "REP-100/financial-report.xlsx"
    });

    expect(repository.findById)
      .toHaveBeenCalledTimes(1);

    expect(repository.findById)
      .toHaveBeenCalledWith("REP-100");

    expect(repository.completeGeneration)
      .toHaveBeenCalledTimes(1);

    expect(repository.completeGeneration)
      .toHaveBeenCalledWith({
        reportId: "REP-100",
        blobName: "REP-100/financial-report.xlsx",
        generatedAt,
        expectedVersion: "\"version-1\"",
        event: {
          eventId: "REP-100:ReportGenerated",
          occurredAt: generatedAt,
          reportId: "REP-100",
          blobName: "REP-100/financial-report.xlsx"
        }
      });
  });


  it("should propagate application errors", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn()
        .mockRejectedValue(new Error("Cosmos unavailable")), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    const input = {
      reportId: "REP-100", blobName: "REP-100/financial-report.xlsx"
    };

    await expect(handler(input))
      .rejects
      .toThrow("Cosmos unavailable");

    expect(repository.findById)
      .toHaveBeenCalledTimes(1);

    expect(repository.findById)
      .toHaveBeenCalledWith("REP-100");

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject undefined input", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    await expect(handler(undefined))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject null input", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    await expect(handler(null))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject input without reportId", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    const input = {
      blobName: "REP-100/financial-report.xlsx"
    };

    await expect(handler(input))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject input without blobName", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    const input = {
      reportId: "REP-100"
    };

    await expect(handler(input))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject input with invalid reportId type", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    const input = {
      reportId: 100, blobName: "REP-100/financial-report.xlsx"
    };

    await expect(handler(input))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should reject input with invalid blobName type", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now: () => "2026-08-11T20:00:00.000Z"
    });

    const input = {
      reportId: "REP-100", blobName: 123
    };

    await expect(handler(input))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });


  it("should use generatedAt from now dependency", async () => {

    const generatedAt = "2026-08-13T10:30:00.000Z";

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn()
        .mockResolvedValue({
          state: {
            reportId: "REP-100", status: "REQUESTED"
          }, version: "\"version-1\""
        }), completeGeneration: jest.fn()
    };

    const useCase = new CompleteGenerationUseCase(repository);

    const now = jest.fn()
      .mockReturnValue(generatedAt);

    const handler = createCompleteGenerationHandler({
      useCase, now
    });

    const input = {
      reportId: "REP-100", blobName: "REP-100/financial-report.xlsx"
    };

    await handler(input);

    expect(now)
      .toHaveBeenCalledTimes(1);

    expect(repository.completeGeneration)
      .toHaveBeenCalledWith({
        reportId: "REP-100",
        blobName: "REP-100/financial-report.xlsx",
        generatedAt,
        expectedVersion: "\"version-1\"",
        event: {
          eventId: "REP-100:ReportGenerated",
          occurredAt: generatedAt,
          reportId: "REP-100",
          blobName: "REP-100/financial-report.xlsx"
        }
      });
  });


  it("should not call repository when input is invalid", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn(), completeGeneration: jest.fn()
    };

    const now = jest.fn()
      .mockReturnValue("2026-08-11T20:00:00.000Z");

    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase, now
    });

    await expect(handler({
      reportId: "REP-100"
    }))
      .rejects
      .toThrow("CompleteGeneration activity input is invalid");

    expect(now)
      .not.toHaveBeenCalled();

    expect(repository.findById)
      .not.toHaveBeenCalled();

    expect(repository.completeGeneration)
      .not.toHaveBeenCalled();
  });

});
