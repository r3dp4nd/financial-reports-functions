export class ReportFailureConcurrencyError extends Error {

    constructor(reportId: string) {
        super(`Concurrent failure update detected for report ${reportId}`);
        this.name = "ReportFailureConcurrencyError";
    }
}