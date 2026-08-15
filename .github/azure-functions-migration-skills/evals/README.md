# Evals del toolkit

## Propósito

Validar que las skills producen evidencia útil, respetan el alcance y cargan solo las referencias necesarias.

Estos evals no son tests automáticos obligatorios. Son escenarios de revisión para ejecutar con un agente o usar como checklist durante cambios del toolkit.

## Criterios generales

Todo eval debe comprobar:

- no se leen ni registran secretos;
- no se introducen cambios funcionales;
- no se crean capas, interfaces o archivos sin uso inmediato;
- se reutiliza `.migration/` cuando existe;
- las referencias cargadas corresponden a la skill y al caso;
- se declaran bloqueos, riesgos, deuda e incógnitas sin convertirlos en trabajo automático.

## Evals disponibles

```text
skills/assess-function-app/evals/assess-function-app.md
skills/prepare-function-app/evals/prepare-function-app.md
skills/analyze-function/evals/analyze-function.md
skills/migrate-function/evals/migrate-function.md
skills/refactor-function/evals/refactor-function.md
skills/migrate-shared-component/evals/migrate-shared-component.md
skills/test-function/evals/test-function.md
skills/verify-function-app/evals/verify-function-app.md
```
