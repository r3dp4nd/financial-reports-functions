import {ReportFailureState} from "./report-failure.types";

export function markReportFailed(current: ReportFailureState, failedAt: string, failureCode: string, failureReason: string): ReportFailureState {

    if (!failedAt?.trim()) {
        throw new Error("failedAt is required");
    }

    if (!failureCode?.trim()) {
        throw new Error("failureCode is required");
    }

    if (!failureReason?.trim()) {
        throw new Error("failureReason is required");
    }

    if (current.status === "FAILED") {
        return current;
    }

    if (current.status !== "REQUESTED" && current.status !== "PROCESSING") {
        throw new Error(`Cannot fail report from status ${current.status}`);
    }

    return {
        ...current,
        status: "FAILED",
        failedAt,
        failureCode,
        failureReason
    };
}