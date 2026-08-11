import {ServiceBusClient, ServiceBusSender} from "@azure/service-bus";

import {getServiceBusConfig, ServiceBusConfig} from "../config/service-bus.config";

const config: ServiceBusConfig = getServiceBusConfig();

export const serviceBusClient = new ServiceBusClient(config.connectionString);

export const reportRequestsSender: ServiceBusSender = serviceBusClient.createSender(config.reportRequestsQueueName);

export const reportGeneratedSender: ServiceBusSender = serviceBusClient.createSender(config.reportGeneratedQueueName);