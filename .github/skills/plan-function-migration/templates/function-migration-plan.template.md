# Plan de migración — <FunctionName>

## Referencias

- Analysis: `.migration/20-analysis/functions/<FunctionName>/analysis.json|md` (o slice equivalente)
- Global plan: `.migration/30-plan/migration-plan.json|md`
- BEFORE (catálogo de la Function): `.migration/00-before/functions/<FunctionName>.md`

## Estado y scope

- Status:
- Capability:
- Effective slice:

## Comportamiento a preservar

> Copiado literal de la sección "Contrato a preservar" del `analysis.json|md` de esta Function/slice — nunca
> reinterpretado. `verify-function-app` usará esta misma referencia para comparar AFTER.

- Contratos observables:

## Acciones FN

| Action ID | Lane | Cambio | Executor sugerido | Owner/stage | requiredForMigration | requiredForRefactor | Preserve behavior | Prohibited changes | dependsOn | Criterio verificable |
|---|---|---|---|---|---|---|---|---|---|---|

## Manual de ejecución por acción

> Esta sección es el propósito central del skill: cada acción debe leerse como un manual operativo, ejecutable por
> un dev o QA sin releer el código fuente por su cuenta ni inferir el "cómo". No delegar este contenido únicamente
> al JSON — la vista humana debe ser autosuficiente.

### <Action ID>

**Código antes** (leído del BEFORE, archivo + líneas):

```ts
```

**Código después** (destino):

```ts
```

**Árbol de carpetas antes → después** (cuando aplique):

```text
```

**Comandos exactos** (instalación/desinstalación/build, en orden):

```bash
```

**Pasos numerados**:

1.
2.
3.

**Comando de verificación y resultado esperado literal**:

```bash
```

## Dependencias globales/shared

| Action/Resource | Motivo |
|---|---|

## Arquitectura requerida

- Adapter Azure:
- Capability:
- Infrastructure boundary:
- Shared ownership:

## Programming Model

- Current:
- Target:
- Applicable action:
- Paquete `@azure/functions`: versión actual → versión target (confirmar en `dependencies`, no `devDependencies`)

## Durable

- Applicable:
- Workflow/participants:
- Paquete `durable-functions`: versión actual → versión target (v3→`2.x`, v4→`3.x`; ver `_shared/references/official-sources.md`)
- Llamadas a `DurableClient` API con firma afectada (si el plan incluye un starter/trigger):

| Método | Firma actual | Firma target |
|---|---|---|

## Validación

- checks intermedios seguros:
- gates finales:

## Contrato de evaluación local

| Action ID | Expected result | Preserve behavior | Prohibited changes | Verification criteria | Failure criteria |
|---|---|---|---|---|---|

## Riesgos, unknowns y deuda

- Riesgos:
- Unknowns:
- Debt fuera de alcance:
