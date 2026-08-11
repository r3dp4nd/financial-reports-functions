export interface RequestReportHttpRequest {
    customerId: string;
    from: string;
    to: string;
}

export interface RequestReportHttpResponse {
    reportId: string;
    status: "REQUESTED";
}