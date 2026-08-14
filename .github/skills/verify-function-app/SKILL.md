---
name: verify-function-app
description: Verifica de forma reproducible una Azure Function App después de su migración comparando BEFORE, PLAN y AFTER, ejecutando los gates finales y determinando el resultado sin modificar código.
---

# Verify Function App

## Objetivo

Determinar mediante evidencia reproducible si la Function App completó correctamente la migración técnica requerida y
preservó los contratos observables definidos por el plan.

Este skill:

- verifica;
- compara;
- ejecuta gates finales;
- agrega resultados;
- emite una conclusión.

Este skill no corrige.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

`architecture-policy.md` se utiliza únicamente para verificar cambios estructurales requeridos explícitamente por el
plan.

No se utiliza como target arquitectónico independiente.

## Entradas

Consumir los artifacts aplicables de:

- inventory;
- assessment;
- catálogo BEFORE;
- global migration plan;
- dependency baseline referenciada;
- shared resources;
- Function analyses;
- Function plans;
- global preparation;
- Function preparations;
- Function testing;
- Function migrations;
- Durable migrations.

No exigir artifacts correctamente `NOT_APPLICABLE`.

No reconstruir información cuyo owner ya exista.

## Principio

Comparar:

```text
BEFORE
→ PLAN
→ EXECUTION
→ AFTER
```

Verification responde:

`¿Lo que debía cambiar cambió y lo que debía preservarse se preservó?`

No reconstruir el target.

No seleccionar nuevas versiones.

No corregir fallos encontrados.

## Scope

Consumir del plan:

- `requestedScope`;
- `effectiveScope`;
- `affectedFunctionsOutsideScope`.

Verification utiliza:

`effectiveScope`

como scope principal de los gates de migración.

No ampliar el scope durante verification.

Los hallazgos fuera del scope pueden registrarse cuando afecten directamente un gate requerido.

## Target técnico

Consumir el target aprobado desde:

- migration plan;
- baseline reference.

Verificar cuando corresponda:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- package targets aprobados;
- Durable target aprobado;
- demás dimensiones explícitamente requeridas por el plan.

No comparar contra:

`latest`

No cambiar targets durante verification.

## Secuencia

Ejecutar cuando corresponda:

1. plan compliance;
2. dependency state;
3. installation;
4. runtime evidence;
5. typecheck;
6. build global;
7. tests;
8. coverage;
9. Function registration;
10. Programming Model;
11. Durable workflows;
12. observable contracts;
13. required structural changes;
14. shared resources;
15. relevant legacy residual;
16. packaging;
17. final aggregation.

El orden puede adaptarse cuando existan dependencias técnicas, pero todos los gates obligatorios deben quedar resueltos.

## Verification checks

Cada check utiliza exclusivamente:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

No utilizar estos valores para representar evidencia.

## Evidence status

Cuando un hallazgo describa certeza:

usar:

`evidenceStatus`

Valores conforme a:

`status-policy.md`

Ejemplo:

```json
{
  "currentRuntime": null,
  "evidenceStatus": "UNKNOWN"
}
```

No utilizar:

`PASS`

como sinónimo de conocimiento confirmado.

## Plan compliance

Verificar las acciones del plan antes de emitir conclusión final.

Considerar:

- `GLOBAL-*`;
- `SR-ACTION-*`;
- `FN-*`.

Para cada acción relevante registrar:

- Action ID;
- type;
- `requiredForMigration`;
- execution artifact;
- `executionStatus`;
- verification status;
- evidence.

Ejemplo:

```json
{
  "actionId": "FN-REQUESTREPORT-003",
  "requiredForMigration": true,
  "executionStatus": "COMPLETED",
  "status": "PASS",
  "evidence": []
}
```

Toda acción con:

`requiredForMigration = true`

debe quedar satisfecha para obtener:

- `VERIFIED`;
- o `VERIFIED_WITH_DEBT`.

Las acciones con:

`requiredForMigration = false`

no bloquean por sí solas la migración.

## Acciones no ejecutadas

Una acción requerida con:

`executionStatus = NOT_EXECUTED`

impide declarar la migración verificada.

Determinar si corresponde:

- `BLOCKED`;
- `REQUIRES_REVIEW`.

No convertir automáticamente `NOT_EXECUTED` en `NOT_APPLICABLE`.

## Dependency verification

Consumir exclusivamente los targets aprobados por el plan y baseline referenciada.

Registrar cuando corresponda:

