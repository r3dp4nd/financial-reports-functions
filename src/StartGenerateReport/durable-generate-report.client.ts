import {DurableClient} from "durable-functions";

import {ReportRequestedMessage, StartGenerateReportClient} from "./handler";

const ORCHESTRATOR_NAME = "ReportOrchestrator";

export class DurableGenerateReportClient implements StartGenerateReportClient {

  constructor(private readonly client: DurableClient) {
  }

  async start(reportId: string, input: ReportRequestedMessage): Promise<string> {

    return this.client
      .startNew(ORCHESTRATOR_NAME, {
        instanceId: reportId,
        input: {
          reportId: input.reportId,
          customerId: input.customerId,
          period: input.period
        }
      });
  }
}
