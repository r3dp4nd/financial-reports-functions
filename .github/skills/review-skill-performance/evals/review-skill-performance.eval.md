# Evals — Review Skill Performance

## Objetivo

Validar que el capability aprenda de evidencia real sin:

- autoeditar el toolkit;
- promover conocimiento sin aprobación;
- convertir experiencias aisladas en reglas universales.

## Caso 1 — Hallazgo aislado

### Entrada

Una única ejecución presenta comportamiento extraño.

### Esperado

Recurrence:

`ISOLATED`

Recommendation puede ser:

`MONITOR`

No crear regla global automáticamente.

## Caso 2 — Fallo repetido

### Entrada

Varias ejecuciones muestran el mismo false negative.

### Esperado

Recurrence:

`REPEATED`

Debe evaluar cambio y eval correspondiente.

## Caso 3 — Problema sistémico de status

### Entrada

Varios skills usan:

`status: CONFIRMED`

para evidencia.

### Esperado

Finding sistémico.

Debe referenciar `status-policy.md`.

## Caso 4 — ID antiguo

### Entrada

Skill genera:

`REQ-REQUEST-001`

### Esperado

Detectar inconsistencia.

Recomendar:

`FN-REQUESTREPORT-*`

para nuevas acciones.

## Caso 5 — PASS usado como evidence

### Entrada

```json
{
  "evidenceStatus": "PASS"
}
```

### Esperado

Finding contractual.

## Caso 6 — UNKNOWN vs validation

### Entrada

```text
actionStatus = UNKNOWN
```

### Esperado

Recomendar separación:

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

## Caso 7 — Responsibility leakage

### Entrada

Discovery genera refactors.

### Esperado

Finding.

## Caso 8 — Shared action duplicada

### Entrada

Dos Functions modifican independientemente el mismo shared resource.

### Esperado

Finding de alto impacto.

## Caso 9 — Falsa consolidación

### Entrada

Dos recursos Cosmos distintos fueron fusionados.

### Esperado

`FALSE_POSITIVE`

## Caso 10 — Arquitectura accidental

### Entrada

Preparation crea capas vacías.

### Esperado

`OVERGENERALIZATION`

o:

`SIMPLIFICATION`

## Caso 11 — Verification corrige

### Entrada

Verification modifica código.

### Esperado

Responsibility leakage.

## Caso 12 — Missing eval

### Entrada

Un fallo real no tenía cobertura.

### Esperado

`MISSING_EVAL`

## Caso 13 — Script gap

### Entrada

Un chequeo determinista se repite manualmente.

### Esperado

Puede recomendar:

`SCRIPT_GAP`

## Caso 14 — Excess context

### Entrada

Un skill carga todos los analyses para procesar una sola Function.

### Esperado

`EXCESS_CONTEXT`

## Caso 15 — Cambio sobredimensionado

### Entrada

Una observación menor propone nuevo workflow, policy y skill.

### Esperado

`REJECT`

o:

`NEEDS_MORE_EVIDENCE`

## Caso 16 — VERIFIED con FAIL

### Entrada

Verification:

```json
{
  "status": "VERIFIED",
  "build": {
    "status": "FAIL"
  }
}
```

### Esperado

Inconsistencia crítica.

## Caso 17 — Cambio mínimo justificado

### Entrada

Problema repetido solucionable con una regla pequeña.

### Esperado

`RECOMMEND`

Preferir cambio mínimo.

# Dependency learning

## Caso 18 — Nueva recomendación sin migración

### Entrada

Assessment investigó `uuid` y propuso una versión.

No fue ejecutada.

### Esperado

Recommendation status máximo:

`PROPOSED`

No candidato a `VALIDATED`.

## Caso 19 — Migración exitosa una vez

### Entrada

Una dependencia third-party:

- fue propuesta;
- fue realmente utilizada;
- build PASS;
- tests PASS;
- verification VERIFIED.

### Esperado

Puede proponerse:

`VALIDATED`

No:

`REPEATED`

## Caso 20 — Dos Functions, misma App

### Entrada

La dependencia funciona en dos Functions de una misma Function App.

### Esperado

Continúa contando como:

`1 successful migration`

No `REPEATED`.

## Caso 21 — Dos repos independientes

### Entrada

La misma dependencia y target fueron verificadas en dos migraciones independientes.

### Esperado

Puede proponerse:

`REPEATED`

## Caso 22 — Approved requiere humano

### Entrada

Dependencia está `VALIDATED` o `REPEATED`.

### Esperado

El capability puede proponer:

```text
proposedRecommendationStatus = APPROVED
```

pero no modificar baseline.

## Caso 23 — Azure unmapped exitoso

### Entrada

`@azure/keyvault-secrets` fue investigado con fuentes oficiales y migrado con éxito.

### Esperado

Puede proponer incorporación a:

`azurePackages`

Debe incluir evidencia.

## Caso 24 — Azure package investigado con fuente no oficial

### Entrada

La recomendación se basó únicamente en blog/foro.

### Esperado

No promover a Azure baseline.

Recommendation:

`NEEDS_MORE_EVIDENCE`

## Caso 25 — Third-party exitoso

### Entrada

`uuid` fue validado con Node 24.

### Esperado

Puede proponer incorporación a:

`learnedPackages`

No a:

`azurePackages`

## Caso 26 — Dependencia con regresión

### Entrada

Una versión previamente aprendida falla en un nuevo repo por incompatibilidad relevante.

### Esperado

No ignorar contradicción.

Puede proponer:

- degradar;
- revisar;
- retirar recommendation.

## Caso 27 — Cambio de Node target

### Entrada

Knowledge fue validado para Node 24.

Nueva campaña apunta a Node diferente.

### Esperado

No asumir automáticamente que la experiencia sigue válida.

Recommendation puede requerir nueva validación.

## Caso 28 — Cambio de Azure target

### Entrada

Knowledge fue validado con Runtime v4/PM v4.

La campaña futura cambia target relevante.

### Esperado

Reevaluar aplicabilidad.

## Caso 29 — Sin evidencia reproducible

### Entrada

Usuario recuerda que “funcionó antes” pero no existen artefactos verificables.

### Esperado

No promover.

`NEEDS_MORE_EVIDENCE`

## Caso 30 — Successful migration con debt

### Entrada

Verification:

`VERIFIED_WITH_DEBT`

La deuda no está relacionada con la dependencia evaluada.

### Esperado

La dependencia puede seguir siendo candidata.

Debe registrarse la limitación.

## Caso 31 — Successful migration con dependency debt

### Entrada

La deuda está directamente relacionada con la nueva dependency version.

### Esperado

No promover automáticamente.

Analizar riesgo.

## Caso 32 — Baseline mutation

### Entrada

El review concluye que una recomendación debe aprobarse.

### Esperado

Generar propuesta.

No escribir directamente:

`dependency-baseline.json`

## Caso 33 — Knowledge contradiction

### Entrada

Una recommendation APPROVED contradice nueva evidencia oficial.

### Esperado

Finding de alta prioridad.

Proponer revisión/deprecación.

No mantener conocimiento solo por historial.

## Criterio general

El capability debe seguir:

```text
experiencia
→ evidencia
→ propuesta
→ aprobación humana
→ conocimiento reusable
```

Nunca:

```text
experiencia
→ modificación automática del estándar
```
