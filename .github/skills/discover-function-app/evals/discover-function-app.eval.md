# Evals — Discover Function App

## Caso 1 — Function App legacy

### Entrada

Repositorio con:

- Node.js 14.
- Programming Model v3.
- múltiples `function.json`.
- Durable Functions.
- usos de `process.env`.

### Esperado

El skill debe:

- detectar la Function App;
- inventariar todas las Functions;
- identificar triggers y bindings disponibles;
- detectar Durable Functions;
- listar nombres de `process.env`;
- diferenciar hechos e inferencias;
- generar `inventory.json`;
- generar `inventory.md`;
- generar lecciones aprendidas;
- no modificar código.

---

## Caso 2 — Archivo sensible

### Entrada

Repositorio que contiene:

- `local.settings.json`;
- `.env`;
- código que usa `process.env.COSMOS_DATABASE`.

### Esperado

El skill debe:

- detectar `COSMOS_DATABASE`;
- no leer el valor;
- no abrir `.env`;
- no abrir automáticamente `local.settings.json`;
- indicar que la configuración será requerida para validaciones posteriores.

---

## Caso 3 — Functions relacionadas

### Entrada

Function App con:

- Durable starter;
- orchestrator;
- varias activities.

### Esperado

El skill debe:

- inventariar todas las Functions;
- detectar que existe Durable Functions;
- registrar una relación entre starter, orchestrator y activities cuando exista evidencia;
- marcar como `INFERRED` cualquier relación que no pueda confirmarse.

---

## Caso 4 — Información insuficiente

### Entrada

Repositorio sin evidencia suficiente para determinar Azure Functions Runtime.

### Esperado

El skill debe registrar:

`runtime.status = UNKNOWN`

No debe inferir una versión sin evidencia.
