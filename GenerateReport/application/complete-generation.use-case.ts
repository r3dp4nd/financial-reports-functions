import {ReportGenerationRepository} from "../domain/report-generation.repository";
import {ReportGenerationConcurrencyError} from "../domain/report-generation-concurrency.error";
import {markReportGenerated} from "../domain/report-generation";
import {ReportGeneratedEventPublisher} from "./report-generated-event.publisher";
import {CompleteGenerationCommand} from "./complete-generation.command";
import {CompleteGenerationResult} from "./complete-generation.result";

const MAX_UPDATE_ATTEMPTS = 2;

export class CompleteGenerationUseCase {

    constructor(private readonly repository: ReportGenerationRepository, private readonly eventPublisher: ReportGeneratedEventPublisher) {
    }

    async execute(command: CompleteGenerationCommand): Promise<CompleteGenerationResult> {

        this.validate(command);

        for (let attempt = 1; attempt <= MAX_UPDATE_ATTEMPTS; attempt++) {

            const snapshot = await this.repository
                .findById(command.reportId);

            if (!snapshot) {
                throw new Error(`Report ${command.reportId} was not found`);
            }

            const nextState = markReportGenerated(snapshot.state, command.blobName, command.generatedAt);

            const alreadyGenerated = nextState === snapshot.state;

            if (!alreadyGenerated) {

                try {

                    await this.repository
                        .updateGenerated({
                            reportId: command.reportId,
                            blobName: command.blobName,
                            generatedAt: command.generatedAt,
                            expectedVersion: snapshot.version
                        });

                } catch (error: unknown) {

                    if (error instanceof ReportGenerationConcurrencyError && attempt < MAX_UPDATE_ATTEMPTS) {
                        continue;
                    }

                    throw error;
                }
            }

            await this.publishEvent(command);

            return {
                reportId: command.reportId,
                status: "GENERATED",
                blobName: command.blobName
            };
        }

        throw new Error(`Unable to complete report ${command.reportId}`);
    }

    private async publishEvent(command: CompleteGenerationCommand): Promise<void> {

        await this.eventPublisher
            .publish({
                eventId: `${command.reportId}:ReportGenerated`,
                occurredAt: command.generatedAt,
                reportId: command.reportId,
                blobName: command.blobName
            });
    }

    private validate(command: CompleteGenerationCommand): void {

        if (!command.reportId?.trim()) {
            throw new Error("reportId is required");
        }

        if (!command.blobName?.trim()) {
            throw new Error("blobName is required");
        }

        if (!command.generatedAt?.trim()) {
            throw new Error("generatedAt is required");
        }
    }
}