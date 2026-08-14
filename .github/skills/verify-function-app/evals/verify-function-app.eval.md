# Evals — Verify Function App

## Objetivo

Validar que `verify-function-app` cierre la migración de una Function App mediante evidencia reproducible comparando:

```text
BEFORE
→ PLAN
→ EXECUTION
→ AFTER
```

sin:

- corregir código;
- modificar tests;
- generar tests;
- crear Action IDs;
- cambiar targets;
- actualizar dependencias;
- modificar dependency baseline;
- reinterpretar planning;
- desplegar;
- convertir incertidumbre en éxito.

Verification es el owner del cierre técnico final de la Function App.

## Caso 1 — Todos los gates obligatorios satisfechos

### Entrada

El effectiveScope está completamente migrado.

Se demuestra:

- target técnico requerido;
- Action IDs obligatorios completados;
- dependency targets correctos;
- Node.js target utilizado donde corresponde;
- installation satisfactoria;
- typecheck satisfactorio cuando aplica;
- build global satisfactorio;
- tests requeridos satisfactorios;
- Functions esperadas presentes;
- Programming Model correcto;
- Durable correcto cuando aplica;
- structural requirements satisfechos;
- shared resources consistentes;
- packaging válido;
- ausencia de blockers y debt relevante.

### Esperado

Status:

`VERIFIED`

No significa deployment productivo realizado.

## Caso 2 — Deuda no bloqueante

### Entrada

Todos los gates obligatorios están satisfechos.

Permanece technical debt no requerida para migration.

### Esperado

Status:

`VERIFIED_WITH_DEBT`

La deuda debe permanecer explícita.

## Caso 3 — Build global FAIL

### Entrada

El build global obligatorio termina:

`FAIL`

### Esperado

Final:

`BLOCKED`

No corregir código desde verification.

## Caso 4 — Tests obligatorios FAIL

### Entrada

Una suite requerida como gate final termina:

`FAIL`

### Esperado

Final:

`BLOCKED`

No modificar el test para obtener verde.

## Caso 5 — Function requerida faltante

### Entrada

BEFORE y PLAN requieren:

`RequestReport`

pero AFTER no contiene una registration válida correspondiente.

### Esperado

Function check:

`FAIL`

Final:

`BLOCKED`

## Caso 6 — Programming Model incorrecto

### Entrada

Una Function debía terminar en:

`V4`

pero AFTER sigue en:

`V3`

### Esperado

Programming Model check:

`FAIL`

Final:

`BLOCKED`

No utilizar el término `legacy` como estado del Programming Model.

## Caso 7 — Programming Model MIXED no aprobado

### Entrada

Una Function debía terminar exclusivamente en `V4`.

AFTER permanece:

`MIXED`

sin que el plan lo permita.

### Esperado

Check:

`FAIL`

Final:

`BLOCKED`

## Caso 8 — Node target no utilizado

### Entrada

El target requiere Node.js 24.

Build y tests obligatorios fueron ejecutados con otra versión incompatible.

### Esperado

No declarar:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Registrar el runtime realmente utilizado.

Resolver como:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

según la causa.

## Caso 9 — Runtime registrado por gate

### Entrada

Se ejecutan:

- installation;
- typecheck;
- build;
- tests.

### Esperado

Registrar cuando corresponda el Node.js realmente utilizado para cada gate.

No asumir un único runtime para todos los comandos.

## Caso 10 — Node declarado no demuestra ejecución

### Entrada

`package.json` declara:

```json
{
  "engines": {
    "node": "24"
  }
}
```

pero no existe evidencia sobre el runtime realmente usado para build/tests.

### Esperado

Puede registrarse la versión declarada.

No debe considerarse suficiente para demostrar ejecución bajo Node.js 24.

## Caso 11 — Installation PASS

### Entrada

El mecanismo reproducible del proyecto se ejecuta correctamente.

### Esperado

Installation check:

`PASS`

Debe registrar:

- command;
- runtime;
- scope;
- evidence.

## Caso 12 — Installation no actualiza targets

### Entrada

Durante verification existe una versión publicada más reciente.

### Esperado

No actualizar dependencies.

No ejecutar instalación con `latest`.

Utilizar únicamente el estado definido por plan/baseline.

