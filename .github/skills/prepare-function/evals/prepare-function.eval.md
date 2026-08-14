# Evals — Prepare Function

## Objetivo

Validar que `prepare-function` ejecute únicamente las acciones locales de preparation aprobadas para una Function,
preservando su comportamiento observable y habilitando la testabilidad necesaria sin:

- migrar plataforma;
- generar nuevas pruebas de comportamiento;
- reinterpretar planning;
- crear Action IDs;
- imponer una arquitectura objetivo;
- ejecutar acciones globales o shared propietarias.

Debe distinguir:

```text
planning
→ FN-* aprobadas

prepare-function
→ ejecución local

generate-function-tests
→ protección mediante tests

migration
→ cambio de plataforma
```

## Caso 1 — Preparation no aplicable

### Entrada

La Function no posee acciones locales de preparation requeridas.

### Esperado

Status:

`NOT_APPLICABLE`

No modificar código únicamente para producir una preparation.

## Caso 2 — Acción local ejecutada

### Entrada

El migration plan contiene:

`FN-REQUESTREPORT-001`

asignada a preparation.

### Esperado

Ejecutar la acción conservando exactamente:

`FN-REQUESTREPORT-001`

Registrar:

`executionStatus = COMPLETED`

No generar un Action ID nuevo.

## Caso 3 — Action ID proviene de planning

### Entrada

`analysis.json` contiene `migrationNeeds` sin IDs.

El migration plan contiene:

`FN-REQUESTREPORT-001`

### Esperado

Utilizar el Action ID del plan.

No buscar ni esperar `FN-*` dentro de:

`analysis.json`

## Caso 4 — Solo acciones de preparation

### Entrada

El plan contiene:

- `FN-REQUESTREPORT-001` — `STRUCTURAL`, phase preparation;
- `FN-REQUESTREPORT-002` — Programming Model migration.

### Esperado

Ejecutar únicamente:

`FN-REQUESTREPORT-001`

No ejecutar la acción de Programming Model.

## Caso 5 — Acción no requerida

### Entrada

El plan contiene:

```text
type = STRUCTURAL
requiredForMigration = false
```

### Esperado

No ejecutarla como trabajo obligatorio.

Su existencia no impide cerrar preparation cuando las acciones requeridas estén completas.

## Caso 6 — Adapter con lógica

### Entrada

El Azure adapter contiene lógica funcional y el plan contiene una acción estructural concreta para extraer únicamente
una parte necesaria para testabilidad.

### Esperado

Extraer únicamente lo requerido por el plan.

No utilizar preparation para limpiar completamente el adapter.

No rediseñar la capability.

## Caso 7 — Estructura actual válida

### Entrada

La Function ya posee una estructura coherente y la migración no requiere cambios estructurales.

### Esperado

Preservar la estructura.

No crear por anticipado:

- `domain`;
- `application`;
- `infrastructure`;
- `shared`;
- nuevas interfaces;
- factories.

No imponer paths específicos.

## Caso 8 — No target architecture

### Entrada

Existe coupling relevante pero el plan solo requiere un seam mínimo.

### Esperado

Ejecutar el seam mínimo.

No producir o implementar:

- `targetArchitecture`;
- arquitectura ideal;
- reorganización completa de carpetas.

## Caso 9 — Contract real

### Entrada

Una dependencia externa necesita un boundary para poder sustituirse durante tests.

El plan contiene una acción aprobada.

### Esperado

Puede crear un contract con responsabilidad real.

Ejemplo:

`ReportRepository`

No imponer:

`*.port.ts`

No crear interfaces adicionales sin necesidad.

## Caso 10 — Contract innecesario

### Entrada

La Function utiliza una función pura sin dependencia externa.

### Esperado

No crear una interface únicamente por consistencia arquitectónica.

## Caso 11 — Cosmos directo requerido para testabilidad

### Entrada

Código funcional construye:

`CosmosClient`

directamente.

El plan contiene una acción:

`REQUIRED_TESTABILITY`

para introducir un seam mínimo.

### Esperado

Ejecutar únicamente el aislamiento necesario.

