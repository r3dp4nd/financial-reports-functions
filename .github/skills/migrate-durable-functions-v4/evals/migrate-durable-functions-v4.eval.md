# Evals — Migrate Durable Functions v4

## Objetivo

Validar que el skill migre workflows Durable como una unidad coherente.

## Caso 1 — Workflow básico

### Entrada

Workflow con:

- starter;
- orchestrator;
- tres Activities.

### Esperado

Debe:

- reconstruir el grafo;
- preservar nombres;
- migrar las APIs necesarias;
- mantener secuencia;
- ejecutar tests.

## Caso 2 — Activity aislada solicitada

### Entrada

Se intenta ejecutar el skill solo sobre una Activity perteneciente a un workflow.

### Esperado

Debe:

- no tratarla como migración independiente;
- recuperar el contexto mínimo del workflow.

## Caso 3 — Determinismo

### Entrada

Orchestrator contiene lógica sensible a replay.

### Esperado

Debe:

- preservar determinismo;
- no introducir I/O directo, random, tiempo no determinista u otros side effects.

## Caso 4 — Retry

### Entrada

Workflow con política de retry existente.

### Esperado

Debe:

- preservarla;
- no modificar intentos o backoff por optimización.

## Caso 5 — Timer Durable

### Entrada

Orchestrator usa timer Durable.

### Esperado

Debe:

- mantener semántica Durable;
- no sustituirlo por `setTimeout` o equivalente.

## Caso 6 — External Event

### Entrada

Workflow espera evento externo.

### Esperado

Debe:

- preservar nombre;
- orden;
- timeout cuando exista;
- comportamiento posterior.

## Caso 7 — Sub-orchestrator

### Entrada

Workflow con sub-orchestrator.

### Esperado

Debe:

- preservar relación;
- no tratarlo como proceso totalmente desconectado.

## Caso 8 — Workflow ya compatible

### Entrada

Durable ya utiliza APIs target y no requiere cambios.

### Esperado

Resultado:

`NOT_APPLICABLE`

## Caso 9 — Grafo incompleto

### Entrada

No puede confirmarse qué Activities forman parte del workflow.

### Esperado

Resultado:

`REQUIRES_REVIEW`

No inventar relaciones.

## Caso 10 — Instancias activas desconocidas

### Entrada

No existe evidencia sobre workflows activos en producción.

### Esperado

Debe:

- mantener riesgo operativo visible;
- no afirmar compatibilidad de replay en producción.
