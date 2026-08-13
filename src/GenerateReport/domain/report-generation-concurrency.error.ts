export class ReportGenerationConcurrencyError extends Error {

    constructor(reportId: string) {
        super(`Concurrent update detected for report ${reportId}`);

        this.name = "ReportGenerationConcurrencyError";
    }
}