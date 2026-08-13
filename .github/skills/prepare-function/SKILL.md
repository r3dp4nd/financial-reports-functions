---
name: prepare-function
description: Prepara una Function para migración refactorizándola hacia la arquitectura objetivo, aislando infraestructura cuando corresponda y agregando tests que protejan su comportamiento actual.
---

# Prepare Function

## Objetivo

Dejar una Function preparada para su siguiente migración de plataforma.

Debe:

- preservar comportamiento;
- aplicar acciones estructurales requeridas;
- reducir acoplamiento al runtime;
- respetar recursos compartidos;
- lograr testabilidad suficiente;
- obtener baseline verde.

No migra Programming Model ni workflows Durable.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir:

- analysis de la Function;
- migration plan de la Function;
- plan global;
- preparación global aplicable.

Cuando corresponda:

`.migration/resources/shared-resources.json`

## Entradas

Consumir primero:

- analysis;
- Function plan;
- global plan;
- global preparation;
- shared resources.

No reconstruir analysis.

## Acciones

Ejecutar acciones `FN-*` autorizadas por el plan.

Principalmente:

- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`;
- otras acciones locales explícitamente planificadas.

No ejecutar:

- `TECHNICAL_DEBT`;
- `OPTIMIZATION`;

salvo que hayan sido promovidas explícitamente a requisito mediante nuevo análisis/plan aprobado.

## IDs

Preservar los IDs provenientes de `analysis.json`.

Ejemplo:

`FN-REQUESTREPORT-001`

No crear un ID nuevo para representar la misma acción.

## Arquitectura

Aplicar:

`../_shared/architecture-policy.md`

Azure adapters:

`src/functions/`

Lógica funcional:

`src/<Capability>/`

Crear solo las piezas requeridas.

No crear capas vacías.

## Adapter Azure

Debe concentrarse principalmente en:

- registro;
- adaptación;
- composition;
- invocation;
- response mapping.

Si el plan exige extracción funcional, no mantener la lógica significativa dentro del adapter.

## Contracts

Crear únicamente cuando proporcionen un límite real.

Usar nombres naturales.

Ejemplos:

- `ReportRepository`
- `MessagePublisher`
- `ReportGenerator`

No imponer `*.port.ts`.

## Infraestructura

Aislar cuando corresponda:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs.

## Recursos compartidos

Consumir resource IDs y shared action dependencies.

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS"
    }

Si una acción compartida obligatoria:

`SR-ACTION-*`

está pendiente:

`status = BLOCKED`

No crear una implementación local alternativa.

## Configuración

Aislar `process.env` cuando sea requerido por:

- testabilidad;
- arquitectura;
- plan.

Nunca leer valores sensibles.

## Refactor scope

Clasificar:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

Esta clasificación no usa el campo `status`.

Si un refactor `SIGNIFICANT` excede el alcance aprobado:

`status = REQUIRES_REVIEW`

## Tests

Agregar únicamente tests definidos o derivados directamente del análisis/plan.

Priorizar:

1. comportamiento principal;
2. validaciones;
3. decisiones;
4. errores;
5. límites externos.

No agregar integration tests.

## Baseline

Registrar:

- command;
- runtime;
- suites;
- tests;
- failures;
- coverage cuando aplique;
- status.

El status de baseline usa:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `REQUIRES_REVIEW`

## Programming Model

Preservar temporalmente el modelo actual.

No migrarlo aquí.

## Durable

Puede refactorizar una Activity internamente cuando esté planificado.

No cambiar:

- workflow graph;
- orchestration semantics;
- retries;
- timers;
- events.

## Catálogo BEFORE

No modificar la ficha histórica:

`.migration/catalog/functions/<FunctionName>.md`

## Salida estructurada

Crear:

`.migration/functions/<FunctionName>/preparation.json`

Debe contener:

- `schemaVersion`;
- `function`;
- `status`;
- `behaviorPreserved`;
- `architectureBefore`;
- `architectureChanges`;
- `resultingStructure`;
- `requiredActionsExecuted`;
- `sharedResources`;
- `sharedActionDependencies`;
- `filesModified`;
- `contractsIntroduced`;
- `infrastructureIsolated`;
- `testsAdded`;
- `baseline`;
- `validations`;
- `risks`;
- `unknowns`;
- `technicalDebtRemaining`.

## Estado principal

Usar únicamente:

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

Ejemplo:

    {
      "status": "READY_FOR_MIGRATION"
    }

No utilizar evidencia como estado principal.

## Evidencia interna

Cuando un hallazgo necesite expresar certeza:

usar:

`evidenceStatus`

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "evidenceStatus": "CONFIRMED"
    }

## Salida humana

Crear:

`.migration/functions/<FunctionName>/preparation.md`

Usar:

`../_shared/templates/function-preparation.template.md`

## Lecciones

Crear:

`.migration/lessons/prepare-function/<FunctionName>.json`

`.migration/lessons/prepare-function/<FunctionName>.md`

## Criterio de cierre

`READY_FOR_MIGRATION` requiere:

- comportamiento preservado;
- acciones `FN-*` necesarias completadas;
- arquitectura requerida aplicada;
- shared dependencies disponibles;
- baseline requerida en `PASS`;
- ausencia de blocker local.

## Fuera de alcance

No debe:

- migrar Programming Model;
- migrar Runtime;
- migrar workflow Durable;
- ejecutar global actions;
- duplicar shared resources;
- modificar comportamiento;
- optimizar;
- resolver deuda no requerida;
- desplegar.

Siguiente skill:

- `migrate-programming-model-v4`
- `migrate-durable-functions-v4`
