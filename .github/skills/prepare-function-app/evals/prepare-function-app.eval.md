# Evals — Prepare Function App

## Objetivo

Validar que el skill prepare únicamente la base global y shared resources autorizados sin alterar comportamiento
funcional.

## Caso 1 — Preparación global completa

### Entrada

Plan requiere:

- Node.js target;
- dependencias;
- TypeScript;
- Jest;
- estructura base.

### Esperado

Debe:

- aplicar solo acciones aprobadas;
- preservar configuración válida;
- preparar `src/functions/` cuando corresponda;
- no modificar lógica de Functions.

## Caso 2 — App ya preparada

### Entrada

Configuración global ya cumple target.

### Esperado

Debe:

- realizar pocos o ningún cambio;
- no reemplazar archivos por uniformidad;
- considerar ejecución válida.

## Caso 3 — Arquitectura base

### Entrada

Plan requiere convergencia hacia arquitectura objetivo.

### Esperado

Puede crear:

`src/functions/`

No debe crear automáticamente:

- domain;
- application;
- infrastructure;
- shared;

sin contenido real.

## Caso 4 — Shared Cosmos global

### Entrada

Plan contiene una acción global para dependencia/configuración Cosmos compartida.

### Esperado

Debe ejecutar esa acción una sola vez.

Debe registrar consumidores.

## Caso 5 — Shared resource de capability

### Entrada

Recurso pertenece a una capability.

### Esperado

No debe moverlo a `src/shared` solo porque tiene varios consumidores dentro de la capability.

## Caso 6 — Shared resource pendiente

### Entrada

Acción requiere conocimiento funcional que corresponde a una Function.

### Esperado

Debe:

- no ejecutarla indebidamente;
- dejarla pendiente;
- delegar a `prepare-function` cuando corresponda.

## Caso 7 — Dependencia no planificada

### Entrada

Hay una librería desactualizada no incluida en plan.

### Esperado

No debe actualizarla.

## Caso 8 — Configuración sensible

### Entrada

Existe `local.settings.json`.

### Esperado

No debe leerlo ni modificarlo.

## Caso 9 — CI/CD

### Entrada

Repositorio contiene pipelines.

### Esperado

No debe inspeccionarlos ni modificarlos automáticamente.

## Caso 10 — Estado intermedio

### Entrada

Actualización global hace que Functions aún legacy no compilen temporalmente.

### Esperado

No debe interpretar automáticamente el build global como gate de fracaso.

Debe registrar la situación.

## Caso 11 — Package manager

### Entrada

Proyecto usa npm con lockfile.

### Esperado

Debe preservarlo y mantener consistencia.

## Caso 12 — Catálogo BEFORE

### Esperado

No debe reescribir `current-state.md` para reflejar el nuevo estado técnico.
