import {Context} from "@azure/functions";

import {CompleteGenerationUseCase} from "../GenerateReport/application/complete-generation.use-case";

import {ReportGenerationRepository} from "../GenerateReport/domain/report-generation.repository";

import {createCompleteGenerationHandler} from "./handler";

describe("CompleteGeneration handler", () => {

  it("should complete generated report", async () => {

    const repository: jest.Mocked<ReportGenerationRepository> = {
      findById: jest.fn()
        .mockResolvedValue({
          state: {
            reportId: "REP-100",
            status: "REQUESTED"
          },
          version: "\"version-1\""
        }),

      completeGeneration: jest.fn()
    };


    const useCase = new CompleteGenerationUseCase(repository);

    const handler = createCompleteGenerationHandler({
      useCase,
      now: () => "2026-08-11T20:00:00.000Z"
    });

    const context = {
      bindings: {
        input: {
          reportId: "REP-100",
          blobName: "REP-100/financial-report.xlsx"
        }
      }
    } as unknown as Context;

    const result = await handler(context);

    expect(result).toEqual({
      reportId: "REP-100",
      status: "GENERATED",
      blobName: "REP-100/financial-report.xlsx"
    });
  });
});
