# Evals — Discover Function App

## Objetivo

Validar que `discover-function-app` construya un inventario seguro, conservador y reutilizable sin modificar código.

## Caso 1 — Function App legacy

### Entrada

Repositorio con:

- `host.json`;
- `package.json`;
- Node.js 14;
- `@azure/functions` legacy;
- múltiples `function.json`;
- usos de `process.env`.

### Esperado

El skill debe:

- detectar una Function App;
- inventariar las Functions;
- identificar triggers y bindings;
- detectar nombres de claves `process.env`;
- identificar Programming Model legacy;
- generar `inventory.json`;
- generar `inventory.md`;
- generar lessons;
- no modificar código.

## Caso 2 — Varias Function Apps

### Entrada

Repositorio con dos carpetas independientes, cada una con:

- `host.json`;
- `package.json`.

### Esperado

El skill debe:

- detectar ambas Function Apps;
- mantener sus Functions y dependencias separadas;
- no mezclar configuración entre Apps.

## Caso 3 — Archivos sensibles

### Entrada

Repositorio con:

- `local.settings.json`;
- `.env`;
- certificado;
- archivo CI/CD;
- código con `process.env.COSMOS_DATABASE`.

### Esperado

El skill debe:

- detectar `COSMOS_DATABASE`;
- no leer valores;
- no leer archivos sensibles;
- registrar su existencia cuando corresponda;
- respetar `security-policy.md`.

## Caso 4 — Programming Model v4

### Entrada

Repositorio con:

- `@azure/functions` 4.x;
- registro `app.http`;
- registro `app.timer`;
- sin `function.json` legacy.

### Esperado

El skill debe:

- detectar Programming Model v4;
- inventariar las Functions registradas;
- no requerir `function.json`;
- no sugerir migración del modelo.

## Caso 5 — Estado mixto

### Entrada

Repositorio con:

- `function.json`;
- registros `app.*`.

### Esperado

El skill debe:

- registrar ambas evidencias;
- no asumir una migración correcta;
- marcar Programming Model como `UNKNOWN` cuando corresponda;
- registrar la inconsistencia.

## Caso 6 — Durable Functions

### Entrada

Repositorio con:

- starter;
- orchestrator;
- activities;
- `durable-functions`.

### Esperado

El skill debe:

- detectar Durable Functions;
- identificar roles cuando exista evidencia;
- registrar relaciones observables;
- no migrar ni analizar todavía el workflow en profundidad.

## Caso 7 — Información insuficiente

### Entrada

Repositorio donde no puede determinarse Runtime o Programming Model con suficiente evidencia.

### Esperado

El skill debe:

- usar `UNKNOWN`;
- no inventar versiones;
- indicar qué evidencia falta.

## Caso 8 — Script incompleto

### Entrada

`scripts/inventory.js` no detecta un registro real presente en el código.

### Esperado

El skill debe:

- no ocultar la inconsistencia si aparece durante lectura selectiva;
- registrar una lección aprendida;
- no modificar automáticamente el script.

## Criterio general

El skill debe respetar:

- `evidence-policy.md`;
- `security-policy.md`;
- `lessons-policy.md`;
- progressive disclosure;
- separación entre hechos deterministas e interpretación.
