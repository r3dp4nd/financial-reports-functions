export interface ReportOrchestrationInput {
    reportId: string;
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}

export interface ReportDataResult {
    orders: unknown[];
    payments: unknown[];
    customers: unknown[];
}

export interface GenerateExcelActivityInput {
    reportId: string;
    customerId: string;
    data: ReportDataResult;
}

export interface GenerateExcelActivityResult {
    reportId: string;
    blobName: string;
}