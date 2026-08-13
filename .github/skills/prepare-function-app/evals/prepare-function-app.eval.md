# Evals — Prepare Function App

## Objetivo

Validar preparación global, ownership de acciones y semántica correcta de estados.

## Caso 1 — Preparación global completa

Debe ejecutar únicamente acciones:

- `GLOBAL-*`;
- `SR-ACTION-*` aplicables.

Resultado:

`status = COMPLETED`

## Caso 2 — Acción independiente pendiente

Si parte del trabajo puede continuar:

`status = PARTIAL`

No usar `BLOCKED` innecesariamente.

## Caso 3 — Impedimento técnico

Dependencia necesaria no puede instalarse.

Resultado:

`status = BLOCKED`

## Caso 4 — Decisión humana

Cambio global excede el alcance aprobado.

Resultado:

`status = REQUIRES_REVIEW`

## Caso 5 — Evidencia interna

Un recurso confirmado debe usar:

`evidenceStatus = CONFIRMED`

No:

`status = CONFIRMED`

## Caso 6 — Validación

Una validación exitosa usa:

`status = PASS`

No:

`evidenceStatus = PASS`

## Caso 7 — Arquitectura

Puede crear `src/functions/`.

No debe crear todas las capas por anticipado.

## Caso 8 — Shared resource

Un `SR-ACTION-*` debe ejecutarse una sola vez.

## Caso 9 — Ownership funcional

Un resource con ownership `CAPABILITY` que requiere conocimiento funcional debe delegarse.

## Caso 10 — No build global como gate

Un estado intermedio mixto no debe bloquear automáticamente preparation global.

## Caso 11 — Catálogo

No modifica BEFORE.

## Caso 12 — Seguridad

No lee configuración sensible ni pipelines.

## Criterio general

Debe separar:

`acción planificada → ejecución → validación`

sin mezclar estados de evidencia.
