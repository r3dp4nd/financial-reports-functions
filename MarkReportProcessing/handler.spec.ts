import {createMarkReportProcessingHandler} from "./handler";
import {ReportProcessingRepository} from "../GenerateReport/domain/report-processing.repository";
import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";

describe("MarkReportProcessing handler", () => {

  let repository: jest.Mocked<ReportProcessingRepository>;
  let useCase: MarkReportProcessingUseCase;

  beforeEach(() => {

    repository = {
      findById: jest.fn(),
      markProcessing: jest.fn()
    };

    useCase = new MarkReportProcessingUseCase(repository);
  });

  it("should mark report as processing", async () => {

    repository
      .findById
      .mockResolvedValue({
        state: {
          reportId: "REP-100",
          status: "REQUESTED"
        },
        version: "etag-1"
      });

    repository.markProcessing.mockResolvedValue();

    const handler = createMarkReportProcessingHandler({
      useCase
    });

    await handler({
      reportId: "REP-100",
      processingAt: "2026-08-12T22:00:00.000Z"
    });

    expect(repository.markProcessing).toHaveBeenCalledWith({
      reportId: "REP-100",
      processingAt: "2026-08-12T22:00:00.000Z",
      expectedVersion: "etag-1"
    });
  });

  it("should reject invalid activity input", async () => {

    const handler = createMarkReportProcessingHandler({
      useCase
    });

    await expect(handler(undefined)).rejects.toThrow("MarkReportProcessing activity input is invalid");

    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("should reject activity input without processingAt", async () => {

    const handler = createMarkReportProcessingHandler({
      useCase
    });

    await expect(handler({
      reportId: "REP-100"
    })).rejects.toThrow("MarkReportProcessing activity input is invalid");

    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("should propagate application failure", async () => {

    repository.findById.mockRejectedValue(new Error("Cosmos unavailable"));

    const handler = createMarkReportProcessingHandler({
      useCase
    });

    await expect(handler({
      reportId: "REP-100",
      processingAt: "2026-08-12T22:00:00.000Z"
    })).rejects.toThrow("Cosmos unavailable");
  });
});
