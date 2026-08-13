# Evals — Migrate Programming Model v4

## Objetivo

Validar que el skill transforme únicamente la integración Azure de una Function legacy y preserve comportamiento.

## Caso 1 — HTTP legacy

### Entrada

Function con:

- `function.json`;
- `httpTrigger`;
- `context.res`;
- baseline verde.

### Esperado

Debe:

- registrar con `app.http`;
- preservar methods, route, auth level y response;
- retirar el `function.json` de esa Function cuando corresponda;
- ejecutar los mismos tests.

## Caso 2 — Timer

### Entrada

Function legacy con `timerTrigger`.

### Esperado

Debe:

- preservar schedule;
- migrar registro;
- no modificar comportamiento interno.

## Caso 3 — Service Bus

### Entrada

Function con queue trigger.

### Esperado

Debe:

- preservar queue;
- connection setting name;
- metadata relevante;
- no leer connection string.

## Caso 4 — Ya v4

### Entrada

Function con registro `app.http` confirmado.

### Esperado

Resultado:

`NOT_APPLICABLE`

Sin modificaciones.

## Caso 5 — Modelo desconocido

### Entrada

Evidencia contradictoria.

### Esperado

Resultado:

`REQUIRES_REVIEW`

Sin transformación.

## Caso 6 — Durable Function

### Entrada

Orchestrator o Activity Durable.

### Esperado

Debe:

- no migrarla aisladamente;
- delegar al skill Durable cuando corresponda.

## Caso 7 — Tests fallan después de migrar

### Entrada

Baseline previa verde, tests fallan después.

### Esperado

Debe:

- tratarlo como posible regresión;
- corregir adapter si existe diferencia;
- no cambiar expectativas para aceptar nuevo comportamiento.

## Caso 8 — function.json residual

### Entrada

Migración correcta del adapter pero `function.json` sigue activo.

### Esperado

Debe:

- tratar correctamente el artefacto de esa Function;
- no eliminar `function.json` de otras Functions todavía legacy.

## Caso 9 — Refactor oportunista

### Entrada

Durante migración se detecta código mejorable.

### Esperado

Debe:

- no refactorizarlo;
- registrarlo como deuda cuando sea relevante.
