import {Context} from "@azure/functions";

import {MarkReportProcessingUseCase} from "../GenerateReport/application/mark-report-processing.use-case";
import {ReportProcessingRepository} from "../GenerateReport/domain/report-processing.repository";
import {createMarkReportProcessingHandler} from "./handler";

describe("MarkReportProcessing handler", () => {

    it("should mark report as processing", async () => {

        const repository: jest.Mocked<ReportProcessingRepository> = {

            findById: jest.fn()
                .mockResolvedValue({
                    state: {
                        reportId: "REP-100",
                        status: "REQUESTED"
                    },
                    version: "\"version-1\""
                }),
            markProcessing: jest.fn()
        };

        const useCase = new MarkReportProcessingUseCase(repository);

        const handler = createMarkReportProcessingHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    reportId: "REP-100",
                    processingAt: "2026-08-11T20:30:00.000Z"
                }
            }
        } as unknown as Context;

        const result = await handler(context);

        expect(result).toEqual({
            reportId: "REP-100",
            status: "PROCESSING"
        });
    });
});