## Caso 13 — Typecheck PASS

### Entrada

El proyecto tiene un typecheck requerido.

El comando real se ejecuta exitosamente.

### Esperado

Check:

`PASS`

No inferir `PASS` solo porque exista un script.

## Caso 14 — Typecheck obligatorio NOT_EXECUTED

### Entrada

Typecheck es obligatorio pero no pudo ejecutarse.

### Esperado

Check:

`NOT_EXECUTED`

No declarar:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Resolver el resultado final según la causa.

## Caso 15 — Build global ocurre al final

### Entrada

La Function App contiene varias Functions.

Todavía existen Functions pendientes de adaptación.

### Esperado

No ejecutar el build global final prematuramente como cierre.

El build global debe ejecutarse después de completar las adaptaciones requeridas del effectiveScope/Function App según
el plan.

## Caso 16 — Build PASS no demuestra comportamiento

### Entrada

Build global:

`PASS`

pero un contrato observable requerido no tiene evidencia suficiente.

### Esperado

No declarar automáticamente:

`VERIFIED`

Build exitoso no sustituye testing ni behavioral evidence.

## Caso 17 — Dependency target correcto

### Entrada

Target aprobado:

`@azure/functions = X`

Installed:

`X`

### Esperado

Dependency check:

`PASS`

Preservar cuando corresponda:

- baselineId;
- baselineRevision.

## Caso 18 — Dependency target obligatorio incorrecto

### Entrada

Expected:

`X`

Installed:

`Y`

y el plan exige `X`.

### Esperado

Dependency check:

`FAIL`

Final:

`BLOCKED`

No actualizar automáticamente a `X`.

## Caso 19 — Dependency desviada potencialmente compatible

### Entrada

Installed:

`Y`

diferente de `X`.

Existe evidencia de que podría ser compatible, pero no está aprobado en el plan.

### Esperado

No considerarla automáticamente equivalente.

Check:

`REQUIRES_REVIEW`

No modificar baseline ni plan.

## Caso 20 — Declared vs installed dependency

### Entrada

`package.json` declara `X`.

El estado instalado observado es diferente.

### Esperado

Registrar ambos cuando sea relevante:

- declared version;
- installed version.

No asumir installation correcta únicamente por `package.json`.

## Caso 21 — No latest

### Entrada

Existe una versión más reciente que la target aprobada.

### Esperado

Ignorarla como target de verification.

Comparar exclusivamente contra:

- plan;
- baseline referenciada.

## Caso 22 — Baseline reference preservada

### Entrada

El plan utiliza:

```text
baselineId = node24-azure-functions-v4
baselineRevision = 1
```

### Esperado

Verification conserva esa referencia.

No cambia silenciosamente a una revisión posterior.

## Caso 23 — No baseline mutation

### Entrada

Verification descubre que otro package podría ser útil como target futuro.

### Esperado

No modificar:

`dependency-baseline.json`

No:

- agregar `managedPackages`;
- cambiar targetVersion;
- incrementar baselineRevision.

Puede registrar únicamente un finding o lesson cuando corresponda.

## Caso 24 — No dependency learning lifecycle

### Entrada

Una dependencia third-party fue utilizada exitosamente.

### Esperado

Verification no debe producir:

- `LEARNED_BASELINE`;
- `recommendationStatus`;
- `eligibleForLearningReview`;
- `learnedPackages`;
- promotion automática.

El éxito permanece como evidencia de esta ejecución.

## Caso 25 — Plan compliance completo

### Entrada

El plan contiene:

```text
GLOBAL-001
SR-ACTION-001
FN-REQUESTREPORT-001
```

todos con:

`requiredForMigration = true`

### Esperado

Verification debe comprobar cada Action ID requerido contra sus execution artifacts.

No asumir cumplimiento únicamente porque build y tests pasan.

## Caso 26 — Acción requerida completada

### Entrada

Plan:

```text
FN-REQUESTREPORT-001
requiredForMigration = true
```

Execution artifact:

```text
executionStatus = COMPLETED
```

y el resultado verificable coincide con el plan.

### Esperado

Plan compliance check:

`PASS`

## Caso 27 — Acción requerida NOT_EXECUTED

### Entrada

Plan:

