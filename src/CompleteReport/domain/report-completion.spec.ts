import {markReportCompleted} from "./report-completion";

describe("markReportCompleted", () => {

    it("should transition GENERATED to COMPLETED", () => {

        const result = markReportCompleted({
            reportId: "REP-100",
            status: "GENERATED",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:01:00.000Z");

        expect(result).toEqual({
            reportId: "REP-100",
            status: "COMPLETED",
            blobName: "REP-100/financial-report.xlsx",
            generatedAt: "2026-08-11T20:00:00.000Z",
            completedAt: "2026-08-11T20:01:00.000Z"
        });
    });

    it("should be idempotent when already completed", () => {

        const current = {
            reportId: "REP-100",
            status: "COMPLETED" as const,
            blobName: "REP-100/financial-report.xlsx",
            completedAt: "2026-08-11T20:01:00.000Z"
        };

        const result = markReportCompleted(current, "REP-100/financial-report.xlsx", "2026-08-11T20:05:00.000Z");

        expect(result).toBe(current);
    });

    it("should reject completion from REQUESTED", () => {

        expect(() => markReportCompleted({
            reportId: "REP-100",
            status: "REQUESTED"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:01:00.000Z")).toThrow("Cannot complete report from status REQUESTED");
    });

    it("should reject generated report without blob", () => {

        expect(() => markReportCompleted({
            reportId: "REP-100",
            status: "GENERATED"
        }, "REP-100/financial-report.xlsx", "2026-08-11T20:01:00.000Z")).toThrow("Generated report has no blobName");
    });

    it("should reject different event blob", () => {

        expect(() => markReportCompleted({
            reportId: "REP-100",
            status: "GENERATED",
            blobName: "REP-100/financial-report.xlsx"
        }, "REP-100/other.xlsx", "2026-08-11T20:01:00.000Z")).toThrow("Generated report blob does not match event blob");
    });
});