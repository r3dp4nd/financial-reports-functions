# Evals — Migrate Durable Functions v4

## Objetivo

Validar que `migrate-durable-functions-v4` migre coordinadamente un workflow Durable dentro del contexto de Azure
Functions Programming Model v4, ejecutando únicamente las acciones aprobadas y preservando:

- topology;
- participant contracts;
- determinism;
- retries;
- timers;
- external events;
- sub-orchestrations;
- entities;
- observable behavior;
- shared dependencies.

El nombre del skill no implica que el package:

`durable-functions`

deba migrar necesariamente a major v4.

El target Durable proviene del plan y baseline aprobados.

No debe:

- seleccionar nuevas dependency versions;
- rediseñar el workflow;
- optimizar paralelismo;
- modificar comportamiento funcional;
- generar tests;
- crear Action IDs;
- desplegar;
- afirmar replay safety productiva sin evidencia suficiente.

## Caso 1 — Workflow migrable

### Entrada

Existe un workflow Durable con:

- participants conocidos;
- scope coordinado por planning;
- preparation requerida completada;
- testing gates requeridos satisfechos;
- actions Durable asignadas.

### Esperado

Ejecutar la migración coordinada.

Resultado:

`status = MIGRATED`

Debe preservar la semántica observable del workflow.

## Caso 2 — Durable ausente

### Entrada

La Function App no contiene workflow Durable aplicable al scope.

### Esperado

Resultado:

`status = NOT_APPLICABLE`

No crear artifacts Durable ficticios.

## Caso 3 — Grafo insuficiente

### Entrada

La evidencia disponible no permite determinar de forma segura:

- participants;
- invocation relationships;
- topology relevante.

### Esperado

Resultado:

`status = REQUIRES_REVIEW`

No inventar el grafo.

No inferir relaciones solo por nombres de archivo.

## Caso 4 — Scope de workflow decidido por planning

### Entrada

Planning definió:

`effectiveScope`

incluyendo un workflow Durable.

### Esperado

El skill debe respetar ese scope.

No debe:

- ampliar participants;
- excluir participants requeridos;
- redefinir effectiveScope.

## Caso 5 — Workflow no incluido en effectiveScope

### Entrada

Existe otro workflow Durable en la misma Function App.

No forma parte del effectiveScope.

### Esperado

No migrarlo.

No generar artifacts para ese workflow únicamente porque fue detectado.

## Caso 6 — Action IDs de planning

### Entrada

Planning asigna:

- `FN-*`;
- acciones coordinadas Durable;

a este workflow.

### Esperado

Ejecutar únicamente los Action IDs correspondientes.

Preservar exactamente sus IDs.

No crear:

- `REQ-*`;
- nuevos `FN-*`;
- nuevos `GLOBAL-*`;
- nuevos `SR-ACTION-*`.

## Caso 7 — No ejecutar acciones de otro owner

### Entrada

El plan contiene:

- acción PM asignada a `migrate-programming-model-v4`;
- acción Durable asignada a este skill.

### Esperado

Ejecutar únicamente la acción Durable asignada.

No editar una registration que planning dejó bajo ownership del skill PM.

## Caso 8 — Registration Durable asignada a este skill

### Entrada

Planning asigna explícitamente la adaptación de registration Durable a este workflow.

### Esperado

Puede modificar esa registration como parte de la migración coordinada.

No duplicar la misma modificación en:

`migrate-programming-model-v4`.

## Caso 9 — Ownership de registration ambiguo

### Entrada

El plan no permite determinar qué skill posee la adaptación de una registration Durable.

### Esperado

No modificarla.

Resultado:

`REQUIRES_REVIEW`

No asumir ownership automáticamente.

## Caso 10 — Shared dependency pendiente

### Entrada

El workflow depende de:

`SR-ACTION-001`

y todavía no está completada.

### Esperado

Resultado:

`status = BLOCKED`

No crear una implementación local alternativa dentro de Activities u orchestrators.

