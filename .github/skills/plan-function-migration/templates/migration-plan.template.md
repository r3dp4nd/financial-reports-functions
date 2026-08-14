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

- Technical migration lane:
- Refactor/testability lane:
- Puede ejecutar IA:
- Requiere humano:
- Review antes de ejecución:

## Target técnico

| Dimensión | Actual | Target aprobado | Requisito mínimo oficial |
|---|---|---|---|
| Node.js | | | `v18+` (piso oficial v4); target del proyecto según `_shared/dependency-baseline.json` |
| Azure Functions Runtime | | | `v4.25+` — versión `v4` genérica no es suficiente |
| Programming Model | | | `@azure/functions` `v4.0.0+`, **en `dependencies`**, no `devDependencies` |
| Durable Functions | | | paquete `durable-functions` `3.x` para Programming Model v4 (ver mapeo en `_shared/references/official-sources.md`) |

## Workstreams

| Lane | Objetivo | Scope | Estado |
|---|---|---|---|

## Acciones globales

> Esta es la única fuente de verdad para instalación/actualización de herramientas y ownership de recursos
> compartidos. Cada acción debe incluir comandos exactos — no repetirlos en cada plan de Function, solo referenciar
> el Action ID.

### <GLOBAL Action ID>

- Lane / Cambio / Executor sugerido / requiredForMigration / Preserve behavior / Prohibited changes / dependsOn:
- Comandos exactos de instalación/desinstalación:

```bash
```

- Criterio verificable:

## Recursos compartidos

| Resource ID | Owner action | Lane | Executor sugerido | Consumidores | Dependencias |
|---|---|---|---|---|---|

## Functions

| Function/Slice | Plan | Lane principal | Executor sugerido | Programming Model action | Durable action | Estado |
|---|---|---|---|---|---|---|

## Orden

1.
2.
3.

## Build y verificación final

- Build global después de completar todas las Functions.
- Otros gates obligatorios:

## Contrato de evaluación

| Action ID | Expected result | Preserve behavior | Prohibited changes | Verification criteria | Failure criteria |
|---|---|---|---|---|---|

## Riesgos, unknowns y deuda

- Riesgos:
- Unknowns:
- Technical debt no obligatoria:
