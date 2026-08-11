import {ContainerClient} from "@azure/storage-blob";

import {BlobReportStorage} from "./blob-report.storage";

describe("BlobReportStorage", () => {

    let container: jest.Mocked<ContainerClient>;
    let getBlockBlobClient: jest.Mock;
    let uploadData: jest.Mock;
    let storage: BlobReportStorage;

    beforeEach(() => {

        uploadData = jest.fn();
        getBlockBlobClient = jest.fn(() => ({
            uploadData
        }));
        container = {
            getBlockBlobClient
        } as unknown as jest.Mocked<ContainerClient>;

        storage = new BlobReportStorage(container);
    });

    it("should store report using deterministic blob name", async () => {

        const content = new Uint8Array([1, 2, 3]);

        const result = await storage.save({
            reportId: "REP-100",
            content,
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        expect(getBlockBlobClient).toHaveBeenCalledWith("REP-100/financial-report.xlsx");

        expect(uploadData).toHaveBeenCalledWith(Buffer.from(content), {
            blobHTTPHeaders: {
                blobContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });

        expect(result).toEqual({
            blobName: "REP-100/financial-report.xlsx"
        });
    });

    it("should propagate Blob Storage errors", async () => {

        uploadData.mockRejectedValue(new Error("Blob unavailable"));

        await expect(storage.save({
            reportId: "REP-100",
            content: new Uint8Array([1]),
            contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })).rejects.toThrow("Blob unavailable");
    });
});