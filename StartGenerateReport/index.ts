import {AzureFunction, Context} from "@azure/functions";
import * as df from "durable-functions";
import {DurableOrchestrationClient} from "durable-functions/lib/src/durableorchestrationclient";

import {GenerateReportCommand} from "../GenerateReport/application/generate-report.command";
import {ReportRequestedMessage} from "./report-requested.message";

const ORCHESTRATOR_NAME = "ReportOrchestrator";

const startGenerateReport: AzureFunction = async function (context: Context, message: ReportRequestedMessage): Promise<void> {

    if (!message?.reportId?.trim()) {
        throw new Error("reportId is required");
    }

    if (!message.customerId?.trim()) {
        throw new Error("customerId is required");
    }

    const command: GenerateReportCommand = {
        reportId: message.reportId,
        customerId: message.customerId,
        period: {
            from: message.period.from,
            to: message.period.to
        }
    };

    const client: DurableOrchestrationClient = df.getClient(context);

    const instanceId: string = await client.startNew(ORCHESTRATOR_NAME, message.reportId, command);

    context.log("Report generation orchestration started", {
        reportId: message.reportId,
        instanceId
    });
};

export default startGenerateReport;