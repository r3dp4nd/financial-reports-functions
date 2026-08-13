# Evals — Plan Function Migration

## Objetivo

Validar que planning coordine las acciones ya identificadas sin:

- reanalizar source;
- redefinir versiones;
- duplicar recursos compartidos;
- perder provenance;
- promover conocimiento de dependencias.

## Caso 1 — Plan simple

### Entrada

Una Function con acciones confirmadas.

### Esperado

Crear:

- plan global;
- plan por Function.

Status:

`READY`

cuando no existen blockers.

## Caso 2 — Function actions

### Entrada

Analysis contiene:

`FN-REQUESTREPORT-001`

### Esperado

El plan conserva exactamente ese ID.

No generar:

`REQ-*`

## Caso 3 — Dependency action global

### Entrada

Assessment exige actualizar:

`@azure/functions`

### Esperado

Crear acción:

`GLOBAL-*`

con:

```text
type = REQUIRED_DEPENDENCY
```

## Caso 4 — Dependency provenance baseline

### Entrada

Dependency target proviene de baseline.

### Esperado

La acción conserva:

```text
recommendationSource = BASELINE
```

## Caso 5 — Dependency provenance official research

### Entrada

Azure package unmapped investigado.

### Esperado

Conservar:

`OFFICIAL_RESEARCH`

No convertirlo a:

`BASELINE`

## Caso 6 — Dependency provenance learned

### Entrada

Target proviene de `learnedPackages`.

### Esperado

Conservar:

`LEARNED_BASELINE`

## Caso 7 — Third-party research

### Entrada

Target propuesto mediante investigación externa.

### Esperado

Conservar:

`EXTERNAL_RESEARCH`

## Caso 8 — Proposed dependency sin aprobación

### Entrada

Assessment contiene:

```text
recommendationStatus = PROPOSED
```

y todavía requiere decisión.

### Esperado

Planning no la convierte en `APPROVED`.

Debe registrar review cuando sea necesario.

## Caso 9 — Shared resource consolidation

### Entrada

Dos analyses confirman el mismo ReportRepository Cosmos.

### Esperado

Crear un recurso:

`SR-COSMOS-REPORTS`

No dos.

## Caso 10 — Shared resource action

### Entrada

El recurso compartido requiere adaptación.

### Esperado

Una única:

`SR-ACTION-*`

## Caso 11 — Function consumer adaptations

### Entrada

Dos Functions consumen el recurso pero solo una necesita adaptación local.

### Esperado

Solo esa Function recibe `FN-*` correspondiente.

No duplicar shared action.

## Caso 12 — Dos recursos misma tecnología

### Entrada

Customers y Reports usan Cosmos pero son recursos diferentes.

### Esperado

No fusionarlos únicamente por `@azure/cosmos`.

## Caso 13 — Ownership CAPABILITY

### Entrada

Recurso pertenece naturalmente a Reports.

### Esperado

Ownership:

`CAPABILITY`

No mover automáticamente a repository/shared global.

## Caso 14 — Ownership desconocido

### Entrada

No hay evidencia suficiente.

### Esperado

Mantener desconocido.

No inventar owner.

## Caso 15 — Dependency ordering

### Entrada

Package global → repository shared → Function consumer.

### Esperado

Representar mediante:

```text
GLOBAL-* → SR-ACTION-* → FN-*
```

cuando realmente exista esa dependencia.

## Caso 16 — Sin shared layer

### Entrada

Dependency local a una sola Function.

### Esperado

No crear artificialmente:

`SR-ACTION-*`

## Caso 17 — Function ya v4

### Entrada

Programming Model v4 confirmado.

### Esperado

No crear migration step PM v4.

## Caso 18 — Durable workflow

### Entrada

Varias Functions pertenecen a un workflow Durable.

### Esperado

Planes por Function mantienen detalle.

Plan global coordina migración del workflow.

## Caso 19 — Workflow output path

### Entrada

Existe workflow Durable.

### Esperado

Referencia de ejecución Durable debe apuntar a:

`.migration/workflows/<WorkflowName>/`

No a un directorio ficticio bajo `functions/`.

## Caso 20 — Global build

### Entrada

Varias Functions pendientes.

### Esperado

Build global aparece después de las adaptaciones.

No como gate por Function.

## Caso 21 — Unknown localizado

### Entrada

Una Function tiene unknown.

Otras Functions son independientes.

### Esperado

Plan:

`PARTIAL`

No bloquear innecesariamente todo.

## Caso 22 — Blocker global

### Entrada

Target crítico no puede determinarse.

### Esperado

Plan:

`BLOCKED`

## Caso 23 — Architecture target

### Entrada

Analysis exige extraer lógica del adapter.

### Esperado

Plan refleja acción existente.

No vuelve a diseñar arquitectura desde cero.

## Caso 24 — Technical debt

### Entrada

Analysis contiene deuda no requerida.

### Esperado

Mantener fuera del execution scope.

## Caso 25 — Optimization

### Entrada

Analysis identifica mejora de rendimiento.

### Esperado

No convertir en acción de migración.

## Caso 26 — Baseline reference

### Entrada

Assessment utilizó:

`node24-azure-functions-v4`

### Esperado

Plan global referencia explícitamente esa baseline.

## Caso 27 — No version re-resolution

### Entrada

Assessment definió target `X`.

### Esperado

Planning no consulta latest ni reemplaza `X`.

## Caso 28 — No learning promotion

### Entrada

Una recomendación parece buena.

### Esperado

Planning no modifica:

`learnedPackages`

ni `azurePackages`.

## Criterio general

Planning debe coordinar:

`qué ya sabemos que hay que hacer`

sin volver a convertirse en analysis o assessment.
