# Artifacts de preparación global

## preparation.json

Incluir:

- `schemaVersion`;
- plan ref;
- processed Action IDs;
- `actionResults`;
- changed files;
- validations;
- deviations;
- blockers/review requirements;
- evidence;
- status.

Cada `actionResult` debe conservar el ID del plan y registrar `executionStatus`.

## preparation.md

Usar `../_shared/templates/repository-preparation.template.md`.

No modificar el migration plan para hacer coincidir la ejecución; registrar desviaciones.
