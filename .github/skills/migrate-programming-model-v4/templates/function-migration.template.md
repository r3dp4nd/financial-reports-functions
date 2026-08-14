# Migración — <FunctionName>

## Referencias

- Function plan: `.migration/30-plan/functions/<FunctionName>/migration-plan.json|md`
- Preparation: `.migration/40-execution/functions/<FunctionName>/preparation.json|md`
- Analysis: `.migration/20-analysis/functions/<FunctionName>/analysis.json|md`
- BEFORE: `.migration/00-before/functions/<FunctionName>.md`

## Estado

`MIGRATED | NOT_APPLICABLE | BLOCKED | REQUIRES_REVIEW`

## Action results

| Action ID | Execution status | Resultado | Evidencia |
|---|---|---|---|

## Programming Model

- Before:
- After:
- `@azure/functions`: versión antes → versión después
- Ubicación del package: `dependencies` confirmado (no `devDependencies`)
- Registration/bindings preservados:

## Checklist mecánico v3 → v4 (resultado verificado)

> Verificar cada regla contra el código ya migrado. Ver `_shared/references/official-sources.md` para el detalle.
> No marcar `SÍ` sin haber leído el código real después del cambio.

| # | Regla | Cumple después de migrar | Evidencia |
|---|---|---|---|
| 1 | Orden de argumentos `(request, context)` | `SÍ \| NO \| N/A` | |
| 2 | Trigger input leído solo como primer argumento | `SÍ \| NO \| N/A` | |
| 3 | Output primario solo vía `return` | `SÍ \| NO \| N/A` | |
| 4 | Logging vía `context.<nivel>` (no `context.log.<nivel>`) | `SÍ \| NO \| N/A` | |
| 5 | Tipos HTTP estándar Fetch/`undici` | `SÍ \| NO \| N/A` | |

## Dependencias y APIs

-

## Estructura

- Adapter Azure:
- Capability logic preservada:
- Shared resources:
- Legacy residual:

## Archivos modificados

-

## Validaciones

| Check | Resultado | Evidencia |
|---|---|---|

## Desviaciones, riesgos y unknowns

- Desviaciones:
- Riesgos:
- Unknowns:
