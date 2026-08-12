import {AzureFunction} from "@azure/functions";
import {randomUUID} from "node:crypto";

import {CosmosReportRepository} from "./infrastructure/persistence/cosmos-report.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {RequestReportUseCase} from "./application/request-report.use-case";
import {createRequestReportHandler} from "./handler";

const reportRepository = new CosmosReportRepository(reportsContainer);

const requestReportUseCase = new RequestReportUseCase(reportRepository);

const requestReport: AzureFunction = createRequestReportHandler({
    useCase:
    requestReportUseCase,
    generateReportId:
    randomUUID,
    now: () => new Date().toISOString()
});

export default requestReport;