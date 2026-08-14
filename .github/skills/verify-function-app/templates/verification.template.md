# Verificación final de migración

## Resumen

- Final status: `VERIFIED | VERIFIED_WITH_DEBT | BLOCKED | REQUIRES_REVIEW`
- Effective scope:
- Baseline/target:

## Gates

| Gate | Status | Evidencia |
|---|---|---|
| Plan compliance | | |
| Dependencies | | |
| Node.js 24 | | |
| Runtime v4 (minor `v4.25+` confirmado) | | |
| `@azure/functions` en `dependencies` (no `devDependencies`) | | |
| Installation | | |
| Typecheck | | |
| Build global | | |
| Existing tests, si aplican | | |
| Coverage/JUnit, si aplica | | |
| Sonar, si aplica | | |
| Functions | | |
| Programming Model | | |
| Durable, si aplica | | |
| Structural compliance | | |
| Shared resources | | |
| Azure Functions Host local, si aplica | | |
| BEFORE → AFTER | | |

## Action compliance

| Action ID | Required | Execution | Verification |
|---|---|---|---|

## Contrato por Function (BEFORE vs. AFTER)

> Comparación sin reinterpretación: cada fila reusa literalmente la sección "Contrato a preservar" del
> `analysis.json|md` de la Function/slice (Entrada exacta / Salida exacta / Efectos secundarios / Errores
> observables / Invariantes). No usar una sola fila genérica "BEFORE → AFTER" cuando hay múltiples Functions en el
> effective scope.

| Function/Slice | Entrada preservada | Salida preservada | Efectos preservados | Invariantes preservadas | Evidencia |
|---|---|---|---|---|---|

## Checklist mecánico v3 → v4 (verificación agregada)

> Agregado desde los `programming-model-v4.json|md` de cada Function migrada — ver
> `_shared/references/official-sources.md` para el detalle de cada regla.

| Function | Regla 1 (args) | Regla 2 (trigger input) | Regla 3 (return) | Regla 4 (logging) | Regla 5 (HTTP types) |
|---|---|---|---|---|---|

## AFTER

- Plataforma:
- Functions:
- Legacy residual:
- Estructura requerida:

## Reuso de cache/Graphify en esta verificación

> Registrar si se reusó evidencia ya persistida (`analysis.json`, `programming-model-v4.json`, `durable-v4.json`,
> `.migration/_cache/`) para detectar residuales legacy, en vez de releer código o reconsultar Graphify desde cero.

- Evidencia reusada:
- Consultas/lecturas nuevas necesarias (y por qué la evidencia previa no bastó):

## Bloqueos, deuda y unknowns

- Blockers:
- Technical debt:
- Unknowns/review:

## Conclusión

- Resultado:
- Evidencia principal:
- Siguiente acción humana, si corresponde:
