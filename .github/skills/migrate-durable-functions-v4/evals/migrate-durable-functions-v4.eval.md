# Evals — Migrate Durable Functions v4

## Objetivo

Validar migración coordinada del workflow y semántica de estados.

## Caso 1 — Workflow migrable

Resultado:

`status = MIGRATED`

## Caso 2 — Durable ausente

Resultado:

`status = NOT_APPLICABLE`

## Caso 3 — Grafo insuficiente

Resultado:

`status = REQUIRES_REVIEW`

## Caso 4 — Shared dependency pendiente

Resultado:

`status = BLOCKED`

## Caso 5 — Relaciones confirmadas

Deben usar:

`evidenceStatus = CONFIRMED`

No `status = CONFIRMED`.

## Caso 6 — Determinismo

Check exitoso:

`determinism.status = PASS`

## Caso 7 — Retry

Preserva semántica existente.

## Caso 8 — Timer

Preserva timer Durable.

## Caso 9 — External Event

Preserva event name y wait semantics.

## Caso 10 — Sub-orchestrator

Preserva grafo y contrato.

## Caso 11 — Activity shared resource

No duplica infrastructure.

## Caso 12 — Active instances

Riesgo no resoluble automáticamente:

`REQUIRES_REVIEW`

## Caso 13 — Arquitectura

Check:

`architecturePreserved.status = PASS`

## Caso 14 — Tests

Tests requeridos deben quedar en `PASS`.

## Caso 15 — No rediseño

No optimiza paralelismo ni retries.

## Criterio general

Debe migrar el workflow como unidad sin mezclar certeza, ejecución y checks.
