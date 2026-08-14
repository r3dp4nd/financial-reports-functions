# Status Policy

## Objetivo

Definir una semántica común para los estados utilizados por los skills.

Separar siempre:

- evidencia;
- necesidad de cambio;
- decisión humana;
- estado de ejecución;
- resultado de verificación;
- clasificación de findings.

No usar `status` para representar conceptos diferentes.

## Evidence status

Campo:

`evidenceStatus`

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

### CONFIRMED

Existe evidencia directa suficiente para sustentar la afirmación.

### INFERRED

Existe evidencia parcial que permite una conclusión razonable, pero no definitiva.

### UNKNOWN

No existe evidencia suficiente para sostener una conclusión.

### NOT_APPLICABLE

La dimensión no aplica al contexto evaluado.

`evidenceStatus` responde:

`¿Qué tan sustentada está esta afirmación?`

No indica si debe ejecutarse un cambio.

## Action status

Campo:

`actionStatus`

Valores:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

### REQUIRED

Existe evidencia suficiente de que una acción o cambio es necesario para alcanzar el target.

### NOT_REQUIRED

No se necesita cambio sobre la dimensión evaluada.

Puede significar que:

- la dimensión ya satisface el target;
- el estado actual ya cumple el contrato requerido;
- no existe trabajo necesario sobre ese elemento.

La evidencia que sustenta esta decisión debe representarse mediante:

`evidenceStatus`

### REQUIRES_VALIDATION

Falta evidencia técnica para decidir si una acción o cambio es necesario.

Ejemplos:

- compatibilidad de una dependencia;
- Runtime efectivo no observable;
- comportamiento que requiere comprobación adicional.

`actionStatus` responde:

`¿Necesitamos hacer algo sobre esta dimensión?`

No usar:

`actionStatus = UNKNOWN`

La incertidumbre pertenece a:

`evidenceStatus`.

## Execution status

Campo:

`executionStatus`

Valores:

- `COMPLETED`
- `FAILED`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### COMPLETED

La acción fue ejecutada y alcanzó el resultado definido por su contrato.

No significa que toda la migración esté verificada.

### FAILED

La acción fue ejecutada pero no alcanzó el resultado esperado.

### NOT_EXECUTED

La acción aplicaba pero no fue ejecutada.

Debe registrar el motivo.

No utilizar ausencia de error como evidencia de ejecución.

### NOT_APPLICABLE

La acción planificada no aplica al contexto finalmente observado.

Debe existir evidencia que justifique la conclusión.

### BLOCKED

Existe un impedimento técnico conocido que impide ejecutar o completar la acción.

### REQUIRES_REVIEW

Ejecutar o continuar la acción requiere una decisión humana.

`executionStatus` responde:

`¿Qué ocurrió con esta acción durante execution?`

No utilizar:

- `PASS`;
- `FAIL`;
- `CONFIRMED`;

como sustitutos de `executionStatus`.

## Revisión humana

Usar:

`REQUIRES_REVIEW`

cuando exista suficiente información sobre el problema, pero continuar o cerrar requiera una decisión humana.

Ejemplos:

- cambio fuera del alcance aprobado;
- comportamiento contradictorio;
- ownership estructural ambiguo necesario para continuar;
- riesgo sobre instancias Durable activas;
- posible modificación de contrato observable;
- contradicción entre plan y baseline.

No usar `REQUIRES_REVIEW` como sinónimo de:

- `UNKNOWN`;
- `REQUIRES_VALIDATION`;
- `BLOCKED`.

Semántica:

```text
UNKNOWN
→ falta evidencia

REQUIRES_VALIDATION
→ falta trabajo técnico para decidir

BLOCKED
→ existe impedimento técnico conocido

REQUIRES_REVIEW
→ existe decisión humana pendiente
```

## Status principal

El campo:

`status`

representa el estado principal de un artifact, skill o etapa.

No utilizarlo para representar:

- certeza de evidencia;
- resultado individual de una acción;
- resultado individual de un check;
- clasificación de deuda o findings.

# Estados por etapa

## Assessment

`assess-function-app` usa:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_ANALYSIS

Existe evidencia suficiente para comenzar de forma segura los analyses por Function requeridos.