- package;
- declared version;
- expected target;
- installed version;
- baselineId;
- baselineRevision;
- status;
- evidence.

Ejemplo:

```json
{
  "package": "@azure/cosmos",
  "expectedVersion": "<approved-target>",
  "installedVersion": "<observed-version>",
  "baselineId": "node24-azure-functions-v4",
  "baselineRevision": 1,
  "status": "PASS",
  "evidence": []
}
```

No comparar contra `latest`.

No actualizar packages desde verification.

Si package declaration e installed package divergen:

registrar ambos.

No asumir que modificar `package.json` significa que el package target fue realmente instalado.

## Node.js

Registrar cuando corresponda:

- versión declarada;
- runtime utilizado para installation;
- runtime utilizado para typecheck;
- runtime utilizado para build;
- runtime utilizado para tests.

Cuando el target requiera Node.js 24:

los gates que dependan del runtime target deben haber utilizado Node.js 24 o evidencia equivalente explícitamente
aceptada por el plan.

No asumir Node.js 24 únicamente porque:

`package.json`

lo declare.

Si los gates requeridos fueron ejecutados con una versión incompatible:

no declarar `VERIFIED`.

## Installation

Usar el mecanismo reproducible del proyecto.

Preservar:

- package manager;
- lockfile strategy;
- comandos definidos por el proyecto.

No actualizar dependencias durante verification.

Registrar:

- command;
- runtime;
- result;
- evidence.

## Typecheck

Ejecutar el comando real cuando corresponda.

Registrar:

- command;
- runtime;
- status;
- evidence.

No utilizar existencia de un script como prueba de que typecheck funciona.

## Build global

Ejecutar el build global únicamente después de completar las adaptaciones requeridas de la Function App.

Registrar:

- command;
- runtime;
- status;
- evidence.

El build global pertenece a este skill.

Un build exitoso:

```text
≠
prueba suficiente de preservación funcional
```

Un `FAIL` de build obligatorio bloquea la verificación final.

## Testing artifacts

Consumir cuando correspondan:

`.migration/functions/<FunctionName>/testing.json`

Verificar:

- requirements requeridos;
- tests existentes reutilizados;
- tests agregados;
- resultados pre-migration;
- gaps registrados;
- blockers;
- review requirements.

No modificar `testing.json`.

## Tests finales

Ejecutar las pruebas requeridas después de completar la migración.

Comparar los mismos contratos observables protegidos antes de la migración.

Registrar:

- command;
- runtime;
- suites;
- passed;
- failed;
- skipped;
- status;
- evidence.

No modificar tests para aceptar una regresión.

Una suite verde demuestra únicamente los contratos cubiertos.

## Observable contracts

Verificar explícitamente cuando corresponda:

- input;
- output;
- relevant errors;
- observable side effects.

Usar evidencia proveniente de:

```text
BEFORE
+
analysis
+
plan
+
testing
+
post-migration execution
```

No considerar build exitoso como evidencia suficiente de equivalencia funcional.

Cuando un contrato requerido carezca de evidencia suficiente:

no declararlo preservado.

## Coverage

Verificar coverage únicamente cuando forme parte de los gates aprobados.

No utilizar porcentaje global como sustituto de cobertura funcional.

Considerar cuando corresponda las clasificaciones:

- `BEHAVIORAL`;
- `ADAPTER`;
- `WIRING`;
- `CONTRACT`;
- `TYPE_ONLY`;
- `GENERATED`.

Lógica `BEHAVIORAL` requerida por el contrato no debe estar excluida únicamente para mejorar métricas.

Exclusiones justificadas pueden corresponder a:

- wiring sin comportamiento;
- contracts;
- type-only code;
- generated code.

Cuando exista SonarQube u otra herramienta acordada:

verificar compatibilidad con la evidencia de coverage producida.

## Azure Functions Host

Ejecutar Azure Functions Host únicamente cuando:

- sea necesario para un gate aprobado;
- exista configuración sanitizada y expresamente permitida.

No leer:

`local.settings.json`

No leer archivos protegidos para intentar iniciar el Host.

La imposibilidad de ejecutar Host con configuración segura debe registrarse mediante el estado correspondiente.

## Azure Functions Runtime

No confundir:

`host.json`

con:

`Azure Functions Runtime efectivo`

Verificar Runtime v4 únicamente cuando exista evidencia permitida y suficiente.

Si el Runtime efectivo depende de infraestructura externa no observable de forma segura:

registrar la incertidumbre.

No inspeccionar CI/CD protegido para resolverla.

