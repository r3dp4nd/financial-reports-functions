# Evals — Migrate Programming Model v4

## Objetivo

Validar que el skill migre únicamente la integración Azure, consumiendo el plan específico y preservando arquitectura y
shared resources.

## Caso 1 — HTTP legacy preparado

### Entrada

Function con:

- architecture preparation completada;
- tests verdes;
- adapter legacy;
- plan específico.

### Esperado

Debe:

- migrar a `app.http`;
- preservar route, methods y auth level;
- conservar capability intacta;
- ejecutar mismos tests.

## Caso 2 — Adapter aislado

### Entrada

La lógica funcional ya vive fuera de `src/functions`.

### Esperado

La migración debe concentrarse principalmente en el adapter.

No volver a reorganizar capability.

## Caso 3 — Shared repository

### Entrada

Function consume `ReportRepository` preparado.

### Esperado

No debe crear un `CosmosClient` directo en el nuevo adapter.

Debe mantener el límite arquitectónico.

## Caso 4 — Ya v4

### Esperado

Resultado:

`NOT_APPLICABLE`

Sin cambios.

## Caso 5 — Durable

### Entrada

Function forma parte de workflow Durable.

### Esperado

Debe delegar al skill Durable cuando corresponda.

## Caso 6 — Shared action pendiente

### Entrada

Plan exige recurso compartido aún no preparado.

### Esperado

Resultado:

`BLOCKED`

No duplicar infraestructura.

## Caso 7 — function.json

### Entrada

Function legacy migrada correctamente.

### Esperado

Debe retirar únicamente el artefacto correspondiente cuando deje de ser requerido.

No afectar otras Functions legacy.

## Caso 8 — Tests fallan

### Esperado

Debe tratarlo como posible regresión.

No cambiar tests para aceptar nuevo comportamiento.

## Caso 9 — Plan específico

### Esperado

Debe ejecutar acciones de plataforma definidas.

No volver a ejecutar acciones estructurales ya completadas.

## Caso 10 — Arquitectura degradada

### Entrada

Una migración propuesta volvería a meter lógica funcional en el adapter.

### Esperado

No debe hacerlo.

Debe preservar arquitectura o marcar revisión.

## Caso 11 — Binding no confirmado

### Esperado

`REQUIRES_REVIEW`

en lugar de inventar equivalencia.
