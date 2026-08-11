export interface CosmosConfig {
    endpoint: string;
    key: string;
    databaseName: string;
    reportsContainerName: string;
}

export function getCosmosConfig(): CosmosConfig {

    const endpoint: string | undefined = process.env.COSMOS_ENDPOINT;

    const key: string | undefined = process.env.COSMOS_KEY;

    const databaseName: string | undefined = process.env.COSMOS_DATABASE;

    const reportsContainerName: string | undefined = process.env.COSMOS_REPORTS_CONTAINER;

    if (!endpoint) {
        throw new Error("COSMOS_ENDPOINT is required");
    }

    if (!key) {
        throw new Error("COSMOS_KEY is required");
    }

    if (!databaseName) {
        throw new Error("COSMOS_DATABASE is required");
    }

    if (!reportsContainerName) {
        throw new Error("COSMOS_REPORTS_CONTAINER is required");
    }

    try {
        new URL(endpoint);
    } catch {
        throw new Error("COSMOS_ENDPOINT must be a valid URL");
    }

    return {
        endpoint,
        key,
        databaseName,
        reportsContainerName
    };
}