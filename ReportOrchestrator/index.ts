import * as df from "durable-functions";

import {reportOrchestratorWorkflow} from "./report-orchestrator.workflow";

const reportOrchestrator = df.orchestrator(reportOrchestratorWorkflow);

export default reportOrchestrator;