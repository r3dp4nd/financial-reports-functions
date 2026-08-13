# Evals — Analyze Function

## Objetivo

Validar que el skill comprenda una Function concreta y produzca acciones útiles sin modificar código.

## Caso 1 — Function simple y testeable

### Entrada

Function v4 con:

- handler pequeño;
- servicio separado;
- dependencias sustituibles;
- sin tests.

### Esperado

El skill debe:

- clasificar testabilidad como `HIGH`;
- proponer tests;
- mantener refactor como `NONE`;
- no generar `REQUIRED_PLATFORM`;
- no introducir arquitectura adicional.

## Caso 2 — Handler acoplado a Azure SDK

### Entrada

Function que:

- construye `CosmosClient` dentro del handler;
- usa `process.env` directamente;
- contiene lógica funcional;
- no tiene tests.

### Esperado

Debe:

- identificar baja o media testabilidad con justificación;
- proponer refactor mínimo;
- generar `REQUIRED_TESTABILITY`;
- proponer tests mínimos;
- no proponer un rediseño completo.

## Caso 3 — Function legacy

### Entrada

Function con:

- `function.json`;
- `context`;
- lógica mezclada con adapter Azure.

### Esperado

Debe generar al menos:

- acción `REQUIRED_PLATFORM`;
- acciones `REQUIRED_TESTABILITY` cuando correspondan;
- comportamiento a preservar;
- tests propuestos.

No debe migrar la Function.

## Caso 4 — Function ya v4

### Entrada

Function registrada con `app.http`.

### Esperado

Debe:

- registrar Programming Model satisfecho;
- no generar acción de migración del modelo;
- continuar evaluando Node.js, testabilidad y dependencias.

## Caso 5 — Durable Orchestrator

### Entrada

Orchestrator que invoca varias Activities.

### Esperado

Debe:

- identificar rol;
- considerar contexto mínimo del workflow;
- detectar restricciones relevantes de determinismo;
- no migrar Durable.

## Caso 6 — Activity simple

### Entrada

Activity con:

- input;
- repositorio;
- output;
- poco comportamiento.

### Esperado

Debe:

- no sobrearquitecturar;
- proponer unit tests;
- mantener refactor `NONE` o `MINIMAL` según evidencia.

## Caso 7 — Node.js 24 desconocido

### Entrada

Código que usa una API o dependencia cuya compatibilidad no está confirmada.

### Esperado

Debe registrar:

`REQUIRES_VALIDATION`

No debe asumir compatibilidad por build o TypeScript.

## Caso 8 — Deuda no bloqueante

### Entrada

Código con duplicación o naming pobre que no impide migración ni tests.

### Esperado

Debe:

- clasificar como `TECHNICAL_DEBT`;
- no generar una acción obligatoria de migración.

## Caso 9 — Optimización

### Entrada

Código donde podría aplicarse batching o caching.

### Esperado

Debe:

- clasificarlo como `OPTIMIZATION`;
- mantenerlo fuera de `requiredActions` obligatorias.

## Caso 10 — requiredActions

### Entrada

Function con:

- acoplamiento de testabilidad;
- Programming Model legacy;
- deuda técnica no bloqueante.

### Esperado

`analysis.json` debe diferenciar acciones como:

- `REQUIRED_TESTABILITY`;
- `REQUIRED_PLATFORM`;

y no mezclar la deuda técnica como trabajo obligatorio.

## Caso 11 — Slice amplio

### Entrada

Function que depende de múltiples componentes.

### Esperado

Debe:

- comenzar por dependencias directas;
- ampliar contexto solo cuando sea necesario;
- no cargar toda la App automáticamente.

## Caso 12 — Inventory contradictorio

### Entrada

Inventory indica legacy pero el source muestra registro v4.

### Esperado

Debe:

- registrar contradicción;
- no sobrescribir silenciosamente evidencia anterior;
- utilizar `UNKNOWN` o `REQUIRES_REVIEW`.
