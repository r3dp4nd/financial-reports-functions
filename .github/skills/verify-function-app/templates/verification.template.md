# Verificación final de migración

## Resumen

- Final status: `VERIFIED | VERIFIED_WITH_DEBT | BLOCKED | REQUIRES_REVIEW`
- Effective scope:
- Baseline/target:

## Gates

Cada gate responde una pregunta binaria concreta sobre el estado AFTER — la lista completa antes de interpretar
qué significa en conjunto (ver "Narrativa de cierre" al final del documento).

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

Con los gates de plataforma ya evaluados, esta tabla confirma que cada Action ID del plan realmente se ejecutó
como se especificó — un gate en verde no sirve de nada si la acción que lo produjo se desvió del plan sin
aprobación.

| Action ID | Required | Execution | Verification |
|---|---|---|---|

## Contrato por Function (BEFORE vs. AFTER)

Este es el gate más importante de todos: ¿el comportamiento observable de cada Function sigue siendo el mismo tras
la migración? Comparación sin reinterpretación — cada fila reusa literalmente la sección "Contrato a preservar" del
`analysis.json|md` de la Function/slice (Entrada exacta / Salida exacta / Efectos secundarios / Errores observables
/ Invariantes). No usar una sola fila genérica "BEFORE → AFTER" cuando hay múltiples Functions en el effective
scope.

| Function/Slice | Entrada preservada | Salida preservada | Efectos preservados | Invariantes preservadas | Evidencia |
|---|---|---|---|---|---|

## Checklist mecánico v3 → v4 (verificación agregada)

Detalle mecánico que respalda el gate "Programming Model" de arriba — agregado desde los
`programming-model-v4.json|md` de cada Function migrada. Ver `_shared/references/official-sources.md` para el
detalle de cada regla.

| Function | Regla 1 (args) | Regla 2 (trigger input) | Regla 3 (return) | Regla 4 (logging) | Regla 5 (HTTP types) |
|---|---|---|---|---|---|

## AFTER

Con todos los gates ya verificados, este es el estado final observado de la Function App — la foto que se compara
directamente contra `current-state.md` (BEFORE) para confirmar que la migración cerró el ciclo completo.

- Plataforma:
- Functions:
- Legacy residual:
- Estructura requerida:

## Reuso de cache/Graphify en esta verificación

Registrar si se reusó evidencia ya persistida (`analysis.json`, `programming-model-v4.json`, `durable-v4.json`,
`.migration/_cache/`) para detectar residuales legacy, en vez de releer código o reconsultar Graphify desde cero.

- Evidencia reusada:
- Consultas/lecturas nuevas necesarias (y por qué la evidencia previa no bastó):

## Bloqueos, deuda y unknowns

- Blockers:
- Technical debt:
- Unknowns/review:

## Narrativa de cierre

Este es el resumen que un arquitecto senior daría al final de una revisión: no una lista de gates, sino una
interpretación de qué significan en conjunto. ¿El sistema está realmente listo para producción, tiene deuda
aceptable que se puede asumir conscientemente, o hay algo que bloquea de verdad? Explicar el resultado combinado en
prosa, no solo repetir el status final como una palabra suelta.

## Conclusión

- Resultado:
- Evidencia principal:
- Siguiente acción humana, si corresponde:
