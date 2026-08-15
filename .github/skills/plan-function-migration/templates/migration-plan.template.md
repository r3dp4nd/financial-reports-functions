# Plan global de migración

## Referencias

- Inventory: `.migration/00-before/inventory.json`
- Assessment: `.migration/10-assessment/assessment.json`
- Baseline: `_shared/dependency-baseline.json`

## Estado y scope

- Status: `READY | PARTIAL | BLOCKED`
- Requested scope:
- Effective scope:

## Decision de ejecución

Antes de cualquier acción, esta decisión resume si el proyecto puede avanzar a ejecución tal cual, o si hay
condiciones humanas que resolver primero — todo lo que sigue en este documento es el respaldo de esa decisión.

- Technical migration lane:
- Refactor/testability lane:
- Puede ejecutar IA:
- Requiere humano:
- Review antes de ejecución:

## Target técnico

Tabla de referencia rápida: a qué versión/requisito oficial exacto debe llegar cada dimensión de la plataforma —
el mismo target que cada plan por Function citará al migrar su Programming Model/Durable.

| Dimensión | Target aprobado | Requisito mínimo oficial |
|---|---|---|
| Node.js | | `v18+` |
| Azure Functions Runtime | | `v4.25+` |
| Programming Model | | `@azure/functions v4.0.0+` en `dependencies` |
| Durable Functions | | paquete `durable-functions` `3.x` para PM v4 |

## Workstreams

| Lane | Objetivo | Scope | Estado |
|---|---|---|---|

## Acciones globales (`GLOBAL-*`)

Esta es la única fuente de verdad para instalación/actualización de herramientas y ownership de recursos
compartidos — cada plan por Function referencia estos Action IDs por `dependsOn`, sin repetir los comandos aquí
descritos.

### <GLOBAL Action ID>

**Comandos exactos de instalación/desinstalación**:

```bash
```

**Preserve behavior / Prohibited changes / dependsOn / Criterio verificable**:

## Recursos compartidos (`SR-ACTION-*`)

Un recurso usado por varias Functions necesita una única acción propietaria que decida su ownership — nunca
duplicada en cada plan por Function que lo consume; solo referenciada.

| Resource ID | Owner action | Lane | Executor sugerido | Consumidores | Dependencias |
|---|---|---|---|---|---|

## Functions

Vista general de todas las Functions/slices del effective scope, con su plan individual — el detalle ejecutable
de cada una vive en su propio `migration-plan.md` por Function, no aquí.

| Function/Slice | Plan | Lane principal | Executor sugerido | Programming Model action | Durable | Estado |
|---|---|---|---|---|---|---|

## Orden

Secuencia recomendada de ejecución, respetando las dependencias `GLOBAL-*` → `SR-ACTION-*` → `FN-*` ya
establecidas arriba.

1.
2.
3.

## Build y verificación final

- Build global después de completar todas las Functions.
- Otros gates obligatorios:

## Contrato de evaluación

Tabla que conecta cada acción global con su criterio de éxito/fracaso — la misma que `verify-function-app` usará
para el cierre AFTER.

| Action ID | Expected result | Preserve behavior | Prohibited changes | Verification criteria | Failure criteria |
|---|---|---|---|---|---|

## Riesgos, unknowns y deuda

- Riesgos:
- Unknowns:
- Technical debt no obligatoria:
