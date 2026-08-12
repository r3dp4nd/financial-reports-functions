import {BulkOperationType, Container} from "@azure/cosmos";

import {ReportPeriod} from "../../../Report/domain/report-period";
import {CosmosReportRepository} from "./cosmos-report.repository";

describe("CosmosReportRepository", () => {

    let container: jest.Mocked<Container>;
    let batch: jest.Mock;
    let repository: CosmosReportRepository;

    beforeEach(() => {

        batch = jest.fn();

        container = {
            items: {
                batch
            }
        } as unknown as jest.Mocked<Container>;

        repository = new CosmosReportRepository(container);
    });

    it("should atomically save report and outbox event", async () => {

        batch.mockResolvedValue({
            result: [{
                statusCode: 201
            }, {
                statusCode: 201
            }]
        });

        const period = ReportPeriod.create("2026-08-01", "2026-08-31");

        await repository
            .saveRequested({
                reportId: "REP-100",
                customerId: "CUS-100",
                period,
                status: "REQUESTED",
                requestedAt: "2026-08-11T20:00:00.000Z"
            }, {
                eventId: "REP-100:ReportRequested",
                occurredAt: "2026-08-11T20:00:00.000Z",
                reportId: "REP-100",
                customerId: "CUS-100",
                period: {
                    from: "2026-08-01",
                    to: "2026-08-31"
                }
            });

        expect(batch).toHaveBeenCalledTimes(1);

        const [operations, partitionKey] = batch.mock.calls[0];

        expect(partitionKey).toBe("REP-100");

        expect(operations).toEqual([{
            operationType: BulkOperationType.Create,
            resourceBody: {
                id: "REP-100",
                reportId: "REP-100",
                docType: "REPORT",
                customerId: "CUS-100",
                period: {
                    from: "2026-08-01",
                    to: "2026-08-31"
                },
                status: "REQUESTED",
                requestedAt: "2026-08-11T20:00:00.000Z",
                processingAt: undefined,
                blobName: undefined,
                generatedAt: undefined,
                completedAt: undefined,
                failedAt: undefined,
                failureCode: undefined,
                failureReason: undefined
            }
        }, {
            operationType: BulkOperationType.Create,
            resourceBody: {
                id: "REP-100:ReportRequested",
                reportId: "REP-100",
                docType: "OUTBOX",
                eventType: "ReportRequested",
                eventVersion: 1,
                occurredAt: "2026-08-11T20:00:00.000Z",
                status: "PENDING",
                payload: {
                    eventId: "REP-100:ReportRequested",
                    occurredAt: "2026-08-11T20:00:00.000Z",
                    reportId: "REP-100",
                    customerId: "CUS-100",
                    period: {
                        from: "2026-08-01",
                        to: "2026-08-31"
                    }
                }
            }
        }]);
    });

    it("should fail when transactional batch fails", async () => {

        batch.mockResolvedValue({
            result: [{
                statusCode: 409
            }, {
                statusCode: 424
            }]
        });

        await expect(repository.saveRequested({
            reportId: "REP-100",
            customerId: "CUS-100",
            period: ReportPeriod.create("2026-08-01", "2026-08-31"),
            status: "REQUESTED",
            requestedAt: "2026-08-11T20:00:00.000Z"
        }, {
            eventId: "REP-100:ReportRequested",
            occurredAt: "2026-08-11T20:00:00.000Z",
            reportId: "REP-100",
            customerId: "CUS-100",
            period: {
                from: "2026-08-01",
                to: "2026-08-31"
            }
        })).rejects.toThrow("Request report transaction failed");
    });
});