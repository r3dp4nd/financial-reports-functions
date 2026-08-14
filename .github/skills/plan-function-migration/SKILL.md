---
name: plan-function-migration
description: Consolida evidencia, scope, recursos compartidos y necesidades de migración para construir el plan global y los planes por Function de una Azure Function App, asignando acciones, ownership, dependencias y orden de ejecución sin modificar código.
---

# Plan Function Migration

## Objetivo

Transformar la evidencia acumulada y las necesidades identificadas durante analysis en un plan ejecutable y trazable.

Debe:

1. resolver el scope de migración;
2. consolidar recursos compartidos confirmados;
3. transformar necesidades en acciones;
4. asignar ownership;
5. construir el plan global;
6. construir planes por Function;
7. coordinar workflows Durable;
8. definir dependencias y orden de ejecución;
9. definir criterios de verificación.

No modifica código.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

`architecture-policy.md` se utiliza únicamente para evaluar acciones estructurales concretas.

No construir una arquitectura target completa.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

y los analyses necesarios para el scope solicitado:

`.migration/functions/<FunctionName>/analysis.json`

Si falta un analysis necesario:

- no inventar necesidades ni acciones;
- identificar qué parte del plan depende de él;
- usar `PARTIAL` cuando exista trabajo independiente seguro;
- usar `BLOCKED` cuando no exista un camino seguro para planificar el trabajo requerido.

## Entradas

Requerida:

- scope solicitado por el developer.

Consumir primero:

- inventory;
- assessment;
- analyses necesarios;
- catálogo BEFORE cuando ayude a navegación;
- shared resource candidates;
- baseline reference utilizada por assessment.

No volver a analizar source por defecto.

Consultar source únicamente cuando exista una inconsistencia puntual que impida resolver planning y no pueda resolverse
desde los artifacts existentes.

## Principio

Analysis identifica necesidades.

Planning decide acciones ejecutables.

No asumir una relación uno a uno entre:

`migrationNeed`

y:

`action`

Varias necesidades pueden consolidarse en una sola acción.

Una necesidad puede requerir varias acciones coordinadas.

No confundir:

`estado actual`

con:

`acción futura`.

## Scope solicitado

Preservar exactamente el scope solicitado por el developer.

Tipos conceptuales:

- `FUNCTION`;
- `FUNCTIONS`;
- `FUNCTION_APP`.

Ejemplo:

    {
      "requestedScope": {
        "type": "FUNCTION",
        "functions": [
          "RequestReport"
        ]
      }
    }

## Scope efectivo

Determinar el mínimo scope necesario para ejecutar una migración técnica coherente.

Registrar:

- `requestedScope`;
- `effectiveScope`;
- `affectedFunctionsOutsideScope`;
- motivo de cualquier expansión;
- evidencia utilizada.

No expandir scope únicamente porque:

- varias Functions utilicen el mismo servicio;
- exista código compartido;
- utilicen el mismo SDK;
- pertenezcan a la misma tecnología.

Registrar esos consumidores como afectados fuera del scope cuando corresponda.

## Durable y scope

Cuando una Function solicitada pertenezca a un workflow Durable:

1. identificar el workflow;
2. revisar los analyses de participantes necesarios;
3. determinar si la migración técnica puede realizarse coherentemente de forma aislada;
4. expandir `effectiveScope` al workflow únicamente cuando sea necesario.

Toda expansión debe quedar justificada.

El developer debe poder identificar:

- qué se solicitó;
- qué scope efectivo propone el plan;
- por qué se amplió.

## Dependency baseline

Consumir la referencia de baseline utilizada por assessment.

Registrar como mínimo:

- `baselineId`;
- `baselineRevision`.

No volver a consultar `latest`.

No seleccionar versiones alternativas.

No modificar una versión target aprobada durante planning.

El baseline es owner de los package targets aprobados.

Assessment es owner de la necesidad global de cambio.

Analysis es owner del impacto local.

Planning decide únicamente cómo ejecutar los cambios aprobados.

## Dependencias sin target aprobado

Una dependencia con:

`candidateTarget`

no posee todavía un target ejecutable aprobado.

Planning no debe convertir automáticamente `candidateTarget` en `targetVersion`.

Si la decisión es necesaria:

- registrar la dependencia o acción como `REQUIRES_REVIEW`;
- indicar la evidencia y decisión pendiente;
- mantener `PARTIAL` si existe trabajo independiente seguro;
- utilizar `BLOCKED` si esa decisión impide construir cualquier camino seguro requerido.

Planning no modifica:

`dependency-baseline.json`

## Transformación de necesidades en acciones

Consumir:

`analysis.migrationNeeds`

Planning determina para cada necesidad:

- si requiere una acción;
- scope propietario;
- Action ID;
- tipo;
- resultado esperado;
- `requiredForMigration`;
- dependencias;
- orden;
- criterios de verificación.

No conservar automáticamente un mapping uno a uno entre necesidades y acciones.

## Ownership de acciones

### Global

Usar:

`GLOBAL-NNN`

cuando el cambio pertenece a la Function App como conjunto.

Ejemplos:

- runtime/tooling;
- package target global;
- TypeScript;
- Jest/configuración global;
- build configuration.

### Shared resource

Usar:

`SR-ACTION-NNN`

cuando el cambio pertenece a un recurso compartido confirmado.

Cada recurso que requiera modificación debe tener una única acción propietaria.

### Function

Usar:

`FN-<FUNCTION>-NNN`

cuando la adaptación pertenece al consumidor o slice específico de una Function.

El ID no codifica el tipo de acción.

El tipo vive en:

`type`

## Categorías

Usar cuando corresponda:

- `REQUIRED_PLATFORM`;
- `REQUIRED_NODE`;
- `REQUIRED_DEPENDENCY`;
- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`;
- `TECHNICAL_DEBT`;
- `OPTIMIZATION`.

No crear categorías nuevas sin necesidad demostrada.

## requiredForMigration

Toda acción planificada debe indicar cuando corresponda:

`requiredForMigration`

Valores:

- `true`;
- `false`.

`true` indica que la acción forma parte del camino necesario para completar o verificar la migración técnica.

`false` identifica trabajo no obligatorio para cerrar la migración.

Las acciones:

- `TECHNICAL_DEBT`;
- `OPTIMIZATION`;

deben permanecer fuera de la ejecución obligatoria salvo decisión explícita posterior.

Una acción `STRUCTURAL` con:

`requiredForMigration: false`

no debe ejecutarse automáticamente durante la migración técnica.

## Modelo de acción

Una acción debe contener como mínimo:

- `id`;
- `type`;
- `action`;
- `reason`;
- `requiredForMigration`;
- `dependsOn`;
- evidencia o referencia a evidencia.

Puede incluir cuando corresponda:

- `function`;
- `dependency`;
- `resourceId`;
- `workflow`;
- `phase`.

Ejemplo:

    {
      "id": "FN-REQUESTREPORT-003",
      "type": "REQUIRED_DEPENDENCY",
      "action": "Adaptar el consumidor Cosmos a la API target aprobada.",
      "reason": "Analysis confirmó impacto local sobre una API utilizada.",
      "requiredForMigration": true,
      "dependsOn": [
        "GLOBAL-002"
      ]
    }

No registrar:

`executionStatus`

durante planning.

## Acción vs necesidad

No copiar mecánicamente `migrationNeeds`.

Ejemplo conceptual:

```text
Analysis A
→ Cosmos consumer impact

Analysis B
→ Cosmos consumer impact

Shared resource
→ misma implementación Cosmos confirmada

Planning
→ SR-ACTION-001 modifica implementación propietaria
→ FN-A-* adapta consumidor solo si hace falta
→ FN-B-* adapta consumidor solo si hace falta
```

No duplicar una transformación compartida en cada Function.

## Fase 1 — Shared resources

Consolidar candidatos provenientes de:

- inventory;
- analyses.

Confirmar únicamente recursos con evidencia suficiente.

Crear cuando aplique:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Usar para la vista humana:

`../_shared/templates/shared-resources.template.md`

No crear estos artifacts cuando no existan recursos compartidos confirmados.

Estos artifacts describen:

- recurso;
- ownership;
- consumidores;
- evidencia;
- necesidad general de cambio.

No son migration plans.

## Shared resource IDs

Usar:

`SR-<TYPE>-<NAME>`

Ejemplos:

- `SR-COSMOS-REPORTS`;
- `SR-SERVICEBUS-OUTBOX`;
- `SR-SQL-CUSTOMERS`.

No asumir que el mismo SDK o tecnología representa el mismo recurso.

## Ownership de shared resources

Scopes permitidos:

- `REPOSITORY`;
- `FUNCTION_APP`;
- `CAPABILITY`;
- `WORKFLOW`.

Si ownership no puede confirmarse:

- mantener la incertidumbre;
- no inventar owner;
- registrar revisión cuando la decisión sea necesaria para ejecutar cambios.

## Consolidación de shared resources

Para cada candidato relevante:

1. reunir evidencia disponible;
2. reunir consumidores observados;
3. confirmar o descartar reuse;
4. determinar ownership cuando exista evidencia;
5. evitar fusiones por tecnología;
6. determinar si requiere cambio;
7. registrar unknowns o revisión pendiente.

Planning es owner de la consolidación.

## Fase 2 — Acciones compartidas

Un shared resource que requiera cambio debe tener una única acción propietaria.

Ejemplo:

```text
SR-COSMOS-REPORTS
      ↓
