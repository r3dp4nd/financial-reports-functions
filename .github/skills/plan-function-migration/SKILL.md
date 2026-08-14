---
name: plan-function-migration
description: Construye el plan global y por Function/slice a partir de inventory, assessment y analyses. Úsalo para convertir necesidades aprobadas en acciones globales, shared y locales con ownership, dependencias, orden, executor sugerido y criterios verificables que sirvan como contrato/eval para humanos o IA, sin ejecutar cambios.
---

# Plan Function Migration

## Objetivo

Crear un único plan coherente para la Function App y planes específicos por Function/slice, evitando trabajo duplicado sobre recursos compartidos.

El plan es también el contrato de evaluación de la ejecución: debe permitir que un humano o una IA implemente y que verification compruebe resultados sin reinterpretar intención.

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
3. Separar carriles: migración técnica (`TECHNICAL_MIGRATION`) y refactor/testabilidad (`REFACTOR_TESTABILITY`) cuando ambos existan.
4. Convertir `migrationNeeds` y `refactor/testabilityNeeds` en acciones verificables.
5. Asignar ownership: global, shared, Function o slice.
6. Marcar `requiredForMigration` y si aplica `requiredForRefactor`.
7. Sugerir executor: `HUMAN`, `AI_AGENT` o `EITHER`, con rationale.
8. Definir comportamiento preservado por acción y qué cambios funcionales están prohibidos.
9. Definir `dependsOn`, orden lógico y criterios de evaluación.
10. Crear plan global y planes por Function/slice.
11. Detenerse si una decisión necesaria carece de target/evidencia aprobada.

Cargar según necesidad:

- `references/planning-rules.md`
- `references/action-model.md`
- `references/artifacts.md`

## Salidas

- `.migration/plans/migration-plan.json`
- `.migration/plans/migration-plan.md`
- `.migration/functions/<FunctionName>/migration-plan.json`
- `.migration/functions/<FunctionName>/migration-plan.md`
- `.migration/slices/<SliceName>/migration-plan.json|md` cuando el scope natural no sea una única Function
- `.migration/resources/shared-resources.json|md` cuando existan shared resources confirmados.

## Cierre

Terminar cuando todas las necesidades requeridas tienen owner, lane, executor sugerido, resultado esperado, criterios de evaluación y dependencias suficientes para ejecución segura, o el plan queda explícitamente `PARTIAL`/`BLOCKED`.

## No hacer

- modificar source;
- usar `latest`;
- crear acciones duplicadas para el mismo shared resource;
- generar tests;
- convertir deuda opcional en requisito sin evidencia;
- planificar optimizaciones funcionales como parte de refactor estructural.
