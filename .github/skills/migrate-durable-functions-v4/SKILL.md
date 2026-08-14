---
name: migrate-durable-functions-v4
description: Migra un workflow Azure Durable Functions como unidad coherente cuando planning lo exige. Úsalo para adaptar starter, orchestrator, activities, entities, sub-orchestrators y APIs Durable al target aprobado preservando topology y determinismo; no aplica cuando Durable está ausente o ya cumple el target.
---

# Migrate Durable Functions v4

## Objetivo

Migrar el workflow Durable completo definido por planning sin fragmentar cambios que romperían su coherencia.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/references/artifact-layout.md`

## Precondiciones

Deben existir:

- plan global;
- planes de Functions participantes;
- preparations aplicables;
- Programming Model migration previa cuando el plan lo requiera;
- target Durable aprobado.

## Aplicabilidad

- Durable ausente → `NOT_APPLICABLE`;
- workflow ya target → `NOT_APPLICABLE`;
- topology insuficientemente conocida → `BLOCKED`/`REQUIRES_REVIEW`;
- workflow con acciones aprobadas → migrar como unidad.

## Workflow

1. Confirmar participantes y Action IDs del workflow.
2. Validar topology BEFORE.
3. Adaptar dependency/API target.
4. Migrar starter/client, orchestrator, activities, entities y sub-orchestrators según aplique.
5. Preservar determinismo, retries, timers y external events.
6. Preservar ordering, fan-out/fan-in, failure handling, inputs/outputs y nombres observables.
7. Validar referencias/nombres entre participantes.
8. Registrar deviations y active-instance risk cuando corresponda.
9. Emitir artifacts de workflow.

Cargar:

- `references/durable-rules.md`
- `references/artifacts.md`

## Salidas

Crear `.migration/40-execution/workflows/<WorkflowName>/durable-v4.json|md` para el workflow y sus participantes. Usar una única evidencia propietaria del workflow cuando varios entrypoints compartan la misma migración.

## Cierre

`MIGRATED` solo cuando topology y APIs requeridas estén coherentes y todas las acciones obligatorias del workflow estén completadas.

## No hacer

- usar `latest`;
- generar tests;
- cambiar semántica del workflow por simplificación;
- optimizar topology, retries, timers o failure handling sin acción aprobada;
- ignorar participantes fuera del requested scope si pertenecen al effective scope;
- desplegar.
