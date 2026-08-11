import {Report} from "../../Report/domain/report";

export interface ReportRepository {

    save(report: Report): Promise<void>;

}