import {Context, HttpRequest} from "@azure/functions";

import {RequestReportUseCase} from "./application/request-report.use-case";
import {ReportRepository} from "./domain/report.repository";
import {ReportEventPublisher} from "./application/report-event.publisher";
import {createRequestReportHandler} from "./handler";

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
    let publisher: jest.Mocked<ReportEventPublisher>;
    let useCase: RequestReportUseCase;

    beforeEach(() => {

        repository = {
            save: jest.fn(),
            findById: jest.fn()
        };

        publisher = {
            publishRequested: jest.fn()
        };

        useCase = new RequestReportUseCase(repository, publisher);
    });

    it("should return 202 when report is requested", async () => {

        const handler = createRequestReportHandler({
            useCase,
            generateReportId: () => "REP-100",
            now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        const request = createRequest({
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31"
        });

        await handler(context, request);

        expect(context.res).toEqual({
            status: 202,
            body: {
                reportId: "REP-100",
                status: "REQUESTED"
            }
        });

        expect(repository.save).toHaveBeenCalledWith({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T16:00:00.000Z"
        });
    });

    it("should return 400 when request body is missing", async () => {

        const handler = createRequestReportHandler({
            useCase,
            generateReportId: () => "REP-100",
            now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest(undefined));

        expect(context.res).toEqual({
            status: 400,
            body: {
                error: "request body is required"
            }
        });

        expect(repository.save).not.toHaveBeenCalled();
    });

    it("should return 400 when request is invalid", async () => {

        const handler = createRequestReportHandler({
            useCase,
            generateReportId: () => "REP-100",
            now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest({
            customerId: "",
            from: "2026-08-01",
            to: "2026-08-31"
        }));

        expect(context.res).toEqual({
            status: 400,
            body: {
                error: "customerId is required"
            }
        });
    });

    it("should return 500 when infrastructure fails", async () => {

        repository.save
            .mockRejectedValue(new Error("Cosmos unavailable"));

        const handler = createRequestReportHandler({
            useCase,
            generateReportId: () => "REP-100",
            now: () => "2026-08-11T16:00:00.000Z"
        });

        const context = createContext();

        await handler(context, createRequest({
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31"
        }));

        expect(context.res).toEqual({
            status: 500,
            body: {
                error: "Unable to request report"
            }
        });

        expect(context.log.error).toHaveBeenCalled();
    });
});