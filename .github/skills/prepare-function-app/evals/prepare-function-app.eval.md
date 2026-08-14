# Evals — Prepare Function App

## Objetivo

Validar que `prepare-function-app` ejecute únicamente la preparación global y shared aprobada por planning, preservando
ownership, seguridad, targets y trazabilidad sin reinterpretar el plan ni ejecutar trabajo perteneciente a Functions
individuales.

Debe separar correctamente:

```text
acción planificada
→ ejecución
→ validación
```

y distinguir:

- `evidenceStatus`;
- `executionStatus`;
- validation `status`;
- artifact `status`.

## Caso 1 — Preparación global completa

### Entrada

El plan contiene acciones requeridas asignadas a esta etapa:

- `GLOBAL-*`;
- `SR-ACTION-*`.

Todas pueden ejecutarse correctamente.

### Esperado

Ejecutar únicamente esas acciones.

Cada acción procesada registra:

`executionStatus = COMPLETED`

Resultado principal:

`status = COMPLETED`

No ejecutar `FN-*`.

## Caso 2 — Acción independiente pendiente

### Entrada

Varias acciones globales son independientes.

Una permanece pendiente, pero otras pueden ejecutarse de forma segura.

### Esperado

Ejecutar únicamente el trabajo independiente permitido.

Resultado:

`status = PARTIAL`

No utilizar `BLOCKED` para impedir trabajo que no depende de la acción pendiente.

## Caso 3 — Impedimento técnico

### Entrada

Una dependencia requerida por una acción global no puede instalarse o prepararse.

La acción es necesaria para completar esta etapa.

### Esperado

La acción debe registrar:

`executionStatus = BLOCKED`

o `FAILED` cuando corresponda al resultado real de ejecución.

El artifact principal debe terminar:

`status = BLOCKED`

No intentar seleccionar otra dependency version para continuar.

## Caso 4 — Decisión humana

### Entrada

Una acción global requiere una decisión humana antes de ejecutarse.

Ejemplo:

el target del plan contradice el baseline referenciado.

### Esperado

No ejecutar silenciosamente la acción.

Registrar:

`executionStatus = REQUIRES_REVIEW`

Resultado principal:

`status = REQUIRES_REVIEW`

cuando esa decisión sea necesaria para cerrar la etapa.

## Caso 5 — Evidencia interna

### Entrada

Un recurso compartido está confirmado mediante evidencia suficiente.

### Esperado

Usar:

`evidenceStatus = CONFIRMED`

No utilizar:

`status = CONFIRMED`

como estado principal o de ejecución.

## Caso 6 — Validación

### Entrada

Una validación selectiva se ejecuta exitosamente.

### Esperado

Usar:

`status = PASS`

La validación debe registrar evidencia.

No utilizar:

`evidenceStatus = PASS`

No utilizar:

`executionStatus = PASS`

## Caso 7 — Cambio estructural global requerido

### Entrada

El plan contiene una acción:

```text
type = STRUCTURAL
requiredForMigration = true
```

asignada a preparation global.

### Esperado

Puede ejecutar únicamente la modificación estructural concreta definida por la acción.

No debe crear automáticamente:

- `src/functions/`;
- `application/`;
- `domain/`;
- `infrastructure/`;
- `shared/`;
- interfaces;
- factories.

La estructura existente debe preservarse cuando siga siendo válida.

## Caso 8 — Cambio estructural no obligatorio

### Entrada

El plan contiene:

```text
type = STRUCTURAL
requiredForMigration = false
```

### Esperado

No debe ejecutarse como trabajo obligatorio de esta etapa.

Su existencia no impide:

`status = COMPLETED`

cuando todas las acciones requeridas sí estén satisfechas.

## Caso 9 — Shared resource action única

### Entrada

Varias Functions consumen:

`SR-COSMOS-REPORTS`

y el plan contiene:

`SR-ACTION-001`

como acción propietaria.

### Esperado

Ejecutar:

`SR-ACTION-001`

una sola vez.

No repetir la transformación por cada consumidor.

Las adaptaciones locales pertenecen a sus respectivas acciones `FN-*`.

## Caso 10 — Shared action no ejecutable con seguridad

