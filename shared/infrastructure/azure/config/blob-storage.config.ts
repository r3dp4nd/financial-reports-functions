export interface BlobStorageConfig {
    connectionString: string;
    reportsContainerName: string;
}

export function getBlobStorageConfig(): BlobStorageConfig {

    const connectionString: string | undefined = process.env.STORAGE_CONNECTION;
    const reportsContainerName: string | undefined = process.env.STORAGE_REPORTS_CONTAINER;

    if (!connectionString) {
        throw new Error("STORAGE_CONNECTION is required");
    }

    if (!reportsContainerName) {
        throw new Error("STORAGE_REPORTS_CONTAINER is required");
    }

    return {
        connectionString,
        reportsContainerName
    };
}