No refactorizar toda la infraestructura Cosmos.

## Caso 12 — Cosmos directo sin acción

### Entrada

Código construye directamente `CosmosClient`.

El plan no contiene una acción local de preparation asociada.

### Esperado

No modificarlo únicamente porque el patrón podría mejorarse.

Registrar una desviación o finding solo si impide cumplir una acción requerida.

## Caso 13 — Shared dependency completada

### Entrada

Una acción local depende de:

`SR-ACTION-001`

y esa acción shared está:

`COMPLETED`

### Esperado

La acción local puede continuar.

Debe reutilizar el resource ID y owner existente.

No crear una implementación alternativa.

## Caso 14 — Shared dependency pendiente

### Entrada

Una acción local requerida contiene:

```text
dependsOn = SR-ACTION-001
```

pero la acción shared no está completada.

### Esperado

No ejecutar la acción dependiente.

No crear una implementación local alternativa.

Si esto impide completar preparation:

`status = BLOCKED`

## Caso 15 — Shared resource confirmado

### Entrada

La relación local con:

`SR-COSMOS-REPORTS`

está confirmada.

### Esperado

Usar:

`evidenceStatus = CONFIRMED`

No:

`status = CONFIRMED`

## Caso 16 — No ejecutar SR-ACTION localmente

### Entrada

Existe:

`SR-ACTION-001`

para modificar una implementación compartida.

### Esperado

`prepare-function` no debe ejecutar esa acción propietaria como si fuera una adaptación local.

Solo debe ejecutar las `FN-*` correspondientes a la Function.

## Caso 17 — Adaptación local de dependency

### Entrada

La actualización global de una dependencia ya fue ejecutada.

El plan contiene una `FN-*` para adaptar una API consumida localmente.

### Esperado

Puede modificar únicamente el consumidor local requerido.

No volver a modificar:

- `package.json`;
- lockfile;
- dependency version.

## Caso 18 — No seleccionar dependency version

### Entrada

Durante una adaptación local se detecta una versión aparentemente mejor.

### Esperado

No seleccionarla.

No modificar el target aprobado.

No ejecutar:

`npm install <package>@latest`

La versión pertenece al plan/baseline.

## Caso 19 — process.env requerido para testabilidad

### Entrada

La Function utiliza:

`process.env.REPORT_DATABASE`

y el plan requiere un seam para permitir testing.

### Esperado

Puede aislar la referencia cuando sea necesario.

Registrar únicamente:

`REPORT_DATABASE`

Nunca leer ni copiar el valor real.

## Caso 20 — process.env sin necesidad

### Entrada

Existe una referencia a:

`process.env.REPORT_DATABASE`

pero no bloquea ninguna acción requerida.

### Esperado

No crear automáticamente un config provider o abstraction.

La existencia de `process.env` por sí sola no obliga a cambiar estructura.

## Caso 21 — Seguridad

### Entrada

Existen:

- `.env`;
- `local.settings.json`;
- pipelines;
- certificados.

### Esperado

No leer ni modificar su contenido.

No incluir secretos en:

- source nuevo;
- tests helpers;
- logs;
- preparation artifacts.

## Caso 22 — Programming Model v3 preservado

### Entrada

La Function todavía utiliza Programming Model v3.

Preparation requiere un cambio estructural local.

### Esperado

Ejecutar el cambio preservando temporalmente PM v3.

No migrar registrations.

La migración pertenece a:

`migrate-programming-model-v4`

## Caso 23 — Programming Model v4 preservado

### Entrada

La Function ya utiliza Programming Model v4.

### Esperado

Preparation no debe degradarla ni recrear un adapter v3.

Debe preservar su modelo actual.

## Caso 24 — Durable Activity

### Entrada

La Function es una Durable Activity.

Existe una acción estructural local aprobada.

### Esperado

Puede ejecutar cambios internos mínimos.

Debe preservar:

- Activity name;
- input;
- output;
- relevant errors;
- observable side effects.

No modificar la semántica del workflow.

## Caso 25 — Durable orchestrator

### Entrada

