import {ReportCompletionState} from "./report-completion.types";

export function markReportCompleted(current: ReportCompletionState, blobName: string, completedAt: string): ReportCompletionState {

    if (!blobName?.trim()) {
        throw new Error("blobName is required");
    }

    if (!completedAt?.trim()) {
        throw new Error("completedAt is required");
    }

    if (current.status === "COMPLETED") {

        if (current.blobName !== blobName) {
            throw new Error("Report is already completed with a different blob");
        }

        return current;
    }

    if (current.status !== "GENERATED") {
        throw new Error(`Cannot complete report from status ${current.status}`);
    }

    if (!current.blobName) {
        throw new Error("Generated report has no blobName");
    }

    if (current.blobName !== blobName) {
        throw new Error("Generated report blob does not match event blob");
    }

    return {
        ...current,
        status: "COMPLETED",
        completedAt
    };
}