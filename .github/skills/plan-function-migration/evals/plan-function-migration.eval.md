# Evals — Plan Function Migration

## Objetivo

Validar que el skill consolide correctamente shared resources antes de construir un plan global y planes por Function,
sin duplicar análisis ni mezclar catálogo con planificación.

## Caso 1 — Plan completo sin shared resources

### Entrada

Existen:

- inventory;
- assessment;
- analyses de todas las Functions;
- ningún shared resource real.

### Esperado

Debe crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

y planes por Function.

No debe crear:

`.migration/resources/`

si no existe un recurso compartido real.

## Caso 2 — Shared resource confirmado

### Entrada

RequestReport y GenerateReport confirman consumo del mismo `ReportRepository`.

### Esperado

Debe crear:

`.migration/resources/shared-resources.json`

con el recurso consolidado.

Debe registrar:

- resourceId;
- type;
- ownership;
- consumers;
- paths;
- configuration keys;
- status;
- evidence.

## Caso 3 — Shared resources son descriptivos

### Entrada

Recurso compartido necesita posteriormente migración.

### Esperado

`shared-resources.json` debe describir el recurso.

No debe contener los pasos detallados de migración.

La acción debe vivir en:

`migration-plan.json`

como `SR-ACTION-*`.

## Caso 4 — Acción propietaria única

### Entrada

RequestReport y GenerateReport usan el mismo repository Cosmos que requiere cambio.

### Esperado

Debe generar una sola acción:

`SR-ACTION-001`

Los dos Function plans deben depender de esa acción.

No generar dos refactors equivalentes.

## Caso 5 — Shared resource sin cambio

### Entrada

Mongo repository compartido ya compatible y arquitectónicamente correcto.

### Esperado

Debe aparecer en el catálogo shared.

No debe crear una shared migration action innecesaria.

## Caso 6 — Dos Cosmos diferentes

### Entrada

CustomerRepository y ReportRepository utilizan Cosmos.

### Esperado

Deben permanecer como recursos diferentes si tienen responsabilidades distintas.

No fusionar por tecnología.

## Caso 7 — Ownership CAPABILITY

### Entrada

Varias Functions de Reports utilizan el mismo repository.

### Esperado

Ownership:

`CAPABILITY`

si la evidencia lo confirma.

No promover automáticamente a `FUNCTION_APP`.

## Caso 8 — Ownership desconocido

### Entrada

No existe evidencia suficiente para determinar ownership.

### Esperado

Debe conservar:

`UNKNOWN`

No inventar.

Debe permitir planning independiente cuando sea seguro.

## Caso 9 — Plan global

### Esperado

Debe coordinar:

- target;
- global changes;
- architecture;
- shared resource actions;
- Function plans;
- Durable workflows;
- order;
- risks;
- unknowns;
- verification criteria.

Debe referenciar el catálogo shared en lugar de copiarlo.

## Caso 10 — Plan por Function

### Esperado

Debe describir:

- comportamiento a preservar;
- requiredActions;
- architecture target;
- dependencies;
- shared resource references;
- preparation;
- migration;
- tests;
- verification.

No copiar completo `analysis.json`.

## Caso 11 — Function ya v4

### Entrada

Programming Model v4 pero arquitectura necesita ajuste.

### Esperado

Debe:

- incluir preparation;
- excluir migración v4.

## Caso 12 — Function legacy

### Entrada

Analysis incluye `REQUIRED_PLATFORM`.

### Esperado

Debe planificar:

- preparation;
- baseline;
- Programming Model migration.

## Caso 13 — Durable workflow

### Entrada

Starter, orchestrator y Activities.

### Esperado

Debe:

- conservar planes individuales;
- coordinar migration como workflow;
- evitar migraciones Durable aisladas.

## Caso 14 — Falta un análisis

### Entrada

Inventory contiene cinco Functions pero existen cuatro analyses.

### Esperado

Debe:

- registrar faltante;
- no inventar información;
- usar `PARTIAL` o `BLOCKED` según impacto.

## Caso 15 — Unknown localizado

### Entrada

Una Function está bloqueada por compatibilidad desconocida.

### Esperado

No debe impedir planning de Functions independientes.

## Caso 16 — Technical debt

### Entrada

Analysis incluye deuda y optimizaciones.

### Esperado

No deben convertirse en trabajo obligatorio salvo blocker explícito.

## Caso 17 — Architecture structure

### Entrada

Capability simple.

### Esperado

No debe planificar automáticamente:

- application;
- domain;
- infrastructure;

si no son necesarias.

## Caso 18 — Build global

### Esperado

El plan reserva build global para verification.

No lo exige tras cada Function.

## Caso 19 — Neutralidad del ejecutor

### Esperado

Los planes deben ser utilizables manualmente por un developer.

No depender de instrucciones específicas de IA.

## Criterio general

El skill debe mantener separadas:

`shared resource catalog`

y:

`shared resource migration action`

y producir:

`global coordination + local execution plans`
