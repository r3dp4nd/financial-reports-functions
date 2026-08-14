# Evals — Plan Function Migration

## Objetivo

Validar que `plan-function-migration` transforme la evidencia y las necesidades ya identificadas en un plan ejecutable y
trazable sin:

- reanalizar innecesariamente source;
- redefinir targets;
- duplicar recursos compartidos;
- inventar acciones;
- ejecutar cambios;
- convertir deuda u optimizaciones en requisitos;
- modificar dependency baseline.

Planning es owner de:

- `requestedScope`;
- `effectiveScope`;
- Action IDs;
- ownership de acciones;
- `requiredForMigration`;
- `dependsOn`;
- execution order;
- planes globales y por Function.

## Caso 1 — Plan simple

### Entrada

Una Function con:

- assessment válido;
- analysis en estado adecuado;
- `migrationNeeds` suficientemente definidos;
- sin blockers.

### Esperado

Crear:

- plan global;
- plan por Function cuando corresponda.

Status global:

`READY`

No modificar código.

## Caso 2 — Planning genera Function Action IDs

### Entrada

Analysis contiene una necesidad:

```json
{
  "type": "REQUIRED_PLATFORM",
  "need": "Migrar la integración Azure Functions al Programming Model v4"
}
```

### Esperado

Planning puede crear:

`FN-REQUESTREPORT-001`

No esperar que el ID provenga de analysis.

No generar:

`REQ-*`

Analysis permanece sin Action IDs.

## Caso 3 — Varias necesidades no implican varias acciones

### Entrada

Analysis contiene varias `migrationNeeds` relacionadas con una misma adaptación local.

### Esperado

Planning puede consolidarlas en una única acción cuando compartan:

- owner;
- resultado;
- scope;
- orden.

No debe crear una acción por cada need de forma mecánica.

## Caso 4 — Una necesidad puede requerir varias acciones

### Entrada

Una necesidad requiere:

1. preparación global;
2. adaptación local posterior.

### Esperado

Planning puede generar:

```text
GLOBAL-*
→ FN-*
```

con `dependsOn`.

No forzar relación:

`1 migrationNeed = 1 action`

## Caso 5 — Dependency action global

### Entrada

Assessment determina que:

`@azure/functions`

requiere adoptar un target aprobado para toda la Function App.

### Esperado

Planning puede crear:

`GLOBAL-*`

con:

```text
type = REQUIRED_DEPENDENCY
requiredForMigration = true
```

No crear la misma actualización de package como una acción por cada Function.

## Caso 6 — Baseline target preservado

### Entrada

Assessment utiliza un package target proveniente de:

`managedPackages`.

### Esperado

Planning debe preservar:

- target aprobado;
- baselineId;
- baselineRevision.

Puede registrar provenance:

`BASELINE`

No volver a seleccionar otra versión.

## Caso 7 — Candidate target no aprobado

### Entrada

Assessment contiene:

```text
classification = AZURE_UNMAPPED
candidateTarget = X
actionStatus = REQUIRES_VALIDATION
```

### Esperado

Planning no debe convertir:

`candidateTarget = X`

en:

`targetVersion = X`

ejecutable.

Debe registrar la decisión pendiente.

Puede utilizar:

`REQUIRES_REVIEW`

sobre el elemento afectado.

## Caso 8 — Candidate target bloquea trabajo requerido

### Entrada

Una dependencia crítica no tiene target aprobado.

Toda la migración requerida depende de esa decisión.

### Esperado

Plan global:

`BLOCKED`

o permanecer sujeto al contrato de bloqueo definido por la decisión pendiente.

No crear una acción ejecutable con una versión inventada.

## Caso 9 — Candidate target permite trabajo independiente

### Entrada

Una dependencia requiere revisión, pero existen otras acciones independientes seguras.

### Esperado

Plan global:

`PARTIAL`

Las acciones independientes pueden quedar planificadas.

La dependencia pendiente continúa explícita.

## Caso 10 — No dependency learning

### Entrada

Una dependencia tuvo éxito en migraciones anteriores.

### Esperado

Planning no debe consultar o modificar:

- `learnedPackages`;
- `recommendationStatus`;
- lifecycle de recomendaciones.

Debe utilizar únicamente targets aprobados en baseline o decisiones expresamente incorporadas al plan.

## Caso 11 — Shared resource consolidation

### Entrada

Dos analyses confirman que consumen el mismo recurso Cosmos Reports.

### Esperado

Consolidar un único recurso:

`SR-COSMOS-REPORTS`

No crear dos recursos por Function.

La consolidación debe basarse en evidencia de identidad/reuse.

## Caso 12 — Shared resource action propietaria

### Entrada

`SR-COSMOS-REPORTS`

requiere una transformación shared.