```text
requiredForMigration = true
```

Execution:

`NOT_EXECUTED`

### Esperado

No declarar:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Resolver final como:

- `BLOCKED`;
- o `REQUIRES_REVIEW`.

## Caso 28 — Acción requerida FAILED

### Entrada

Una acción con:

`requiredForMigration = true`

terminó:

`executionStatus = FAILED`

### Esperado

Plan compliance:

`FAIL`

Final:

`BLOCKED`

## Caso 29 — Acción opcional pendiente

### Entrada

Una acción tiene:

`requiredForMigration = false`

y no fue ejecutada.

Todos los gates obligatorios pasan.

### Esperado

No bloquear verification.

Puede contribuir a:

- technical debt;
- optimization opportunity;

según el tipo.

## Caso 30 — Action ID inexistente

### Entrada

Un execution artifact afirma completar:

`FN-REQUESTREPORT-999`

pero ese ID no existe en el plan.

### Esperado

Registrar inconsistencia.

No considerarla evidencia válida de cumplimiento del plan.

Puede requerir:

`REQUIRES_REVIEW`

## Caso 31 — Testing artifact requerido

### Entrada

El plan contiene requirements de testing para una Function.

### Esperado

Consumir:

`.migration/functions/<FunctionName>/testing.json`

cuando corresponda.

No reconstruir desde cero la etapa de testing.

## Caso 32 — requiredBeforeMigration satisfecho

### Entrada

Un requirement contiene:

```text
requiredBeforeMigration = true
```

y `testing.json` demuestra:

- test asociado;
- ejecución;
- resultado satisfactorio;
- evidence.

### Esperado

El gate puede considerarse satisfecho.

## Caso 33 — requiredBeforeMigration pendiente

### Entrada

Un requirement requerido antes de migration sigue pendiente.

La migration fue ejecutada de todos modos.

### Esperado

Registrar inconsistencia del flujo.

No declarar:

`VERIFIED`

Puede resultar:

`BLOCKED`

o:

`REQUIRES_REVIEW`.

## Caso 34 — Tests finales PASS

### Entrada

Los tests requeridos son ejecutados nuevamente después de completar la migration.

### Esperado

Check:

`PASS`

Registrar:

- command;
- runtime;
- suites;
- result;
- evidence.

## Caso 35 — Tests no ejecutados

### Entrada

Los tests son obligatorios pero no se ejecutaron.

### Esperado

Check:

`NOT_EXECUTED`

No declarar:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

## Caso 36 — Tests verdes pero behavior incompleto

### Entrada

Todos los tests ejecutados están verdes.

`testing.json` indica que un contrato observable obligatorio nunca quedó protegido.

### Esperado

No afirmar:

`behavior preserved`

solo por suite verde.

Registrar el gap.

## Caso 37 — Observable contract preservado

### Entrada

BEFORE, analysis, plan, testing y AFTER demuestran consistentemente:

```text
input
→ output
→ relevant side effect
```

### Esperado

El contract check puede utilizar:

`PASS`

con evidence.

## Caso 38 — Behavioral contradiction

### Entrada

BEFORE y AFTER difieren en un comportamiento requerido y el cambio no estaba aprobado.

### Esperado

Check:

`FAIL`

Final:

`BLOCKED`

No reinterpretar BEFORE para aceptar AFTER.

## Caso 39 — Coverage obligatorio PASS

### Entrada

Coverage forma parte explícita del contrato.

Los requirements aplicables están protegidos y las métricas requeridas se satisfacen.

### Esperado

Coverage check:

`PASS`

## Caso 40 — Coverage alto con gap comportamental

### Entrada

Coverage:

`95%`

pero un comportamiento requerido no tiene assertions relevantes.

### Esperado

No considerar coverage suficiente para cerrar behavioral verification.

## Caso 41 — Coverage no acordado

### Entrada

Coverage no forma parte del gate acordado.

### Esperado

Check:

`NOT_APPLICABLE`

No inventar threshold.

## Caso 42 — Exclusión BEHAVIORAL injustificada

### Entrada

Código clasificado como:

`BEHAVIORAL`

requerido por un contrato fue excluido de coverage únicamente para aumentar porcentaje.

### Esperado

No considerar coverage satisfactoria.

Registrar el problema correspondiente.

## Caso 43 — Host sin configuración aprobada

### Entrada

Host verification aplica.

No existe configuración sanitizada y aprobada.

### Esperado

Host check:

`NOT_EXECUTED`

con reason.

No leer:

`local.settings.json`

No abrir CI/CD protegido.

## Caso 44 — Host no aplicable

### Entrada

Host execution no forma parte del gate aprobado.

### Esperado

Host check:

`NOT_APPLICABLE`

## Caso 45 — Host PASS requiere ejecución

### Entrada

Host check se declara exitoso.

### Esperado

Debe existir evidencia de ejecución real.

No registrar:

`PASS`

únicamente por inspección de archivos.

## Caso 46 — Runtime Azure no inferido por host.json

### Entrada

`host.json` existe y es válido.

No existe evidencia segura del Azure Functions Runtime efectivo desplegado.

### Esperado

No afirmar:

`Azure Functions Runtime v4 = CONFIRMED`

solo por `host.json`.

## Caso 47 — Runtime Azure obligatorio no observable

### Entrada

El target exige Runtime v4.

Demostrar el Runtime efectivo requiere acceso externo no disponible o protegido.

### Esperado

No abrir CI/CD protegido.

No inventar evidencia.

No declarar:

`VERIFIED`

si demostrar esa dimensión es obligatorio.

Resolver según corresponda:

`REQUIRES_REVIEW`

o `BLOCKED`.

## Caso 48 — Verification repository scope no equivale deployment

### Entrada

Todos los checks locales/repository pasan.

No hubo deployment.

### Esperado

Puede verificarse el scope técnico que realmente fue demostrado.

No afirmar:

- successful deployment;
- production runtime;
- production traffic correctness;
- production configuration correctness.

## Caso 49 — Functions esperadas presentes

### Entrada

PLAN define las Functions del effectiveScope.

AFTER contiene todas las registrations esperadas.

### Esperado

Functions check:

`PASS`

## Caso 50 — Function inesperada

### Entrada

AFTER contiene una nueva Function no presente en BEFORE ni PLAN.

### Esperado

No ignorarla.

Registrar la diferencia.

Puede requerir:

`REQUIRES_REVIEW`

si no existe explicación aprobada.

## Caso 51 — Programming Model por Function

### Entrada

Varias Functions tienen estados distintos durante la migration.

Al cierre todas las requeridas deben estar `V4`.

### Esperado

Verificar por Function.

No inferir estado global solo desde:

`@azure/functions` package version.

## Caso 52 — Durable workflow completo

### Entrada

Workflow aplicable tiene:

- durable-migration artifact;
- participants correctos;
- registrations correctas;
- topology preservada;
- determinism evidence;
- testing gates satisfechos;
- shared dependencies satisfechas.

### Esperado

Durable check:

`PASS`

## Caso 53 — Durable participant faltante

### Entrada

Una Activity requerida no está registrada en AFTER.

### Esperado

Durable check:

`FAIL`

Final:

`BLOCKED`

## Caso 54 — Durable topology inesperadamente modificada

### Entrada

El plan requería preservar topology.

AFTER demuestra:

`topologyChanged = true`

sin cambio aprobado.

### Esperado

Durable check:

`FAIL`

Final:

`BLOCKED`

## Caso 55 — Determinismo insuficiente

### Entrada

No existe evidencia suficiente para cerrar un determinism gate requerido.

### Esperado

No registrar:

`PASS`

Durable verification puede requerir:

`REQUIRES_REVIEW`

## Caso 56 — Tests Durable no prueban replay safety

### Entrada

Todos los unit tests Durable están verdes.

No existe evidencia suficiente de replay compatibility relevante.

### Esperado

No afirmar:

`production replay safety = CONFIRMED`

## Caso 57 — Active instances desconocidas

### Entrada

Pueden existir instancias activas.

Replay compatibility no está demostrada.

### Esperado

No afirmar compatibilidad productiva.

Registrar:

`REQUIRES_REVIEW`

cuando esa decisión sea necesaria para cierre productivo.

## Caso 58 — Active instances no aplicable

### Entrada

Existe evidencia suficiente para determinar que el riesgo no aplica.

### Esperado

