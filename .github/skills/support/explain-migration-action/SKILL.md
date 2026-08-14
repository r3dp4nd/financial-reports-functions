---
name: explain-migration-action
description: Explica un Action ID de migration plan para un dev humano sin modificar archivos. Úsalo cuando el usuario quiera entender qué hacer, por qué existe la acción, qué preservar, qué no tocar, riesgos y criterios de verificación antes de ejecutar manualmente una migración o refactor.
---

# Explain Migration Action

## Objetivo

Traducir un Action ID del plan en explicación accionable para un dev humano.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/references/manual-execution.md`
- `../../_shared/references/artifact-layout.md`

## Entradas

- Action ID.
- `.migration/30-plan/migration-plan.json`.
- Plan Function/slice y analysis cuando el Action ID lo referencie.

## Workflow

1. Localizar el Action ID.
2. Leer solo artifacts referenciados por la acción.
3. Explicar objetivo, rationale, owner, lane, dependencies y executor sugerido.
4. Enumerar archivos probables y evidencia.
5. Resumir `preserveBehavior` y `prohibitedChanges`.
6. Resumir criterios de verificación y fallo.
7. Listar riesgos, unknowns y preguntas humanas.

## Salidas

Respuesta en conversación. No requiere artifact salvo que el usuario lo pida.

## No hacer

- modificar archivos;
- crear Action IDs;
- cambiar el plan;
- proponer cambios fuera de scope;
- ocultar unknowns.
