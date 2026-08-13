import {ReportProcessingState} from "./report-processing.types";

export function markReportProcessing(current: ReportProcessingState, processingAt: string): ReportProcessingState {

    if (!processingAt?.trim()) {
        throw new Error("processingAt is required");
    }

    if (current.status === "PROCESSING") {
        return current;
    }

    if (current.status !== "REQUESTED") {
        throw new Error(`Cannot process report from status ${current.status}`);
    }

    return {
        ...current,
        status: "PROCESSING",
        processingAt
    };
}