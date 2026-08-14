# Evals — Migrate Programming Model v4

## Objetivo

Validar que `migrate-programming-model-v4` adapte únicamente la integración de una Function con Azure Functions al
Programming Model v4, ejecutando las acciones aprobadas por planning y preservando comportamiento observable, estructura
requerida y contratos existentes.

No debe:

- refactorizar funcionalidad;
- seleccionar dependency versions;
- modificar dependency baseline;
- ejecutar acciones no asignadas;
- generar tests;
- rediseñar Durable workflows;
- ejecutar el build global final.

## Caso 1 — Function v3 preparada

### Entrada

Function:

- Programming Model `V3`;
- preparation completada cuando corresponde;
- testing gates requeridos satisfechos;
- acción `FN-*` asignada a PM migration.

### Esperado

Migrar únicamente la integración Azure requerida.

Registrar:

`status = MIGRATED`

Preservar comportamiento observable.

## Caso 2 — Function ya v4

### Entrada

Programming Model:

`V4`

No existe acción PM requerida.

### Esperado

Status:

`NOT_APPLICABLE`

No modificar registration únicamente para normalizar estilo.

## Caso 3 — Modelo desconocido

### Entrada

Programming Model:

`UNKNOWN`

y no existe evidencia suficiente para determinar adaptación segura.

### Esperado

Status:

`REQUIRES_REVIEW`

No asumir V3 por antigüedad del package.

## Caso 4 — Modelo MIXED

### Entrada

Programming Model:

`MIXED`

### Esperado

Solo puede continuar si el plan identifica explícitamente qué adapter o registration debe migrarse y existe evidencia
suficiente.

Si no puede determinarse con seguridad:

`REQUIRES_REVIEW`

No convertir silenciosamente toda la Function a v4.

## Caso 5 — Action ID de planning

### Entrada

El plan asigna:

`FN-REQUESTREPORT-003`

a Programming Model migration.

### Esperado

Ejecutar conservando exactamente:

`FN-REQUESTREPORT-003`

Registrar el resultado mediante:

`executionStatus`

No generar:

- `REQ-*`;
- nuevos `FN-*`;
- `GLOBAL-*`;
- `SR-ACTION-*`.

## Caso 6 — Solo acciones PM asignadas

### Entrada

El plan contiene:

- una `FN-*` de preparation;
- una `FN-*` de PM migration;
- una `FN-*` de dependency adaptation.

### Esperado

Ejecutar únicamente la acción cuyo owner/phase pertenece a:

`migrate-programming-model-v4`

No reinterpretar el resto del plan.

## Caso 7 — Testing gate satisfecho

### Entrada

Existe:

`.migration/functions/<FunctionName>/testing.json`

Todos los requirements relevantes con:

`requiredBeforeMigration = true`

están satisfechos.

### Esperado

La migration puede continuar.

Debe conservar referencia al artifact de testing cuando corresponda.

## Caso 8 — Testing gate pendiente

### Entrada

Existe un requirement:

```text
requiredBeforeMigration = true
```

pendiente o fallido.

### Esperado

No ejecutar la migración dependiente.

Status:

`BLOCKED`

o:

`REQUIRES_REVIEW`

según la causa.

No generar tests desde este skill.

## Caso 9 — Preparation requerida pendiente

### Entrada

Una acción PM depende de preparation local requerida que no está completada.

### Esperado

No ejecutar la migración.

Status:

`BLOCKED`

No introducir el seam o refactor faltante desde migration.

## Caso 10 — Shared action pendiente

### Entrada

La acción PM depende de:

`SR-ACTION-001`

y todavía no está completada.

### Esperado

Status:

`BLOCKED`

No crear repository/client alternativo dentro de la Function.

## Caso 11 — Package @azure/functions ya preparado

### Entrada

El plan requiere Programming Model v4.

`prepare-function-app` ya dejó disponible el target aprobado de:

`@azure/functions`.

