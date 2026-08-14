# Artifacts de preparación por Function

## preparation.json

Incluir cuando aplique:

- function ref;
- plan ref;
- processed `FN-*`;
- `actionResults`;
- structural changes;
- dependency adaptations;
- shared resource refs;
- validations;
- deviations;
- evidence;
- status.

Ruta nueva: `.migration/40-execution/functions/<FunctionName>/preparation.json`.

## preparation.md

Usar `../templates/function-preparation.template.md`.

No registrar como completada una acción cuyo resultado esperado no pueda observarse.

Ruta nueva: `.migration/40-execution/functions/<FunctionName>/preparation.md`.
