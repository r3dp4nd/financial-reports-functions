# Evaluación de la Function App

## Referencias

- Inventory: `.migration/00-before/inventory.json`
- BEFORE: `.migration/00-before/current-state.md`
- Grafo, si existe: `.migration/00-before/graph/project-graph.json|md`
- Baseline ID/revision:

## Estado

`READY_FOR_ANALYSIS | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Decision

- proceedToAnalysis:
- proceedToPlanning:
- blockingIssues:
- reviewBeforePlanning:
- reviewBeforeExecution:
- validationBeforeVerification:

## Target técnico

> Citar el minor version exacto cuando aplique (`v4.25+` para Runtime), no solo "v4" genérico. Si el Runtime
> detectado es v2/v3, citar el riesgo de EOL explícito (ver `_shared/references/official-sources.md`).

| Dimensión               | Actual | Target | Requisito mínimo oficial | Action status | Evidencia |
|-------------------------|--------|--------|---------------------------|---------------|-----------|
| Node.js                 |        |        | `v18+`                    |               |           |
| Azure Functions Runtime |        |        | `v4.25+`                  |               |           |
| Programming Model       |        |        | `@azure/functions v4.0.0+` en `dependencies` |  |           |
| Durable Functions       |        |        | paquete `durable-functions` `3.x` para v4 |    |           |

## Dependencias que requieren atencion

| Grupo | Package(s) | Motivo | Decision |
|-------|------------|--------|----------|

## Capacidad de validación

- install:
- typecheck:
- build:
- host local:
- tests existentes, si aplican:

| Tooling | Estado | Uso en migración | Review |
|---|---|---|---|
| package scripts | | | |
| tsconfig | | | |
| Jest | | | |
| Coverage/JUnit | | | |
| Sonar | | | |
| CI validation | | | |

## Arquitectura y shared resources

- gaps estructurales transversales:

### Recursos compartidos a coordinar

> Tabla derivada de `assessment.json.sharedResourcesAssessment` — no colapsar en prosa suelta.

| Resource ID | Coordinación necesaria | Motivo |
|---|---|---|

## Functions que requieren análisis

| Prioridad | Function(s) | Motivo |
|-----------|-------------|--------|

## Evidencia externa

> Fuentes oficiales consultadas para esta evaluación (ver `_shared/references/official-sources.md`), citadas cuando
> respaldan una decisión de target o un riesgo (ej. EOL de runtime).

| Fuente | Uso en esta evaluación |
|---|---|

## Riesgos, unknowns y revisión

- Riesgos:
- Unknowns:
- Revisión requerida:
