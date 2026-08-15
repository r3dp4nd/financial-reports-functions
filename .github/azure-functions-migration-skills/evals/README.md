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
assess-function-app.md
prepare-function-app.md
migrate-and-refactor-function.md
shared-component-and-verification.md
```

