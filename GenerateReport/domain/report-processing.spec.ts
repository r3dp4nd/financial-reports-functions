import {markReportProcessing} from "./report-processing";

describe("markReportProcessing", () => {

    it("should transition REQUESTED to PROCESSING", () => {

        const result = markReportProcessing({
            reportId: "REP-100",
            status: "REQUESTED"
        }, "2026-08-11T20:30:00.000Z");

        expect(result).toEqual({
            reportId: "REP-100",
            status: "PROCESSING",
            processingAt: "2026-08-11T20:30:00.000Z"
        });
    });

    it("should be idempotent when already processing", () => {

        const current = {
            reportId: "REP-100",
            status: "PROCESSING" as const,
            processingAt: "2026-08-11T20:30:00.000Z"
        };

        const result = markReportProcessing(current, "2026-08-11T20:35:00.000Z");

        expect(result).toBe(current);
    });

    it("should reject invalid transition", () => {

        expect(() => markReportProcessing({
            reportId: "REP-100",
            status: "GENERATED"
        }, "2026-08-11T20:30:00.000Z")).toThrow("Cannot process report from status GENERATED");
    });

    it("should reject missing processingAt", () => {

        expect(() => markReportProcessing({
            reportId: "REP-100",
            status: "REQUESTED"
        }, "")).toThrow("processingAt is required");
    });
});