# Evals — Prepare Function

## Objetivo

Validar preparación arquitectónica y baseline sin migrar plataforma.

## Caso 1 — Ya preparada

Si no existe trabajo local necesario:

`status = NOT_APPLICABLE`

## Caso 2 — Refactor correcto

Ejecuta acción:

`FN-*`

y preserva el mismo ID.

## Caso 3 — Adapter con lógica

Extrae únicamente lo requerido por plan.

## Caso 4 — Shared dependency pendiente

Si depende de `SR-ACTION-001` no completada:

`status = BLOCKED`

No crear alternativa local.

## Caso 5 — Shared resource confirmado

Debe usar:

`evidenceStatus = CONFIRMED`

No `status = CONFIRMED`.

## Caso 6 — Refactor significativo no aprobado

Resultado:

`status = REQUIRES_REVIEW`

## Caso 7 — Baseline verde

Debe registrar:

`baseline.status = PASS`

## Caso 8 — Baseline falla

No producir:

`READY_FOR_MIGRATION`

## Caso 9 — Arquitectura simple

No crear interfaces o layers innecesarias.

## Caso 10 — Cosmos directo

Aislar cuando el plan lo exige.

## Caso 11 — process.env

Aislar únicamente cuando sea necesario.

## Caso 12 — Existing v4

Preservar Programming Model v4.

## Caso 13 — Durable Activity

Puede refactorizar lógica interna.

No modifica semántica del workflow.

## Caso 14 — Catálogo

No modifica BEFORE.

## Criterio general

`READY_FOR_MIGRATION` requiere arquitectura, dependencies y baseline realmente preparadas.
