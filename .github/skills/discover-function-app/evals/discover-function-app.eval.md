# Evals — Discover Function App

## Objetivo

Validar que `discover-function-app` produzca una fotografía segura y útil del estado actual, con un contrato JSON
estructurado y un único catálogo Markdown humano.

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
- generar `.migration/repository/inventory.json`;
- generar `.migration/catalog/current-state.md`;
- no generar `.migration/repository/inventory.md`;
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
- registrar únicamente existencia o ruta cuando corresponda.

## Caso 4 — Programming Model v4

### Entrada

Repositorio con:

- registros `app.http`;
- registros `app.timer`;
- sin `function.json`.

### Esperado

Debe:

- detectar Programming Model v4;
- inventariar Functions;
- no sugerir migración del modelo.

## Caso 5 — Estado mixto

### Entrada

Repositorio con:

- Functions legacy;
- Functions v4.

### Esperado

Debe:

- conservar ambas evidencias;
- registrar estado mixto o `UNKNOWN` según corresponda;
- no asumir que toda la App está migrada.

## Caso 6 — Arquitectura observable

### Entrada

Repositorio donde:

- entrypoints contienen lógica funcional;
- Cosmos SDK se construye directamente;
- existen services y repositories parciales.

### Esperado

Debe registrar:

- organización actual;
- acoplamientos observables;
- patrones;
- infraestructura utilizada.

No debe proponer todavía refactor detallado.

## Caso 7 — Patrones

### Entrada

Repositorio con:

- Durable workflow;
- Repository claro;
- Outbox explícito.

### Esperado

Debe registrar patrones únicamente cuando exista evidencia.

No inferir patrones por naming ambiguo.

## Caso 8 — Shared resource candidato

### Entrada

Dos Functions importan el mismo `CosmosReportRepository`.

### Esperado

Debe registrar un candidato con:

- id;
- type;
- paths;
- consumidores observables;
- evidencia.

No debe considerarlo todavía consolidado definitivamente.

## Caso 9 — Ownership todavía incierto

### Entrada

Un recurso parece compartido pero no puede confirmarse si pertenece a una capability o a toda la Function App.

### Esperado

Debe usar:

`INFERRED` o `UNKNOWN`

según evidencia.

No decidir ownership definitivo.

## Caso 10 — Shared falso positivo

### Entrada

Dos Functions utilizan Cosmos DB mediante repositories funcionalmente diferentes.

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

## Caso 12 — Catálogo current-state

### Entrada

Discovery completo.

### Esperado

`.migration/catalog/current-state.md` debe permitir comprender:

- qué sistema existe;
- qué Functions contiene;
- plataforma observable;
- arquitectura actual;
- patrones;
- shared resource candidates;
- configuración requerida;
- riesgos;
- unknowns.

No debe describir el target como ya implementado.

## Caso 13 — No inventory.md

### Entrada

Ejecución exitosa de discovery.

### Esperado

No debe generar:

`.migration/repository/inventory.md`

La única vista humana de discovery es:

`.migration/catalog/current-state.md`

## Caso 14 — Información insuficiente

### Entrada

No puede confirmarse Runtime, ownership o relación.

### Esperado

Debe:

- usar `UNKNOWN` o `INFERRED`;
- identificar evidencia disponible;
- no inventar.

## Caso 15 — Script incompleto

### Entrada

El script no detecta una estructura real encontrada posteriormente mediante análisis selectivo.

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
- separación entre discovery, assessment y planning;
- ausencia de Markdown redundante.
