---
name: suggest-code-change
description: Sugiere cambios de código para un Action ID en formato Markdown o diff sin aplicarlos. Úsalo cuando el dev quiera una propuesta concreta de implementación respetando migration plan, arquitectura objetivo, behavior a preservar y cambios prohibidos, manteniendo a la IA como consultor.
---

# Suggest Code Change

## Objetivo

Proponer una implementación concreta sin modificar archivos.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/architecture-policy.md`
- `../../_shared/references/manual-execution.md`
- `../../_shared/references/architecture-examples.md`
- `../../_shared/references/validation-tooling.md`

## Entradas

- Action ID.
- Plan y analysis correspondientes.
- Archivos relevantes o permiso para leerlos.

## Workflow

1. Validar Action ID y scope.
2. Leer archivos relevantes mínimos.
3. Preparar propuesta en `diff` Markdown o pasos concretos.
4. Explicar por qué el cambio cumple el plan.
5. Incluir preserve/prohibited changes y checks.
6. Escribir artifact si el usuario lo pide.

## Salidas

- Respuesta en conversación.
- Opcional: `.migration/40-execution/suggestions/<ActionId>.md`.

Usar `../../_shared/templates/code-suggestion.template.md` cuando se emita artifact.

## No hacer

- usar `apply_patch`;
- modificar source/config/tests;
- ejecutar comandos;
- inventar comportamiento;
- omitir riesgos.
