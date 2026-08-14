---
name: run-migration-checks
description: Ejecuta checks de validación aprobados o seguros para una migración manual sin modificar código. Úsalo después de cambios humanos para correr install, typecheck, build, tests existentes o coverage según plan y tooling observable, registrando resultados en artifacts de ejecución.
---

# Run Migration Checks

## Objetivo

Ejecutar validaciones deterministas para cambios manuales sin corregir código.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/references/manual-execution.md`
- `../../_shared/references/validation-tooling.md`
- `../../_shared/references/artifact-layout.md`

## Entradas

- Action ID, scope o plan.
- Tooling observable.
- Confirmación implícita para comandos locales seguros.

## Workflow

1. Leer plan y validation criteria.
2. Determinar comandos permitidos.
3. No ejecutar comandos que requieran secretos o entorno externo.
4. Ejecutar checks en orden seguro.
5. Capturar status, salida relevante y evidencias.
6. Escribir artifact de check run.

## Salidas

- `.migration/40-execution/checks/<Scope>.json`
- `.migration/40-execution/checks/<Scope>.md`

Usar `../../_shared/templates/check-run.template.md`.

## No hacer

- modificar source/config/tests;
- instalar tooling no aprobado;
- ejecutar Sonar/host local si requiere secretos;
- cambiar tests;
- marcar Action IDs como completados.
