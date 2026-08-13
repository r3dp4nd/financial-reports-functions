import {ReportCompletionRepository} from "../domain/report-completion.repository";
import {ReportCompletionConcurrencyError} from "../domain/report-completion-concurrency.error";
import {markReportCompleted} from "../domain/report-completion";
import {CompleteReportCommand} from "./complete-report.command";
import {CompleteReportResult} from "./complete-report.result";

const MAX_UPDATE_ATTEMPTS = 2;

export class CompleteReportUseCase {

    constructor(private readonly repository: ReportCompletionRepository) {
    }

    async execute(command: CompleteReportCommand): Promise<CompleteReportResult> {

        this.validate(command);

        for (let attempt = 1; attempt <= MAX_UPDATE_ATTEMPTS; attempt++) {

            const snapshot = await this.repository
                .findById(command.reportId);

            if (!snapshot) {
                throw new Error(`Report ${command.reportId} was not found`);
            }

            const nextState = markReportCompleted(snapshot.state, command.blobName, command.completedAt);

            const alreadyCompleted = nextState === snapshot.state;

            if (alreadyCompleted) {

                return {
                    reportId: command.reportId,
                    status: "COMPLETED",
                    blobName: command.blobName
                };
            }

            try {

                await this.repository
                    .complete({
                        reportId: command.reportId,
                        completedAt: command.completedAt,
                        expectedVersion: snapshot.version
                    });

            } catch (error: unknown) {

                if (error instanceof ReportCompletionConcurrencyError && attempt < MAX_UPDATE_ATTEMPTS) {
                    continue;
                }

                throw error;
            }

            return {
                reportId: command.reportId,
                status: "COMPLETED",
                blobName: command.blobName
            };
        }

        throw new Error(`Unable to complete report ${command.reportId}`);
    }

    private validate(command: CompleteReportCommand): void {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.blobName?.trim()) {
            throw new Error("blobName is required");
        }

        if (!command.completedAt?.trim()) {
            throw new Error("completedAt is required");
        }
    }
}