Puede utilizar:

`NOT_APPLICABLE`

con evidencia.

## Caso 59 — Structural requirement satisfecho

### Entrada

El plan contiene una acción estructural:

```text
requiredForMigration = true
```

y AFTER demuestra que fue ejecutada y no revertida.

### Esperado

`structuralCompliance`:

`PASS`

No evaluar arquitectura ideal.

## Caso 60 — Folder opcional ausente

### Entrada

No existe:

`domain/`

porque ninguna acción lo requería.

### Esperado

No fallar structural compliance.

La ausencia de una estructura preferida no es un error.

## Caso 61 — Structural change opcional pendiente

### Entrada

Existe una mejora estructural con:

`requiredForMigration = false`

pendiente.

### Esperado

No bloquear.

Puede contribuir a technical debt cuando corresponda.

## Caso 62 — No architecture target

### Entrada

La Function App no utiliza una arquitectura que el reviewer preferiría.

Todas las obligaciones estructurales requeridas por el plan están satisfechas.

### Esperado

No fallar verification.

No utilizar:

- architecture score;
- clean architecture compliance;
- folder count.

## Caso 63 — Shared resource consistente

### Entrada

Un recurso compartido posee:

- resourceId único;
- owner coherente;
- una acción propietaria;
- consumers correctos.

### Esperado

Shared resources check:

`PASS`

## Caso 64 — Shared duplicate bloqueante

### Entrada

La migration introdujo dos implementaciones contradictorias del mismo recurso requerido.

La duplicación afecta ownership o comportamiento obligatorio.

### Esperado

Classification:

`BLOCKING`

Final:

`BLOCKED`

## Caso 65 — Shared duplicate preexistente no bloqueante

### Entrada

Existe duplicación previa no modificada por migration.

No contradice el target ni una acción requerida.

### Esperado

Puede clasificarse:

`TECHNICAL_DEBT`

No bloquear por sí sola.

## Caso 66 — Misma tecnología no significa duplicación

### Entrada

Customers y Reports utilizan Cosmos DB pero son recursos diferentes.

### Esperado

No clasificarlos como duplicados únicamente porque usan:

`@azure/cosmos`

## Caso 67 — Legacy esperado

### Entrada

Permanece un artifact legacy que el plan marcó explícitamente como esperado/no requerido para retirada.

### Esperado

Classification:

`EXPECTED`

No bloquear.

## Caso 68 — Legacy bloqueante

### Entrada

Permanece activo un:

`function.json`

para una Function que debía quedar exclusivamente registrada mediante PM v4.

### Esperado

Classification:

`BLOCKING`

Final:

`BLOCKED`

## Caso 69 — Legacy desconocido

### Entrada

Existe un artifact cuya relación con runtime/build no puede determinarse.

### Esperado

Classification:

`UNKNOWN`

No eliminarlo.

Puede requerir review.

## Caso 70 — MegaService no bloquea por existencia

### Entrada

Permanece un service legacy grande.

No contradice ninguna acción requerida ni el target técnico.

### Esperado

No clasificarlo:

`BLOCKING`

únicamente por tamaño.

Puede permanecer como technical debt.

## Caso 71 — Packaging completo

### Entrada

El plan requiere packaging y AFTER contiene correctamente:

- dist;
- metadata;
- lockfile;
- runtime dependencies;
- host.json;
- entrypoints;
- `.funcignore`;

cuando aplican.

### Esperado

Packaging check:

`PASS`

## Caso 72 — Runtime artifact faltante

### Entrada

Build termina correctamente.

El package final no contiene un runtime artifact requerido.

### Esperado

Packaging:

`FAIL`

Final:

`BLOCKED`

## Caso 73 — Lockfile inconsistente

### Entrada

Dependency declarations cambiaron pero lockfile requerido quedó inconsistente.

### Esperado

Packaging/dependency check:

`FAIL`

cuando sea obligatorio para reproducibilidad.

## Caso 74 — No correction

### Entrada

Verification detecta una dependency incorrecta.

### Esperado

Registrar el fallo.

No ejecutar:

- install;
- update;
- migration;
- refactor.

Debe identificar la etapa o Action ID responsable.

## Caso 75 — No modificar tests

### Entrada

Un test requerido falla durante verification.

### Esperado

No modificarlo.

No cambiar expected values para obtener verde.

Registrar el fallo y retornar al owner correcto.

## Caso 76 — No crear Action IDs

### Entrada

Verification descubre una necesidad nueva.

### Esperado

No crear:

- `GLOBAL-*`;
- `FN-*`;
- `SR-ACTION-*`.

Registrar el finding.

Retornar a planning cuando sea necesario.

## Caso 77 — No modificar plan

### Entrada

AFTER contradice el migration plan.

### Esperado

No editar el plan para hacer coincidir la ejecución.

Registrar:

- contradiction;
- evidence;
- responsible Action ID;
- blocker/review.

## Caso 78 — BEFORE preservation

### Entrada

Existe:

`.migration/catalog/**`

### Esperado

No modificar BEFORE con datos AFTER.

AFTER vive en:

`.migration/verification/`

## Caso 79 — Evidence status

### Entrada

Una observación está confirmada.

### Esperado

Usar:

`evidenceStatus = CONFIRMED`

No:

`status = PASS`

cuando solo se expresa certeza.

## Caso 80 — Validation status

### Entrada

Un comando obligatorio fue ejecutado correctamente.

### Esperado

Check:

`status = PASS`

No:

`evidenceStatus = PASS`

No:

`executionStatus = PASS`

## Caso 81 — Execution status preservado

### Entrada

Verification consume una acción ejecutada previamente.

### Esperado

Leer su:

`executionStatus`

No convertirlo en:

`PASS`

como si fuera el mismo dominio de estado.

## Caso 82 — Mandatory FAIL

### Entrada

Existe cualquier check obligatorio en:

`FAIL`

### Esperado

Final:

`BLOCKED`

No utilizar:

`VERIFIED_WITH_DEBT`

para ocultar el fallo.

## Caso 83 — Mandatory NOT_EXECUTED

### Entrada

Un gate obligatorio está:

`NOT_EXECUTED`

### Esperado

No declarar:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Resolver:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

según la causa.

## Caso 84 — Human review sin blocker técnico

### Entrada

Todos los checks ejecutables están satisfechos.

Una decisión humana requerida permanece pendiente.

No existe blocker técnico dominante.

### Esperado

Final:

`REQUIRES_REVIEW`

## Caso 85 — Blocker técnico más review

### Entrada

Existe simultáneamente:

- blocker técnico obligatorio;
- review requirement.

### Esperado

Final principal:

`BLOCKED`

El review requirement permanece registrado.

## Caso 86 — Optional FAIL no bloquea automáticamente

### Entrada

Un check relacionado exclusivamente con:

`requiredForMigration = false`

falla.

Todos los gates obligatorios están satisfechos.

### Esperado

No producir automáticamente:

`BLOCKED`

Clasificar el resultado como debt/risk/optimization según corresponda.

## Caso 87 — VERIFIED_WITH_DEBT no oculta review

### Entrada

Todos los checks ejecutados pasan.

Existe una decisión humana obligatoria pendiente.

También existe technical debt.

### Esperado

Final:

`REQUIRES_REVIEW`

No:

`VERIFIED_WITH_DEBT`

## Caso 88 — verification.json

### Entrada

Verification concluye.

### Esperado

Crear:

`.migration/verification/verification.json`

con cuando corresponda:

- `schemaVersion`;
- `status`;
- `target`;
- `scope`;
- `references`;
- `baselineRef`;
- `planCompliance`;
- `runtime`;
- `dependencies`;
- `installation`;
- `typecheck`;
- `build`;
- `testingArtifacts`;
- `tests`;
- `observableContracts`;
- `coverage`;
- `host`;
- `functions`;
- `programmingModel`;
- `durable`;
- `structuralCompliance`;
- `sharedResources`;
- `legacyResidual`;
- `packaging`;
- `blockers`;
- `technicalDebt`;
- `optimizationOpportunities`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

No incluir:

- dependency learning candidates;
- architecture target;
- nuevos dependency targets.

## Caso 89 — verification.md

### Entrada

Verification produce vista humana.

### Esperado

Crear:

`.migration/verification/verification.md`

utilizando:

`verification.template.md`

El JSON permanece como owner estructurado.

## Caso 90 — No lessons obligatorias

### Entrada

Verification concluye normalmente sin aprendizaje reutilizable adicional.

### Esperado

No requerir artifacts vacíos bajo:

`.migration/lessons/verify-function-app/`

para cerrar verification.

## Caso 91 — Lesson no modifica baseline

### Entrada

La ejecución produce una observación reutilizable sobre una dependencia.

### Esperado

Puede registrarse una lesson conforme a `lessons-policy.md`.

No debe:

- modificar baseline;
- aprobar target;
- incrementar baselineRevision.

## Caso 92 — Estado final VERIFIED

### Entrada

Todos los mandatory gates están satisfechos.

No existen:

- blockers;
- review requirements;
- technical debt relevante.

### Esperado

`VERIFIED`

## Caso 93 — Estado final VERIFIED_WITH_DEBT

### Entrada

Todos los mandatory gates están satisfechos.

Existe technical debt no bloqueante.

### Esperado

`VERIFIED_WITH_DEBT`

## Caso 94 — Estado final BLOCKED

### Entrada

Existe impedimento técnico conocido sobre un mandatory gate o required action.

### Esperado

`BLOCKED`

Debe identificar cuando corresponda:

- gate;
- Action ID;
- stage owner;
- evidence.

## Caso 95 — Estado final REQUIRES_REVIEW

### Entrada

No existe blocker técnico dominante.

Una decisión humana es necesaria para cerrar un mandatory gate.

### Esperado

`REQUIRES_REVIEW`

## Caso 96 — Retorno a owner correcto

### Entrada

Verification detecta:

`FN-REQUESTREPORT-002`

incompleta.

La acción pertenece a preparation.

### Esperado

Registrar el owner responsable:

`prepare-function`

No ejecutar la corrección.

## Caso 97 — Fallo de testing vuelve a testing

### Entrada

Existe un testing requirement obligatorio sin protección suficiente.

### Esperado

Indicar como owner:

`generate-function-tests`

o planning/preparation cuando el problema real sea testability.

No generar tests desde verification.

## Caso 98 — Fallo PM vuelve al skill PM

### Entrada

La Function sigue en Programming Model v3.

### Esperado

Indicar:

`migrate-programming-model-v4`

como etapa responsable cuando corresponda.

No migrar desde verification.

## Caso 99 — Fallo Durable vuelve al workflow migration

### Entrada

Un workflow requerido posee una registration/activity incompleta.

### Esperado

Indicar:

`migrate-durable-functions-v4`

cuando sea el owner según planning.

No modificar el workflow.

## Caso 100 — Executor neutral

### Entrada

La verificación puede ser revisada por un developer sin acceso al razonamiento privado del agente.

### Esperado

Los artifacts deben permitir entender:

```text
qué debía cumplirse
→ qué se ejecutó
→ qué evidencia existe
→ qué falló
→ por qué se emitió el estado final
```

No depender de inferencias ocultas.

## Criterio general

`verify-function-app` debe responder:

```text
¿la Function App alcanzó el target técnico obligatorio
y preservó los contratos requeridos
según evidencia reproducible?
```

No debe responder:

```text
¿cómo arreglo lo que falló?
```

Invariantes:

```text
BEFORE
→ histórico
→ no se reescribe
```

```text
PLAN
→ define target, scope y required actions
```

```text
EXECUTION
→ executionStatus
```

```text
VERIFY
→ PASS / FAIL / NOT_EXECUTED / NOT_APPLICABLE / REQUIRES_REVIEW
```

```text
mandatory FAIL
→ BLOCKED
```

```text
mandatory NOT_EXECUTED
→ nunca VERIFIED
```

```text
requiredForMigration = false
→ no bloquea por sí solo
```

```text
tests PASS
≠ all behavior proven
```

```text
coverage
≠ behavioral proof
```

```text
build PASS
≠ behavioral compatibility
```

```text
host.json
≠ deployed Azure Functions Runtime proof
```

```text
MIGRATED
≠ VERIFIED
```

```text
repository verification
≠ deployment verification
≠ production safety
```

```text
structuralCompliance
≠ architecture ideal
```

```text
verification
→ no correction
→ no new Action IDs
→ no baseline mutation
```
