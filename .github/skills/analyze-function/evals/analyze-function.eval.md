# Evals — Analyze Function

## Objetivo

Validar que `analyze-function` analice en profundidad una Function dentro del contexto de migración y produzca evidencia
local sobre:

- comportamiento observable;
- dependencias;
- impacto de migración;
- estructura actual relevante;
- testabilidad;
- recursos compartidos;
- coupling legacy;
- riesgos;
- necesidades de migración;

sin:

- modificar código;
- diseñar una arquitectura target;
- generar Action IDs;
- decidir execution order;
- construir migration plans;
- ampliar automáticamente el scope.

## Caso 1 — Function simple sin necesidad estructural

### Entrada

Function con:

- adapter delgado;
- lógica separada;
- dependencia sustituible;
- tests existentes.

### Esperado

Debe:

- documentar el slice actual relevante;
- reconocer testabilidad alta cuando exista evidencia;
- no inventar necesidades estructurales;
- no exigir reorganización;
- no generar acciones.

`structuralNeeds` puede quedar vacío.

## Caso 2 — Lógica dentro del Azure adapter

### Entrada

Entrypoint contiene:

- validaciones;
- reglas funcionales;
- creación de SDK;
- persistencia.

### Esperado

Debe:

- documentar la estructura actual;
- identificar coupling relevante para migración;
- evaluar impacto sobre testabilidad y adaptación;
- registrar `migrationNeeds` o `structuralNeeds` cuando sean realmente necesarios.

No debe:

- crear `FN-*`;
- diseñar una capability target completa;
- modificar código.

## Caso 3 — Cosmos acoplado

### Entrada

Código funcional construye `CosmosClient` directamente.

### Esperado

Debe:

- identificar dependencia directa de infraestructura;
- identificar consumidores relevantes;
- evaluar impacto sobre migración y testabilidad;
- registrar necesidad de boundary únicamente cuando exista razón concreta.

No debe imponer una interface por regla general.

No debe crear una acción ejecutable.

## Caso 4 — Recurso compartido confirmado

### Entrada

La Function consume un recurso previamente identificado como:

`SR-COSMOS-REPORTS`

y existe evidencia suficiente de reutilización.

### Esperado

Debe:

- referenciar `resourceId`;
- describir cómo la Function lo consume;
- registrar dependencia local relevante;
- evitar duplicar una necesidad shared como si fuera exclusivamente local.

No debe crear:

`SR-ACTION-*`

La consolidación y ownership ejecutable pertenecen a planning.

## Caso 5 — Recurso aparentemente compartido

### Entrada

Varias Functions utilizan la misma tecnología SQL.

No existe evidencia suficiente de que representen el mismo recurso.

### Esperado

No debe afirmar shared ownership únicamente por tecnología.

Debe mantener:

`evidenceStatus = INFERRED`

o:

`UNKNOWN`

según corresponda.

No fusionar recursos.

## Caso 6 — Shared candidate inferido

### Entrada

Discovery marcó un candidato shared con:

`evidenceStatus = INFERRED`

### Esperado

Analysis debe evaluar el uso concreto de esta Function.

Puede:

- confirmar la relación;
- mantenerla inferida;
- descartarla.

No debe elevarla automáticamente a:

`CONFIRMED`

sin nueva evidencia.

## Caso 7 — Capability observable

### Entrada

Dos Functions pertenecen aparentemente al mismo proceso funcional.

### Esperado

Puede registrar una capability común únicamente cuando exista evidencia suficiente.

No debe crear:

- una capability artificial por Function;
- una estructura de carpetas target;
- una acción de reorganización solo por naming.

## Caso 8 — Function Programming Model v3

### Entrada

Function utiliza:

- `function.json`;
- `context`;
- modelo confirmado `V3`.

### Esperado

Debe registrar:

