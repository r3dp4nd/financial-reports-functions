import {ReportGenerationState} from "./report-generation.types";

export function markReportGenerated(current: ReportGenerationState, blobName: string, generatedAt: string): ReportGenerationState {

    if (!blobName?.trim()) {
        throw new Error("blobName is required");
    }

    if (!generatedAt?.trim()) {
        throw new Error("generatedAt is required");
    }

    if (current.status === "GENERATED") {

        if (current.blobName !== blobName) {
            throw new Error("Report is already generated with a different blob");
        }

        return current;
    }

    if (current.status !== "REQUESTED" && current.status !== "PROCESSING") {
        throw new Error(`Cannot generate report from status ${current.status}`);
    }

    return {
        ...current, status: "GENERATED", blobName, generatedAt
    };
}