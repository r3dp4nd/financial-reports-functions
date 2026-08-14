---
name: plan-function-migration
description: Construye el plan global y por Function a partir de inventory, assessment y analyses. Úsalo para convertir necesidades aprobadas en acciones globales, shared y locales con ownership, dependencias, orden y criterios verificables, sin ejecutar cambios.
---

# Plan Function Migration

## Objetivo

Crear un único plan coherente para la Function App y un plan específico por Function, evitando trabajo duplicado sobre recursos compartidos.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/dependency-baseline.json`

## Precondiciones

Deben existir inventory, assessment y los analyses requeridos para el effective scope.

## Workflow

1. Resolver `requestedScope` y `effectiveScope`.
2. Consolidar shared resources y sus consumidores.
3. Convertir `migrationNeeds` en acciones verificables.
4. Asignar ownership: global, shared o Function.
5. Marcar `requiredForMigration`.
6. Definir `dependsOn` y orden lógico.
7. Crear plan global y planes por Function.
8. Detenerse si una decisión necesaria carece de target/evidencia aprobada.

Cargar según necesidad:

- `references/planning-rules.md`
- `references/action-model.md`
- `references/artifacts.md`

## Salidas

- `.migration/plans/migration-plan.json`
- `.migration/plans/migration-plan.md`
- `.migration/functions/<FunctionName>/migration-plan.json`
- `.migration/functions/<FunctionName>/migration-plan.md`
- `.migration/resources/shared-resources.json|md` cuando existan shared resources confirmados.

## Cierre

Terminar cuando todas las necesidades requeridas tienen owner, resultado esperado y dependencias suficientes para ejecución segura, o el plan queda explícitamente `PARTIAL`/`BLOCKED`.

## No hacer

- modificar source;
- usar `latest`;
- crear acciones duplicadas para el mismo shared resource;
- generar tests;
- convertir deuda opcional en requisito sin evidencia.