### Esperado

Crear una única acción:

`SR-ACTION-*`

No duplicar la transformación en cada consumidor.

## Caso 13 — Adaptación local de un consumidor

### Entrada

Dos Functions consumen el mismo shared resource.

Solo una requiere adaptación adicional local.

### Esperado

Crear:

- una `SR-ACTION-*` propietaria cuando corresponda;
- una `FN-*` únicamente para la Function que requiere adaptación local.

No crear una `FN-*` redundante para la otra Function.

## Caso 14 — Dos recursos de la misma tecnología

### Entrada

Customers y Reports utilizan:

`@azure/cosmos`

pero representan recursos distintos.

### Esperado

No fusionarlos únicamente por:

- package;
- SDK;
- tecnología.

Deben mantenerse como recursos diferentes cuando la evidencia así lo indique.

## Caso 15 — Ownership CAPABILITY

### Entrada

Un recurso pertenece claramente a Reports y sus consumidores forman parte de esa capability.

### Esperado

Ownership puede ser:

`CAPABILITY`

No moverlo automáticamente a:

- `REPOSITORY`;
- `FUNCTION_APP`;
- carpeta `shared`.

## Caso 16 — Ownership WORKFLOW

### Entrada

Un recurso pertenece específicamente a un workflow Durable.

### Esperado

Ownership puede ser:

`WORKFLOW`

cuando exista evidencia suficiente.

No generalizarlo a toda la Function App.

## Caso 17 — Ownership desconocido

### Entrada

No existe evidencia suficiente para determinar ownership.

### Esperado

Mantener ownership desconocido.

No inventar owner.

Si ownership es necesario para ejecutar una acción requerida:

registrar review o bloqueo correspondiente.

## Caso 18 — Dependency ordering

### Entrada

Existe una dependencia real:

```text
package global
→ shared implementation
→ Function consumer
```

### Esperado

Representar mediante:

```text
GLOBAL-*
→ SR-ACTION-*
→ FN-*
```

usando:

`dependsOn`

El execution order debe respetar esas dependencias.

## Caso 19 — No dependency ordering artificial

### Entrada

Dos acciones pueden ejecutarse independientemente.

### Esperado

No crear:

`dependsOn`

solo para producir un orden lineal.

Planning debe representar únicamente dependencias reales.

## Caso 20 — No cycles

### Entrada

Una combinación propuesta de acciones produciría:

```text
GLOBAL-001
→ FN-A-001
→ GLOBAL-001
```

### Esperado

El plan no debe cerrar como:

`READY`

Debe detectar la inconsistencia.

No producir un execution order cíclico.

## Caso 21 — Dependencia inexistente

### Entrada

Una acción referencia:

`dependsOn = GLOBAL-999`

pero ese Action ID no existe.

### Esperado

Planning debe detectar la referencia inválida.

No cerrar como:

`READY`

## Caso 22 — Dependency local sin shared action

### Entrada

Una dependencia pertenece únicamente a una Function.

No existe recurso shared real.

### Esperado

No crear artificialmente:

- `SR-*`;
- `SR-ACTION-*`.

Puede utilizar una acción `FN-*` cuando corresponda.

## Caso 23 — Function ya Programming Model v4

### Entrada

Analysis confirma:

```text
Programming Model = V4
actionStatus = NOT_REQUIRED
```

### Esperado

No crear una acción de migración PM v4.

La Function puede seguir teniendo otras acciones:

- Node;
- dependency adaptation;
- testability;
- Durable;
- structural.

## Caso 24 — requestedScope Function

### Entrada

Developer solicita migrar únicamente:

`RequestReport`

### Esperado

Plan debe preservar:

```json
{
  "requestedScope": {
    "type": "FUNCTION",
    "functions": [
      "RequestReport"
    ]
  }
}
```

No convertir automáticamente el scope en toda la Function App.

## Caso 25 — Código compartido no amplía scope automáticamente

### Entrada

`RequestReport`

usa un service que también consume:

`AuditReport`.

### Esperado

Planning puede registrar:

`AuditReport`

en:

`affectedFunctionsOutsideScope`

No debe ampliar automáticamente:

`effectiveScope`

solo porque ambas Functions compartan código.

## Caso 26 — Durable requiere ampliación coherente

### Entrada

La Function solicitada pertenece a un workflow Durable y no puede migrarse coherentemente aislada.

### Esperado

Planning puede ampliar:

`effectiveScope`

al workflow requerido.

Debe registrar:

- requestedScope;
- effectiveScope;
- participantes;
- reason;
- evidence.

No ocultar la expansión.

## Caso 27 — Durable no requiere ampliación automática

### Entrada

Una Function Durable puede migrarse en la acción concreta sin modificar coherencia del workflow completo.

### Esperado

No ampliar automáticamente el scope únicamente porque:

`Durable = true`

La expansión debe estar justificada.

## Caso 28 — Durable workflow coordination

### Entrada

Varias Functions del effectiveScope pertenecen a un mismo workflow Durable.

### Esperado

Planes por Function pueden mantener detalle local.

El plan global debe coordinar el workflow como unidad cuando corresponda.

No fragmentar una migración coordinada en acciones incompatibles entre sí.

## Caso 29 — Workflow artifact path

### Entrada

Existe workflow Durable:

`GenerateReportWorkflow`

### Esperado

Los artifacts de ejecución coordinada deben referenciar:

`.migration/workflows/GenerateReportWorkflow/`

No inventar un workflow directory bajo:

`.migration/functions/`.

## Caso 30 — requiredForMigration true

### Entrada

Una acción estructural es indispensable para habilitar:

- compatibilidad;
- testabilidad requerida;
- migración técnica.

### Esperado

Planning debe registrar:

```text
requiredForMigration = true
```

La razón debe ser trazable.

## Caso 31 — Structural no obligatorio

### Entrada

Analysis identifica una mejora estructural útil pero no necesaria para migrar.

### Esperado

Si se representa en el plan:

```text
type = STRUCTURAL
requiredForMigration = false
```

No incorporarla automáticamente al execution order obligatorio.

## Caso 32 — Technical debt

### Entrada

Analysis registra deuda no requerida para migración.

### Esperado

Mantenerla separada del trabajo obligatorio.

No convertirla automáticamente en:

`requiredForMigration = true`

No incorporarla al execution order requerido.

## Caso 33 — Optimization

### Entrada

Analysis identifica una mejora de rendimiento.

### Esperado

Mantenerla fuera de la migración técnica obligatoria.

No crear una acción requerida únicamente por la oportunidad de optimización.

## Caso 34 — Testing requirement gate

### Entrada

Analysis identifica comportamiento que debe protegerse antes de una acción de migración.

### Esperado

Planning debe registrar el testing requirement.

Puede indicar:

```text
requiredBeforeMigration = true
```

cuando sea gate de una acción posterior.

Planning no genera el test.

## Caso 35 — Testing requirement no bloqueante para una acción independiente

### Entrada

Existe un testing requirement pendiente para Function A.

Una acción independiente de Function B no depende de él.

### Esperado

No bloquear artificialmente la acción independiente.

El dependency graph debe expresar únicamente la dependencia real.

## Caso 36 — No architecture target

### Entrada

Analysis registra una necesidad estructural:

`separar construcción rígida de CosmosClient para habilitar testabilidad`.

### Esperado

Planning puede convertirla en una acción concreta.

No debe generar:

- `architectureTarget`;
- blueprint completo;
- reorganización adicional no sustentada.

## Caso 37 — Acción concreta, no instrucción vaga

### Entrada

Existe una necesidad estructural aprobada.

### Esperado

La acción no debe decir únicamente:

```text
aplicar clean architecture
```

o:

```text
refactorizar según buenas prácticas
```

Debe describir un resultado técnico verificable.

## Caso 38 — Baseline reference

### Entrada

Assessment utilizó:

```text
baselineId = node24-azure-functions-v4
baselineRevision = 1
```

### Esperado

Plan global debe conservar:

- baselineId;
- baselineRevision.

No copiar innecesariamente todo el baseline.

## Caso 39 — No version re-resolution

### Entrada

Assessment utiliza target aprobado:

`X`

### Esperado

Planning no:

- consulta `latest`;
- selecciona `Y`;
- redefine target;
- actualiza baseline.

El plan utiliza:

`X`

## Caso 40 — No source reanalysis por defecto

### Entrada

Inventory, assessment y analyses contienen evidencia suficiente para planificar.

### Esperado

Planning no debe recorrer nuevamente todo el source.

Debe construir el plan desde artifacts existentes.

## Caso 41 — Inconsistencia puntual

### Entrada

Existe una contradicción concreta entre dos artifacts que impide asignar ownership o dependencia.

### Esperado

Planning puede consultar únicamente evidencia mínima necesaria para resolver la inconsistencia cuando el contrato lo
permita.

No debe convertir la excepción en un nuevo análisis completo del repositorio.

## Caso 42 — Analysis faltante pero trabajo independiente

### Entrada

El requestedScope contiene varias Functions.

Falta analysis de una Function.

Las demás tienen suficiente información y son independientes.

### Esperado

Plan global puede quedar:

`PARTIAL`

No inventar acciones para la Function sin analysis.

## Caso 43 — Analysis faltante bloqueante

### Entrada

Falta un analysis necesario para determinar el camino obligatorio del effectiveScope.

### Esperado

