export class ReportCompletionConcurrencyError extends Error {

    constructor(reportId: string) {

        super(`Concurrent completion detected for report ${reportId}`);
        this.name = "ReportCompletionConcurrencyError";
    }
}