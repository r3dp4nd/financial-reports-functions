import {Context, HttpRequest} from "@azure/functions";

import {RequestReportUseCase} from "./application/request-report.use-case";
import {ReportRepository} from "./domain/report.repository";
import {createRequestReportHandler} from "./handler";
import {ReportPeriod} from "../Report/domain/report-period";

function createContext(): Context {

    const log = jest.fn() as unknown as Context["log"];
    log.error = jest.fn();
    return {
        log
    } as unknown as Context;
}

function createRequest(body: unknown): HttpRequest {
    return {
        body
    } as unknown as HttpRequest;
}

describe("RequestReport HTTP handler", () => {

    let repository: jest.Mocked<ReportRepository>;
    let useCase: RequestReportUseCase;

    beforeEach(() => {

        repository = {
            saveRequested: jest.fn(),
        };

        useCase = new RequestReportUseCase(repository);
    });

    it("should return 202 when report is requested", async () => {

        const handler = createRequestReportHandler({
            useCase, generateReportId: () => "REP-100", now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        const request = createRequest({
            customerId: "CUS-100", from: "2026-08-01", to: "2026-08-31"
        });

        await handler(context, request);

        expect(context.res).toEqual({
            status: 202, body: {
                reportId: "REP-100", status: "REQUESTED"
            }
        });

        expect(repository.saveRequested).toHaveBeenCalledWith({
                customerId: "CUS-100",
                period: expect.any(ReportPeriod),
                reportId: "REP-100",
                requestedAt: "2026-08-11T16:00:00.000Z",
                status: "REQUESTED",
            },
            {
                customerId: "CUS-100",
                eventId: "REP-100:ReportRequested",
                occurredAt: "2026-08-11T16:00:00.000Z",
                period: {
                    from: "2026-08-01",
                    to: "2026-08-31",
                },
                reportId: "REP-100",
            },);
    });

    it("should return 400 when request body is missing", async () => {

        const handler = createRequestReportHandler({
            useCase, generateReportId: () => "REP-100", now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest(undefined));

        expect(context.res).toEqual({
            status: 400, body: {
                error: "request body is required"
            }
        });

        expect(repository.saveRequested).not.toHaveBeenCalled();
    });

    it("should return 400 when request is invalid", async () => {

        const handler = createRequestReportHandler({
            useCase, generateReportId: () => "REP-100", now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest({
            customerId: "", from: "2026-08-01", to: "2026-08-31"
        }));

        expect(context.res).toEqual({
            status: 400, body: {
                error: "customerId is required"
            }
        });
    });

    it("should return 500 when infrastructure fails", async () => {

        repository.saveRequested
            .mockRejectedValue(new Error("Cosmos unavailable"));

        const handler = createRequestReportHandler({
            useCase, generateReportId: () => "REP-100", now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest({
            customerId: "CUS-100", from: "2026-08-01", to: "2026-08-31"
        }));

        expect(context.res).toEqual({
            status: 500, body: {
                error: "Unable to request report"
            }
        });

        expect(context.log.error).toHaveBeenCalled();
    });
});