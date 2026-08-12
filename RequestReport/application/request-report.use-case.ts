import {Report} from "../../Report/domain/report";
import {ReportPeriod} from "../../Report/domain/report-period";
import {ReportRepository} from "../domain/report.repository";
import {RequestReportCommand} from "./request-report.command";
import {RequestReportResult} from "./request-report.result";
import {ReportRequestedIntegrationEvent} from "./report-requested.integration-event";
import {RequestReportValidationError} from "./request-report-validation.error";
import {createRequestReportIdentity} from "./request-report-idempotency";

export class RequestReportUseCase {

  constructor(private readonly reportRepository: ReportRepository) {
  }

  async execute(command: RequestReportCommand): Promise<RequestReportResult> {

    this.validateRequiredFields(command);

    const period = this.createPeriod(command.from, command.to);

    this.validateRequestedAt(command.requestedAt);

    const identity = createRequestReportIdentity({
      idempotencyKey: command.idempotencyKey,
      customerId: command.customerId,
      from: command.from,
      to: command.to
    });

    const report: Report = {
      reportId: identity.reportId,
      customerId: command.customerId,
      period,
      status: "REQUESTED",
      requestedAt: command.requestedAt
    };

    const event: ReportRequestedIntegrationEvent = {
      eventId: `${identity.reportId}:ReportRequested`,
      occurredAt: command.requestedAt,
      reportId: identity.reportId,
      customerId: command.customerId,
      period: {
        from: period.from,
        to: period.to
      }
    };

    return this.reportRepository.saveRequested({
      report,
      event,
      idempotencyKeyHash: identity.idempotencyKeyHash,
      requestHash: identity.requestHash
    });
  }

  private validateRequiredFields(command: RequestReportCommand): void {

    if (!command.idempotencyKey
      ?.trim()) {
      throw new RequestReportValidationError("idempotencyKey is required");
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