- comportamiento observable a preservar;
- impacto local del Programming Model;
- `actionStatus = REQUIRED` para esa dimensión cuando el target es v4;
- `migrationNeeds` relacionados cuando corresponda;
- necesidades de testing.

No debe:

- migrar;
- crear `FN-*`;
- generar migration plan.

## Caso 9 — Function ya Programming Model v4

### Entrada

Function registrada mediante:

`app.http(...)`

### Esperado

Debe registrar:

```text
Programming Model = V4
actionStatus = NOT_REQUIRED
```

para esa dimensión.

Debe continuar evaluando cuando corresponda:

- Node.js;
- dependencias;
- testabilidad;
- coupling;
- Durable;
- otros impactos técnicos.

No debe generar necesidad PM v4.

## Caso 10 — Durable Orchestrator

### Entrada

Orchestrator con:

- Activities;
- branching;
- retries o timers.

### Esperado

Debe:

- identificar rol Durable;
- registrar contexto mínimo del workflow;
- identificar relaciones relevantes;
- registrar riesgos de determinismo cuando exista evidencia;
- identificar posible impacto sobre scope.

No debe:

- migrar el workflow;
- decidir automáticamente `effectiveScope`;
- rediseñar topology.

## Caso 11 — Durable Activity

### Entrada

Function identificada como:

`ACTIVITY`

### Esperado

Debe analizarla como Function local y registrar:

- input;
- output;
- errors;
- observable side effects;
- relación con workflow cuando exista evidencia.

No debe exigir análisis completo del workflow si no es necesario para comprender la Activity.

## Caso 12 — Testabilidad alta sin tests existentes

### Entrada

Function sin tests pero con:

- lógica pura;
- dependencies sustituibles;
- boundaries claros.

### Esperado

No debe clasificar automáticamente la testabilidad como `LOW`.

Puede utilizar:

`HIGH`

o:

`MEDIUM`

según evidencia.

La existencia de tests y la testabilidad son dimensiones distintas.

## Caso 13 — Testabilidad limitada

### Entrada

Function:

- construye clientes externos internamente;
- lee configuración rígidamente;
- mezcla runtime y lógica;
- no posee seams sustituibles.

### Esperado

Debe registrar:

- limitaciones concretas;
- seams potencialmente necesarios;
- `testingNeeds`;
- necesidad `REQUIRED_TESTABILITY` cuando corresponda.

No debe modificar producción.

No debe generar tests.

## Caso 14 — No target architecture

### Entrada

La estructura actual presenta coupling relevante para migración.

### Esperado

Debe describir:

- estructura actual relevante;
- problema concreto;
- impacto;
- necesidad estructural cuando corresponda.

No debe producir:

- `targetArchitecture`;
- `architectureGap`;
- arquitectura ideal completa.

## Caso 15 — No estructura innecesaria

### Entrada

Function pequeña cuyo comportamiento puede migrarse preservando su estructura actual.

### Esperado

No debe exigir:

- `domain`;
- `application`;
- `infrastructure`;
- `shared`;
- interfaces;
- factories;
- nuevas carpetas.

No debe generar una necesidad estructural únicamente por preferencia arquitectónica.

## Caso 16 — Node.js 24 con compatibilidad desconocida

### Entrada

La Function utiliza una dependencia o API cuya compatibilidad con Node.js 24 no está suficientemente demostrada.

### Esperado

Debe separar:

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

cuando corresponda.

No asumir compatibilidad porque:

- TypeScript compile;
- package installation;
- package metadata;

parezcan correctos.

## Caso 17 — Dependency impact requerido

### Entrada

Assessment marca una dependencia:

```text
impactAnalysisRequired = true
actionStatus = REQUIRED
```

La Function es consumidora.

### Esperado

Analysis debe identificar:

- imports o usos relevantes;
- APIs consumidas;
- impacto local conocido;
- unknowns;
- migration needs.

No debe volver a elegir la versión target.

No debe modificar baseline.

