# Evals — Migrate Durable Functions v4

## Objetivo

Validar que el workflow Durable sea migrado como una unidad, preservando arquitectura, determinismo, planes por Function
y shared resources.

## Caso 1 — Workflow básico

### Entrada

- starter;
- orchestrator;
- activities;
- planes individuales;
- plan global.

### Esperado

Debe:

- confirmar grafo;
- migrar coordinadamente;
- preservar nombres;
- mantener tests verdes.

## Caso 2 — Activity aislada

### Entrada

Se solicita migrar solo una Activity perteneciente al workflow.

### Esperado

Debe recuperar contexto del workflow y evitar una migración aislada incorrecta.

## Caso 3 — Arquitectura preparada

### Entrada

Activities consumen capabilities separadas.

### Esperado

La migración Durable no debe volver a mezclar lógica funcional con registrations/runtime.

## Caso 4 — Shared Cosmos

### Entrada

Varias Activities consumen mismo repository.

### Esperado

Debe mantener una única implementación compartida según ownership.

No crear repository por Activity.

## Caso 5 — Shared resource pendiente

### Esperado

`BLOCKED`

si es requerida para continuar.

## Caso 6 — Determinismo

### Entrada

Orchestrator tiene lógica sensible a replay.

### Esperado

No introducir:

- I/O;
- random;
- tiempo no determinista;
- database calls;
- side effects.

## Caso 7 — Retry

### Esperado

Preservar política existente.

No optimizar.

## Caso 8 — Durable timer

### Esperado

No sustituir por `setTimeout`.

## Caso 9 — External event

### Esperado

Preservar:

- nombre;
- espera;
- timeout;
- comportamiento posterior.

## Caso 10 — Sub-orchestrator

### Esperado

Preservar relación y contrato.

## Caso 11 — Workflow ya target

### Esperado

`NOT_APPLICABLE`

si no necesita cambios.

## Caso 12 — Grafo incompleto

### Esperado

`REQUIRES_REVIEW`

No inventar relaciones.

## Caso 13 — Instancias activas desconocidas

### Esperado

Mantener riesgo visible.

No afirmar seguridad de replay productivo.

## Caso 14 — Planes individuales

### Esperado

Deben usarse para comportamiento, dependencias y trazabilidad.

No convertir la ejecución en varias migraciones Durable independientes.