La Function es un orchestrator.

Una acción de preparation habilita testabilidad.

### Esperado

No modificar:

- workflow graph;
- Activity ordering;
- retries;
- timers;
- external events;
- orchestration semantics.

No introducir I/O no determinista.

## Caso 26 — Preparación para testing

### Entrada

Un comportamiento requerido no puede probarse porque una dependencia está construida rígidamente.

El plan contiene:

`REQUIRED_TESTABILITY`

### Esperado

Puede introducir únicamente el seam mínimo aprobado.

Debe registrar el resultado en:

`testabilityPreparation`

No generar todavía behavioral tests.

## Caso 27 — No generar tests

### Entrada

El plan contiene:

`testingRequirements`

pendientes.

### Esperado

`prepare-function` no debe crear:

- Jest test files;
- characterization tests;
- unit tests nuevos.

Debe conservar los requirements pendientes para:

`generate-function-tests`

## Caso 28 — testingRequirementsPending

### Entrada

Preparation estructural termina correctamente.

El plan todavía contiene requirements que deben cubrirse antes de migration.

### Esperado

Registrar:

`testingRequirementsPending`

La existencia de esos requirements no impide necesariamente:

`READY_FOR_MIGRATION`

como status de preparation.

No implica permiso para saltar el gate de testing posterior.

## Caso 29 — Tests existentes

### Entrada

La Function ya posee tests relevantes.

### Esperado

Puede ejecutarlos selectivamente para detectar regresiones provocadas por preparation.

No reescribirlos únicamente por estilo.

Registrar el resultado bajo:

`existingTestBaseline`

## Caso 30 — Tests inexistentes

### Entrada

No existen tests previos.

### Esperado

Puede registrar:

```text
existingTestBaseline.status = NOT_APPLICABLE
```

o equivalente según el contrato.

No generar tests desde preparation.

La ausencia de tests no bloquea preparation por sí sola.

## Caso 31 — Existing test baseline PASS

### Entrada

Existen tests relevantes y fueron ejecutados después de preparation.

Todos pasan.

### Esperado

Registrar:

`status = PASS`

con evidencia.

No utilizar:

`executionStatus = PASS`

## Caso 32 — Existing test baseline FAIL por regresión de preparation

### Entrada

Una prueba existente que era válida falla después de un cambio ejecutado por preparation y la evidencia vincula el fallo
con esa modificación.

### Esperado

No producir:

`READY_FOR_MIGRATION`

sin resolver el impacto mediante el flujo correspondiente.

No modificar el test para aceptar la regresión.

El resultado puede ser:

`BLOCKED`

o:

`REQUIRES_REVIEW`

según la evidencia.

## Caso 33 — Existing baseline no ejecutada

### Entrada

Existen tests relevantes pero no pudieron ejecutarse.

### Esperado

Registrar:

`NOT_EXECUTED`

No afirmar:

`PASS`

La consecuencia sobre el status principal depende de si esa validación era necesaria para cerrar preparation.

## Caso 34 — No baseline verde obligatoria cuando todavía debe generarse testing

### Entrada

No existía baseline de comportamiento antes de preparation.

Preparation habilitó testabilidad correctamente.

El plan requiere que `generate-function-tests` se ejecute después.

### Esperado

Preparation puede finalizar:

`READY_FOR_MIGRATION`

si todas sus propias acciones requeridas están completas.

Debe dejar:

`testingRequirementsPending`

explícitos.

No inventar una baseline `PASS`.

## Caso 35 — Action result

### Entrada

Se ejecuta:

`FN-REQUESTREPORT-001`

### Esperado

`preparation.json` debe registrar:

```text
actionId = FN-REQUESTREPORT-001
executionStatus = COMPLETED
```

No utilizar únicamente:

`requiredActionsExecuted`

## Caso 36 — Acción fallida

### Entrada

Una acción local fue ejecutada pero produjo un fallo técnico.

### Esperado

Registrar:

`executionStatus = FAILED`

No marcar:

`COMPLETED`

La consecuencia sobre el artifact principal debe reflejar el blocker correspondiente.

