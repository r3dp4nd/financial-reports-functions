# Eval: migrate-shared-component y verify-function-app

## Escenario

Repositorio con varios consumidores de un componente compartido y evidencias previas de assessment, migración, refactor y tests.

## Prompt de componente compartido

```text
Usa migrate-shared-component para migrar este componente compartido identificando consumidores, contrato, settings y verificaciones.
```

## Prompt de verificación

```text
Usa verify-function-app para comprobar convergencia final de la Function App.
```

## Debe cargar para componente compartido

- `principles/copilot-rules.md`
- `references/dependencies/dependency-strategy.md` cuando cambie SDK/dependencia
- `references/architecture/function-architecture.md`
- `references/configuration/environment-and-bindings.md`
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`

## Debe cargar para verificación

- `principles/copilot-rules.md`
- `references/azure-functions/platform-target.md`
- `references/azure-functions/programming-model-v4.md`
- `references/azure-functions/bindings-v4.md`
- `references/configuration/environment-and-bindings.md`
- `references/testing/jest.md`
- `references/quality/sonar.md` si aplica
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`
- `references/azure-functions/durable-v4.md` solo si aplica

## Debe producir

Para componente compartido:

- consumidores;
- contrato preservado;
- settings compartidos, solo por nombre;
- impacto por consumidor;
- validaciones.

Para verificación:

- inventario inicial vs final;
- Runtime/Programming Model/Node/dependencias;
- Functions, triggers, bindings y settings;
- build, tests, coverage y LCOV;
- artefactos legacy pendientes;
- deuda, bloqueos, desviaciones e incógnitas.

## No debe

- ocultar fallos de validación;
- declarar éxito si una comprobación requerida no corrió;
- leer secretos;
- corregir silenciosamente problemas arquitectónicos grandes durante la verificación.

