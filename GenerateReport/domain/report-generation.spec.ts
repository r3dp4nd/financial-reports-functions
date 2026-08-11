import {markReportGenerated} from "./report-generation";

describe("markReportGenerated", () => {

    it("should transition REQUESTED to GENERATED", () => {

        const result = markReportGenerated({
            reportId: "REP-100",
            status: "REQUESTED"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:00:00.000Z");

        expect(result).toEqual({
            reportId: "REP-100",
            status: "GENERATED",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        });
    });

    it("should allow PROCESSING to GENERATED", () => {

        const result = markReportGenerated({
            reportId: "REP-100",
            status: "PROCESSING"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:00:00.000Z");

        expect(result.status).toBe("GENERATED");
    });

    it("should be idempotent when already generated", () => {

        const current = {
            reportId: "REP-100",
            status: "GENERATED" as const,
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        };

        const result = markReportGenerated(current, "REP-100/financial-report.xlsx", "2026-08-11T20:05:00.000Z");

        expect(result).toBe(current);
    });

    it("should reject different blob when already generated", () => {

        expect(() => markReportGenerated({
            reportId: "REP-100",
            status: "GENERATED",
            blobName: "REP-100/financial-report.xlsx"
        }, "REP-100/other.xlsx", "2026-08-11T20:00:00.000Z")).toThrow("Report is already generated with a different blob");
    });

    it("should reject invalid transition", () => {

        expect(() => markReportGenerated({
            reportId: "REP-100",
            status: "COMPLETED"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:00:00.000Z")).toThrow("Cannot generate report from status COMPLETED");
    });
});