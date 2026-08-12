import {ReportProcessingRepository} from "../domain/report-processing.repository";
import {ReportProcessingConcurrencyError} from "../domain/report-processing-concurrency.error";
import {markReportProcessing} from "../domain/report-processing";
import {MarkReportProcessingCommand} from "./mark-report-processing.command";
import {MarkReportProcessingResult} from "./mark-report-processing.result";

const MAX_UPDATE_ATTEMPTS = 2;

export class MarkReportProcessingUseCase {

    constructor(private readonly repository: ReportProcessingRepository) {
    }

    async execute(command: MarkReportProcessingCommand): Promise<MarkReportProcessingResult> {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.processingAt?.trim()) {
            throw new Error("processingAt is required");
        }

        for (let attempt = 1; attempt <= MAX_UPDATE_ATTEMPTS; attempt++) {

            const snapshot = await this.repository
                .findById(command.reportId);

            if (!snapshot) {
                throw new Error(`Report ${command.reportId} was not found`);
            }

            const nextState = markReportProcessing(snapshot.state, command.processingAt);

            const alreadyProcessing = nextState === snapshot.state;

            if (alreadyProcessing) {

                return {
                    reportId: command.reportId,
                    status: "PROCESSING"
                };
            }

            try {

                await this.repository
                    .markProcessing({
                        reportId: command.reportId,
                        processingAt: command.processingAt,
                        expectedVersion: snapshot.version
                    });

            } catch (error: unknown) {

                if (error instanceof ReportProcessingConcurrencyError && attempt < MAX_UPDATE_ATTEMPTS) {
                    continue;
                }

                throw error;
            }

            return {
                reportId: command.reportId,
                status: "PROCESSING"
            };
        }

        throw new Error(`Unable to mark report ${command.reportId} as processing`);
    }
}