No significa que todas las dimensiones estén completamente resueltas.

### PARTIAL

Existen unknowns o validaciones pendientes, pero puede continuar trabajo independiente seguro.

### BLOCKED

Existe un impedimento técnico conocido que impide continuar la siguiente etapa necesaria.

### REQUIRES_REVIEW

Existe una decisión humana necesaria para cerrar assessment o permitir el trabajo requerido.

## Analysis

`analyze-function` usa:

- `READY`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY

Existe evidencia suficiente para que planning pueda decidir de forma segura:

- impactos;
- migration needs;
- testing needs;
- relaciones relevantes.

No significa ausencia de technical debt o unknowns irrelevantes para planning.

### PARTIAL

Existen unknowns locales, pero pueden planificarse de forma segura necesidades independientes.

### BLOCKED

Falta información necesaria para determinar de forma segura un impacto requerido por la migración.

### REQUIRES_REVIEW

Existe una decisión humana necesaria para cerrar el análisis.

## Planning

`plan-function-migration` usa:

- `READY`
- `PARTIAL`
- `BLOCKED`

### READY

El plan tiene evidencia suficiente para ejecutar las acciones requeridas dentro del `effectiveScope`.

### PARTIAL

Parte del plan puede ejecutarse de forma segura y otra permanece pendiente.

`PARTIAL` no autoriza ejecutar acciones dependientes de elementos no resueltos.

### BLOCKED

No existe actualmente un camino seguro para ejecutar una parte obligatoria del `effectiveScope`.

Cuando una acción o decisión particular requiera intervención humana:

registrar:

`REQUIRES_REVIEW`

sobre el elemento correspondiente.

No agregar:

`REQUIRES_REVIEW`

como estado principal adicional del plan.

## Global preparation

`prepare-function-app` usa:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### COMPLETED

Todas las acciones requeridas asignadas a la etapa fueron:

- `COMPLETED`;
- o justificadamente `NOT_APPLICABLE`.

Trabajo con:

`requiredForMigration = false`

no impide este estado.

### PARTIAL

Existe trabajo requerido pendiente, pero puede continuar trabajo independiente seguro.

### BLOCKED

Un impedimento técnico impide completar trabajo requerido de la etapa.

### REQUIRES_REVIEW

Una decisión humana impide completar trabajo requerido de la etapa.

## Function preparation

`prepare-function` usa:

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_MIGRATION

Todas las acciones locales de preparation requeridas están satisfechas.

Significa:

`preparation local completada`

No significa automáticamente:

- testing requirements satisfechos;
- migration autorizada;
- Function verificada.

Un requirement:

`requiredBeforeMigration = true`

pendiente sigue siendo un gate posterior.

### NOT_APPLICABLE

La Function no requiere acciones locales de preparation.

### BLOCKED

Un impedimento técnico impide completar una acción local requerida.

### REQUIRES_REVIEW

Completar preparation requiere una decisión humana.

No utilizar `PARTIAL` como status principal de Function preparation.

Los resultados parciales permanecen registrados en:

`actionResults`.

## Function testing

`generate-function-tests` usa:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### COMPLETED

Todos los testing requirements obligatorios para las migraciones dependientes están suficientemente protegidos y
ejecutados cuando corresponde.

Requirements no obligatorios pendientes no bloquean por sí solos este estado.

### PARTIAL

Parte de los requirements está satisfecha y existen otros pendientes sin impedir trabajo independiente que no dependa de
ellos.

No significa que una migration dependiente pueda ignorar:

`requiredBeforeMigration = true`.

### BLOCKED

Un blocker técnico impide proteger o ejecutar un testing requirement obligatorio.

### REQUIRES_REVIEW

No puede determinarse la expectativa correcta o cerrar un requirement obligatorio sin decisión humana.

## Migration

Los skills:

- `migrate-programming-model-v4`;
- `migrate-durable-functions-v4`;

usan:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### MIGRATED

Las acciones de migración requeridas del scope correspondiente fueron ejecutadas satisfactoriamente y sus gates locales
obligatorios están satisfechos.

No significa:

- `VERIFIED`;
- deployment exitoso;
- Runtime productivo confirmado;
- production safety confirmada.

