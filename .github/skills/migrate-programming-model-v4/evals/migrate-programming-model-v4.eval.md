# Evals — Migrate Programming Model v4

## Objetivo

Validar que la migración cambie únicamente integración Azure necesaria.

## Caso 1 — Legacy preparada

Migra adapter y produce:

`status = MIGRATED`

## Caso 2 — Ya v4

Produce:

`status = NOT_APPLICABLE`

## Caso 3 — Modelo desconocido

Produce:

`status = REQUIRES_REVIEW`

## Caso 4 — Shared action pendiente

Produce:

`status = BLOCKED`

## Caso 5 — Function action

Preserva IDs `FN-*`.

No crea `REQ-*`.

## Caso 6 — Arquitectura

La verificación interna usa:

`architecturePreserved.status = PASS`

No:

`architecturePreserved.status = CONFIRMED`

## Caso 7 — Tests

Baseline posterior:

`status = PASS`

Una regresión no puede ocultarse modificando tests.

## Caso 8 — function.json

Solo trata el artefacto perteneciente a la Function.

## Caso 9 — Shared resources

No duplica repositories o clients.

## Caso 10 — Cambio funcional inesperado

Produce:

`REQUIRES_REVIEW`

## Caso 11 — Durable

No migra una Function perteneciente a workflow que requiere coordinación Durable independiente.

## Caso 12 — No build global

El build final permanece en verification.

## Criterio general

Debe diferenciar:

`MIGRATED`

de:

`PASS`

y de:

`CONFIRMED`.
