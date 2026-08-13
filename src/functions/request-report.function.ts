import {CosmosReportRepository} from "../RequestReport/infrastructure/persistence/cosmos-report.repository";
import {reportsContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";
import {RequestReportUseCase} from "../RequestReport/application/request-report.use-case";
import {createRequestReportHandler} from "../RequestReport/handler";
import {app} from "@azure/functions";

const reportRepository = new CosmosReportRepository(reportsContainer);

const requestReportUseCase = new RequestReportUseCase(reportRepository);

const handler = createRequestReportHandler({
  useCase: requestReportUseCase, now: () => new Date().toISOString()
});

app.http("RequestReport", {
  methods: ["POST"],
  route: "reports",
  authLevel: "function",
  handler
});
