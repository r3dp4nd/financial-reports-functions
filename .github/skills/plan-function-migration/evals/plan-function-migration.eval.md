# Evals — Plan Function Migration

## Objetivo

Validar que el skill construya un único plan global usando `requiredActions` de los análisis existentes.

## Caso 1 — Plan completo

### Entrada

Existen:

- inventory;
- assessment;
- analysis de todas las Functions;
- `requiredActions` completos.

### Esperado

El skill debe:

- generar únicamente `migration-plan.json`;
- generar únicamente `migration-plan.md`;
- producir estado `READY`;
- construir orden global;
- referenciar acciones de cada Function.

No debe crear planes por Function.

## Caso 2 — Falta un análisis

### Entrada

Inventory contiene cinco Functions, pero solo cuatro tienen `analysis.json`.

### Esperado

Debe:

- registrar el análisis faltante;
- no inventar acciones;
- usar estado `PARTIAL` o `BLOCKED` según impacto.

## Caso 3 — Function ya v4

### Entrada

Analysis con:

- Programming Model v4;
- únicamente `REQUIRED_TESTABILITY`.

### Esperado

El plan debe:

- incluir preparación si corresponde;
- no incluir `migrate-programming-model-v4` para esa Function.

## Caso 4 — Functions legacy independientes

### Entrada

Dos Functions legacy no Durable con baseline pendiente.

### Esperado

Orden conceptual:

- preparar App;
- preparar Functions;
- obtener tests;
- migrar Programming Model;
- verificar.

## Caso 5 — Workflow Durable

### Entrada

Starter, orchestrator y Activities relacionadas.

### Esperado

El plan debe:

- agruparlas como workflow;
- referenciar `migrate-durable-functions-v4`;
- no planificar Activities como migraciones independientes del workflow.

## Caso 6 — Unknown local

### Entrada

Una Function tiene una dependencia `REQUIRES_VALIDATION`, otras son independientes.

### Esperado

Debe:

- mantener visible el unknown;
- bloquear solo acciones dependientes;
- permitir estado `PARTIAL` cuando exista trabajo seguro independiente.

## Caso 7 — Technical debt

### Entrada

Analysis contiene:

- `REQUIRED_PLATFORM`;
- `TECHNICAL_DEBT`;
- `OPTIMIZATION`.

### Esperado

El execution order debe incluir:

- required platform.

No debe incluir como trabajo obligatorio:

- technical debt no bloqueante;
- optimization.

## Caso 8 — No duplicación

### Entrada

Cada `analysis.json` ya describe acciones detalladamente.

### Esperado

El plan debe:

- referenciar acciones;
- no copiar todo su contenido;
- limitarse a coordinación, orden y dependencias.

## Caso 9 — Build global

### Entrada

Migración con varias Functions que pasarán temporalmente por estados incompatibles.

### Esperado

El plan debe:

- permitir validaciones intermedias;
- reservar build global como gate final;
- no exigir build completo después de cada Function.