### Esperado

El skill utiliza ese estado preparado.

No:

- modifica package target;
- consulta `latest`;
- cambia baseline;
- vuelve a instalar otra versión por preferencia.

## Caso 12 — Package target faltante

### Entrada

La Function requiere PM v4, pero el package aprobado no está preparado correctamente.

### Esperado

Status:

`BLOCKED`

No seleccionar una versión alternativa.

El problema pertenece a preparation global o planning según la causa.

## Caso 13 — Registration HTTP preservada

### Entrada

Function HTTP v3 con:

- Function name;
- route;
- methods;
- auth behavior;
- input;
- output.

### Esperado

La registration v4 debe preservar los elementos observables requeridos por el plan.

No cambiar route o methods por preferencia.

## Caso 14 — Trigger no HTTP

### Entrada

Function utiliza un trigger soportado por la migración, por ejemplo:

- timer;
- queue;
- Service Bus;
- blob;
- event hub.

### Esperado

Adaptar únicamente la registration necesaria al Programming Model v4.

Preservar:

- Function name;
- trigger semantics;
- configuration key names;
- relevant binding behavior.

## Caso 15 — Configuration keys

### Entrada

La registration utiliza:

`process.env.REPORT_QUEUE`

### Esperado

Preservar el nombre:

`REPORT_QUEUE`

cuando corresponda.

No leer:

- `.env`;
- `local.settings.json`;
- CI/CD protegido.

No registrar valores reales.

## Caso 16 — Behavior preserved

### Entrada

La migración cambia únicamente la integración Azure.

### Esperado

Preservar cuando corresponda:

- input;
- output;
- relevant errors;
- observable side effects.

No introducir cambios funcionales para simplificar migration.

## Caso 17 — Cambio funcional inesperado

### Entrada

La migración aparentemente requiere cambiar comportamiento observable no aprobado.

### Esperado

No aplicar el cambio silenciosamente.

Status:

`REQUIRES_REVIEW`

Registrar:

- comportamiento afectado;
- evidencia;
- acción relacionada.

## Caso 18 — No refactor adicional

### Entrada

Durante PM migration se observa código estructuralmente mejorable.

La mejora no está requerida por la acción.

### Esperado

No:

- extraer nueva capability;
- crear interfaces adicionales;
- reorganizar carpetas;
- modernizar nombres;
- separar services por preferencia.

La migration debe mantenerse mínima.

## Caso 19 — Structure preserved

### Entrada

Preparation introdujo un seam o boundary requerido.

### Esperado

La migration no debe revertirlo.

Registrar cuando corresponda:

`structurePreserved.status = PASS`

con evidencia.

No utilizar:

`structurePreserved.status = CONFIRMED`

No evaluar arquitectura ideal.

## Caso 20 — No path obligatorio

### Entrada

La Function vive en una estructura distinta de:

`src/functions/<FunctionName>`

### Esperado

Migrar utilizando la estructura coherente existente.

No mover archivos únicamente para ajustarse a un path convencional.

## Caso 21 — Legacy function.json perteneciente a la Function

### Entrada

La Function migrada posee:

`function.json`

v3.

### Esperado

Tratar únicamente el artifact asociado a la registration migrada.

Puede retirarse cuando:

- el plan lo requiere;
- la registration v4 lo reemplazó;
- ya no participa en build/runtime.

No eliminar artifacts legacy cuyo ownership o uso sea incierto.

## Caso 22 — Legacy artifact incierto

### Entrada

Existe un `function.json` u otro artifact legacy cuya relación con la Function no puede demostrarse.

### Esperado

Preservarlo.

Registrar:

`REQUIRES_REVIEW`

o unknown cuando corresponda.

No eliminarlo por limpieza.

## Caso 23 — Shared resources

### Entrada

La Function utiliza:

`SR-COSMOS-REPORTS`

preparado previamente.

### Esperado

La migration debe preservar su uso.

No:

