# Evals — Review Skill Performance

## Objetivo

Validar que el capability produzca propuestas basadas en evidencia y no convierta observaciones aisladas en complejidad
permanente.

## Caso 1 — Hallazgo aislado

### Entrada

Una única ejecución presenta un comportamiento extraño no reproducido.

### Esperado

Recurrence:

`ISOLATED`

La recomendación puede ser:

`MONITOR`

No crear una regla global automáticamente.

## Caso 2 — Fallo repetido

### Entrada

Varias ejecuciones muestran el mismo false negative.

### Esperado

Recurrence:

`REPEATED`

Debe evaluar una mejora concreta y su eval correspondiente.

## Caso 3 — Problema sistémico

### Entrada

Varios skills utilizan incorrectamente:

`status: CONFIRMED`

### Esperado

Finding:

`AMBIGUOUS_RULE`

o:

`SKILL_GAP`

según causa.

Recurrence:

`SYSTEMIC`

Debe referenciar `status-policy.md`.

## Caso 4 — ID antiguo

### Entrada

Un skill nuevo genera:

`REQ-REQUEST-001`

### Esperado

Debe detectar inconsistencia respecto de:

`FN-REQUESTREPORT-*`

No necesita modificar artefactos históricos ya cerrados.

## Caso 5 — PASS usado como evidencia

### Entrada

Artefacto contiene:

    {
      "evidenceStatus": "PASS"
    }

### Esperado

Debe detectar inconsistencia semántica.

`PASS` pertenece a checks.

## Caso 6 — CONFIRMED usado como estado principal

### Entrada

    {
      "status": "CONFIRMED"
    }

en un migration artifact.

### Esperado

Finding de contrato.

Debe indicar que el status válido pertenece a:

- `MIGRATED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

## Caso 7 — NOT_APPLICABLE vs NOT_REQUIRED

### Entrada

Assessment marca Programming Model v4 como:

`NOT_APPLICABLE`

### Esperado

Debe identificar que la decisión de cambio correcta es:

`actionStatus = NOT_REQUIRED`

## Caso 8 — UNKNOWN vs REQUIRES_VALIDATION

### Entrada

Una dimensión desconocida usa únicamente:

`actionStatus = UNKNOWN`

### Esperado

Debe detectar separación incorrecta.

Debe recomendar:

`evidenceStatus = UNKNOWN`

y cuando corresponda:

`actionStatus = REQUIRES_VALIDATION`

## Caso 9 — Responsibility leakage

### Entrada

Discovery genera plan de refactor.

### Esperado

Finding:

`SKILL_GAP`

o `OVERCONSTRAINT/AMBIGUOUS_RULE` según causa.

Debe señalar fuga de responsabilidad.

## Caso 10 — Shared action duplicada

### Entrada

Dos Function plans migran independientemente el mismo shared resource.

### Esperado

Finding de impacto al menos `HIGH` si puede producir implementaciones inconsistentes.

Debe recomendar una única:

`SR-ACTION-*`

## Caso 11 — Falsa consolidación

### Entrada

Dos repositories Cosmos distintos fueron fusionados por tecnología.

### Esperado

Finding:

`FALSE_POSITIVE`

Debe recomendar consolidación por identidad/ownership funcional, no tecnología.

## Caso 12 — Arquitectura accidental

### Entrada

Preparation crea:

- application;
- domain;
- infrastructure;
- ports;
- adapters;

vacíos.

### Esperado

Finding:

`OVERGENERALIZATION`

o `SIMPLIFICATION`.

Debe contrastar con `architecture-policy.md`.

## Caso 13 — Verification corrige código

### Entrada

Verification detecta un fallo y lo modifica.

### Esperado

Finding de responsibility leakage.

Verification solo verifica.

## Caso 14 — Missing eval

### Entrada

Un fallo real de seguridad no estaba cubierto por evals.

### Esperado

Finding:

`MISSING_EVAL`

Prioridad:

`P0` o `P1` según impacto.

## Caso 15 — Script gap

### Entrada

Un mismo chequeo determinista es repetido manualmente en varias ejecuciones.

### Esperado

Puede recomendar:

`SCRIPT_GAP`

sin implementar automáticamente el script.

## Caso 16 — Exceso de contexto

### Entrada

Un skill carga todos los analyses aunque solo trabaja sobre una Function.

### Esperado

Finding:

`EXCESS_CONTEXT`

Debe recomendar carga selectiva.

## Caso 17 — Propuesta compleja sin evidencia

### Entrada

Una única observación menor propone un nuevo skill, policy y workflow.

### Esperado

Recommendation:

`REJECT`

o:

`NEEDS_MORE_EVIDENCE`

## Caso 18 — VERIFIED con FAIL

### Entrada

Verification tiene:

    {
      "status": "VERIFIED",
      "build": {
        "status": "FAIL"
      }
    }

### Esperado

Debe detectar inconsistencia crítica.

## Caso 19 — Cambio justificado

### Entrada

Un false negative repetido y reproducible se resuelve con una regla pequeña y un eval.

### Esperado

Recommendation:

`RECOMMEND`

La propuesta debe preferir el cambio mínimo.

## Criterio general

El capability debe aprender de evidencia sin convertirse en un generador automático de reglas, archivos o complejidad.
