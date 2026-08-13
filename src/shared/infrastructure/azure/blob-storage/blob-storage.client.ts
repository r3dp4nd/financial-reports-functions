import {BlobServiceClient, ContainerClient} from "@azure/storage-blob";

import {BlobStorageConfig, getBlobStorageConfig} from "../config/blob-storage.config";

const config: BlobStorageConfig = getBlobStorageConfig();

export const blobServiceClient: BlobServiceClient = BlobServiceClient.fromConnectionString(config.connectionString);

export const reportsBlobContainer: ContainerClient = blobServiceClient.getContainerClient(config.reportsContainerName);