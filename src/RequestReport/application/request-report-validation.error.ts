export class RequestReportValidationError extends Error {

    constructor(message: string) {
        super(message);

        this.name = "RequestReportValidationError";
    }
}