### NOT_APPLICABLE

No existe migración correspondiente aplicable al scope.

### BLOCKED

Un impedimento técnico impide completar una acción de migración requerida.

### REQUIRES_REVIEW

Completar la migración requiere una decisión humana.

## Verification checks

Los checks de verification o validaciones individuales usan:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

### PASS

La comprobación fue realizada y satisface el criterio definido.

Debe existir evidencia suficiente.

Cuando el criterio exige ejecutar un comando:

`PASS`

requiere evidencia de esa ejecución.

### FAIL

La comprobación fue realizada y no satisface el criterio.

### NOT_EXECUTED

La comprobación aplicaba pero no fue ejecutada.

Debe registrar el motivo.

No utilizar:

`NOT_EXECUTED`

como equivalente silencioso de éxito.

### NOT_APPLICABLE

La comprobación no aplica al contexto.

Debe existir justificación cuando no sea evidente.

### REQUIRES_REVIEW

La comprobación no puede cerrarse sin interpretación o decisión humana.

Los check statuses responden:

`¿El criterio de esta comprobación quedó satisfecho?`

No utilizar estos valores como:

- `executionStatus`;
- `evidenceStatus`;
- artifact status.

## Final verification

`verify-function-app` usa:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

### VERIFIED

Todos los gates obligatorios y acciones requeridas fueron satisfechos.

No existen blockers, review requirements obligatorios ni technical debt relevante para diferenciar el resultado.

### VERIFIED_WITH_DEBT

Todos los gates obligatorios y acciones requeridas fueron satisfechos.

Permanece technical debt no bloqueante.

No usar este estado para ocultar:

- mandatory `FAIL`;
- mandatory `NOT_EXECUTED`;
- blocker técnico;
- decisión humana requerida para un gate obligatorio.

### BLOCKED

Existe al menos un impedimento técnico conocido que impide cerrar un gate obligatorio o una acción requerida.

### REQUIRES_REVIEW

No existe blocker técnico dominante, pero no puede emitirse una conclusión final sin decisión humana.

# Agregación final

Derivar el estado final únicamente a partir de:

- gates obligatorios;
- acciones `requiredForMigration = true`;
- blockers técnicos;
- decisiones humanas pendientes;
- technical debt documentada.

## Mandatory FAIL

Un gate obligatorio con:

`FAIL`

produce:

`BLOCKED`

## Mandatory NOT_EXECUTED

Un gate obligatorio con:

`NOT_EXECUTED`

impide:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

Debe resolverse como:

- `BLOCKED`;
- o `REQUIRES_REVIEW`;

según la causa.

## Required action incomplete

Una acción:

`requiredForMigration = true`

que permanezca:

- `FAILED`;
- `NOT_EXECUTED`;
- `BLOCKED`;
- `REQUIRES_REVIEW`;

impide cerrar como:

- `VERIFIED`;
- `VERIFIED_WITH_DEBT`.

El resultado final depende de la causa dominante.

## Human review

Si no existe blocker técnico dominante pero una decisión humana impide cerrar:

`REQUIRES_REVIEW`

## Technical blocker + review

Cuando existan simultáneamente:

- blocker técnico;
- decisión humana pendiente;

el estado principal es:

`BLOCKED`

Las decisiones pendientes deben seguir registradas.

## Non-blocking debt

Cuando todos los gates obligatorios y acciones requeridas están satisfechos y permanece technical debt no bloqueante:

`VERIFIED_WITH_DEBT`

## All mandatory requirements satisfied

Cuando todos los gates obligatorios y acciones requeridas están satisfechos y no existe deuda relevante:

`VERIFIED`

## Trabajo no obligatorio

Acciones con:

`requiredForMigration = false`

no bloquean por sí solas:

- `COMPLETED`;
- `READY_FOR_MIGRATION`;
- `MIGRATED`;
- `VERIFIED`.

Un check opcional fallido tampoco se convierte automáticamente en blocker.

Debe clasificarse según corresponda como:

- technical debt;
- risk;
- optimization;
- finding.

# Distinciones importantes

## UNKNOWN vs REQUIRES_VALIDATION

`UNKNOWN` describe evidencia.

Ejemplo:

