# Migración Durable — <WorkflowName>

## Referencias

- Global plan: `.migration/30-plan/migration-plan.json|md`
- Function plans: `.migration/30-plan/functions/<FunctionName>/migration-plan.json|md`
- Analyses de los participantes: `.migration/20-analysis/slices/<SliceName>/analysis.json|md`
- BEFORE topology: `.migration/00-before/current-state.md`

## Estado

`MIGRATED | NOT_APPLICABLE | BLOCKED | REQUIRES_REVIEW`

## Participantes y topology

| Rol | Function/handler | Before | After |
|---|---|---|---|

## Versión del paquete `durable-functions`

> Ver mapeo oficial en `_shared/references/official-sources.md`: Programming Model v3 ↔ paquete `2.x`;
> Programming Model v4 ↔ paquete `3.x`. No asumir que migrar el Programming Model migra automáticamente este paquete.

- Antes:
- Después:

## Action results

| Action ID | Execution status | Resultado | Evidencia |
|---|---|---|---|

## Llamadas a `DurableClient` API con firma afectada

> Ver tabla completa de métodos (`getStatus`, `startNew`, `raiseEvent`, etc.) en
> `_shared/references/official-sources.md`. Cada llamada del starter/trigger a `df.getClient(context)` debe
> verificarse contra la firma v4 (objeto de opciones, no argumentos posicionales).

| Método | Firma antes (posicional) | Firma después (options object) | Archivo | Evidencia |
|---|---|---|---|---|

## Llamadas a `callHttp` (si el orchestrator las usa)

| Parámetro v3 | Parámetro v4 | Actualizado |
|---|---|---|
| `uri` | `url` | `SÍ \| NO \| N/A` |
| `content` | `body` | `SÍ \| NO \| N/A` |
| `asynchronousPatternEnabled` | `enablePolling` | `SÍ \| NO \| N/A` |

## Semántica preservada

- Orchestrator determinism:
- Activities:
- Retries/timers:
- Events/entities/sub-orchestrators:

## Active instances

- Estado conocido:
- Riesgo/revisión:

## Validaciones

| Check | Resultado | Evidencia |
|---|---|---|

## Desviaciones, riesgos y unknowns

- Desviaciones:
- Riesgos:
- Unknowns:
