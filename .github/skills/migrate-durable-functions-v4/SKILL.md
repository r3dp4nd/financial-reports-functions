---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions como una unidad coherente hacia el target aprobado compatible con Azure Functions Programming Model v4, preservando comportamiento, determinismo, topology y recursos compartidos.
---

# Migrate Durable Functions v4

## Objetivo

Migrar la integración Durable de un workflow como una unidad funcional coherente hacia el target aprobado.

El nombre del skill hace referencia al contexto de Azure Functions Programming Model v4.

No implica que el package:

`durable-functions`

deba utilizar major version 4.

Debe preservar cuando corresponda:

- workflow topology;
- roles;
- comportamiento observable;
- determinismo;
- contracts;
- Function y Activity names;
- instance semantics;
- retries;
- timers;
- external events;
- sub-orchestrations;
- entities;
- estructura requerida previamente preparada;
- recursos compartidos;
- comportamiento protegido mediante pruebas.

No rediseña el workflow.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

`architecture-policy.md` se utiliza únicamente para evitar revertir cambios estructurales requeridos previamente.

No se utiliza para introducir arquitectura nueva durante Durable migration.

## Precondiciones

Deben existir cuando correspondan:

- inventory;
- assessment;
- global migration plan;
- Function analyses necesarias;
- Function migration plans necesarias;
- Function preparations requeridas;
- global preparation;
- shared resources.

Debe existir una definición suficiente del workflow y de sus participantes.

Cuando existan testing requirements requeridos antes de migration:

`.migration/functions/<FunctionName>/testing.json`

o los artifacts de testing correspondientes a los participantes.

Todos los requirements de los que dependa esta migración con:

`requiredBeforeMigration = true`

deben encontrarse satisfechos.

No omitir testing gates definidos por el plan.

## Entradas

Consumir primero:

- global plan;
- workflow scope definido por planning;
- Function plans participantes;
- Function analyses necesarios;
- preparations;
- testing artifacts cuando correspondan;
- shared resources;
- global preparation relevante.

No reconstruir analysis.

No reinterpretar planning.

No volver a seleccionar package targets.

## Aplicabilidad

### Durable ausente

Si no existe Durable en el scope:

`status = NOT_APPLICABLE`

### Workflow ya en target

Si el workflow ya cumple el target aprobado y no existe ninguna acción Durable requerida:

`status = NOT_APPLICABLE`

### Workflow insuficientemente conocido

Si no existe evidencia suficiente para identificar de forma segura:

- participantes;
- roles;
- topology relevante;
- registrations;

usar:

`status = REQUIRES_REVIEW`

### Dependencia requerida pendiente

Cuando una acción requerida depende de una preparación todavía no completada:

`status = BLOCKED`

## Unidad de migración

La unidad coherente es el workflow.

Puede contener:

- `CLIENT`;
- `STARTER`;
- `ORCHESTRATOR`;
- `ACTIVITY`;
- `SUB_ORCHESTRATOR`;
- `ENTITY`.

Los planes por Function aportan trazabilidad local.

No fragmentan automáticamente la migración del workflow.

Planning determina el `effectiveScope`.

Este skill no amplía el scope por decisión propia.

## Ownership de acciones

Ejecutar únicamente acciones aprobadas cuya responsabilidad corresponda a la migración coordinada del workflow Durable.

Una Function Durable no pertenece automáticamente a este skill para todas sus modificaciones.

Planning puede asignar, por ejemplo:

```text
HTTP starter PM registration
→ migrate-programming-model-v4

orchestrator + activities Durable adaptation
→ migrate-durable-functions-v4
```

No ejecutar una acción que ya tenga otro owner.

Evitar que:

`migrate-programming-model-v4`

y:

`migrate-durable-functions-v4`

modifiquen la misma acción o adapter.

## Action IDs

Preservar exactamente los IDs definidos por planning.

Este skill no genera nuevos Action IDs.

Si descubre una necesidad no representada por el plan:

- no ejecutarla silenciosamente;
- registrar evidencia;
- registrar una desviación;
- volver a planning cuando sea necesaria para continuar.

## Execution status

Cada acción procesada utiliza:

- `COMPLETED`;
- `FAILED`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Aplicar:

`../_shared/status-policy.md`

No utilizar `PASS` o `FAIL` como estado de ejecución de una acción.

## Dependency target

La versión target de:

`durable-functions`

debe provenir del plan y de la dependency baseline aprobada.

Cuando el workflow requiera además:

`@azure/functions`

