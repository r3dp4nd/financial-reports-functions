import {ReportGenerationSnapshot} from "./report-generation.types";
import {ReportGeneratedIntegrationEvent} from "../application/report-generated.integration-event";

export interface CompleteGeneratedReport {
  reportId: string;
  blobName: string;
  generatedAt: string;
  expectedVersion: string;

  event: ReportGeneratedIntegrationEvent;
}

export interface ReportGenerationRepository {

  findById(
    reportId: string
  ): Promise<ReportGenerationSnapshot | null>;
  
  completeGeneration(
    input: CompleteGeneratedReport
  ): Promise<void>;
}
