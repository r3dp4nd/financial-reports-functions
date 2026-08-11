import {Container, CosmosClient, Database} from "@azure/cosmos";

import {CosmosConfig, getCosmosConfig} from "../config/cosmos.config";

const config: CosmosConfig = getCosmosConfig();

export const cosmosClient = new CosmosClient({
    endpoint: config.endpoint,
    key: config.key
});

const database: Database = cosmosClient.database(config.databaseName);

export const reportsContainer: Container = database.container(config.reportsContainerName);
export const ordersContainer: Container = database.container(config.ordersContainerName);