SR-ACTION-001
```

Las Functions consumidoras deben utilizar `dependsOn` cuando su trabajo local dependa de la acción compartida.

## Dependency actions

Una dependencia puede requerir trabajo en distintos scopes.

### Global

Cuando el package target o tooling pertenece a toda la Function App.

### Shared

Cuando la adaptación pertenece a una implementación compartida.

### Function

Cuando un consumidor necesita adaptación local.

No duplicar trabajo cuando una única acción propietaria sea suficiente.

## Orden y dependencias

Representar dependencias mediante:

`dependsOn`

Ejemplo conceptual:

```text
GLOBAL-002
package target
    ↓
SR-ACTION-001
shared implementation adaptation
    ↓
FN-REQUESTREPORT-003
consumer adaptation
```

Las dependencias deben:

- referenciar acciones existentes;
- no formar ciclos;
- respetarse en `executionOrder`.

No implementar una state machine o workflow engine complejo para representar el orden.

## Protección de comportamiento

Consolidar las necesidades de pruebas identificadas durante analysis.

Determinar cuáles deben quedar satisfechas antes de ejecutar una migración que dependa de ellas.

Planning define:

- comportamiento que debe protegerse;
- pruebas requeridas;
- etapa previa necesaria;
- criterios de resultado.

Planning no genera las pruebas.

Cuando exista la capability:

`generate-function-tests`

puede utilizar estas necesidades como entrada.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Usar:

`../_shared/templates/migration-plan.template.md`

## Estado del plan

Usar únicamente:

- `READY`;
- `PARTIAL`;
- `BLOCKED`.

### READY

El camino requerido para el scope efectivo está suficientemente definido para ejecución.

### PARTIAL

Existe trabajo independiente seguro que puede ejecutarse, pero parte del plan permanece pendiente.

### BLOCKED

No existe actualmente un camino seguro para ejecutar el trabajo requerido.

Las decisiones humanas pendientes deben registrarse sobre:

- acción;
- riesgo;
- dependencia;
- recurso;
- workflow;

mediante `REQUIRES_REVIEW`.

No agregar `REQUIRES_REVIEW` como status principal del plan.

## migration-plan.json global

Debe contener cuando corresponda:

- `schemaVersion`;
- `status`;
- `baselineRef`;
- `target`;
- `requestedScope`;
- `effectiveScope`;
- `affectedFunctionsOutsideScope`;
- `globalActions`;
- `sharedResourceActions`;
- `functionPlans`;
- `durableWorkflows`;
- `dependencies`;
- `executionOrder`;
- `verificationCriteria`;
- `technicalDebtOutOfScope`;
- `optimizationsOutOfScope`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

No debe contener:

- `architectureTarget`;
- dependency targets no aprobados;
- ejecución realizada.

## Plan por Function

Crear para cada Function incluida en el scope efectivo cuando corresponda:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Usar:

`../_shared/templates/function-migration-plan.template.md`

## migration-plan.json por Function

Debe contener cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `scope`;
- `behaviorToPreserve`;
- `requiredActions`;
- `dependsOn`;
- `sharedResources`;
- `preparationSteps`;
- `testingRequirements`;
- `technicalMigration`;
- `durableContext`;
- `verificationCriteria`;
- `technicalDebtOutOfScope`;
- `optimizationsOutOfScope`;
- `risks`;
- `unknowns`;
- `reviewRequirements`.

No debe contener una arquitectura target completa.

Los pasos deben describir cambios concretos y verificables.

No utilizar instrucciones vagas como:

- `aplicar clean architecture`;
- `refactorizar según buenas prácticas`;
- `modernizar service`.

## Function ya en Programming Model v4

Si una Function ya está confirmada en:

`V4`

no crear una acción de migración de Programming Model.

Puede seguir requiriendo acciones relacionadas con:

- Node.js;
- dependencias;
- testabilidad;
- Durable;
- otros cambios técnicos aprobados.

## Durable

Mantener planes por Function cuando sean útiles para responsabilidades locales.

Coordinar el workflow como unidad cuando el scope efectivo lo requiera.

Registrar en el plan global:

- workflow;
- participantes;
- scope;
- dependencias;
- orden relativo;
- necesidad de migración Durable especializada;
- riesgos de instancias activas cuando hayan sido identificados.

No diseñar aquí un nuevo workflow.

## Orden de ejecución

Construir el orden mínimo necesario respetando `dependsOn`.

Secuencia conceptual cuando aplique:

1. acciones globales requeridas;
2. acciones de shared resources requeridas;
3. preparación estructural por Function;
4. protección de comportamiento requerida;
5. migración técnica:

- adaptaciones de dependencias/APIs;
- Programming Model;
- Durable workflows;

6. validaciones selectivas necesarias;
7. verificación final de la Function App.

No incluir el baseline como etapa de ejecución.

El build global final pertenece a:

`verify-function-app`

## Unknowns

Un `UNKNOWN` no bloquea automáticamente todo el plan.

Determinar qué acciones dependen de la incertidumbre.

Usar:

- `PARTIAL` cuando exista trabajo independiente seguro;
- `BLOCKED` cuando la incertidumbre impida construir el camino requerido.

No convertir una incertidumbre en una acción inventada.

## Revisión humana

Usar `REQUIRES_REVIEW` sobre el elemento afectado cuando continuar requiera decisión humana.

Ejemplos:

- target de dependencia aún no aprobado;
- expansión significativa del scope;
- cambio potencial de contrato observable;
- ownership compartido ambiguo necesario para ejecución;
- riesgo sobre instancias Durable activas.

Planning no resuelve silenciosamente estas decisiones.

## Neutralidad del ejecutor

Los planes deben describir:

- intención técnica;
- cambio requerido;
- owner;
- dependencias;
- resultado esperado;
- evidencia;
- criterios verificables.

No depender de un agente específico.

Una acción debe poder ser ejecutada:

- por un skill;
- por otro agente compatible;
- manualmente por un developer.

## Salidas

Cuando existan shared resources confirmados:

```text
.migration/resources/shared-resources.json
.migration/resources/shared-resources.md
```

Plan global:

```text
.migration/plans/migration-plan.json
.migration/plans/migration-plan.md
```

Por Function incluida en el scope efectivo:

```text
.migration/functions/<FunctionName>/migration-plan.json
.migration/functions/<FunctionName>/migration-plan.md
```

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

El skill termina cuando:

- inventory y assessment fueron consumidos;
- los analyses necesarios fueron consumidos;
- `baselineId` y `baselineRevision` fueron preservados;
- versiones target aprobadas no fueron redefinidas;
- `requestedScope` fue preservado;
- `effectiveScope` fue determinado o quedó explícitamente bloqueado;
- Functions afectadas fuera del scope quedaron visibles;
- shared resources relevantes fueron consolidados cuando existía evidencia;
- cada cambio shared requerido tiene una única acción propietaria;
- `migrationNeeds` fueron transformadas en acciones únicamente cuando correspondía;
- acciones utilizan IDs del scope correcto;
- acciones indican `requiredForMigration`;
- dependencias entre acciones utilizan `dependsOn`;
- `executionOrder` respeta esas dependencias;
- trabajo no requerido quedó fuera de ejecución obligatoria;
- existe plan global;
- cada Function incluida que requiera detalle tiene plan;
- Durable quedó coordinado cuando aplica;
- riesgos, unknowns y revisiones pendientes permanecen visibles;
- criterios de verificación quedaron definidos;
- no se modificó código;
- no se modificó dependency baseline.

La ausencia de lessons no impide cerrar planning.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- investigar arbitrariamente nuevas versiones;
- utilizar `latest` como target;
- aprobar `candidateTarget`;
- actualizar dependency baseline;
- generar pruebas;
- ejecutar acciones;
- refactorizar;
- migrar;
- modernizar;
- optimizar;
- ejecutar el build global final.

Siguiente skill sugerido:

`prepare-function-app`
