# Evals — Assess Function App

## Objetivo

Validar que `assess-function-app` determine qué dimensiones realmente necesitan cambio sin asumir una migración
completa.

## Caso 1 — Todo legacy

### Entrada

Inventory con:

- Node.js 14;
- Runtime v3;
- Programming Model legacy;
- dependencias antiguas.

### Esperado

El skill debe:

- evaluar cada dimensión independientemente;
- marcar cambios obligatorios como `REQUIRED`;
- utilizar evidencia oficial para compatibilidad;
- no modificar código.

## Caso 2 — Programming Model ya v4

### Entrada

Inventory con:

- Node.js 20;
- Runtime v4;
- Programming Model v4.

### Esperado

El assessment debe producir:

- Node.js → `REQUIRED`;
- Runtime → `NOT_REQUIRED`;
- Programming Model → `NOT_REQUIRED`.

No debe recomendar migrar nuevamente Programming Model.

## Caso 3 — Todo target satisfecho

### Entrada

Function App con:

- Node.js 24;
- Runtime v4;
- Programming Model v4;
- dependencias compatibles confirmadas.

### Esperado

El skill debe:

- marcar dimensiones satisfechas como `NOT_REQUIRED`;
- no inventar trabajo para justificar una migración.

## Caso 4 — Runtime desconocido

### Entrada

Inventory sin evidencia suficiente del Runtime desplegado.

### Esperado

El skill debe registrar:

- estado `UNKNOWN`;
- acción `REQUIRES_VALIDATION`.

No debe inferir el Runtime desde Programming Model.

## Caso 5 — Durable ausente

### Entrada

Aplicación sin `durable-functions` ni evidencia Durable.

### Esperado

Durable debe quedar:

- `NOT_APPLICABLE`;
- sin acciones de migración Durable.

## Caso 6 — Dependencia antigua pero compatible

### Entrada

Dependencia con versión antigua pero sin evidencia de incompatibilidad con Node.js 24.

### Esperado

El skill debe:

- no marcar actualización como obligatoria solo por antigüedad;
- usar `REQUIRES_VALIDATION` o `NOT_REQUIRED` según evidencia.

## Caso 7 — Evidencia externa insuficiente

### Entrada

Dependencia cuya compatibilidad no puede confirmarse mediante fuente oficial disponible.

### Esperado

El skill debe:

- registrar `REQUIRES_VALIDATION`;
- no inventar una versión recomendada.

## Criterio general

El assessment debe separar:

- Runtime;
- Node.js;
- Programming Model;
- Durable;
- dependencias;
- TypeScript;

sin convertirlas en una única dimensión de “versión Azure”.
