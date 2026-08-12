import {Report} from "../../Report/domain/report";
import {ReportPeriod} from "../../Report/domain/report-period";
import {ReportRepository} from "../domain/report.repository";
import {RequestReportCommand} from "./request-report.command";
import {RequestReportResult} from "./request-report.result";
import {ReportEventPublisher} from "./report-event.publisher";
import {ReportRequestedIntegrationEvent} from "./report-requested.integration-event";
import {RequestReportValidationError} from "./request-report-validation.error";

export class RequestReportUseCase {

    constructor(private readonly reportRepository: ReportRepository, private readonly reportEventPublisher: ReportEventPublisher) {
    }

    async execute(command: RequestReportCommand): Promise<RequestReportResult> {

        this.validateRequiredFields(command);

        const period = this.createPeriod(command.from, command.to);

        this.validateRequestedAt(command.requestedAt);

        const report: Report = {
            reportId: command.reportId,
            customerId: command.customerId,
            period,
            status: "REQUESTED",
            requestedAt: command.requestedAt
        };
        
        await this.reportRepository.save(report);

        const event: ReportRequestedIntegrationEvent = {
            eventId: command.reportId,
            occurredAt: command.requestedAt,
            reportId: report.reportId,
            customerId: report.customerId,
            period: {
                from: report.period.from,
                to: report.period.to
            }
        };

        await this.reportEventPublisher.publishRequested(event);

        return {
            reportId: report.reportId,
            status: "REQUESTED"
        };
    }

    private validateRequiredFields(command: RequestReportCommand): void {

        if (!command.reportId?.trim()) {
            throw new RequestReportValidationError("reportId is required");
        }

        if (!command.customerId?.trim()) {
            throw new RequestReportValidationError("customerId is required");
        }
    }

    private createPeriod(from: string, to: string): ReportPeriod {

        try {

            return ReportPeriod.create(from, to);

        } catch (error: unknown) {

            if (error instanceof Error) {
                throw new RequestReportValidationError(error.message);
            }

            throw error;
        }
    }

    private validateRequestedAt(requestedAt: string): void {

        if (!requestedAt?.trim()) {
            throw new RequestReportValidationError("requestedAt is required");
        }

        const date = new Date(requestedAt);

        if (Number.isNaN(date.getTime())) {
            throw new RequestReportValidationError("requestedAt is invalid");
        }
    }
}