import {Report} from "./report.types";

export interface ReportRepository {

    save(report: Report): Promise<void>;

    findById(reportId: string): Promise<Report | null>;
}