Cuando Runtime v4 sea un gate obligatorio y no pueda demostrarse:

no declarar `VERIFIED`.

## Functions

Comparar:

- Functions BEFORE;
- Functions esperadas según el plan;
- Functions observadas AFTER.

Registrar:

- expected;
- present;
- missing;
- unexpected;
- status;
- evidence.

No considerar una Function eliminada o agregada como correcta únicamente porque build pase.

## Programming Model

Verificar por Function dentro del scope efectivo cuando corresponda.

Comprobar:

- modelo esperado;
- registro observable;
- migration artifact;
- action result;
- validation evidence.

Una Function correctamente `NOT_APPLICABLE` no debe considerarse fallo.

No inferir PM v4 únicamente desde package version cuando exista evidencia más directa disponible.

## Durable

Verificar cada workflow aplicable como unidad.

Comprobar cuando corresponda:

- target Durable aprobado;
- participants;
- registrations;
- topology;
- determinism;
- retries;
- timers;
- external events;
- sub-orchestrators;
- entities;
- tests;
- shared resources;
- active-instance review state;
- action results.

No reconstruir todo el workflow si `durable-migration.json` ya contiene evidencia suficiente.

Un workflow con:

```text
active instances may exist
+
replay compatibility unknown
```

no debe considerarse seguro productivamente sin la revisión requerida.

## Structural compliance

Verificar únicamente los cambios estructurales que el plan haya marcado:

`requiredForMigration = true`

Comprobar:

- que fueron ejecutados;
- que no fueron revertidos posteriormente;
- que el resultado observable cumple la intención de la acción.

No verificar:

- cantidad de carpetas;
- clean architecture;
- arquitectura ideal;
- future-proofing general.

Las acciones estructurales:

`requiredForMigration = false`

no forman parte del gate obligatorio.

## Shared resources

Verificar únicamente recursos compartidos relevantes para el scope efectivo.

Comprobar cuando corresponda:

- resource ID;
- ownership consolidado;
- consumers relevantes;
- shared action completion;
- implementaciones esperadas;
- duplicaciones introducidas por la migración.

No considerar como duplicación dos recursos distintos que utilicen la misma tecnología.

Una deuda shared preexistente no bloquea salvo que contradiga una acción requerida.

## Legacy residual

Inspeccionar únicamente legacy relevante para:

- effectiveScope;
- target técnico;
- acciones requeridas;
- packaging o registration.

Clasificar hallazgos como:

- `BLOCKING`;
- `TECHNICAL_DEBT`;
- `EXPECTED`;
- `UNKNOWN`.

Usar:

`classification`

No utilizar el status principal para esta clasificación.

Ejemplos:

```text
function.json todavía registrado para una Function migrada cuando debía retirarse
→ BLOCKING

MegaService legacy todavía existente pero fuera de acciones requeridas
→ TECHNICAL_DEBT o EXPECTED
```

No exigir eliminación de todo código legacy.

## Packaging

Verificar cuando corresponda:

- build output;
- package metadata;
- lockfile;
- runtime dependencies;
- `host.json`;
- `.funcignore`;
- entrypoints;
- artifacts requeridos para deployment.

No desplegar.

No modificar packaging desde verification.

## Deuda y optimizaciones

Mantener separadas:

- blockers;
- technical debt;
- optimization opportunities;
- unknowns;
- review requirements.

Deuda no bloqueante no impide:

`VERIFIED_WITH_DEBT`

Una optimización pendiente no produce deuda automáticamente.

## Aggregation

Aplicar la agregación final definida por:

`status-policy.md`

### Mandatory FAIL

Un check obligatorio en:

`FAIL`

bloquea el cierre requerido.

Resultado final:

`BLOCKED`

### Mandatory NOT_EXECUTED

Un check obligatorio en:

`NOT_EXECUTED`

impide:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Debe resolverse como:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

según la causa.

### REQUIRES_REVIEW

Cuando no exista blocker técnico dominante pero una decisión humana sea necesaria:

`REQUIRES_REVIEW`

### Technical blocker + review

Si existen simultáneamente:

- blocker técnico;
- decisión humana pendiente;

el estado principal es:

`BLOCKED`

La revisión pendiente permanece registrada.

### Non-blocking debt

Cuando todos los gates obligatorios están satisfechos y solo existe deuda no bloqueante:

`VERIFIED_WITH_DEBT`

### All mandatory gates satisfied

Cuando todos los gates obligatorios están satisfechos y no existe deuda relevante:

`VERIFIED`

## Salida estructurada

