import {ContainerClient} from "@azure/storage-blob";

import {ReportStorage, StoredReport, StoreReportInput} from "../../domain/report.storage";

export class BlobReportStorage implements ReportStorage {

    constructor(private readonly container: ContainerClient) {
    }

    async save(input: StoreReportInput): Promise<StoredReport> {

        const blobName = `${input.reportId}/financial-report.xlsx`;

        const blockBlobClient = this.container.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(Buffer.from(input.content), {
            blobHTTPHeaders: {
                blobContentType: input.contentType
            }
        });

        return {
            blobName
        };
    }
}