su target también debe provenir del plan aprobado.

Este skill no selecciona versiones alternativas.

La preparación global es responsable de package targets globales.

Si una versión requerida no se encuentra preparada:

`status = BLOCKED`

No ejecutar:

```text
npm install durable-functions@latest
```

No utilizar una versión diferente por conveniencia.

## Documentación técnica externa

Cuando sea necesario resolver la forma exacta de una API Durable para el target aprobado:

puede consultarse documentación oficial mínima conforme a `evidence-policy.md`.

La investigación responde:

`¿Cómo adaptamos esta API al target ya aprobado?`

No:

`¿Qué package version deberíamos elegir ahora?`

## Workflow

Identificar y preservar los participantes relevantes.

Registrar cuando corresponda:

| Participant | Role | Evidence status |
|-------------|------|-----------------|
|             |      |                 |

No inventar participantes por naming.

## Workflow topology

Preservar cuando corresponda:

- order;
- branching;
- fan-out;
- fan-in;
- Activities;
- sub-orchestrations;
- retries;
- timers;
- external events;
- entities;
- result flow;
- relevant error flow.

El resultado esperado de una migración técnica es normalmente:

```text
topologyChanged = false
```

Si la topology cambia sin una decisión explícita del plan:

no tratarlo como una adaptación técnica normal.

Usar:

`REQUIRES_REVIEW`

cuando sea necesaria una decisión humana.

No rediseñar el workflow.

## Graph evidence

Registrar el grafo únicamente con el detalle necesario para demostrar relaciones relevantes.

No generar representaciones BEFORE/AFTER redundantes cuando la topology no haya cambiado.

Cuando exista una diferencia:

- mostrarla explícitamente;
- conservar evidencia;
- no normalizarla como parte de la migración.

## Starter / Client

Preservar cuando corresponda:

- target orchestrator;
- input;
- instance ID semantics;
- start behavior;
- response;
- status information;
- relevant errors.

No cambiar la estrategia de creación de instances únicamente por preferencia.

## Orchestrator

Preservar cuando corresponda:

- order;
- branching;
- fan-out/fan-in;
- Activity calls;
- retries;
- timers;
- sub-orchestrations;
- external events;
- entities;
- error behavior;
- result.

No introducir I/O externo dentro del orchestrator.

No rediseñar decisiones funcionales.

## Determinismo

La migración debe preservar las restricciones de determinismo requeridas por Durable Functions.

No introducir dentro del orchestrator:

- database I/O;
- network calls;
- filesystem I/O;
- messaging I/O directo;
- external SDK clients;
- side effects directos;
- random no determinista;
- tiempo no determinista;
- mutable global state dependiente de la ejecución.

Cuando el target Durable proporcione APIs deterministas equivalentes:

utilizar únicamente las adaptaciones necesarias para preservar la semántica existente.

No considerar:

```text
typecheck PASS
```

o:

```text
build PASS
```

como prueba suficiente de determinismo.

## Determinism check

Registrar:

```json
{
  "determinism": {
    "status": "PASS",
    "evidence": []
  }
}
```

Usar los estados de verification checks:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

No afirmar `PASS` sin evidencia.

## Activities

Preservar cuando corresponda:

- Activity name;
- input;
- output;
- relevant errors;
- external observable effects.

Una Activity puede seguir tratándose como una función normal desde el punto de vista de comportamiento.

No modificar contratos funcionales como parte de la migración Durable.

Los cambios estructurales locales previamente aprobados deben preservarse.

## Sub-orchestrators

Preservar:

- target;
- input;
- output;
- invocation semantics;
- ordering relevante;
- errors.

No convertir sub-orchestrations en Activities o viceversa salvo decisión explícita fuera de esta migración técnica.

## Retries

Preservar:

- existencia;
- policy;
- cantidad relevante;
- intervals;
- error handling asociado;

cuando formen parte del comportamiento actual.

No cambiar retries por preferencia o supuesta optimización.

## Timers

Preservar:

- existencia;
- secuencia;
- intención;
- duración o cálculo relevante;
- cancellation behavior cuando corresponda.

No sustituir timers Durable por tiempo no determinista.

## External events

Preservar cuando corresponda:

- event name;
- waiting semantics;
- payload contract;
- ordering assumptions;
- timeout interaction.

No renombrar eventos sin una acción aprobada.

## Entities

Cuando existan Durable Entities, preservar:

- entity name;
- operation names;
- state semantics;
- inputs;
- outputs;
- relevant errors.

No rediseñar el modelo de estado durante la migración técnica.

## Durable APIs

Registrar únicamente APIs realmente adaptadas.

Cuando corresponda:

| Participant | Before | After | Adaptation |
|-------------|--------|-------|------------|
|             |        |       |            |

El target ya debe estar aprobado.

No volver a resolver versiones desde esta sección.

## Shared resources

Consumir Resource IDs y ownership definidos por planning.

No:

- duplicar repositories;
- duplicar publishers;
- construir clientes alternativos por Activity;
- cambiar ownership;
- crear recursos locales para evitar una dependencia shared.

Las `SR-ACTION-*` requeridas deben estar completadas antes de ejecutar una acción dependiente.

Si una dependencia obligatoria no está completada:

no ejecutar la acción dependiente.

Cuando impida completar el workflow:

`status = BLOCKED`

## Estructura preparada

Preservar únicamente los cambios estructurales requeridos que ya fueron aplicados durante preparation.

No volver a introducir lógica funcional dentro de registration adapters cuando el plan exigió separarla.

No utilizar Durable migration como oportunidad para:

- reorganizar capabilities;
- renombrar carpetas;
- dividir servicios legacy;
- introducir capas adicionales.

## Código funcional

Modificar únicamente lo necesario para adaptar la integración Durable al target aprobado.

No cambiar:

- decisiones funcionales;
- contract outputs;
- relevant error semantics;
- observable side effects.

Si una adaptación aparentemente exige un cambio funcional:

`status = REQUIRES_REVIEW`

No normalizar el cambio como parte de la migración.

## Active instances

Evaluar explícitamente el riesgo de instancias activas cuando sea relevante.

Registrar uno de:

- `UNKNOWN`;
- `REVIEWED`;
- `NOT_APPLICABLE`.

### UNKNOWN

No existe evidencia suficiente sobre instancias activas o estrategia de replay.

`UNKNOWN` por sí solo no demuestra un fallo.

Sin embargo, cuando:

```text
active instances may exist
+
replay compatibility is unknown
```

no afirmar seguridad productiva.

Usar:

`REQUIRES_REVIEW`

antes de cerrar una decisión que dependa de esa seguridad.

### REVIEWED

La situación de instancias activas y replay fue revisada con evidencia suficiente o decisión humana registrada.

### NOT_APPLICABLE

Existe evidencia suficiente de que la consideración no aplica al workflow o al contexto evaluado.

No intentar resolver esta información leyendo:

- CI/CD protegido;
- secretos;
- configuración productiva no autorizada.

No afirmar replay safety únicamente mediante tests locales.

## Tests previos

Consumir los tests definidos para proteger el comportamiento requerido del workflow y sus participantes.

Antes de migrar, todos los requirements marcados:

`requiredBeforeMigration = true`

deben estar satisfechos cuando la acción Durable dependa de ellos.

Este skill no genera pruebas nuevas.

## Tests posteriores

Después de la adaptación, ejecutar nuevamente las pruebas relevantes cuando sea viable.

Preservar las mismas expectativas de comportamiento.

No modificar tests únicamente para aceptar una regresión.

Si un test basado en evidencia confirmada falla:

- registrar `FAIL`;
- preservar evidencia;
- no cambiar el contrato silenciosamente.

## Validaciones

Puede ejecutar cuando corresponda:

- tests relevantes;
- typecheck selectivo;
- registration consistency;
- workflow graph consistency;
- determinism review;
- static checks.

Cada validación utiliza:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

Cada `PASS` debe estar respaldado por evidencia.

El build global final pertenece a:

`verify-function-app`

No utilizarlo como gate obligatorio de este skill.

## Structure preserved

Comprobar únicamente que Durable migration no revirtió cambios estructurales requeridos previamente.

Ejemplo:

```json
{
  "structurePreserved": {
    "status": "PASS",
    "evidence": []
  }
}
```

Este check no evalúa calidad arquitectónica global.

No verifica modernización.

## Legacy artifacts

Retirar únicamente artifacts Durable legacy directamente reemplazados por una acción aprobada.

Antes de retirarlos:

- confirmar su ownership;
- confirmar el reemplazo;
- confirmar que ya no participan en registration o build observable.

Ante incertidumbre:

preservar y registrar.

No realizar cleanup global.

## Desviaciones del plan

Registrar toda diferencia entre lo planificado y lo ejecutado.

Una desviación no autoriza trabajo nuevo.

Si aparece una necesidad Durable adicional:

- no crear un nuevo Action ID;
- no ejecutarla silenciosamente;
- registrar evidencia;
- volver a planning cuando sea necesaria.