```json
{
  "evidenceStatus": "UNKNOWN"
}
```

`REQUIRES_VALIDATION` describe la necesidad de trabajo técnico adicional para decidir.

Ejemplo:

```json
{
  "evidenceStatus": "UNKNOWN",
  "actionStatus": "REQUIRES_VALIDATION"
}
```

## NOT_APPLICABLE vs NOT_REQUIRED

`NOT_APPLICABLE` describe que una dimensión, acción o check no aplica dentro de su dominio correspondiente.

Ejemplo:

Durable no existe:

```json
{
  "evidenceStatus": "NOT_APPLICABLE"
}
```

`NOT_REQUIRED` pertenece exclusivamente a:

`actionStatus`

y significa que la dimensión fue evaluada pero no necesita cambio.

Ejemplo:

Programming Model ya es v4:

```json
{
  "evidenceStatus": "CONFIRMED",
  "actionStatus": "NOT_REQUIRED"
}
```

Si posteriormente se invoca el skill de migración PM v4:

```json
{
  "status": "NOT_APPLICABLE"
}
```

## PARTIAL vs BLOCKED

Usar:

`PARTIAL`

cuando existe trabajo independiente seguro.

Usar:

`BLOCKED`

cuando un impedimento técnico impide continuar el trabajo necesario.

No todos los artifacts soportan:

`PARTIAL`.

Utilizarlo únicamente donde esté definido por esta policy.

## FAILED vs BLOCKED

`FAILED`

describe el resultado de una acción que sí fue ejecutada.

`BLOCKED`

describe un impedimento técnico que impide ejecutar o completar el trabajo requerido.

Una acción:

`executionStatus = FAILED`

puede provocar:

`status = BLOCKED`

en el artifact propietario.

## BLOCKED vs REQUIRES_REVIEW

Usar:

`BLOCKED`

cuando existe un impedimento técnico conocido.

Ejemplo:

```text
mandatory test gate = FAIL
```

Usar:

`REQUIRES_REVIEW`

cuando el siguiente paso depende de una decisión humana.

Ejemplo:

```text
behavior contract contradictorio
→ human decision required
```

## MIGRATED vs VERIFIED

`MIGRATED`

describe el resultado de una etapa de migration.

`VERIFIED`

describe el cierre agregado de la Function App.

Por tanto:

```text
MIGRATED
≠ VERIFIED
```

Una o varias Functions pueden estar:

`MIGRATED`

mientras la Function App todavía no puede considerarse:

`VERIFIED`.

## READY_FOR_MIGRATION

`READY_FOR_MIGRATION`

describe exclusivamente el cierre de:

`prepare-function`.

No significa que todos los gates necesarios para ejecutar migration estén satisfechos.

Ejemplo:

```text
prepare-function
→ READY_FOR_MIGRATION

testing requirement
→ requiredBeforeMigration = true
→ todavía pendiente

migration
→ todavía bloqueada por testing gate
```

# Campos relacionados que no son status

## requiredForMigration

Campo definido por planning.

Valores:

- `true`
- `false`

Responde:

`¿Esta acción es obligatoria para cerrar la migración?`

No es un estado.

No sustituye:

- `executionStatus`;
- verification check `status`.

## classification

Usar cuando un dominio necesita categorizar un finding sin representar estado.

Ejemplos:

Legacy residual:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

Review findings:

- `FALSE_POSITIVE`
- `MISSING_EVAL`
- `SCRIPT_GAP`
- otros definidos por su contrato.

`classification`

no sustituye:

- `status`;
- `evidenceStatus`;
- `executionStatus`.

# Principios

No convertir incertidumbre en éxito.

No convertir technical debt no bloqueante en blocker.

No convertir un check opcional fallido en blocker obligatorio.

No utilizar `PASS` como evidencia.

No utilizar `CONFIRMED` como resultado de ejecución.

No utilizar `UNKNOWN` como action status.

No utilizar `MIGRATED` como sinónimo de `VERIFIED`.

No utilizar `READY_FOR_MIGRATION` como prueba de que testing ya está satisfecho.

No utilizar la misma propiedad para:

- evidencia;
- necesidad de acción;
- ejecución;
- check;
- clasificación.
