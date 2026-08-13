# Evals — Plan Function Migration

## Objetivo

Validar que el skill produzca un plan global y planes por Function, coordinando arquitectura, shared resources y
dependencias sin duplicar análisis.

## Caso 1 — Plan completo

### Entrada

Existen:

- inventory;
- assessment;
- analyses de todas las Functions.

### Esperado

Debe crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

y por Function:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

## Caso 2 — Plan global

### Esperado

Debe coordinar:

- target;
- cambios globales;
- arquitectura;
- shared resources;
- Function plans;
- Durable workflows;
- orden;
- riesgos;
- unknowns;
- verification criteria.

## Caso 3 — Plan por Function

### Esperado

Debe describir:

- comportamiento a preservar;
- requiredActions;
- arquitectura objetivo;
- dependencias;
- shared resources;
- preparación;
- migración;
- tests;
- verificación.

No debe copiar completo `analysis.json`.

## Caso 4 — Shared Cosmos

### Entrada

RequestReport y GenerateReport consumen el mismo repository Cosmos y este necesita cambio.

### Esperado

Debe crear una única shared resource action.

Ejemplo:

`SR-ACTION-001`

Ambos Function plans deben depender de ella.

No generar dos migraciones del repository.

## Caso 5 — Shared Mongo sin cambio

### Entrada

Recurso Mongo compartido confirmado compatible y correctamente aislado.

### Esperado

Debe quedar:

`NOT_REQUIRED`

No inventar refactor.

## Caso 6 — Shared resource con ownership CAPABILITY

### Entrada

Recurso utilizado por varias Functions de una misma capability.

### Esperado

Debe preservar ownership `CAPABILITY`.

No promover a global por conveniencia.

## Caso 7 — Dependencia entre plans

### Entrada

Function necesita un shared resource antes de refactorizar.

### Esperado

El Function plan debe declarar:

`dependsOn`

hacia la acción compartida.

## Caso 8 — Function ya v4

### Entrada

Analysis indica Programming Model v4, pero necesita arquitectura y tests.

### Esperado

El plan debe:

- incluir preparación/refactor;
- excluir migración de Programming Model.

## Caso 9 — Function legacy

### Entrada

Analysis incluye `REQUIRED_PLATFORM`.

### Esperado

El plan debe incluir migración v4 después de preparación y baseline.

## Caso 10 — Durable workflow

### Entrada

Starter, orchestrator y Activities.

### Esperado

Debe:

- mantener planes por Function para trazabilidad;
- agrupar ejecución de migración a nivel workflow;
- no planificar Activities como migraciones independientes de plataforma.

## Caso 11 — Arquitectura

### Entrada

Varias Functions requieren extracción de lógica del adapter.

### Esperado

Cada Function plan debe definir su cambio estructural.

El plan global debe coordinar estructura común sin duplicar acciones.

## Caso 12 — No carpetas vacías

### Entrada

Capability simple.

### Esperado

El plan no debe ordenar crear todas las capas estándar por convención.

## Caso 13 — Falta un análisis

### Entrada

Inventory tiene cinco Functions, cuatro analizadas.

### Esperado

Debe:

- registrar faltante;
- no inventar plan;
- usar `PARTIAL` o `BLOCKED`.

## Caso 14 — Unknown localizado

### Entrada

Una Function tiene incompatibilidad pendiente, otras son independientes.

### Esperado

Debe permitir avanzar trabajo seguro independiente.

## Caso 15 — Technical debt

### Entrada

Analysis contiene deuda y optimización.

### Esperado

No incluirlas como trabajo obligatorio salvo que sean blocker explícito.

## Caso 16 — Build global

### Esperado

El plan debe reservar el build completo para verificación final.

No exigirlo después de cada Function.

## Caso 17 — Neutralidad de ejecución

### Entrada

Plan será ejecutado manualmente por un developer.

### Esperado

Las acciones deben ser comprensibles sin depender de instrucciones internas de un agente.

Ejemplo válido:

`Extraer acceso Cosmos detrás de ReportRepository.`

Ejemplo no deseado:

`El agente debe crear la interfaz...`
