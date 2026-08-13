export class ReportPeriod {

    private constructor(public readonly from: string, public readonly to: string) {
    }

    static create(from: string, to: string): ReportPeriod {

        if (!from?.trim()) {
            throw new Error("from is required");
        }

        if (!to?.trim()) {
            throw new Error("to is required");
        }

        const fromDate = new Date(from);

        const toDate = new Date(to);

        if (Number.isNaN(fromDate.getTime())) {
            throw new Error("from is invalid");
        }

        if (Number.isNaN(toDate.getTime())) {
            throw new Error("to is invalid");
        }

        if (fromDate > toDate) {
            throw new Error("from must be before or equal to to");
        }

        return new ReportPeriod(from, to);
    }
}