## Caso 18 — Dependency sin impacto local

### Entrada

Assessment marca una dependencia global para impact analysis.

La Function analizada no la consume directa ni transitivamente dentro del slice relevante.

### Esperado

No debe inventar una adaptación local.

Puede registrar:

```text
NOT_APPLICABLE
```

o ausencia de impacto local, según el campo correspondiente.

No generar migration need solo porque el package exista en la Function App.

## Caso 19 — migrationNeeds sin Action IDs

### Entrada

La Function requiere:

- adaptación del Programming Model;
- seam de testabilidad;
- adaptación local de Cosmos.

### Esperado

Debe registrar necesidades conceptualmente como:

```json
{
  "migrationNeeds": [
    {
      "type": "REQUIRED_PLATFORM",
      "need": "Migrar la integración Azure Functions al Programming Model v4"
    },
    {
      "type": "REQUIRED_TESTABILITY",
      "need": "Introducir un seam mínimo para sustituir la dependencia externa"
    },
    {
      "type": "REQUIRED_DEPENDENCY",
      "need": "Adaptar el uso local de la API Cosmos aprobada"
    }
  ]
}
```

No debe generar:

- `FN-*`;
- `GLOBAL-*`;
- `SR-ACTION-*`;
- `dependsOn`;
- execution order.

## Caso 20 — Technical debt separada

### Entrada

Function presenta:

- adaptación PM requerida;
- naming inconsistente no bloqueante;
- servicio grande no necesario de refactorizar para migrar.

### Esperado

Debe separar:

- necesidades de migración;
- technical debt;
- optimizations.

La deuda no debe convertirse automáticamente en:

`requiredForMigration = true`

Ese campo pertenece a planning.

## Caso 21 — Legacy coupling

### Entrada

La Function depende de un service grande con múltiples responsabilidades.

### Esperado

Debe evaluar el coupling utilizando cuando corresponda:

- `NONE`;
- `LEGACY_COUPLING`;
- `LEGACY_MONOLITH_CANDIDATE`;
- `REQUIRES_REVIEW`.

La clasificación debe basarse en evidencia estructural y de responsabilidades.

LOC puede utilizarse como señal.

LOC por sí solo no debe producir:

`LEGACY_MONOLITH_CANDIDATE`.

## Caso 22 — Legacy provider temporal posible

### Entrada

La Function utiliza una pequeña parte de un service legacy grande.

La migración no requiere refactorizar todo el service.

### Esperado

Analysis puede identificar una necesidad de boundary mínimo o provider temporal.

No debe proponer obligatoriamente refactorizar el servicio completo.

No debe convertir modernización futura en requisito técnico actual.

## Caso 23 — Afectación fuera del scope

### Entrada

La Function solicitada consume código compartido utilizado también por otras Functions.

### Esperado

Debe registrar cuando corresponda:

`affectedFunctionsOutsideScope`

con evidencia.

No debe:

- ampliar automáticamente el scope;
- decidir `effectiveScope`;
- crear planes para las otras Functions.

Planning decide el scope efectivo.

## Caso 24 — Durable puede requerir ampliación de scope

### Entrada

La Function seleccionada pertenece a un workflow Durable y existen participantes relacionados necesarios para una
migración coherente.

### Esperado

Analysis debe registrar:

- workflow relacionado;
- participants observados;
- posible impacto sobre scope;
- evidencia.

No debe decidir automáticamente:

`effectiveScope = WORKFLOW`

La decisión pertenece a planning.

## Caso 25 — Catálogo individual BEFORE ausente

### Entrada

No existe:

`.migration/catalog/functions/<FunctionName>.md`

y existe evidencia suficiente para documentar el estado original.

### Esperado

Puede crear la ficha histórica BEFORE utilizando:

`function-current-state.template.md`

Debe incluir únicamente estado observable relevante.

No debe incluir:

