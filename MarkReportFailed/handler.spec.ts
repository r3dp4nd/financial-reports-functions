import {Context} from "@azure/functions";

import {MarkReportFailedUseCase} from "../GenerateReport/application/mark-report-failed.use-case";
import {ReportFailureRepository} from "../GenerateReport/domain/report-failure.repository";
import {createMarkReportFailedHandler} from "./handler";

describe("MarkReportFailed handler", () => {

    it("should mark report failed", async () => {

        const repository: jest.Mocked<ReportFailureRepository> = {

            findById: jest.fn()
                .mockResolvedValue({
                    state: {
                        reportId: "REP-100",
                        status: "PROCESSING"
                    },
                    version: "\"version-1\""
                }),
            markFailed: jest.fn()
        };

        const useCase = new MarkReportFailedUseCase(repository);

        const handler = createMarkReportFailedHandler({
            useCase
        });

        const context = {
            bindings: {
                input: {
                    reportId: "REP-100",
                    failedAt: "2026-08-12T00:30:00.000Z",
                    failureCode: "REPORT_GENERATION_FAILED",
                    failureReason: "Cosmos unavailable"
                }
            }
        } as unknown as Context;

        const result = await handler(context);

        expect(result).toEqual({
            reportId: "REP-100",
            status: "FAILED"
        });
    });
});