## Caso 11 — Shared dependency satisfecha

### Entrada

El workflow utiliza:

`SR-COSMOS-REPORTS`

y la acción shared requerida está completada.

### Esperado

Reutilizar el recurso preparado.

No:

- duplicar repository;
- crear un nuevo client local;
- cambiar ownership.

## Caso 12 — Relaciones confirmadas

### Entrada

Existe evidencia suficiente sobre la relación entre orchestrator y Activity.

### Esperado

Usar:

`evidenceStatus = CONFIRMED`

No:

`status = CONFIRMED`

## Caso 13 — Package Durable preparado globalmente

### Entrada

`prepare-function-app` dejó disponible el target aprobado para:

`durable-functions`

y cuando corresponda:

`@azure/functions`.

### Esperado

Utilizar ese estado preparado.

No:

- cambiar package version;
- consultar `latest`;
- modificar baseline;
- reinstalar otra versión por preferencia.

## Caso 14 — Package Durable no preparado

### Entrada

El workflow requiere un target Durable aprobado pero la preparación global no fue completada.

### Esperado

Resultado:

`BLOCKED`

No seleccionar una versión alternativa.

## Caso 15 — Target Durable no es major v4 por nombre del skill

### Entrada

El plan contiene un target aprobado de:

`durable-functions`

compatible con Programming Model v4.

Su major no coincide necesariamente con `4`.

### Esperado

Utilizar exactamente el target aprobado.

No inferir:

```text
skill name contains v4
→ durable-functions major 4 required
```

## Caso 16 — Orchestrator preserva topology

### Entrada

El workflow contiene:

```text
Orchestrator
→ Activity A
→ Activity B
```

### Esperado

La migración debe preservar la topology requerida.

Registrar cuando corresponda:

`topologyChanged = false`

No reordenar Activities por preferencia.

## Caso 17 — Branching

### Entrada

El orchestrator contiene branching basado en datos de entrada o resultados previos.

### Esperado

Preservar:

- conditions;
- branch semantics;
- outputs relevantes.

No simplificar branching por estilo.

## Caso 18 — Fan-out / fan-in

### Entrada

El workflow ejecuta varias Activities en paralelo y luego agrega resultados.

### Esperado

Preservar:

- fan-out semantics;
- fan-in semantics;
- aggregation behavior.

No aumentar ni reducir paralelismo por optimización.

## Caso 19 — Retry

### Entrada

Existe retry configurado para una Activity o sub-orchestrator.

### Esperado

Preservar cuando corresponda:

- retry policy;
- retry count;
- delay/backoff semantics;
- error behavior.

No cambiar retry porque otra configuración parezca mejor.

## Caso 20 — Timer

### Entrada

El orchestrator utiliza un Durable timer.

### Esperado

Preservar:

- durable timer semantics;
- timing intent;
- orchestration determinism.

No sustituirlo por:

- `setTimeout`;
- timer no Durable;
- espera real bloqueante.

## Caso 21 — External Event

### Entrada

El workflow espera un external event.

### Esperado

Preservar:

- event name;
- wait semantics;
- continuation behavior;
- relevant timeout behavior.

No renombrar el event sin acción aprobada.

## Caso 22 — Sub-orchestrator

### Entrada

El orchestrator llama a un sub-orchestrator.

### Esperado

Preservar:

- target sub-orchestrator;
- input;
- output;
- invocation semantics;
- ordering;
- relevant errors.

No inlinear el sub-orchestrator por conveniencia.

## Caso 23 — Entity

### Entrada

El workflow utiliza Durable Entities.

### Esperado

Preservar cuando corresponda:

- entity name;
- operations;
- input/output semantics;
- state transitions observables.

No eliminar Entity usage para simplificar migration.

## Caso 24 — Activity contract

### Entrada

Una Activity recibe input, persiste información y devuelve resultado.

### Esperado

Preservar:

- Activity name;
- input;
- output;
- relevant errors;
- observable side effects.