- target architecture;
- Action IDs;
- cambios futuros como ya ejecutados.

## Caso 26 — Catálogo individual BEFORE existente

### Entrada

Ya existe una ficha BEFORE válida:

`.migration/catalog/functions/<FunctionName>.md`

### Esperado

Debe reutilizarla.

No sobrescribir sus secciones históricas con el estado actual posterior a cambios.

Puede referenciarla desde analysis.

## Caso 27 — Contradicción con inventory

### Entrada

Inventory indica una relación, modelo o dependencia distinta de la evidencia local observada.

### Esperado

Debe:

- registrar la contradicción;
- preservar ambas evidencias;
- no sobrescribir silenciosamente inventory;
- utilizar `UNKNOWN` o `REQUIRES_REVIEW` cuando corresponda.

## Caso 28 — Analysis status READY

### Entrada

Existe evidencia suficiente para:

- comprender comportamiento relevante;
- identificar impactos;
- registrar migration needs;
- permitir planning seguro.

### Esperado

Status:

`READY`

No significa que no exista technical debt.

## Caso 29 — Analysis status PARTIAL

### Entrada

Existen unknowns locales, pero hay suficiente evidencia para planificar trabajo independiente de forma segura.

### Esperado

Status:

`PARTIAL`

Los unknowns deben permanecer explícitos.

## Caso 30 — Analysis status BLOCKED

### Entrada

Falta información necesaria para identificar de forma segura un impacto requerido por la migración.

### Esperado

Status:

`BLOCKED`

Debe registrar qué información impide continuar.

## Caso 31 — Analysis status REQUIRES_REVIEW

### Entrada

Existe una decisión humana necesaria que impide cerrar el análisis.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolver la decisión silenciosamente.

## Caso 32 — No migration plan

### Entrada

Analysis identifica correctamente todos los impactos locales.

### Esperado

No debe producir:

- execution order;
- `dependsOn`;
- `requiredForMigration`;
- Action IDs;
- migration steps;
- migration plan.

El siguiente owner es:

`plan-function-migration`

## Caso 33 — Testing needs, no tests generados

### Entrada

Analysis detecta que debe protegerse:

- happy path;
- validation error;
- external failure.

### Esperado

Debe registrar `testingNeeds` o requisitos equivalentes.

No debe:

- crear archivos Jest;
- escribir casos de prueba completos como artifact de ejecución;
- marcar testing como `PASS`.

La generación pertenece a:

`generate-function-tests`.

## Caso 34 — Shared resource ownership no consolidado

### Entrada

La Function consume un recurso que parece compartido por varias Functions.

### Esperado

Analysis puede registrar:

- resource candidate/ref;
- uso local;
- consumidores observados;
- evidencia.

No debe consolidar definitivamente:

- ownership;
- `SR-ACTION-*`;
- migration order.

Planning es owner de esa consolidación.

## Caso 35 — Lessons opcionales

### Entrada

Analysis concluye correctamente sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/analyze-function/`

no debe impedir cerrar analysis.

No crear artifacts de lessons vacíos como requisito.

## Criterio general

`analyze-function` debe responder:

```text
¿cómo funciona esta Function hoy?
```

```text
¿qué partes de su slice se verán afectadas por la migración?
```

```text
¿qué necesidades deben llegar a planning?
```

No debe responder:

```text
¿cuáles son los Action IDs?
```

ni:

```text
¿en qué orden debemos ejecutar las acciones?
```

Invariantes:

```text
analysis
→ migrationNeeds
```

```text
planning
→ Action IDs
```

```text
current structure
≠ target architecture
```

```text
structural need
≠ mandatory refactor
```

```text
testingNeed
≠ generated test
```

```text
affectedFunctionsOutsideScope
≠ effectiveScope
```

```text
shared usage
≠ consolidated ownership
```

```text
legacy size
≠ monolith proof
```

```text
analysis
≠ planning
≠ execution
```
