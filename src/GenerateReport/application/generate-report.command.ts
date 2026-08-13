export interface GenerateReportCommand {
    reportId: string;
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}