No introducir lógica de orchestration en la Activity.

## Caso 25 — Starter

### Entrada

Existe una Function starter/client que inicia el workflow.

### Esperado

Preservar cuando corresponda:

- target orchestrator;
- input;
- instance ID semantics;
- start semantics;
- status/response behavior;
- relevant errors.

## Caso 26 — Determinismo

### Entrada

El orchestrator migrado no introduce nuevas fuentes no deterministas.

### Esperado

El check puede registrar:

`determinism.status = PASS`

solo con evidencia suficiente.

No usar:

`evidenceStatus = PASS`

## Caso 27 — I/O real dentro del orchestrator

### Entrada

La migración introduce o mantiene directamente dentro del orchestrator:

- database call;
- HTTP call;
- filesystem I/O;
- Service Bus publish.

### Esperado

No considerar el determinismo satisfecho.

Registrar:

`FAIL`

o blocker/review según el contrato.

No justificarlo porque el código compile.

## Caso 28 — Tiempo no determinista

### Entrada

El orchestrator utiliza directamente una API de tiempo no compatible con replay semantics.

### Esperado

Registrar el riesgo o fallo correspondiente.

No afirmar:

`determinism.status = PASS`

solo porque los tests locales estén verdes.

## Caso 29 — Randomness

### Entrada

El orchestrator usa randomness no controlada.

### Esperado

No considerar el workflow determinista.

Debe registrarse evidencia y tratamiento correspondiente.

## Caso 30 — Mutable global state

### Entrada

El orchestrator depende de estado global mutable que puede afectar replay.

### Esperado

No declarar determinismo satisfecho sin resolver o revisar el riesgo.

## Caso 31 — Build no demuestra determinismo

### Entrada

El workflow compila y typecheck pasa.

### Esperado

No inferir:

`determinism.status = PASS`

solo desde:

- build;
- typecheck.

## Caso 32 — Tests locales no prueban replay safety

### Entrada

Todos los unit tests del workflow están verdes.

### Esperado

No afirmar:

`production replay safety = CONFIRMED`

únicamente por los tests.

La replay compatibility requiere evidencia específica adicional cuando sea relevante.

## Caso 33 — Testing gate satisfecho

### Entrada

Todos los testing requirements del workflow con:

`requiredBeforeMigration = true`

están satisfechos.

### Esperado

La migración puede continuar.

Debe referenciar los artifacts de testing correspondientes cuando existan.

## Caso 34 — Testing gate pendiente

### Entrada

Un participant posee:

```text
requiredBeforeMigration = true
```

pendiente o fallido.

La acción Durable depende de ese behavior protection.

### Esperado

No ejecutar la migración dependiente.

Resultado:

`BLOCKED`

o:

`REQUIRES_REVIEW`

según la causa.

No generar tests desde este skill.

## Caso 35 — Tests posteriores

### Entrada

La migración Durable termina.

Existen tests requeridos de participants/workflow.

### Esperado

Volver a ejecutar los tests relevantes cuando corresponda.

Los checks de tests usan:

`PASS`

No:

`executionStatus = PASS`

## Caso 36 — Regresión posterior

### Entrada

Un test válido falla después de la migración Durable.

### Esperado

No modificar el test para obtener verde.

Registrar:

- contract affected;
- participant;
- evidence;
- failure.

No declarar el workflow correctamente migrado mientras el gate obligatorio permanezca fallido.

## Caso 37 — Active instances desconocidas

### Entrada

No existe evidencia segura sobre si hay instancias activas en producción.

### Esperado

Registrar:

```text
activeInstances.status = UNKNOWN
```

o estado equivalente definido por el contrato.

No inspeccionar:

- CI/CD protegido;
- secrets;
- producción no autorizada.

## Caso 38 — Active instances revisadas

### Entrada

Existe evidencia autorizada y suficiente sobre instancias activas y replay compatibility.

### Esperado

Puede registrar:

