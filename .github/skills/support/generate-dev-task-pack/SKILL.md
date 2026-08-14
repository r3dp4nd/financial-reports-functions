---
name: generate-dev-task-pack
description: Genera un paquete de trabajo Markdown para devs humanos a partir de uno o varios Action IDs aprobados, sin modificar código. Úsalo para convertir migration plan en checklist, archivos candidatos, comandos, criterios de done, riesgos y PR description dentro de la ejecución manual asistida.
---

# Generate Dev Task Pack

## Objetivo

Crear un task pack humano para ejecutar manualmente Action IDs del plan.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/references/manual-execution.md`
- `../../_shared/references/artifact-layout.md`

## Entradas

- Uno o varios Action IDs.
- `.migration/30-plan/migration-plan.json`.
- Planes Function/slice y analyses requeridos.

## Workflow

1. Validar que todos los Action IDs existan.
2. Resolver dependencias entre acciones.
3. Agrupar por owner cuando el task pack combine acciones.
4. Extraer archivos candidatos, preserve/prohibited changes y checks.
5. Crear checklist ordenado y criterios de done.
6. Crear PR description sugerida.
7. Escribir task pack Markdown.

## Salidas

- `.migration/40-execution/dev-tasks/<ActionId>.md` para una acción.
- `.migration/40-execution/dev-tasks/<Scope>.md` para grupo de acciones.

Usar `../../_shared/templates/dev-task-pack.template.md`.

## No hacer

- modificar source;
- crear Action IDs;
- cambiar plan;
- ejecutar comandos;
- generar tests.
