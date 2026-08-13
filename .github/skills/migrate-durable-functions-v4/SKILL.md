---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions como una unidad coherente hacia el target definido, usando planes por Function y plan global, preservando arquitectura, determinismo, contratos y recursos compartidos.
---

# Migrate Durable Functions v4

## Objetivo

Migrar un workflow Durable como unidad coherente.

Preservar:

- comportamiento;
- relaciones;
- determinismo;
- nombres;
- contracts;
- arquitectura;
- shared resources.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

- inventory;
- assessment;
- plan global;
- analyses participantes;
- planes por Function;
- preparations requeridas.

## Entradas

Consumir primero:

- workflow;
- analyses;
- Function plans;
- global plan;
- shared resources;
- preparations;
- tests.

No reconstruir toda la App.

## Aplicabilidad

Durable ausente:

`NOT_APPLICABLE`

Workflow ya compatible:

`NOT_APPLICABLE`

Grafo no confirmable:

`REQUIRES_REVIEW`

## Unidad

La unidad de migración es el workflow.

Puede incluir:

- client;
- starter;
- orchestrator;
- activities;
- sub-orchestrators;
- entities.

Los planes por Function sirven para detalle y trazabilidad, no para fragmentar incorrectamente la migración.

## Grafo y roles

Confirmar:

- participants;
- roles;
- calls;
- events;
- dependencies.

Roles:

- `CLIENT`
- `STARTER`
- `ORCHESTRATOR`
- `ACTIVITY`
- `SUB_ORCHESTRATOR`
- `ENTITY`
- `UNKNOWN`

No inferir relaciones solo por naming.

## Arquitectura

Preservar la estructura preparada.

No volver a mezclar runtime Durable con lógica funcional extraída.

## Shared resources

Respetar resource ownership y shared actions.

No crear implementaciones por Activity cuando el recurso es compartido.

Si una dependencia obligatoria está pendiente:

`BLOCKED`

## Starter / Client

Preservar:

- orchestrator;
- input;
- instance identity cuando aplique;
- status behavior;
- response;
- errors.

## Orchestrator

Preservar:

- order;
- decisions;
- branching;
- fan-out/fan-in;
- retries;
- timers;
- sub-orchestrations;
- external events;
- errors;
- compensations;
- result.

No rediseñar workflow.

## Determinismo

No introducir dentro del orchestrator:

- I/O;
- network;
- database;
- random no determinista;
- tiempo no determinista;
- side effects.

## Activities

Preservar:

- names;
- input;
- output;
- errors;
- external effects.

Mantener separación arquitectónica existente.

## Retries

Preservar semántica confirmada.

No optimizar.

## Timers

Preservar timers Durable.

## External Events

Preservar:

- event name;
- wait semantics;
- timeout;
- behavior.

## Active instances

No afirmar seguridad productiva o replay compatibility sin evidencia.

Cuando afecte cierre:

`REQUIRES_REVIEW`

## Tests

Ejecutar baseline del workflow.

Priorizar:

- orchestrator decisions;
- sequence;
- activity contracts;
- retries;
- errors;
- events;
- sub-orchestrations.

## Validación

Ejecutar:

- tests;
- typecheck selectivo;
- registration checks;
- graph consistency;

cuando corresponda.

Host global pertenece a verification.

## Catálogo

No modificar documentación BEFORE.

## Salidas estructuradas

Crear:

`.migration/functions/<WorkflowName>/durable-migration.json`

Debe registrar:

- status;
- workflow;
- participants;
- graph;
- roles;
- model change;
- architecture preserved;
- shared resources;
- registrations;
- retries;
- timers;
- events;
- sub-orchestrators;
- entities;
- tests;
- validations;
- active instance risks;
- unknowns.

## Salida humana

Crear:

`.migration/functions/<WorkflowName>/durable-migration.md`

Usar:

`../_shared/templates/durable-migration.template.md`

## Lecciones

Crear:

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.json`

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.md`

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Criterio de cierre

`MIGRATED` requiere:

- workflow confirmado;
- participantes coordinados;
- registrations migradas;
- arquitectura preservada;
- shared resources consistentes;
- determinismo preservado;
- tests verdes.

## Fuera de alcance

No debe:

- rediseñar workflow;
- modificar reglas de negocio;
- optimizar paralelismo;
- modificar retries por conveniencia;
- redefinir shared resources;
- ejecutar build global;
- afirmar seguridad de active instances sin evidencia;
- desplegar.

Siguiente skill sugerido:

`verify-function-app`