`REVIEWED`

cuando corresponda.

Debe preservar la evidencia.

## Caso 39 — Active instances no aplicable

### Entrada

Existe evidencia suficiente de que el riesgo de instancias activas no aplica al caso revisado.

### Esperado

Puede registrar:

`NOT_APPLICABLE`

con justificación.

## Caso 40 — Active instances + replay desconocido

### Entrada

Pueden existir instancias activas.

No existe evidencia suficiente de replay compatibility.

### Esperado

No afirmar producción segura.

Resultado:

`REQUIRES_REVIEW`

antes de considerar esa dimensión cerrada.

## Caso 41 — No acceso productivo implícito

### Entrada

Resolver active instances requeriría conectarse a infraestructura productiva no autorizada.

### Esperado

No hacerlo.

Registrar la incertidumbre.

El skill no debe ampliar permisos por sí mismo.

## Caso 42 — No rediseño

### Entrada

Durante migration se detecta una oportunidad para:

- aumentar fan-out;
- cambiar retries;
- eliminar Activity;
- fusionar orchestrators;
- simplificar topology.

### Esperado

No aplicar la optimización.

La migration debe preservar comportamiento.

## Caso 43 — No architecture target

### Entrada

Preparation introdujo boundaries necesarios.

### Esperado

La migration debe preservarlos.

Puede registrar:

`structurePreserved.status = PASS`

con evidencia.

No utilizar:

`architecturePreserved`

como evaluación contra arquitectura ideal.

## Caso 44 — Structure preserved

### Entrada

El workflow fue preparado con seams o providers requeridos.

### Esperado

La migración no debe revertir esos cambios.

`structurePreserved.status = PASS`

solo cuando exista evidencia suficiente.

## Caso 45 — No nuevos Action IDs

### Entrada

Durante migration aparece una necesidad no incluida en planning.

### Esperado

No crear un nuevo:

- `FN-*`;
- `GLOBAL-*`;
- `SR-ACTION-*`.

Registrar:

`deviationsFromPlan`

y devolver a planning/preparation cuando sea necesario.

## Caso 46 — No modificar plan

### Entrada

La evidencia encontrada contradice una premisa del plan.

### Esperado

No editar silenciosamente migration plans.

Registrar:

- contradiction;
- evidence;
- blocker/review;
- deviation.

## Caso 47 — actionResults

### Entrada

Se ejecutan acciones Durable aprobadas.

### Esperado

`durable-migration.json` debe registrar por acción:

- actionId;
- executionStatus.

Una acción exitosa utiliza:

`executionStatus = COMPLETED`

No:

`PASS`

## Caso 48 — Acción fallida

### Entrada

Una acción Durable se ejecuta pero falla técnicamente.

### Esperado

Registrar:

`executionStatus = FAILED`

No:

`COMPLETED`

El status principal debe reflejar el impedimento.

## Caso 49 — Legacy Durable artifacts

### Entrada

Existen artifacts legacy reemplazados por la nueva registration Durable.

### Esperado

Solo retirarlos cuando:

- ownership está confirmado;
- fueron reemplazados;
- ya no participan en registration/build;
- la acción lo permite.

No eliminar artifacts inciertos por limpieza.

## Caso 50 — Workflow artifact

### Entrada

La migración Durable produce resultado.

### Esperado

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.json`

No crear el artifact principal bajo:

`.migration/functions/<FunctionName>/`

porque el owner de esta migration es el workflow.

## Caso 51 — durable-migration.json

### Entrada

La migration finaliza.

### Esperado

Debe registrar cuando corresponda:

- `schemaVersion`;
- `workflow`;
- `status`;
- `planRef`;
- `participants`;
- `functionPlanRefs`;
- `testingRefs`;
- `actionResults`;
- `roles`;
- `graph`;
- `topologyChanged`;
- `registrations`;
- `durableApiChanges`;
- `structurePreserved`;
- `sharedResources`;
- `determinism`;
- `retries`;
- `timers`;
- `externalEvents`;
- `subOrchestrators`;
- `entities`;
- `activeInstances`;
- `tests`;
- `validations`;
- `filesModified`;
- `legacyArtifactsHandled`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

## Caso 52 — Vista humana

### Entrada

Se requiere salida humana.

### Esperado

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.md`

