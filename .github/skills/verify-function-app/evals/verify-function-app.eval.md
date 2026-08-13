# Evals — Verify Function App

## Objetivo

Validar el gate final y la semántica consistente de estados.

## Caso 1 — Todo correcto

Todos los gates obligatorios:

`PASS`

Resultado:

`status = VERIFIED`

## Caso 2 — Correcto con deuda

Gates obligatorios:

`PASS`

Existe solo deuda no bloqueante.

Resultado:

`status = VERIFIED_WITH_DEBT`

## Caso 3 — Build falla

`build.status = FAIL`

Resultado:

`status = BLOCKED`

## Caso 4 — Tests fallan

`tests.status = FAIL`

Resultado:

`status = BLOCKED`

## Caso 5 — Function faltante

Resultado final:

`BLOCKED`

## Caso 6 — Unknown no resoluble automáticamente

Si requiere decisión humana:

`REQUIRES_REVIEW`

## Caso 7 — Host sin configuración aprobada

`host.status = NOT_EXECUTED`

Debe registrar razón.

No debe leer `local.settings.json`.

## Caso 8 — Host no necesario

`host.status = NOT_APPLICABLE`

cuando realmente no forma parte del criterio.

## Caso 9 — Evidencia de Function

Debe usar:

`evidenceStatus = CONFIRMED`

No `status = CONFIRMED`.

## Caso 10 — Legacy scan

Debe usar:

`classification = TECHNICAL_DEBT`

o clasificación correspondiente.

No reutilizar `status` para clasificaciones.

## Caso 11 — Arquitectura

`architecture.status = PASS`

si satisface obligaciones reales del plan.

## Caso 12 — Carpetas opcionales

No falla por ausencia de:

- domain;
- application;
- infrastructure;

si el plan no las requería.

## Caso 13 — Shared resource único

Ownership y consumidores correctos:

check satisfactorio.

## Caso 14 — Shared duplicate bloqueante

Si altera consistencia o ownership requerido:

clasificación bloqueante y resultado final `BLOCKED`.

## Caso 15 — Shared duplicate menor

Puede clasificarse como deuda si no compromete gates.

## Caso 16 — Node target no utilizado

Si Node.js 24 era gate y build/tests se ejecutaron con otro runtime:

no emitir `VERIFIED`.

## Caso 17 — Durable incompleto

Resultado:

`BLOCKED`

## Caso 18 — Active instances inciertas

No afirmar compatibilidad productiva.

Puede requerir `REQUIRES_REVIEW`.

## Caso 19 — Packaging

Check usa:

`PASS | FAIL | NOT_EXECUTED | NOT_APPLICABLE`

## Caso 20 — BEFORE preservado

No modifica catálogo histórico.

## Caso 21 — Optimización pendiente

No bloquea por sí sola.

## Criterio general

Debe respetar:

`evidenceStatus ≠ check.status ≠ final status ≠ classification`
