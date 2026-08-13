import {ReportPeriod} from "./report-period";

describe("ReportPeriod", () => {

    it("should create valid period", () => {

        const period = ReportPeriod.create("2026-08-01", "2026-08-31");

        expect(period.from).toBe("2026-08-01");

        expect(period.to).toBe("2026-08-31");
    });

    it("should allow same start and end", () => {

        const period = ReportPeriod.create("2026-08-11", "2026-08-11");

        expect(period).toEqual({
            from: "2026-08-11",

            to: "2026-08-11"
        });
    });

    it("should reject empty from", () => {

        expect(() => ReportPeriod.create("", "2026-08-31")).toThrow("from is required");
    });

    it("should reject empty to", () => {

        expect(() => ReportPeriod.create("2026-08-01", "")).toThrow("to is required");
    });

    it("should reject invalid from", () => {

        expect(() => ReportPeriod.create("invalid", "2026-08-31")).toThrow("from is invalid");
    });

    it("should reject invalid to", () => {

        expect(() => ReportPeriod.create("2026-08-01", "invalid")).toThrow("to is invalid");
    });

    it("should reject reversed period", () => {

        expect(() => ReportPeriod.create("2026-08-31", "2026-08-01")).toThrow("from must be before or equal to to");
    });
});