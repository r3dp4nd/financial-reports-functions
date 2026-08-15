# Eval: verify-function-app

## Escenario

Repositorio con evidencias previas de assessment, preparación, análisis, migración, refactor, componentes compartidos y tests.

## Prompt

```text
Usa verify-function-app para comprobar convergencia final de la Function App.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/azure-functions/platform-target.md`
- `references/azure-functions/programming-model-v4.md`
- `references/azure-functions/bindings-v4.md`
- `references/configuration/environment-and-bindings.md`
- `references/testing/jest.md`
- `references/quality/sonar.md` si aplica
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`
- `references/evidence/artifact-contracts.md` solo si necesita detalle completo de `verification.md`
- `references/azure-functions/durable-v4.md` solo si aplica

## Debe producir

`.migration/verification.md` o salida equivalente con:

- inventario inicial vs final;
- Runtime, Programming Model, Node.js y dependencias;
- Functions, triggers, bindings y settings;
- build, tests, coverage y LCOV;
- artefactos legacy pendientes;
- deuda, bloqueos, desviaciones e incógnitas.

## No debe

- ocultar fallos de validación;
- declarar éxito si una comprobación requerida no corrió;
- leer secretos;
- corregir silenciosamente problemas arquitectónicos grandes durante la verificación;
- reabrir análisis ya cubiertos por evidencia vigente salvo que exista contradicción.
