import {AzureFunction, Context} from "@azure/functions";

import {CompleteReportUseCase} from "./application/complete-report.use-case";
import {ReportGeneratedMessage} from "./report-generated.message.types";

export interface CompleteReportHandlerDependencies {
    useCase: CompleteReportUseCase;
    now: () => string;
}

export function createCompleteReportHandler(dependencies: CompleteReportHandlerDependencies): AzureFunction {

    return async function (context: Context, message: ReportGeneratedMessage): Promise<void> {

        const result = await dependencies
            .useCase
            .execute({
                reportId: message.reportId,
                blobName: message.blobName,
                completedAt: dependencies.now()
            });

        context.log("Report completed", {
            reportId: result.reportId,
            status: result.status
        });
    };
}