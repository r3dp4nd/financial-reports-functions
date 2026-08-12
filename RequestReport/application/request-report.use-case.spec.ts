import {RequestReportUseCase} from "./request-report.use-case";
import {ReportRepository} from "../domain/report.repository";
import {ReportEventPublisher} from "./report-event.publisher";

describe("RequestReportUseCase", () => {

    let repository: jest.Mocked<ReportRepository>;
    let eventPublisher: jest.Mocked<ReportEventPublisher>;
    let useCase: RequestReportUseCase;

    beforeEach(() => {
        repository = {
            saveRequested: jest.fn()
        };
        eventPublisher = {
            publishRequested: jest.fn()
        };

        useCase = new RequestReportUseCase(repository);
    });

    it("should request a report", async () => {

        const result = await useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });

        expect(repository.saveRequested).toHaveBeenCalledWith(expect.objectContaining({
            reportId: "REP-100",

            status: "REQUESTED"
        }), expect.objectContaining({
            eventId: "REP-100:ReportRequested",

            reportId: "REP-100"
        }));
    });
});