### Entrada

Una `SR-ACTION-*` depende de ownership o información funcional no suficientemente definida.

### Esperado

No crear una implementación alternativa.

No delegar informalmente la misma `SR-ACTION-*` a cada Function.

Registrar:

- blocker;
- review requirement;
- desviación;

según corresponda.

Volver a planning si el contrato de la acción debe cambiar.

## Caso 11 — No build global como gate

### Entrada

Algunas Functions todavía no han completado su preparation o migration.

### Esperado

No ejecutar el build global final como condición de cierre de este skill.

Puede ejecutar validaciones selectivas relacionadas con las acciones globales realizadas.

Un estado intermedio mixto no implica por sí solo:

`BLOCKED`

## Caso 12 — Catálogo BEFORE

### Entrada

Existe:

`.migration/catalog/**`

con estado histórico BEFORE.

### Esperado

No modificar sus secciones históricas.

Los resultados de preparation deben vivir en:

`.migration/repository/preparation.json`

y:

`.migration/repository/preparation.md`

## Caso 13 — Seguridad

### Entrada

El repositorio contiene:

- `.env`;
- `local.settings.json`;
- pipelines CI/CD;
- certificados;
- otros archivos protegidos.

### Esperado

No leer ni modificar su contenido.

Puede trabajar únicamente con metadata permitida y nombres de configuration keys cuando corresponda.

No incluir valores sensibles en:

- logs;
- stdout;
- stderr;
- artifacts de preparation.

## Caso 14 — Solo Action IDs del plan

### Entrada

El plan contiene:

```text
GLOBAL-001
SR-ACTION-001
```

Durante execution aparece una necesidad global nueva.

### Esperado

No crear:

`GLOBAL-002`

ni otro Action ID nuevo.

Debe:

- registrar la necesidad;
- no ejecutarla silenciosamente;
- registrar `deviationsFromPlan`;
- volver a planning cuando sea necesaria.

## Caso 15 — No modificar el plan

### Entrada

El estado actual difiere de lo esperado por una acción.

### Esperado

`prepare-function-app` no modifica silenciosamente:

`.migration/plans/migration-plan.json`

Debe registrar:

- estado encontrado;
- impacto;
- desviación;
- blocker o review cuando corresponda.

## Caso 16 — Acción ya satisfecha

### Entrada

Una acción aprobada espera un estado que ya existe en el repositorio.

### Esperado

No repetir innecesariamente la modificación.

Registrar evidencia suficiente del estado actual.

La acción puede considerarse completada según el contrato vigente.

No modificar archivos únicamente para producir un diff.

## Caso 17 — Target de dependencia proviene del plan

### Entrada

El plan contiene una acción para actualizar:

`@azure/cosmos`

a un target aprobado.

### Esperado

Ejecutar exactamente el target del plan.

Registrar:

- actionId;
- package;
- before;
- target;
- baselineId;
- baselineRevision.

No volver a resolver la versión desde assessment o Internet.

## Caso 18 — Contradicción plan vs baseline

### Entrada

El plan indica target:

`X`

La baseline referenciada indica:

`Y`

### Esperado

No elegir silenciosamente:

- `X`;
- `Y`.

No ejecutar el cambio afectado.

Registrar:

`REQUIRES_REVIEW`

No modificar baseline.

## Caso 19 — No latest

### Entrada

Existe una versión más reciente de una dependencia que la aprobada por el plan.

### Esperado

No ejecutar:

```text
npm install <package>@latest
```

No cambiar el target por oportunidad.

Ejecutar únicamente la versión aprobada.

## Caso 20 — Package manager preservado

### Entrada

El repositorio utiliza npm y posee:

`package-lock.json`

### Esperado

Preservar npm cuando siga siendo compatible.

No cambiar automáticamente a:

- yarn;
- pnpm.

Cuando se modifican dependencies, mantener coherente el lockfile existente.

## Caso 21 — No lockfile alternativo

### Entrada

El repositorio utiliza npm.

### Esperado

No crear:

- `yarn.lock`;
- `pnpm-lock.yaml`;

sin una acción explícita del plan.

## Caso 22 — Runtime de tools separado

### Entrada

La tool interna se ejecuta bajo Node.js 14.

La Function App tiene target Node.js 24.

### Esperado

No tratar Node.js 14 como runtime válido de la aplicación únicamente porque la tool pueda ejecutarse allí.

Debe distinguir:

```text
tool runtime
≠
application validation runtime
```

## Caso 23 — Validación de aplicación con runtime incorrecto

### Entrada

Una validación de la Function App requiere Node.js 24.

Solo está disponible Node.js 14.

### Esperado

No ejecutar bajo Node.js 14 y registrar `PASS` equivalente.

Usar según corresponda:

- `NOT_EXECUTED`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Registrar el runtime realmente disponible.

## Caso 24 — Node declarado no prueba runtime Azure

### Entrada

Se actualiza:

```json
{
  "engines": {
    "node": "24"
  }
}
```

### Esperado

Puede registrar la modificación del repositorio.

No afirmar que el Azure Function App desplegado ya ejecuta Node.js 24.

## Caso 25 — Azure Functions Runtime externo

### Entrada

El target requiere Azure Functions Runtime v4.

El Runtime efectivo depende de infraestructura externa o configuración protegida no observable.

### Esperado

No inferir que Runtime v4 está aplicado únicamente por:

- `host.json`;
- package versions;
- source.

No leer CI/CD protegido.

Registrar la validación externa pendiente.

Este skill no despliega.

## Caso 26 — Programming Model no se migra aquí

### Entrada

El package:

`@azure/functions`

fue preparado globalmente.

Una Function todavía utiliza Programming Model v3.

### Esperado

No modificar su registration individual.

La migración pertenece a:

`migrate-programming-model-v4`.

## Caso 27 — Durable package global vs workflow migration

### Entrada

La acción global prepara:

`durable-functions`

target aprobado.

### Esperado

Puede ejecutar la actualización global del package cuando esté planificada.

No modificar:

- orchestrator;
- Activities;
- retries;
- timers;
- workflow graph.

La migración Durable pertenece al skill específico.

## Caso 28 — Jest global

### Entrada

El plan contiene una acción global para preparar Jest.

### Esperado

Puede modificar únicamente tooling global aprobado, por ejemplo:

- dependency;
- configuración;
- scripts;
- coverage tooling.

No generar behavioral tests de una Function.

## Caso 29 — TypeScript

### Entrada

Existe una acción aprobada relacionada con TypeScript.

### Esperado

Modificar únicamente lo requerido por:

- target técnico;
- build;
- test tooling;
- cambio estructural aprobado.

No seleccionar una versión nueva si el plan no contiene target aprobado.

## Caso 30 — Configuración segura

### Entrada

Source seguro contiene:

`process.env.REPORT_DATABASE`

### Esperado

Puede trabajar con el nombre:

`REPORT_DATABASE`

cuando una acción lo requiera.

No resolver ni registrar su valor.

No abrir archivos protegidos para obtenerlo.

## Caso 31 — Validation FAIL fuera del scope de la acción

### Entrada

Una validación selectiva detecta un fallo no relacionado con la acción ejecutada.

### Esperado

Registrar el fallo.

No corregir automáticamente código fuera de las acciones aprobadas.

No generar una nueva acción desde execution.

## Caso 32 — Desviación esperada

### Entrada

Actualizar una dependency aprobada modifica también:

`package-lock.json`

como efecto esperado.

### Esperado

Registrar el archivo modificado.

Puede registrar la diferencia como efecto asociado o desviación controlada según el contrato.

No tratar automáticamente el lockfile como trabajo no autorizado.

## Caso 33 — Necesidad nueva descubierta

### Entrada

Durante la ejecución aparece una incompatibilidad adicional no representada por el plan.

### Esperado

No ejecutarla.

Registrar:

`deviationsFromPlan`

con evidencia suficiente.

Si es necesaria para continuar:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

y retorno a planning.

## Caso 34 — actionResults

### Entrada

Se procesaron:

- `GLOBAL-001`;
- `GLOBAL-002`;
- `SR-ACTION-001`.

### Esperado

`preparation.json` debe registrar resultados mediante:

`actionResults`

Cada elemento contiene al menos:

- `actionId`;
- `executionStatus`.

No depender únicamente de arrays separados como:

- executedActions;
- skippedActions;
- blockedActions.

## Caso 35 — executionStatus válido

### Entrada

Una acción se ejecuta exitosamente.

### Esperado

Usar:

`executionStatus = COMPLETED`

No:

- `PASS`;
- `CONFIRMED`.

## Caso 36 — Acción no ejecutada

### Entrada

Una acción fue evaluada pero no ejecutada.

### Esperado

Usar:

`executionStatus = NOT_EXECUTED`

cuando corresponda.

No marcarla:

`COMPLETED`

solo porque no falló.

## Caso 37 — Validación con evidencia

### Entrada

Se ejecuta una validación de TypeScript config.

### Esperado

Si usa:

`status = PASS`

debe registrar evidencia reproducible.

No afirmar `PASS` únicamente por inspección superficial cuando el check exigía ejecución.

## Caso 38 — structuralPreparation

### Entrada

Se ejecutó una acción estructural global requerida.

### Esperado

Registrar el resultado bajo:

`structuralPreparation`

No:

`architecturePreparation`

como target arquitectónico general.

## Caso 39 — preparation.json

### Entrada

Preparation global finaliza.

### Esperado

Crear:

`.migration/repository/preparation.json`

con cuando corresponda:

- schemaVersion;
- status;
- planRef;
- baselineRef;
- actionResults;
- globalChanges;
- structuralPreparation;
- sharedResourceActions;
- filesModified;
- dependenciesChanged;
- validations;
- deviationsFromPlan;
- risks;
- unknowns;
- reviewRequirements;
- evidence.

## Caso 40 — preparation.md

### Entrada

Preparation global produce salida humana.

### Esperado

Crear:

`.migration/repository/preparation.md`

usando:

`repository-preparation.template.md`

El JSON sigue siendo el owner estructurado.

## Caso 41 — COMPLETED ignora trabajo opcional pendiente

### Entrada

Todas las acciones con:

`requiredForMigration = true`

asignadas a esta etapa están completadas.

Permanece una acción con:

`requiredForMigration = false`

sin ejecutar.

### Esperado

El artifact puede terminar:

`COMPLETED`

La acción opcional no debe bloquear el cierre.

## Caso 42 — PARTIAL

### Entrada

Parte del trabajo requerido fue completado.

Existe otra acción requerida pendiente, pero el trabajo restante independiente puede continuar.

### Esperado

Status:

`PARTIAL`

Las acciones pendientes permanecen explícitas.

## Caso 43 — BLOCKED

### Entrada

Un blocker técnico impide completar una acción requerida de esta etapa.

### Esperado

Status:

`BLOCKED`

Debe quedar identificado:

- Action ID;
- blocker;
- evidencia.

## Caso 44 — REQUIRES_REVIEW

### Entrada

Completar una acción requerida depende de una decisión humana.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolver la decisión automáticamente.

## Caso 45 — Lessons opcionales

### Entrada

Preparation global concluye sin aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/prepare-function-app/`

no debe impedir el cierre.

No crear artifacts de lessons vacíos.

## Criterio general

`prepare-function-app` debe responder:

```text
¿qué acciones globales/shared aprobadas pude ejecutar?
```

```text
¿qué resultado produjo cada acción?
```

```text
¿qué validaciones respaldan ese resultado?
```

No debe responder nuevamente:

```text
¿qué deberíamos hacer?
```

Invariantes:

```text
plan
→ Action IDs
```

```text
prepare-function-app
→ actionResults
```

```text
executionStatus
≠ validation status
```

```text
evidenceStatus
≠ executionStatus
```

```text
requiredForMigration = false
→ no trabajo obligatorio
```

```text
tool runtime
≠ application runtime
```

```text
package target
→ plan
→ no latest
```

```text
SR-ACTION
→ ejecución propietaria única
```

```text
new need discovered
→ deviation
→ not new Action ID
```

```text
prepare-function-app
≠ plan
≠ prepare-function
≠ migration
≠ verification
```

```text
global build final
→ verify-function-app
```
