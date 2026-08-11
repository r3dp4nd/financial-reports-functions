import {RequestReportUseCase} from "./request-report.use-case";
import {ReportRepository} from "../domain/report.repository";
import {ReportEventPublisher} from "./report-event.publisher";

describe("RequestReportUseCase", () => {

    let repository: jest.Mocked<ReportRepository>;
    let eventPublisher: jest.Mocked<ReportEventPublisher>;
    let useCase: RequestReportUseCase;

    beforeEach(() => {
        repository = {
            save: jest.fn(),
            findById: jest.fn()
        };
        eventPublisher = {
            publishRequested: jest.fn()
        };

        useCase = new RequestReportUseCase(repository, eventPublisher);
    });

    it("should request a report", async () => {

        const result = await useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });

        expect(repository.save).toHaveBeenCalledTimes(1);

        expect(repository.save).toHaveBeenCalledWith({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            },
            status: "REQUESTED",
            requestedAt: "2026-08-11T15:00:00.000Z"
        });

        expect(eventPublisher.publishRequested).toHaveBeenCalledTimes(1);

        expect(eventPublisher.publishRequested).toHaveBeenCalledWith({
            eventId: "REP-100",
            occurredAt: "2026-08-11T15:00:00.000Z",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        });

        expect(result).toEqual({
            reportId: "REP-100",
            status: "REQUESTED"
        });
    });

    it("should reject empty reportId", async () => {

        await expect(useCase.execute({
            reportId: "",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("reportId is required");

        expect(repository.save).not.toHaveBeenCalled();

        expect(eventPublisher.publishRequested).not.toHaveBeenCalled();
    });

    it("should reject empty customerId", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("customerId is required");

        expect(repository.save).not.toHaveBeenCalled();

        expect(eventPublisher.publishRequested).not.toHaveBeenCalled();
    });

    it("should reject invalid from date", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "invalid-date",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("from is invalid");

        expect(repository.save).not.toHaveBeenCalled();
    });

    it("should reject invalid to date", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "invalid-date",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("to is invalid");

        expect(repository.save).not.toHaveBeenCalled();
    });

    it("should reject invalid requestedAt", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "invalid-date"
        })).rejects.toThrow("requestedAt is invalid");

        expect(repository.save).not.toHaveBeenCalled();
    });

    it("should reject reversed period", async () => {

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-31",
            to: "2026-08-01",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("from must be before or equal to to");

        expect(repository.save).not.toHaveBeenCalled();

        expect(eventPublisher.publishRequested).not.toHaveBeenCalled();
    });

    it("should not publish when repository fails", async () => {

        repository.save
            .mockRejectedValue(new Error("Repository unavailable"));

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("Repository unavailable");

        expect(eventPublisher.publishRequested).not.toHaveBeenCalled();
    });

    it("should propagate publisher failure", async () => {

        eventPublisher
            .publishRequested
            .mockRejectedValue(new Error("Publisher unavailable"));

        await expect(useCase.execute({
            reportId: "REP-100",
            customerId: "CUS-100",
            from: "2026-08-01",
            to: "2026-08-31",
            requestedAt: "2026-08-11T15:00:00.000Z"
        })).rejects.toThrow("Publisher unavailable");

        expect(repository.save).toHaveBeenCalledTimes(1);
    });
});