## Salida estructurada

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.json`

Debe contener cuando corresponda:

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

No debe duplicar completamente:

- inventory;
- Function analyses;
- Function plans;
- preparations;
- testing artifacts.

Referenciar sus owners.

## actionResults

Cada acción procesada debe registrar como mínimo:

- `actionId`;
- `executionStatus`.

Registrar cuando corresponda:

- participant;
- reason;
- filesModified;
- evidence.

Ejemplo:

```json
{
  "actionId": "FN-GENERATEREPORTORCHESTRATOR-004",
  "executionStatus": "COMPLETED",
  "evidence": []
}
```

## Estado principal

Usar únicamente:

- `MIGRATED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### MIGRATED

La migración Durable requerida del workflow fue completada.

Además:

- workflow y participantes relevantes estaban suficientemente confirmados;
- package targets requeridos estaban preparados;
- testing gates previos requeridos estaban satisfechos;
- actions requeridas fueron ejecutadas;
- registrations fueron adaptadas;
- topology requerida fue preservada;
- determinismo fue preservado con evidencia;
- contracts relevantes fueron preservados;
- shared resources permanecen coordinados;
- validaciones locales obligatorias fueron satisfactorias;
- active instances no dejan una decisión de seguridad productiva pendiente que impida cerrar esta etapa;
- no existe blocker.

`MIGRATED` no significa que toda la Function App esté verificada.

### NOT_APPLICABLE

Durable no existe en el scope o el workflow ya cumple el target sin acciones requeridas.

### BLOCKED

Un impedimento técnico conocido impide completar o validar una acción requerida.

### REQUIRES_REVIEW

Completar la migración o afirmar una propiedad necesaria requiere una decisión humana.

## Evidence status

Cuando un hallazgo o relación necesite expresar certeza:

usar:

`evidenceStatus`

Ejemplo:

```json
{
  "from": "GenerateReportOrchestrator",
  "to": "CreateExcelActivity",
  "evidenceStatus": "CONFIRMED"
}
```

No utilizar el status principal para representar certeza de un hallazgo.

## Artefactos de workflow

Los artifacts Durable viven bajo:

`.migration/workflows/<WorkflowName>/`

No almacenarlos bajo:

`.migration/functions/<WorkflowName>/`

salvo que exista además una Function real con ese nombre y posea sus propios artifacts.

La separación permanece:

```text
functions/
→ artifacts de Functions

workflows/
→ artifacts coordinados de Durable workflows
```

## Salida humana

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.md`

Usar:

`../_shared/templates/durable-migration.template.md`

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

Durable migration registra ejecución.

No reescribe el estado histórico BEFORE.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

`MIGRATED` requiere:

- el workflow era aplicable;
- el scope efectivo provenía del plan;
- participantes relevantes fueron coordinados;
- Action IDs provenían del plan;
- `dependsOn` requeridos estaban satisfechos;
- package targets aprobados estaban preparados;
- testing gates previos requeridos estaban satisfechos;
- registrations requeridas fueron migradas;
- topology no cambió sin una decisión explícita;
- determinismo tiene evidencia suficiente;
- retries, timers, events, sub-orchestrators y entities relevantes fueron preservados;
- contracts funcionales relevantes fueron preservados;
- shared resources no fueron duplicados ni redefinidos;
- active instance risk fue evaluado al nivel necesario;
- actions procesadas tienen `executionStatus`;
- tests y validaciones requeridas fueron satisfactorias;
- desviaciones quedaron explícitas;
- no se generaron nuevos Action IDs;
- no se modificó el plan;
- no se ejecutó build global final;
- no existe blocker de esta etapa.

La ausencia de lessons no impide cerrar Durable migration.

## Fuera de alcance

No debe:

- seleccionar dependency versions;
- utilizar `latest`;
- modificar packages globales para elegir otra versión;
- rediseñar workflow;
- cambiar reglas funcionales;
- cambiar topology por preferencia;
- optimizar paralelismo;
- cambiar retries por preferencia;
- cambiar timers sin necesidad técnica aprobada;
- renombrar external events arbitrariamente;
- redefinir shared resources;
- cambiar ownership;
- generar tests;
- crear nuevos Action IDs;
- modificar silenciosamente el migration plan;
- afirmar replay safety de instancias activas sin evidencia;
- resolver deuda no requerida;
- modernizar;
- ejecutar build global final;
- desplegar.

Siguiente skill sugerido:

`verify-function-app`
