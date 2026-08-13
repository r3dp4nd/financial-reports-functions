import * as df from "durable-functions";
import {reportOrchestratorWorkflow} from "../ReportOrchestrator/report-orchestrator.workflow";


df.app.orchestration("ReportOrchestrator", reportOrchestratorWorkflow);
