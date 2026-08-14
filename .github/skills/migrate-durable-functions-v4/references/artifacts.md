# Artifacts Durable

Ruta nueva: `.migration/40-execution/workflows/<WorkflowName>/durable-v4.json|md`.

El artifact propietario del workflow debe incluir cuando aplique:

- workflow ID/name;
- participants;
- topology BEFORE/AFTER;
- plan/action refs;
- dependency target;
- changed files;
- `actionResults`;
- determinism evidence;
- active-instance status/risk;
- validations;
- legacy residuals;
- deviations;
- blockers/review requirements;
- status.

Usar `../templates/durable-migration.template.md` para la vista humana.
