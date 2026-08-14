---
name: review-manual-migration
description: Revisa cambios manuales de migración contra Action IDs del plan sin corregir código. Úsalo para analizar git diff, artifacts de checks y BEFORE/PLAN, detectando scope creep, behavior roto, verification faltante y recomendando READY, NEEDS_FIX, REQUIRES_REVIEW o BLOCKED.
---

# Review Manual Migration

## Objetivo

Revisar cambios hechos por humano contra el plan de migración.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/architecture-policy.md`
- `../../_shared/references/manual-execution.md`
- `../../_shared/references/artifact-layout.md`

## Entradas

- Action IDs o scope.
- Git diff o archivos modificados.
- Plan, BEFORE/analysis y check artifacts cuando existan.

## Workflow

1. Leer Action IDs y criterios.
2. Inspeccionar diff enfocado.
3. Comparar cambios contra expected result.
4. Detectar cambios fuera de plan.
5. Revisar preserve/prohibited changes.
6. Revisar checks ejecutados/faltantes.
7. Emitir recomendación.
8. Escribir review artifact si se pide o si hay Action ID.

## Salidas

- `.migration/40-execution/reviews/<Scope>.json`
- `.migration/40-execution/reviews/<Scope>.md`

Usar `./templates/manual-review.template.md`.

## No hacer

- corregir código;
- modificar plan;
- aprobar cambios sin evidencia;
- ignorar cambios fuera de scope;
- ejecutar comandos salvo que el usuario lo pida explícitamente.