- duplicar repository;
- crear otro CosmosClient local;
- cambiar ownership;
- crear una alternativa shared.

## Caso 24 — Durable ownership asignado a PM skill

### Entrada

Una Function Durable tiene una acción de registration PM explícitamente asignada por planning a este skill.

### Esperado

Puede ejecutar únicamente esa adaptación PM.

No migrar semántica Durable adicional.

No modificar:

- topology;
- retries;
- timers;
- Activity semantics;
- orchestration behavior.

## Caso 25 — Durable ownership asignado al skill Durable

### Entrada

Planning asigna la adaptación coordinada de registration al workflow Durable.

### Esperado

`migrate-programming-model-v4` no debe editar esa registration.

Debe evitar double ownership.

La responsabilidad pertenece a:

`migrate-durable-functions-v4`

## Caso 26 — Durable no se delega automáticamente

### Entrada

La Function pertenece a un workflow Durable.

El plan no deja claro qué skill posee la migration de registration.

### Esperado

No asumir automáticamente:

`Durable → migrate-durable-functions-v4`

ni:

`Durable → migrate-programming-model-v4`

Debe registrar:

`REQUIRES_REVIEW`

La ownership la decide planning.

## Caso 27 — Tests posteriores

### Entrada

La migration termina.

Existen tests requeridos generados o reutilizados previamente.

### Esperado

Volver a ejecutar los tests relevantes cuando corresponda.

Si pasan:

`status = PASS`

en el check de tests.

No utilizar:

`executionStatus = PASS`

## Caso 28 — Regresión posterior

### Entrada

Un test válido que protegía comportamiento esperado falla después de PM migration.

### Esperado

No modificar el test para obtener verde.

Registrar:

- fallo;
- behavior affected;
- evidence.

La migration no debe considerarse completada correctamente mientras el gate requerido permanezca fallido.

## Caso 29 — Tests no ejecutados

### Entrada

Los tests requeridos existen pero no pudieron ejecutarse.

### Esperado

No registrar:

`PASS`

Usar:

`NOT_EXECUTED`

en el check correspondiente.

Si eran gate obligatorio:

no declarar:

`MIGRATED`

como resultado satisfactorio de la acción dependiente.

## Caso 30 — Runtime de tests

### Entrada

Los tests posteriores son ejecutados.

### Esperado

Registrar el Node.js realmente utilizado cuando sea relevante.

No asumir Node.js 24 únicamente por el target de campaña.

## Caso 31 — Validación local

### Entrada

La migration permite validaciones selectivas como:

- typecheck local;
- registration consistency;
- tests.

### Esperado

Puede ejecutarlas.

Cada check debe usar:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

`PASS` requiere evidencia.

## Caso 32 — No build global

### Entrada

Otras Functions de la Function App todavía no terminaron su migración.

### Esperado

No ejecutar el build global final como gate de este skill.

El build global pertenece a:

`verify-function-app`

después de completar las adaptaciones requeridas de la Function App.

## Caso 33 — No deployment

### Entrada

La Function fue migrada localmente.

### Esperado

No desplegar.

No afirmar:

- Azure runtime efectivo actualizado;
- deployment exitoso;
- comportamiento productivo verificado.

## Caso 34 — No nuevos Action IDs

### Entrada

Durante migration aparece una necesidad no representada en el plan.

### Esperado

No crear:

`FN-REQUESTREPORT-999`

Debe registrar:

`deviationsFromPlan`

Si es necesaria para continuar:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

y retornar a planning/preparation según corresponda.

## Caso 35 — No modificar migration plan

### Entrada

El estado encontrado contradice una premisa del plan.

### Esperado

No editar silenciosamente:

`.migration/functions/<FunctionName>/migration-plan.json`

Registrar:

- contradiction;
- evidence;
- deviation;
- review/blocker.

## Caso 36 — actionResults

### Entrada

La migration ejecuta:

`FN-REQUESTREPORT-003`

### Esperado

`migration.json` debe registrar:

```text
actionId = FN-REQUESTREPORT-003
executionStatus = COMPLETED
```

No utilizar:

`PASS`

como execution status.

## Caso 37 — Acción fallida

### Entrada

La adaptación PM se ejecuta pero produce un fallo técnico.

### Esperado

Registrar:

`executionStatus = FAILED`

No:

`COMPLETED`

El estado principal debe reflejar el impedimento correspondiente.

## Caso 38 — migration.json

### Entrada

La migration finaliza.

### Esperado

Crear:

`.migration/functions/<FunctionName>/migration.json`

con cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `planRef`;
- `testingRef`;
- `previousProgrammingModel`;
- `resultingProgrammingModel`;
- `actionResults`;
- `trigger`;
- `bindings`;
- `configurationKeys`;
- `adapterChanges`;
- `dependenciesAndApis`;
- `structurePreserved`;
- `sharedResources`;
- `filesModified`;
- `legacyArtifactsHandled`;
- `tests`;
- `validations`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

## Caso 39 — migration.md

### Entrada

Se requiere vista humana.

### Esperado

Crear:

`.migration/functions/<FunctionName>/migration.md`

usando:

`function-migration.template.md`

El JSON permanece como owner estructurado.

## Caso 40 — MIGRATED

### Entrada

La acción PM requerida:

- fue ejecutada;
- tiene `executionStatus = COMPLETED`;
- produjo Programming Model v4;
- preservó los contratos requeridos;
- superó sus gates locales obligatorios;
- no tiene blockers ni review requirements.

### Esperado

Status:

`MIGRATED`

Este estado no significa:

`VERIFIED`

para la Function App.

## Caso 41 — NOT_APPLICABLE

### Entrada

La Function ya está en PM v4 y no existe acción PM requerida.

### Esperado

Status:

`NOT_APPLICABLE`

## Caso 42 — BLOCKED

### Entrada

Existe impedimento técnico que evita completar una acción PM requerida.

### Esperado

Status:

`BLOCKED`

Registrar:

- Action ID;
- blocker;
- evidence.

## Caso 43 — REQUIRES_REVIEW

### Entrada

Completar la migration requiere una decisión humana.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolverla silenciosamente.

## Caso 44 — MIGRATED no equivale a PASS

### Entrada

La Function completa la adaptación PM.

### Esperado

Usar:

`MIGRATED`

como status principal de migration.

Usar:

`PASS`

únicamente para checks/validations.

No intercambiar ambos conceptos.

## Caso 45 — MIGRATED no equivale a CONFIRMED

### Entrada

Existe evidencia confirmada sobre resulting Programming Model.

### Esperado

Puede registrar:

`evidenceStatus = CONFIRMED`

y simultáneamente:

`status = MIGRATED`

No utilizar un campo como sustituto del otro.

## Caso 46 — Lessons opcionales

### Entrada

La migration termina sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/migrate-programming-model-v4/`

no debe impedir el cierre.

No crear lessons vacías únicamente por contrato.

## Criterio general

`migrate-programming-model-v4` debe responder:

```text
¿la integración de esta Function con Azure Functions fue adaptada al Programming Model v4
según las acciones aprobadas?
```

No debe responder:

```text
¿la Function App completa ya está verificada?
```

Invariantes:

```text
planning
→ Action IDs
```

```text
testing
→ requiredBeforeMigration gate
```

```text
prepare-function-app
→ package target
```

```text
migrate-programming-model-v4
→ registration/integration adaptation
```

```text
MIGRATED
≠ PASS
≠ CONFIRMED
≠ VERIFIED
```

```text
structurePreserved
≠ architecture target
```

```text
Durable Function
≠ ownership automática del Durable skill
```

```text
planning
→ decide PM/Durable ownership
```

```text
new migration need
→ deviation/replan
→ no nuevo Action ID
```

```text
global build final
→ verify-function-app
```
