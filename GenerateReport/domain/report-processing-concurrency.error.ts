export class ReportProcessingConcurrencyError extends Error {

    constructor(reportId: string) {
        super(`Concurrent processing update detected for report ${reportId}`);
        this.name = "ReportProcessingConcurrencyError";
    }
}