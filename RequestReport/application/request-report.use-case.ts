import {Report} from "../domain/report.types";
import {ReportRepository} from "../domain/report.repository";
import {RequestReportCommand} from "./request-report.command";
import {RequestReportResult} from "./request-report.result";
import {ReportEventPublisher} from "./report-event.publisher";
import {ReportRequestedIntegrationEvent} from "./report-requested.integration-event";

export class RequestReportUseCase {

    constructor(private readonly reportRepository: ReportRepository, private readonly reportEventPublisher: ReportEventPublisher) {
    }

    async execute(command: RequestReportCommand): Promise<RequestReportResult> {

        this.validate(command);

        const report: Report = {
            reportId: command.reportId,
            customerId: command.customerId,
            period: {
                from: command.from,
                to: command.to
            },
            status: "REQUESTED",
            requestedAt: command.requestedAt
        };

        await this.reportRepository.save(report);

        const event: ReportRequestedIntegrationEvent = {
            eventId: command.reportId,
            occurredAt: command.requestedAt,
            reportId: report.reportId,
            customerId: report.customerId,
            period: report.period
        };

        await this.reportEventPublisher.publishRequested(event);

        return {
            reportId: report.reportId,
            status: "REQUESTED"
        };
    }

    private validate(command: RequestReportCommand): void {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.customerId?.trim()) {
            throw new Error("customerId is required");
        }

        if (!command.from?.trim()) {
            throw new Error("from is required");
        }

        if (!command.to?.trim()) {
            throw new Error("to is required");
        }

        if (!command.requestedAt?.trim()) {
            throw new Error("requestedAt is required");
        }

        const from = new Date(command.from);

        const to = new Date(command.to);

        const requestedAt = new Date(command.requestedAt);

        if (Number.isNaN(from.getTime())) {
            throw new Error("from is invalid");
        }

        if (Number.isNaN(to.getTime())) {
            throw new Error("to is invalid");
        }

        if (Number.isNaN(requestedAt.getTime())) {
            throw new Error("requestedAt is invalid");
        }

        if (from > to) {
            throw new Error("from must be before or equal to to");
        }
    }
}