Plan global:

`BLOCKED`

No crear acciones especulativas.

## Caso 44 — Global build no es acción por Function

### Entrada

Varias Functions requieren migración.

### Esperado

Planning puede registrar el build global como criterio/gate final de verification.

No debe:

- ejecutar build;
- crear un build gate por cada Function;
- exigir build completo durante estado intermedio.

El build global final pertenece a:

`verify-function-app`.

## Caso 45 — Plan global

### Entrada

Planning completo.

### Esperado

Crear:

`.migration/plans/migration-plan.json`

y:

`.migration/plans/migration-plan.md`

utilizando:

`migration-plan.template.md`

El JSON es owner estructurado.

## Caso 46 — Plan por Function

### Entrada

Una Function forma parte del effectiveScope y requiere detalle local.

### Esperado

Crear:

`.migration/functions/<FunctionName>/migration-plan.json`

y:

`.migration/functions/<FunctionName>/migration-plan.md`

utilizando:

`function-migration-plan.template.md`

No duplicar todo el plan global dentro del plan local.

## Caso 47 — Shared resources artifacts condicionales

### Entrada

No existen shared resources confirmados.

### Esperado

Planning no debe crear artifacts vacíos de shared resources únicamente por contrato.

### Entrada alternativa

Existen shared resources confirmados.

### Esperado

Puede crear:

```text
.migration/resources/shared-resources.json
.migration/resources/shared-resources.md
```

utilizando el template correspondiente.

## Caso 48 — Plan READY

### Entrada

Todas las acciones requeridas del effectiveScope:

- están suficientemente definidas;
- tienen targets aprobados;
- tienen dependencies válidas;
- no requieren decisiones pendientes.

### Esperado

Status:

`READY`

## Caso 49 — Plan PARTIAL

### Entrada

Parte del trabajo está suficientemente definido.

Otra parte permanece pendiente, pero existe trabajo independiente seguro.

### Esperado

Status:

`PARTIAL`

No tratarlo como permiso para ejecutar acciones dependientes de elementos no resueltos.

## Caso 50 — Plan BLOCKED

### Entrada

No existe un camino seguro para ejecutar una parte obligatoria del effectiveScope.

### Esperado

Status:

`BLOCKED`

Debe registrarse la causa.

## Caso 51 — Human review sobre elemento

### Entrada

Una dependencia requiere aprobación humana antes de poder ejecutarse.

Existe otro trabajo independiente.

### Esperado

El elemento afectado debe registrar:

`REQUIRES_REVIEW`

El status global puede ser:

`PARTIAL`

cuando aún exista trabajo independiente seguro.

No agregar:

`REQUIRES_REVIEW`

como nuevo status principal del plan.

## Caso 52 — Planning no ejecuta

### Entrada

El plan está completamente definido.

### Esperado

Planning no debe:

- modificar source;
- modificar `package.json`;
- instalar dependencies;
- crear tests;
- ejecutar migration;
- actualizar shared implementation.

Solo produce planificación.

## Caso 53 — No executionStatus en planning

### Entrada

Planning crea:

`GLOBAL-001`

### Esperado

La acción no debe quedar marcada:

```text
executionStatus = COMPLETED
```

porque todavía no fue ejecutada.

Puede contener:

- requiredForMigration;
- dependsOn;
- phase;
- owner;
- verification criteria.

## Caso 54 — No baseline mutation

### Entrada

Planning encuentra que sería conveniente gestionar un nuevo package.

### Esperado

No modificar:

`dependency-baseline.json`

No incrementar:

`baselineRevision`

No agregar:

`managedPackages`.

La evolución del baseline pertenece al proceso de review controlado.

## Caso 55 — Lessons opcionales

### Entrada

Planning termina sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/plan-function-migration/`

no debe impedir cerrar planning.

No crear lessons vacías como requisito.

## Criterio general

Planning debe responder:

```text
¿qué acciones ejecutables necesita este scope?
```

```text
¿quién es owner de cada acción?
```

```text
¿qué es obligatorio para migrar?
```

```text
¿qué depende de qué?
```

```text
¿cuál es el mínimo effectiveScope coherente?
```

No debe responder nuevamente:

```text
¿qué hace esta Function hoy?
```

ni ejecutar:

```text
el cambio planificado
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
migrationNeed
≠ action obligatoriamente 1:1
```

```text
requestedScope
≠ effectiveScope automáticamente
```

```text
shared technology
≠ shared resource
```

```text
candidateTarget
≠ approved target
```

```text
requiredForMigration = false
→ fuera del camino obligatorio
```

```text
dependsOn
→ dependencia real
→ no orden decorativo
```

```text
planning
≠ execution
```

```text
planning
→ nunca modifica dependency baseline
```
