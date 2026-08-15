# Eval: prepare-function-app

## Escenario

Repositorio con assessment disponible. El tooling TypeScript/Jest/Sonar puede faltar, estar incompleto o estar presente con convenciones distintas.

## Prompt

```text
Usa prepare-function-app para preparar TypeScript, Jest, coverage, Sonar y scripts npm sin migrar Functions ni cambiar comportamiento.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/tooling/typescript-build-scripts.md`
- `references/testing/jest.md` si Jest/testing forma parte del objetivo
- `references/quality/sonar.md` si Sonar forma parte del objetivo
- `references/configuration/environment-and-bindings.md` si hay settings/local settings
- `references/dependencies/dependency-strategy.md` si modifica dependencias o lockfile
- `references/evidence/migration-artifacts.md`

## Debe producir

`.migration/preparation.md` o salida equivalente con:

- archivos globales creados/actualizados;
- scripts agregados o preservados;
- configuración TypeScript base/prod/spec;
- configuración Jest/coverage y Sonar;
- settings necesarios para local, solo por nombre;
- cambios pospuestos y razón;
- validaciones ejecutadas.

## No debe

- migrar Programming Model;
- refactorizar Functions;
- actualizar dependencias a `latest` sin estrategia;
- copiar valores de `local.settings.json`;
- crear excepciones de coverage que oculten comportamiento real.

