import {OutboxPublisher} from "./outbox.publisher";
import {OutboxRepository} from "./outbox.repository";

const MAX_ATTEMPTS = 5;

export interface RetryOutboxResult {
  processed: number;
  published: number;
  pending: number;
  failed: number;
}

export class RetryOutboxUseCase {

  constructor(
    private readonly publisher: OutboxPublisher,
    private readonly repository: OutboxRepository,
    private readonly now: () => string
  ) {
  }

  async execute(): Promise<RetryOutboxResult> {

    const now = this.now();

    /*
     * Dejamos dos minutos al Change Feed para
     * resolver el fast path antes de considerar
     * el evento pendiente para reconciliación.
     */
    const occurredBefore = new Date(new Date(now).getTime() - 2 * 60 * 1000).toISOString();

    const documents = await this.repository.findPending(occurredBefore);

    let published = 0;
    let pending = 0;
    let failed = 0;

    for (const document of documents) {

      try {

        await this.publisher.publish(document);

        await this.repository.markPublished(document.reportId, document.id, now);

        published++;

      } catch (error: unknown) {

        const attemptCount = (document.attemptCount ?? 0) + 1;
        const exhausted = attemptCount >= MAX_ATTEMPTS;
        const lastError = error instanceof Error ? error.message : "Unknown outbox publication failure";

        await this.repository.recordFailure({
          reportId: document.reportId,
          eventId: document.id,
          attemptCount,
          lastAttemptAt: now,
          lastError,
          status: exhausted ? "FAILED" : "PENDING"
        });

        if (exhausted) {
          failed++;
        } else {
          pending++;
        }
      }
    }

    return {
      processed: documents.length,
      published,
      pending,
      failed
    };
  }
}
