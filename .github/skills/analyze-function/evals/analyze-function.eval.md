# Evals — Analyze Function

## Objetivo

Validar que `analyze-function` documente comportamiento, arquitectura actual, gap hacia arquitectura objetivo, recursos
compartidos y acciones requeridas sin modificar código.

## Caso 1 — Function simple ya bien estructurada

### Entrada

Function v4 con:

- adapter delgado;
- service separado;
- dependencia sustituible;
- tests existentes.

### Esperado

Debe:

- reconocer arquitectura adecuada;
- `architectureGap` vacío o mínimo;
- testabilidad `HIGH`;
- no inventar refactor;
- no generar `STRUCTURAL` innecesario.

## Caso 2 — Lógica dentro del Azure adapter

### Entrada

Entrypoint contiene:

- validaciones;
- reglas;
- creación de SDK;
- persistencia.

### Esperado

Debe:

- documentar arquitectura actual;
- identificar gap;
- generar acciones `STRUCTURAL`;
- indicar extracción hacia capability;
- no modificar código.

## Caso 3 — Cosmos acoplado

### Entrada

Service funcional construye `CosmosClient` directamente.

### Esperado

Debe:

- identificar acoplamiento de infraestructura;
- evaluar necesidad de contrato;
- generar acción arquitectónica si corresponde;
- no imponer interfaz si no aporta un límite real.

## Caso 4 — MongoDB compartido

### Entrada

Function consume un repository Mongo usado también por otra Function.

### Esperado

Debe:

- referenciar el `resourceId` compartido;
- describir uso;
- no crear una acción duplicada para migrar el recurso.

## Caso 5 — SQL compartido

### Entrada

Varias Functions utilizan la misma infraestructura SQL.

### Esperado

Debe:

- identificar recurso compartido;
- registrar ownership;
- distinguir dependencia funcional de tecnología subyacente.

## Caso 6 — Shared resource no confirmado

### Entrada

Discovery marcó un candidato como `INFERRED`.

### Esperado

El análisis debe:

- confirmar o descartar la relación;
- no elevarlo automáticamente a `CONFIRMED`.

## Caso 7 — Capability compartida

### Entrada

Dos Functions pertenecen al mismo proceso funcional.

### Esperado

Debe:

- reconocer capability común cuando la evidencia lo soporte;
- no crear artificialmente una capability por Function.

## Caso 8 — Function legacy

### Entrada

Function con `function.json` y `context`.

### Esperado

Debe generar:

- comportamiento a preservar;
- arquitectura actual;
- acciones estructurales cuando corresponda;
- `REQUIRED_PLATFORM`;
- tests propuestos.

No debe migrar.

## Caso 9 — Function ya v4

### Entrada

Function registrada mediante `app.http`.

### Esperado

Debe:

- marcar Programming Model satisfecho;
- no generar acción de migración v4;
- continuar analizando arquitectura, Node y testabilidad.

## Caso 10 — Durable Orchestrator

### Entrada

Orchestrator con Activities y decisiones.

### Esperado

Debe:

- identificar rol;
- registrar contexto mínimo del workflow;
- detectar riesgos de determinismo;
- no migrarlo.

## Caso 11 — Testabilidad

### Entrada

Function sin tests pero con lógica pura y dependencias sustituibles.

### Esperado

No debe clasificar automáticamente `LOW`.

La clasificación debe basarse en estructura, no en existencia de tests.

## Caso 12 — Architecture target

### Entrada

Function cuya estructura actual no cumple la arquitectura objetivo.

### Esperado

Debe describir explícitamente:

- `currentArchitecture`;
- `targetArchitecture`;
- `architectureGap`.

## Caso 13 — No carpetas innecesarias

### Entrada

Function muy simple.

### Esperado

La arquitectura propuesta puede ser:

- adapter;
- service;
- tests.

No debe exigir:

- domain;
- application;
- infrastructure;

si no aportan responsabilidad real.

## Caso 14 — Node.js 24 desconocido

### Entrada

Uso de dependencia cuya compatibilidad no está confirmada.

### Esperado

Debe usar:

`REQUIRES_VALIDATION`

No asumir compatibilidad por compilación.

## Caso 15 — requiredActions

### Entrada

Function con:

- adapter legacy;
- Cosmos acoplado;
- deuda de naming.

### Esperado

Debe diferenciar:

- `REQUIRED_PLATFORM`;
- `STRUCTURAL`;
- posiblemente `REQUIRED_TESTABILITY`;
- `TECHNICAL_DEBT`.

La deuda no debe convertirse en acción obligatoria.

## Caso 16 — Catálogo individual

### Entrada

Análisis completo.

### Esperado

Debe crear:

`.migration/catalog/functions/<FunctionName>.md`

representando el estado BEFORE.

Debe incluir:

- comportamiento;
- arquitectura actual;
- dependencias;
- recursos compartidos;
- relaciones;
- testabilidad;
- riesgos;
- unknowns.

No debe describir el resultado futuro como ya implementado.

## Caso 17 — Contradicción con inventory

### Entrada

Inventory indica un modelo o dependencia diferente a lo observado.

### Esperado

Debe:

- registrar contradicción;
- preservar evidencia;
- usar `UNKNOWN` o revisión cuando sea necesario.
