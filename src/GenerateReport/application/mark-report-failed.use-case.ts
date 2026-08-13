import {ReportFailureRepository} from "../domain/report-failure.repository";
import {ReportFailureConcurrencyError} from "../domain/report-failure-concurrency.error";
import {markReportFailed} from "../domain/report-failure";
import {MarkReportFailedCommand} from "./mark-report-failed.command";
import {MarkReportFailedResult} from "./mark-report-failed.result";

const MAX_UPDATE_ATTEMPTS = 2;

export class MarkReportFailedUseCase {

    constructor(private readonly repository: ReportFailureRepository) {
    }

    async execute(command: MarkReportFailedCommand): Promise<MarkReportFailedResult> {

        this.validate(command);

        for (let attempt = 1; attempt <= MAX_UPDATE_ATTEMPTS; attempt++) {

            const snapshot = await this.repository
                .findById(command.reportId);

            if (!snapshot) {
                throw new Error(`Report ${command.reportId} was not found`);
            }

            const nextState = markReportFailed(snapshot.state, command.failedAt, command.failureCode, command.failureReason);

            const alreadyFailed = nextState === snapshot.state;

            if (alreadyFailed) {

                return {
                    reportId: command.reportId,
                    status: "FAILED"
                };
            }

            try {

                await this.repository
                    .markFailed({
                        reportId: command.reportId,
                        failedAt: command.failedAt,
                        failureCode: command.failureCode,
                        failureReason: command.failureReason,
                        expectedVersion: snapshot.version
                    });

            } catch (error: unknown) {

                if (error instanceof ReportFailureConcurrencyError && attempt < MAX_UPDATE_ATTEMPTS) {
                    continue;
                }

                throw error;
            }

            return {
                reportId: command.reportId,
                status: "FAILED"
            };
        }

        throw new Error(`Unable to mark report ${command.reportId} as failed`);
    }

    private validate(command: MarkReportFailedCommand): void {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.failedAt?.trim()) {
            throw new Error("failedAt is required");
        }

        if (!command.failureCode?.trim()) {
            throw new Error("failureCode is required");
        }

        if (!command.failureReason?.trim()) {
            throw new Error("failureReason is required");
        }
    }
}