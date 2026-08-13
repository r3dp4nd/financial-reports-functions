import {app, InvocationContext} from "@azure/functions";

import * as df from "durable-functions";

import {DurableGenerateReportClient} from "../StartGenerateReport/durable-generate-report.client";

import {createStartGenerateReportHandler} from "../StartGenerateReport/handler";

app.serviceBusQueue("StartGenerateReport", {
  queueName: "%SERVICE_BUS_REPORT_REQUESTS_QUEUE%",
  connection: "SERVICE_BUS_CONNECTION",
  extraInputs: [df.input.durableClient()],
  handler: async (message: unknown, context: InvocationContext): Promise<void> => {
    const durableClient = df.getClient(context);

    const client = new DurableGenerateReportClient(durableClient);

    const handler = createStartGenerateReportHandler({
      client
    });
    await handler(message, context);
  }
});
