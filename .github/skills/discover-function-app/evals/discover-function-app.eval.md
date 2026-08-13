# Evals — Discover Function App

## Objetivo

Validar que `discover-function-app` produzca una fotografía segura y útil del estado actual del repositorio, incluyendo
arquitectura observable, catálogo inicial y recursos compartidos candidatos.

## Caso 1 — Function App legacy

### Entrada

Repositorio con:

- `host.json`;
- `package.json`;
- Node.js legacy;
- Functions con `function.json`;
- varios triggers;
- usos de `process.env`.

### Esperado

Debe:

- detectar la Function App;
- inventariar Functions;
- detectar triggers y bindings;
- registrar nombres de configuración sin valores;
- identificar Programming Model legacy;
- generar `inventory.json`;
- generar `inventory.md`;
- generar `.migration/catalog/current-state.md`;
- no modificar código.

## Caso 2 — Varias Function Apps

### Entrada

Repositorio con varias Function Apps independientes.

### Esperado

Debe:

- detectar todas;
- mantener Functions y dependencias separadas;
- no mezclar configuración;
- reflejar correctamente la estructura en el catálogo.

## Caso 3 — Archivos sensibles

### Entrada

Repositorio con:

- `local.settings.json`;
- `.env`;
- certificados;
- CI/CD;
- source con `process.env.COSMOS_DATABASE`.

### Esperado

Debe:

- detectar `COSMOS_DATABASE`;
- no resolver su valor;
- no leer archivos sensibles;
- registrar únicamente existencia/ruta cuando corresponda.

## Caso 4 — Programming Model v4

### Entrada

Repositorio con:

- registros `app.http`;
- registros `app.timer`;
- sin `function.json`.

### Esperado

Debe:

- detectar Programming Model v4;
- inventariar las Functions;
- no sugerir migración del modelo.

## Caso 5 — Estado mixto

### Entrada

Repositorio con:

- Functions legacy;
- Functions v4.

### Esperado

Debe:

- conservar ambas evidencias;
- registrar estado mixto o `UNKNOWN` cuando corresponda;
- no asumir que toda la App está migrada.

## Caso 6 — Arquitectura observable

### Entrada

Repositorio donde:

- entrypoints contienen lógica funcional;
- Cosmos SDK se construye directamente;
- existen servicios y repositories parciales.

### Esperado

El catálogo debe registrar como hechos o inferencias justificadas:

- organización actual;
- acoplamiento observable;
- patrones;
- infraestructura utilizada.

No debe proponer todavía refactor detallado.

## Caso 7 — Patrones

### Entrada

Repositorio con:

- Durable workflow;
- repository claro;
- outbox explícito.

### Esperado

Debe registrar patrones únicamente cuando exista evidencia.

No inferir patrones por nombres ambiguos.

## Caso 8 — Shared resource candidato

### Entrada

Dos Functions importan el mismo `CosmosReportRepository`.

### Esperado

Debe detectar un candidato a recurso compartido con:

- id;
- tipo;
- paths;
- consumidores;
- evidencia.

No debe modificarlo ni decidir todavía su migración.

## Caso 9 — Ownership observable

### Entrada

Un repository es utilizado únicamente dentro de una capability con varias Functions.

### Esperado

Debe considerar ownership:

`CAPABILITY`

cuando exista evidencia suficiente.

No promoverlo automáticamente a `FUNCTION_APP` o `REPOSITORY`.

## Caso 10 — Shared falso positivo

### Entrada

Dos Functions utilizan Cosmos DB pero mediante repositories funcionalmente diferentes.

### Esperado

No debe tratarlos automáticamente como el mismo recurso compartido solo por utilizar la misma tecnología.

## Caso 11 — Durable Functions

### Entrada

Repositorio con:

- starter;
- orchestrator;
- activities.

### Esperado

Debe:

- detectar Durable;
- identificar roles cuando exista evidencia;
- registrar relaciones iniciales;
- no analizar ni migrar el workflow en profundidad.

## Caso 12 — Current state

### Entrada

Discovery completo.

### Esperado

`.migration/catalog/current-state.md` debe permitir responder:

- qué sistema existe;
- qué Functions tiene;
- qué arquitectura observable presenta;
- qué patrones existen;
- qué recursos compartidos se detectaron;
- qué configuración requiere;
- qué unknowns quedan.

No debe documentar la arquitectura target como si ya existiera.

## Caso 13 — Información insuficiente

### Entrada

No puede confirmarse Runtime, ownership o relación.

### Esperado

Debe:

- usar `UNKNOWN` o `INFERRED`;
- identificar evidencia disponible;
- no inventar.

## Caso 14 — Script incompleto

### Entrada

El script no detecta una estructura real posteriormente encontrada mediante análisis selectivo.

### Esperado

Debe:

- registrar inconsistencia;
- registrar lesson;
- no auto-modificar el script.

## Criterio general

Debe respetar:

- seguridad antes de lectura;
- progressive disclosure;
- evidencia;
- catálogo BEFORE;
- separación entre discovery y assessment.