## Caso 37 — Acción no ejecutada

### Entrada

Una acción fue evaluada pero no pudo ejecutarse.

### Esperado

Registrar:

`executionStatus = NOT_EXECUTED`

cuando corresponda.

No asumir éxito por ausencia de excepción.

## Caso 38 — No nuevos Action IDs

### Entrada

Durante preparation se descubre una nueva necesidad estructural.

### Esperado

No crear:

`FN-REQUESTREPORT-999`

Debe:

- registrar la nueva necesidad;
- no ejecutarla silenciosamente;
- agregarla a `deviationsFromPlan`;
- volver a planning cuando sea requerida.

## Caso 39 — No modificar migration plan

### Entrada

El estado actual no coincide con una premisa del plan.

### Esperado

No editar silenciosamente:

`.migration/functions/<FunctionName>/migration-plan.json`

Registrar:

- evidencia;
- desviación;
- blocker o review.

## Caso 40 — Refactor mayor no aprobado

### Entrada

Una acción aparentemente mínima revela que completarla requeriría modificar una parte significativamente mayor del
sistema de lo aprobado.

### Esperado

No ampliar silenciosamente el cambio.

Status:

`REQUIRES_REVIEW`

cuando sea necesaria decisión humana.

No necesita utilizar una clasificación adicional como:

`SIGNIFICANT`

## Caso 41 — Legacy service grande

### Entrada

La Function utiliza una pequeña parte de un service legacy grande.

La preparación puede completarse mediante un boundary mínimo.

### Esperado

No refactorizar todo el service.

Puede ejecutar únicamente el provider/seam requerido por el plan.

El resto puede permanecer como technical debt.

## Caso 42 — LOC no autoriza refactor

### Entrada

Un service tiene muchas líneas de código.

No existe evidencia de que sea necesario modificarlo para preparation.

### Esperado

No refactorizarlo únicamente por tamaño.

LOC es una señal, no una orden de cambio.

## Caso 43 — Catálogo BEFORE

### Entrada

Existe:

`.migration/catalog/functions/<FunctionName>.md`

### Esperado

No modificar sus secciones BEFORE.

Los resultados de esta etapa viven en:

`.migration/functions/<FunctionName>/preparation.json`

y:

`.migration/functions/<FunctionName>/preparation.md`

## Caso 44 — preparation.json

### Entrada

Preparation concluye.

### Esperado

Crear:

`.migration/functions/<FunctionName>/preparation.json`

con cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `planRef`;
- `behaviorPreserved`;
- `actionResults`;
- `structuralChanges`;
- `resultingStructure`;
- `sharedResources`;
- `sharedActionDependencies`;
- `filesModified`;
- `contractsIntroduced`;
- `infrastructureIsolated`;
- `testabilityPreparation`;
- `existingTestBaseline`;
- `testingRequirementsPending`;
- `validations`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `technicalDebtRemaining`;
- `evidence`.

No incluir:

`testsAdded`

como responsabilidad de esta etapa.

## Caso 45 — preparation.md

### Entrada

Preparation produce vista humana.

### Esperado

Crear:

`.migration/functions/<FunctionName>/preparation.md`

usando:

`function-preparation.template.md`

El JSON permanece como owner estructurado.

## Caso 46 — Behavior preserved requiere evidencia

### Entrada

Preparation modifica estructura pero no existen pruebas suficientes para demostrar todos los contratos.

### Esperado

No afirmar de forma absoluta:

`behaviorPreserved = true`

sin evidencia suficiente.

Debe conservar:

- unknowns;
- validations;
- testing requirements pendientes;

según corresponda.

## Caso 47 — READY_FOR_MIGRATION

### Entrada

Todas las acciones de preparation con:

`requiredForMigration = true`

están:

- `COMPLETED`;
- o justificadamente `NOT_APPLICABLE`.

Además:

- dependencies requeridas están disponibles;
- shared dependencies requeridas están satisfechas;
- no existe blocker local.

### Esperado

Status:

`READY_FOR_MIGRATION`

Los testing requirements posteriores pueden seguir visibles.

