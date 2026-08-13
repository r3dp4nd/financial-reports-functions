export interface RequestReportCommand {
  idempotencyKey: string;
  customerId: string;
  from: string;
  to: string;
  requestedAt: string;
}
