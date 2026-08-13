import {markReportFailed} from "./report-failure";

describe("markReportFailed", () => {

    it("should transition PROCESSING to FAILED", () => {

        const result = markReportFailed({
            reportId: "REP-100",
            status: "PROCESSING"
        }, "2026-08-12T00:30:00.000Z", "REPORT_GENERATION_FAILED", "Cosmos unavailable");

        expect(result).toEqual({
            reportId: "REP-100",
            status: "FAILED",
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable"
        });
    });

    it("should allow REQUESTED to FAILED", () => {

        const result = markReportFailed({
            reportId: "REP-100",
            status: "REQUESTED"
        }, "2026-08-12T00:30:00.000Z", "REPORT_GENERATION_FAILED", "Unable to start processing");

        expect(result.status).toBe("FAILED");
    });

    it("should be idempotent when already failed", () => {

        const current = {
            reportId: "REP-100",
            status: "FAILED" as const,
            failedAt: "2026-08-12T00:30:00.000Z",
            failureCode: "REPORT_GENERATION_FAILED",
            failureReason: "Cosmos unavailable"
        };

        const result = markReportFailed(current, "2026-08-12T00:35:00.000Z", "OTHER_ERROR", "Other failure");

        expect(result).toBe(current);
    });

    it("should reject GENERATED to FAILED", () => {

        expect(() => markReportFailed({
            reportId: "REP-100",
            status: "GENERATED"
        }, "2026-08-12T00:30:00.000Z", "REPORT_GENERATION_FAILED", "Unexpected error")).toThrow("Cannot fail report from status GENERATED");
    });

    it("should reject COMPLETED to FAILED", () => {

        expect(() => markReportFailed({
            reportId: "REP-100",
            status: "COMPLETED"
        }, "2026-08-12T00:30:00.000Z", "REPORT_GENERATION_FAILED", "Unexpected error")).toThrow("Cannot fail report from status COMPLETED");
    });

    it("should require failure information", () => {

        expect(() => markReportFailed({
            reportId: "REP-100",
            status: "PROCESSING"
        }, "", "REPORT_GENERATION_FAILED", "Failure")).toThrow("failedAt is required");

        expect(() => markReportFailed({
            reportId: "REP-100",
            status: "PROCESSING"
        }, "2026-08-12T00:30:00.000Z", "", "Failure")).toThrow("failureCode is required");

        expect(() => markReportFailed({
            reportId: "REP-100",
            status: "PROCESSING"
        }, "2026-08-12T00:30:00.000Z", "REPORT_GENERATION_FAILED", "")).toThrow("failureReason is required");
    });
});