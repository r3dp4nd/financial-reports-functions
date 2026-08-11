export interface ServiceBusConfig {
    connectionString: string;
    reportRequestsQueueName: string;
}

export function getServiceBusConfig(): ServiceBusConfig {

    const connectionString: string | undefined = process.env.SERVICE_BUS_CONNECTION;
    const reportRequestsQueueName: string | undefined = process.env.SERVICE_BUS_REPORT_REQUESTS_QUEUE;

    if (!connectionString) {
        throw new Error("SERVICE_BUS_CONNECTION is required");
    }

    if (!reportRequestsQueueName) {
        throw new Error("SERVICE_BUS_REPORT_REQUESTS_QUEUE is required");
    }

    return {
        connectionString,
        reportRequestsQueueName
    };
}