Crear:

`.migration/verification/verification.json`

Debe contener cuando corresponda:

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

No debe contener:

- dependency targets nuevos;
- dependency learning promotion;
- cambios ejecutados durante verification;
- architecture target.

## Estado final

Usar exclusivamente:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

## VERIFIED

Requiere:

- target técnico obligatorio demostrado;
- todas las acciones `requiredForMigration = true` satisfechas;
- dependency targets obligatorios satisfechos;
- todos los mandatory gates resueltos satisfactoriamente;
- build global exitoso cuando aplique;
- tests requeridos verdes;
- contratos observables requeridos preservados;
- Functions esperadas presentes;
- Programming Model correcto;
- Durable correcto cuando aplique;
- cambios estructurales requeridos satisfechos;
- shared resources requeridos consistentes;
- packaging requerido válido;
- ausencia de blockers;
- ausencia de deuda relevante que requiera `VERIFIED_WITH_DEBT`.

## VERIFIED_WITH_DEBT

Requiere los mismos gates obligatorios que:

`VERIFIED`

pero existe deuda técnica no bloqueante.

No utilizar `VERIFIED_WITH_DEBT` para esconder:

- mandatory `FAIL`;
- mandatory `NOT_EXECUTED`;
- blocker;
- revisión humana requerida para un gate obligatorio.

## BLOCKED

Existe un impedimento técnico conocido que impide satisfacer un gate obligatorio o una acción requerida.

Registrar:

- blocker;
- gate afectado;
- evidence;
- etapa o acción responsable.

Verification no corrige el blocker.

## REQUIRES_REVIEW

La evidencia disponible no permite cerrar un gate obligatorio sin decisión humana y no existe un blocker técnico
dominante.

Registrar explícitamente:

- decisión requerida;
- evidencia disponible;
- consecuencia sobre verification.

## Resultado y retorno

Cuando el resultado sea:

`BLOCKED`

indicar la etapa o Action ID responsable.

Ejemplos:

```text
GLOBAL-003
→ prepare-function-app
```

```text
FN-REQUESTREPORT-002
→ prepare-function
```

```text
testing requirement
→ generate-function-tests
```

```text
PM migration
→ migrate-programming-model-v4
```

```text
Durable workflow
→ migrate-durable-functions-v4
```

Verification no ejecuta esa corrección.

## Salida humana

Crear:

`.migration/verification/verification.md`

Usar:

`../_shared/templates/verification.template.md`

## Catálogo

No modificar:

`.migration/catalog/**`

BEFORE permanece histórico.

AFTER vive en verification.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante derivado de la ejecución.

Verification no:

- modifica baseline;
- promueve targets;
- convierte una ejecución exitosa en regla permanente.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

El skill termina cuando:

- BEFORE, PLAN, EXECUTION y AFTER fueron comparados;
- effectiveScope fue respetado;
- baseline y target aprobados fueron preservados;
- cumplimiento de Action IDs requeridos fue verificado;
- dependency targets requeridos fueron verificados;
- runtimes utilizados en gates relevantes quedaron registrados;
- installation fue evaluada cuando aplicaba;
- typecheck fue ejecutado cuando era obligatorio;
- build global fue ejecutado cuando era obligatorio;
- testing artifacts requeridos fueron consumidos;
- tests finales requeridos fueron ejecutados;
- contratos observables requeridos fueron verificados;
- coverage fue evaluado cuando aplicaba;
- Functions y Programming Model fueron verificados;
- Durable fue verificado como workflow cuando aplicaba;
- cambios estructurales obligatorios fueron verificados;
- shared resources relevantes fueron verificados;
- legacy residual relevante fue clasificado;
- packaging fue evaluado cuando aplicaba;
- ningún mandatory `NOT_EXECUTED` quedó oculto;
- blockers, debt, unknowns y review requirements quedaron separados;
- se emitió estado final;
- no se realizaron correcciones;
- no se modificó dependency baseline;
- no se modificó catálogo BEFORE.

La ausencia de lessons no impide cerrar verification.

## Fuera de alcance

No debe:

- corregir código;
- modificar tests;
- generar tests;
- introducir seams;
- seleccionar nuevas versiones;
- consultar `latest` para redefinir targets;
- modificar dependency baseline;
- aprobar dependency targets;
- modificar migration plans;
- generar nuevos Action IDs;
- ejecutar acciones pendientes;
- refactorizar;
- migrar;
- modernizar;
- optimizar;
- modificar CI/CD protegido;
- desplegar.