utilizando:

`durable-migration.template.md`

El JSON permanece como owner estructurado.

## Caso 53 — MIGRATED

### Entrada

Las acciones Durable requeridas:

- fueron ejecutadas;
- están `COMPLETED`;
- preservaron topology y contracts;
- superaron gates locales obligatorios;
- no tienen blockers ni review requirements obligatorios.

### Esperado

Status:

`MIGRATED`

No significa todavía:

`VERIFIED`

## Caso 54 — MIGRATED no prueba production replay safety

### Entrada

El workflow fue migrado correctamente a nivel local/repository.

Active instances no fueron evaluadas productivamente.

### Esperado

No afirmar:

`production replay safety = CONFIRMED`

solo por:

`status = MIGRATED`

Ambas dimensiones deben permanecer separadas.

## Caso 55 — NOT_APPLICABLE

### Entrada

No existe Durable aplicable al scope.

### Esperado

Status:

`NOT_APPLICABLE`

## Caso 56 — BLOCKED

### Entrada

Existe impedimento técnico conocido que evita completar una acción Durable requerida.

### Esperado

Status:

`BLOCKED`

Registrar:

- Action ID;
- participant/workflow afectado;
- blocker;
- evidence.

## Caso 57 — REQUIRES_REVIEW

### Entrada

Completar la migration requiere una decisión humana.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolverla silenciosamente.

## Caso 58 — Estado y checks separados

### Entrada

El workflow está migrado y el determinism check pasa.

### Esperado

Puede registrar simultáneamente:

```text
status = MIGRATED
determinism.status = PASS
```

No intercambiar ambos valores.

## Caso 59 — Certeza separada de ejecución

### Entrada

La topology original está confirmada mediante evidencia.

### Esperado

Puede registrar:

`evidenceStatus = CONFIRMED`

No utilizar:

`status = CONFIRMED`

para migration o validation.

## Caso 60 — No build global

### Entrada

Otras Functions de la Function App todavía requieren adaptación.

### Esperado

No ejecutar el build global final como gate de este skill.

Puede ejecutar validaciones selectivas relevantes.

El build global final pertenece a:

`verify-function-app`.

## Caso 61 — No deployment

### Entrada

El workflow fue migrado localmente.

### Esperado

No desplegar.

No afirmar:

- successful Azure deployment;
- runtime productivo actualizado;
- production replay safety;
- ausencia de instancias activas.

## Caso 62 — Lessons opcionales

### Entrada

La migración concluye sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/migrate-durable-functions-v4/`

no debe impedir el cierre.

No crear artifacts vacíos únicamente por contrato.

## Criterio general

`migrate-durable-functions-v4` debe responder:

```text
¿el workflow Durable aprobado fue adaptado preservando su semántica y contratos?
```

No debe responder por sí solo:

```text
¿es seguro desplegarlo con todas las instancias productivas existentes?
```

Invariantes:

```text
planning
→ effectiveScope
→ Action IDs
→ PM/Durable ownership
```

```text
workflow
→ unidad de migration Durable
```

```text
Durable v4 skill name
≠ durable-functions major 4
```

```text
topology before
→ topology after
→ normalmente topologyChanged = false
```

```text
build PASS
≠ determinism proof
```

```text
tests PASS
≠ replay safety proof
```

```text
MIGRATED
≠ PASS
≠ CONFIRMED
≠ VERIFIED
≠ production-safe automáticamente
```

```text
active instances unknown
+ replay compatibility unknown
→ human review
```

```text
new need
→ deviation / replan
→ no new Action ID
```

```text
global build final
→ verify-function-app
```
