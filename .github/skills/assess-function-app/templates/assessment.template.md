# Evaluación de la Function App

## Referencias

- Inventory: `.migration/00-before/inventory.json`
- BEFORE: `.migration/00-before/current-state.md`
- Grafo, si existe: `.migration/00-before/graph/project-graph.json|md`
- Baseline ID/revision:

## Estado

`READY_FOR_ANALYSIS | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Decision

Esta es la decisión ejecutiva de todo el documento: ¿el proyecto avanza a análisis/planning, se bloquea, o requiere
más evidencia antes de seguir? Las secciones siguientes existen para respaldar esta decisión con evidencia, no al
revés — léelas como el porqué, no como el qué.

- proceedToAnalysis:
- proceedToPlanning:
- blockingIssues:

Cada punto de revisión de abajo debe explicar la consecuencia de decidir mal, no solo qué revisar.

| Punto de revisión | Consecuencia de decidir mal |
|---|---|

- reviewBeforePlanning:
- reviewBeforeExecution:
- validationBeforeVerification:

## Target técnico

Con la decisión ya planteada, esta tabla es su respaldo más directo: qué tan lejos está el repositorio hoy de la
plataforma objetivo, y con qué requisito oficial exacto se compara — no basta con decir "necesita v4", el detalle
del minor version determina si hay riesgo de soporte inmediato.

> Citar el minor version exacto cuando aplique (`v4.25+` para Runtime), no solo "v4" genérico. Si el Runtime
> detectado es v2/v3, citar el riesgo de EOL explícito (ver `_shared/references/official-sources.md`).

| Dimensión               | Actual | Target | Requisito mínimo oficial | Action status | Evidencia |
|-------------------------|--------|--------|---------------------------|---------------|-----------|
| Node.js                 |        |        | `v18+`                    |               |           |
| Azure Functions Runtime |        |        | `v4.25+`                  |               |           |
| Programming Model       |        |        | `@azure/functions v4.0.0+` en `dependencies` |  |           |
| Durable Functions       |        |        | paquete `durable-functions` `3.x` para v4 |    |           |

## Dependencias que requieren atencion

El gap de plataforma de arriba casi siempre viene acompañado de dependencias que deben actualizarse en conjunto —
esta tabla agrupa cuáles bloquean el avance, cuáles solo requieren análisis de impacto, y cuáles son informativas.

| Grupo | Package(s) | Motivo | Decision |
|-------|------------|--------|----------|

## Capacidad de validación

Antes de aprobar cualquier cambio, conviene saber con qué red de seguridad se cuenta hoy para confirmar que nada se
rompió — esto determina qué tan a ciegas se estaría ejecutando la migración.

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

Más allá de versiones y tooling, esta sección evalúa si la estructura interna del repositorio puede sostener una
migración segura — gaps transversales de organización y recursos compartidos sin ownership claro son el tipo de
riesgo que no se ve en una tabla de versiones, pero que puede complicar cualquier acción posterior.

- gaps estructurales transversales:

### Recursos compartidos a coordinar

Un recurso sin ownership definido es, en la práctica, un recurso que cualquier acción futura puede romper sin
darse cuenta de que afecta a otro consumidor. Tabla derivada de `assessment.json.sharedResourcesAssessment` — no
colapsar en prosa suelta.

| Resource ID | Coordinación necesaria | Motivo |
|---|---|---|

## Functions que requieren análisis

Con la arquitectura y los shared resources ya evaluados, esta tabla traduce ese panorama en la agenda concreta de
`analyze-function`: qué Functions o slices merecen análisis profundo primero, y por qué.

| Prioridad | Function(s) | Motivo |
|-----------|-------------|--------|

## Evidencia externa

Cuando una decisión de arriba se apoyó en una fuente oficial (por ejemplo el riesgo de EOL del runtime), esta tabla
deja la referencia exacta para que cualquiera pueda verificarla sin tener que confiar solo en la palabra de este
documento.

| Fuente | Uso en esta evaluación |
|---|---|

## Riesgos, unknowns y revisión

Cierre del documento: qué de todo lo anterior es un riesgo real si se ignora, qué preguntas siguen sin respuesta, y
qué requiere aprobación humana explícita antes de que planning convierta esto en acciones.

- Riesgos:
- Unknowns:
- Revisión requerida:
