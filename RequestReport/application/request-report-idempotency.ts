import {createHash} from "crypto";

export interface RequestReportIdentity {
  reportId: string;
  idempotencyKeyHash: string;
  requestHash: string;
}

export interface RequestReportIdentityInput {
  idempotencyKey: string;
  customerId: string;
  from: string;
  to: string;
}

export function createRequestReportIdentity(input: RequestReportIdentityInput): RequestReportIdentity {

  const idempotencyKeyHash = sha256(input.idempotencyKey.trim());

  const canonicalRequest = JSON.stringify({
    customerId: input.customerId.trim(),
    from: input.from.trim(),
    to: input.to.trim()
  });

  const requestHash = sha256(canonicalRequest);

  return {
    reportId: `REP-${idempotencyKeyHash}`,
    idempotencyKeyHash,
    requestHash
  };
}

function sha256(value: string): string {

  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}
