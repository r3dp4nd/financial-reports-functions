# Evals — Assess Function App

## Objetivo

Validar que `assess-function-app` determine gaps técnicos y arquitectónicos globales sin invadir el análisis detallado
por Function.

## Caso 1 — Todo legacy

### Entrada

Inventory con:

- Node.js 14;
- Runtime v3;
- Programming Model legacy;
- arquitectura fuertemente acoplada.

### Esperado

Debe:

- evaluar cada dimensión independientemente;
- marcar cambios técnicos requeridos;
- marcar arquitectura `CHANGE_REQUIRED`;
- no proponer todavía archivos concretos a mover.

## Caso 2 — Programming Model ya v4

### Entrada

- Node.js 20;
- Runtime v4;
- Programming Model v4.

### Esperado

Debe producir:

- Node.js → `REQUIRED`;
- Runtime → `NOT_REQUIRED`;
- Programming Model → `NOT_REQUIRED`.

No remigrar v4.

## Caso 3 — Arquitectura alineada

### Entrada

Repositorio con:

- adapters delgados;
- lógica por capability;
- infraestructura aislada.

### Esperado

Architecture assessment:

`ALIGNED`

No inventar refactor global.

## Caso 4 — Arquitectura parcial

### Entrada

Algunas Functions están desacopladas y otras siguen legacy.

### Esperado

Architecture assessment:

`PARTIALLY_ALIGNED`

El detalle debe delegarse a `analyze-function`.

## Caso 5 — Shared Cosmos

### Entrada

Discovery detecta repository Cosmos compartido por varias Functions.

### Esperado

Debe:

- reconocer impacto transversal;
- conservar ownership;
- evaluar compatibilidad o usar `REQUIRES_VALIDATION`;
- no crear todavía shared action.

## Caso 6 — Dos Cosmos distintos

### Entrada

Dos repositories distintos usan Cosmos.

### Esperado

No fusionarlos como un único recurso solo por tecnología.

## Caso 7 — Shared resource ya correcto

### Entrada

Recurso compartido correctamente aislado y compatible.

### Esperado

Acción:

`NOT_REQUIRED`

No planificar refactor por uniformidad.

## Caso 8 — Runtime desconocido

### Entrada

No hay evidencia suficiente.

### Esperado

Runtime:

`REQUIRES_VALIDATION`

No inferir desde Programming Model.

## Caso 9 — Durable ausente

### Esperado

Durable:

`NOT_APPLICABLE`

## Caso 10 — Dependencia antigua pero compatible

### Esperado

No marcar actualización obligatoria únicamente por antigüedad.

## Caso 11 — Catálogo BEFORE

### Esperado

No debe modificar `current-state.md` para mostrar el target futuro.

## Caso 12 — Evidencia parcial

### Entrada

Hay unknowns globales pero puede continuarse con análisis.

### Esperado

Estado general:

`PARTIAL`

No bloquear innecesariamente.

## Caso 13 — Contradicción crítica

### Entrada

Inventory y evidencia observada son incompatibles en una dimensión fundamental.

### Esperado

`REQUIRES_REVIEW`

No escoger silenciosamente una de las versiones.

## Criterio general

El assessment debe mantener separadas:

- plataforma;
- arquitectura;
- shared resources;
- testing;
- riesgos;

sin convertirse en un plan de implementación.
