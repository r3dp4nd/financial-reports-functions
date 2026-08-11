export interface StoreReportInput {
    reportId: string;
    content: Uint8Array;
    contentType: string;
}

export interface StoredReport {
    blobName: string;
}

export interface ReportStorage {

    save(
        input: StoreReportInput
    ): Promise<StoredReport>;
}