## Caso 48 — READY_FOR_MIGRATION no salta testing

### Entrada

Preparation terminó correctamente.

Existe:

```text
testingRequirement.requiredBeforeMigration = true
```

todavía pendiente.

### Esperado

`prepare-function` puede cerrar su propia etapa como:

`READY_FOR_MIGRATION`

pero no debe afirmar que la acción de migration ya está habilitada.

El gate pertenece al flujo posterior y a:

`generate-function-tests`.

## Caso 49 — NOT_APPLICABLE

### Entrada

No existen acciones locales de preparation.

### Esperado

Status:

`NOT_APPLICABLE`

No crear cambios ficticios.

## Caso 50 — BLOCKED

### Entrada

Un impedimento técnico conocido impide completar una acción local requerida.

### Esperado

Status:

`BLOCKED`

Registrar:

- actionId;
- blocker;
- evidence.

## Caso 51 — REQUIRES_REVIEW

### Entrada

Completar preparation requiere una decisión humana.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolverla silenciosamente.

## Caso 52 — No PARTIAL

### Entrada

Parte de las acciones locales pudo ejecutarse, pero otra acción requerida permanece bloqueada.

### Esperado

No introducir un status principal:

`PARTIAL`

porque no forma parte del contrato de Function preparation.

Usar:

`BLOCKED`

o:

`REQUIRES_REVIEW`

según la causa.

Los resultados individuales permanecen en:

`actionResults`.

## Caso 53 — No build global final

### Entrada

Preparation local termina.

### Esperado

No ejecutar el build global final como gate de esta etapa.

Puede realizar únicamente validaciones locales/selectivas cuando aporten evidencia.

El build global pertenece a:

`verify-function-app`.

## Caso 54 — Validaciones

### Entrada

Se ejecuta una validación local relacionada con preparation.

### Esperado

Usar:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

No mezclar estos valores con:

`executionStatus`

o:

`evidenceStatus`.

## Caso 55 — Desviación del plan

### Entrada

Preparation produce un efecto no descrito exactamente en el plan pero necesario como consecuencia directa del cambio
aprobado.

### Esperado

Registrar:

`deviationsFromPlan`

cuando corresponda.

Una desviación no autoriza trabajo nuevo fuera de scope.

## Caso 56 — Technical debt permanece fuera

### Entrada

Existe deuda técnica no necesaria para migration.

### Esperado

No resolverla.

Puede permanecer registrada en:

`technicalDebtRemaining`

No impide:

`READY_FOR_MIGRATION`

si no es bloqueante.

## Caso 57 — Optimization fuera de scope

### Entrada

Durante preparation se detecta una mejora de rendimiento.

### Esperado

No implementarla.

No convertirla en una acción requerida.

## Caso 58 — Lessons opcionales

### Entrada

Preparation concluye sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/prepare-function/<FunctionName>.*`

no impide cerrar preparation.

No crear artifacts vacíos por obligación.

## Criterio general

`prepare-function` debe responder:

```text
¿qué acciones locales de preparation aprobadas ejecuté?
```

```text
¿qué resultado tuvo cada una?
```

```text
¿la Function quedó estructuralmente preparada para las siguientes etapas?
```

No debe responder:

```text
¿qué tests nuevos debo generar y ejecutar?
```

ni:

```text
¿cómo migro el Programming Model?
```

Invariantes:

```text
analysis
→ migrationNeeds
```

```text
planning
→ FN-*
```

```text
prepare-function
→ actionResults
```

```text
FN-* de preparation
≠ todas las FN-* del plan
```

```text
testability preparation
≠ generated tests
```

```text
existingTestBaseline
≠ testing.json
```

```text
READY_FOR_MIGRATION
≠ testing gate satisfied automáticamente
```

```text
structural change
→ solo cuando está aprobado
```

```text
shared resource
→ no implementación local alternativa
```

```text
new need
→ deviation / replan
→ no nuevo Action ID
```

```text
prepare-function
≠ generate-function-tests
≠ migrate-programming-model-v4
≠ migrate-durable-functions-v4
```
