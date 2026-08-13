# Azure Functions Migration Skills

## Objetivo

Conjunto de skills progresivos para comprender, preparar, migrar y verificar Azure Function Apps Node.js hacia el target
técnico definido.

Target actual:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- comportamiento protegido por tests;
- arquitectura objetivo alineada con `financial-reports-functions`.

Los skills se ejecutan manualmente desde GitHub Copilot Chat.

No existe orquestación autónoma.

## Principio

Trabajar desde evidencia hacia cambios.

Flujo conceptual:

`discover → assess → analyze → plan → prepare → migrate → verify`

No todos los skills aplican en todos los repositorios.

Una dimensión que ya cumple el target debe preservarse.

## Ejecutor

Los artefactos de análisis y planificación son independientes del ejecutor.

Las acciones pueden realizarse:

- mediante skills;
- mediante IA;
- manualmente por un desarrollador.

El resultado esperado y los criterios de verificación deben ser los mismos.

## Políticas compartidas

Aplicar cuando corresponda:

- `_shared/evidence-policy.md`
- `_shared/security-policy.md`
- `_shared/lessons-policy.md`
- `_shared/architecture-policy.md`

## Memoria de migración

`.migration/` contiene la memoria persistente de la migración.

Los siguientes skills deben consumir primero los artefactos existentes antes de volver a analizar el repositorio.

JSON:

- entrada estructurada para agentes y skills.

Markdown:

- documentación humana y soporte para developers.

## Catálogo del estado actual

Antes de modificar código debe existir una fotografía documentada del sistema.

Documento principal:

`.migration/catalog/current-state.md`

Detalle por Function:

`.migration/catalog/functions/<FunctionName>.md`

El catálogo representa el estado anterior a la migración.

No debe transformarse progresivamente en documentación de la arquitectura target.

## Recursos compartidos

El discovery y los análisis deben identificar recursos compartidos relevantes.

Ejemplos:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositorios;
- configuración;
- servicios comunes.

Los recursos compartidos deben tener:

- identificador;
- tipo;
- ownership;
- consumidores;
- configuración por nombre de clave;
- evidencia.

La planificación debe coordinar su modificación una sola vez.

## Arquitectura objetivo

Toda refactorización debe seguir:

`_shared/architecture-policy.md`

La arquitectura es requerida.

Las carpetas y capas se crean únicamente cuando tengan responsabilidad real.

## Flujo principal

### 1. discover-function-app

Construye:

- inventario;
- catálogo general inicial;
- candidatos a recursos compartidos.

Salida estructurada:

`.migration/repository/inventory.json`

Documentación principal:

`.migration/catalog/current-state.md`

### 2. assess-function-app

Determina el gap entre estado actual y target.

Evalúa independientemente:

- Node.js;
- Runtime;
- Programming Model;
- Durable;
- dependencias;
- TypeScript;
- tooling global.

### 3. analyze-function

Ejecutar por Function o unidad funcional coherente.

Produce:

- comportamiento actual;
- dependencias;
- recursos compartidos utilizados;
- arquitectura actual;
- gap arquitectónico;
- testabilidad;
- compatibilidad;
- riesgos;
- requiredActions.

También crea o actualiza:

`.migration/catalog/functions/<FunctionName>.md`

### 4. plan-function-migration

Construye dos niveles de planificación:

- plan global del repositorio/Function App;
- plan específico por Function.

Además coordina acciones sobre recursos compartidos.

Plan global:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Plan por Function:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

### 5. prepare-function-app

Prepara cambios globales como:

- Node.js;
- dependencias;
- TypeScript;
- Jest;
- build;
- estructura base;
- `host.json`;
- `.funcignore`.

También prepara la base estructural requerida por la arquitectura.

### 6. prepare-function

Refactoriza una Function hacia la arquitectura objetivo y protege su comportamiento con tests.

El refactor debe ser suficiente para alcanzar los límites arquitectónicos requeridos, pero sin crear capas vacías ni
abstracciones innecesarias.

### 7. migrate-programming-model-v4

Migra adapters Azure legacy no Durable cuando aplique.

Una Function ya v4 debe producir:

`NOT_APPLICABLE`

### 8. migrate-durable-functions-v4

Migra workflows Durable como unidades coherentes.

### 9. verify-function-app

Gate técnico final.

Verifica:

- instalación;
- runtime usado;
- typecheck;
- build;
- tests;
- coverage;
- registro de Functions;
- Durable;
- legacy residual;
- packaging;
- arquitectura resultante;
- deuda técnica;
- unknowns.

## Plan global y planes por Function

El plan global coordina:

- cambios globales;
- recursos compartidos;
- dependencias;
- orden de ejecución;
- workflows;
- planes por Function.

El plan por Function describe:

- comportamiento a preservar;
- acciones concretas;
- dependencias globales;
- recursos compartidos de los que depende;
- preparación;
- migración;
- verificación.

No debe duplicar todo el análisis.

## Navegación condicional

No ejecutar los skills mecánicamente.

Repositorio ya v4:

`discover → assess → analyze → plan → prepare/refactor → verify`

Repositorio legacy:

`discover → assess → analyze → plan → prepare → migrate → verify`

Durable:

usar el skill especializado cuando corresponda.

## Estados

Evidencia:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Acción:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

Plan:

- `READY`
- `PARTIAL`
- `BLOCKED`

Preparación:

- `READY_FOR_MIGRATION`
- `BLOCKED`
- `REQUIRES_REVIEW`
- `NOT_APPLICABLE`

Migración:

- `MIGRATED`
- `BLOCKED`
- `REQUIRES_REVIEW`
- `NOT_APPLICABLE`

Verificación:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Invalidation

Mantener reglas simples:

- cambio estructural importante → repetir discovery;
- cambio de versiones/dependencias → repetir assessment;
- cambio de una Function → repetir su analysis;
- cambio de recursos compartidos → actualizar analyses afectados y plan;
- cambios relevantes de analysis → regenerar plan global y planes afectados;
- cambios posteriores a verification → volver a verificar.

No introducir hashes ni state machine compleja en el MVP.

## Build

No exigir build completo después de cada Function.

Usar validaciones intermedias cuando aporten evidencia.

El build global es gate final de `verify-function-app`.

## Tests

Secuencia preferida:

`comportamiento actual`

→ `refactor arquitectónico mínimo necesario`

→ `tests`

→ `baseline verde`

→ `migración`

→ `mismos tests verdes`

No agregar integration tests en el alcance actual.

## Deuda técnica

Separar:

- cambios obligatorios;
- deuda técnica;
- optimizaciones.

La migración puede finalizar con deuda técnica documentada.

## Mejora del toolkit

Las lessons generadas por ejecuciones reales pueden ser analizadas mediante:

`review-skill-performance`

Este capability propone mejoras, pero nunca modifica automáticamente los skills.

## Regla final

El objetivo no es producir más cambios.

El objetivo es alcanzar el target con:

- evidencia;
- comportamiento protegido;
- arquitectura mantenible;
- mínima dependencia futura del runtime y SDKs.
