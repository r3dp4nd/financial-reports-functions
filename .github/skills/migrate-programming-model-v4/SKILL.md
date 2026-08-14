---
name: migrate-programming-model-v4
description: Migra una Function Node.js/TypeScript al Azure Functions Programming Model v4 cuando el plan lo exige. Úsalo para transformar registration, bindings y adapter Azure preservando comportamiento y acciones aprobadas; no aplica si la Function ya está confirmada en v4.
---

# Migrate Programming Model v4

## Objetivo

Ejecutar únicamente las acciones de Programming Model v4 de una Function y registrar evidencia reproducible.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/references/artifact-layout.md`

## Precondiciones

Deben existir plan global, plan de Function y preparation aplicable.

Consultar `.migration/20-analysis/functions/<FunctionName>/analysis.json|md` (o slice equivalente) cuando el
`executionGuide` del plan quede incompleto: contiene el contrato a preservar, `relationships` y `legacyCoupling`
con más detalle que el plan resumido, y es la fuente de verdad más rica disponible para resolver ambigüedades.

La dependencia `@azure/functions` debe usar el target aprobado por planning/baseline y quedar declarada en
`dependencies` (no `devDependencies`) — ver `../_shared/references/official-sources.md`.

## Aplicabilidad

- V4 confirmado y sin acción de modelo → `NOT_APPLICABLE`;
- V3 con acción aprobada → migrar;
- MIXED/UNKNOWN → no ejecutar hasta resolver la incertidumbre requerida.

## Workflow

1. Confirmar Action IDs de esta etapa.
2. Cargar solo el adapter/entrypoint y dependencias necesarias.
3. Migrar registration y bindings según el plan.
4. Mantener lógica funcional fuera del adapter cuando el slice ya fue preparado.
5. Preservar contrato, nombres, bindings, errores, payloads y side effects observables.
6. Eliminar artifacts v3 solo cuando su reemplazo esté confirmado.
7. Ejecutar validaciones selectivas.
8. Registrar actionResults, evidence y deviations.

Cargar:

- `references/migration-rules.md`
- `references/artifacts.md`

## Salidas

- `.migration/40-execution/functions/<FunctionName>/programming-model-v4.json`
- `.migration/40-execution/functions/<FunctionName>/programming-model-v4.md`

## Cierre

Status `MIGRATED` solo cuando las acciones de modelo requeridas estén completadas y la registration v4 esperada sea observable.

## No hacer

- usar `latest`;
- generar tests;
- migrar Durable topology desde este skill;
- corregir acciones no planificadas;
- cambiar semántica funcional por simplificación;
- desplegar.
