---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions como una unidad coherente hacia el target definido, preservando determinismo, comportamiento, arquitectura y recursos compartidos.
---

# Migrate Durable Functions v4

## Objetivo

Migrar un workflow Durable como unidad funcional coherente.

Preservar:

- grafo;
- roles;
- comportamiento;
- determinismo;
- contracts;
- names;
- retries;
- timers;
- events;
- arquitectura;
- recursos compartidos.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir cuando apliquen:

- inventory;
- assessment;
- global plan;
- Function analyses;
- Function plans;
- Function preparations;
- shared resources.

## Aplicabilidad

Durable ausente:

`status = NOT_APPLICABLE`

Workflow ya en target y sin cambio necesario:

`status = NOT_APPLICABLE`

Grafo insuficientemente conocido:

`status = REQUIRES_REVIEW`

Dependencia obligatoria pendiente:

`status = BLOCKED`

## Unidad de migración

La unidad es el workflow.

Puede contener:

- `CLIENT`
- `STARTER`
- `ORCHESTRATOR`
- `ACTIVITY`
- `SUB_ORCHESTRATOR`
- `ENTITY`

Los planes por Function aportan trazabilidad, pero no fragmentan la migración del workflow.

## Artefactos de workflow

Los artefactos Durable viven bajo:

`.migration/workflows/<WorkflowName>/`

No almacenarlos bajo:

`.migration/functions/<WorkflowName>/`

salvo que el workflow sea además una entidad Function real y exista un artefacto propio de esa Function.

La separación es:

```text
functions/
→ artefactos de Functions

workflows/
→ artefactos de workflows Durable
```

## Dependencia durable-functions

La versión target de:

`durable-functions`

debe provenir de:

- assessment;
- plan global;
- dependency baseline aprobada.

Este skill no selecciona una versión diferente durante la migración.

Si la dependencia requerida no está preparada:

`status = BLOCKED`

Si aparece una incompatibilidad inesperada con la versión aprobada:

`status = REQUIRES_REVIEW`

No utilizar:

`durable-functions@latest`

como sustituto de la baseline.

## Evidence status

Cada relación importante debe usar `evidenceStatus` cuando exista incertidumbre.

Ejemplo:

    {
      "from": "GenerateReportOrchestrator",
      "to": "CreateExcelActivity",
      "evidenceStatus": "CONFIRMED"
    }

No usar `status` para representar certeza del grafo.

## Arquitectura

Preservar la arquitectura preparada.

No volver a introducir lógica funcional dentro de registration adapters.

## Shared resources

Consumir resource IDs existentes.

No crear implementaciones alternativas por Activity.

Las acciones propietarias `SR-ACTION-*` deben estar completadas antes cuando sean obligatorias.

## Starter / Client

Preservar cuando aplique:

- target orchestrator;
- input;
- instance behavior;
- response;
- errors.

## Orchestrator

Preservar:

- order;
- branching;
- fan-out/fan-in;
- activities;
- retries;
- timers;
- sub-orchestrations;
- external events;
- errors;
- result.

No rediseñar el workflow.

## Determinismo

No introducir dentro del orchestrator:

- I/O;
- network calls;
- database access;
- side effects;
- random no determinista;
- tiempo no determinista.

El resultado se registra como check:

    {
      "determinism": {
        "status": "PASS"
      }
    }

## Activities

Preservar:

- names;
- input;
- output;
- errors;
- effects externos.

No modificar contratos funcionales sin revisión.

## Active instances

Si existen riesgos sobre instancias productivas activas y no hay evidencia suficiente para decidir estrategia:

`status = REQUIRES_REVIEW`

No afirmar seguridad de replay únicamente por pruebas locales.

## Tests

Ejecutar tests requeridos del workflow.

Registrar checks con los estados definidos por `status-policy.md`.

## Validación

Puede incluir:

- tests;
- typecheck selectivo;
- registration consistency;
- graph consistency;
- determinism review.

El build global pertenece a verification.

## Salida estructurada

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.json`

Debe contener:

- `schemaVersion`;
- `workflow`;
- `status`;
- `participants`;
- `graph`;
- `roles`;
- `actionsExecuted`;
- `architecturePreserved`;
- `sharedResources`;
- `registrations`;
- `determinism`;
- `retries`;
- `timers`;
- `events`;
- `subOrchestrators`;
- `entities`;
- `tests`;
- `validations`;
- `activeInstanceRisks`;
- `risks`;
- `unknowns`.

## Estado principal

Usar únicamente:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Checks internos

Ejemplo:

    {
      "determinism": {
        "status": "PASS"
      },
      "architecturePreserved": {
        "status": "PASS"
      }
    }

## Salida humana

Crear:

`.migration/workflows/<WorkflowName>/durable-migration.md`

Usar:

`../_shared/templates/durable-migration.template.md`

## Lecciones

Crear:

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.json`

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.md`

## Criterio de cierre

`MIGRATED` requiere:

- workflow confirmado;
- participantes coordinados;
- dependency target aprobada disponible;
- registrations migradas;
- determinismo preservado;
- arquitectura preservada;
- shared resources consistentes;
- tests requeridos verdes;
- ausencia de blocker.

## Fuera de alcance

No debe:

- seleccionar versiones de dependencias;
- rediseñar workflow;
- cambiar negocio;
- optimizar paralelismo;
- cambiar retries por preferencia;
- redefinir resources;
- ejecutar build global final;
- afirmar compatibilidad de instancias activas sin evidencia;
- desplegar.

Siguiente skill sugerido:

`verify-function-app`
