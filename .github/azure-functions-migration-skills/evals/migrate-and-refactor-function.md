# Eval: migrate-function y refactor-function

## Escenario

Function comprendida con análisis previo. Puede estar en Programming Model v3, v4 parcial o Durable. Tiene handler, bindings, settings, dependencias y comportamiento observable.

## Prompt de migración

```text
Usa migrate-function para migrar <FunctionName> a Programming Model v4 preservando trigger, bindings, settings y comportamiento.
```

## Prompt de refactor

```text
Usa refactor-function para ordenar <FunctionName> por capability, DI, application, domain e infrastructure sin cambiar comportamiento.
```

## Debe cargar para migración

- `principles/copilot-rules.md`
- `references/azure-functions/programming-model-v4.md`
- `references/azure-functions/bindings-v4.md`
- `references/configuration/environment-and-bindings.md`
- `references/azure-functions/durable-v4.md` solo si aplica
- `references/evidence/migration-artifacts.md`

## Debe cargar para refactor

- `principles/copilot-rules.md`
- `references/architecture/function-architecture.md`
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`

## Debe producir

Artefactos bajo `.migration/functions/<function-name>/` con:

- equivalencia de bindings y settings;
- adaptaciones obligatorias;
- estructura/naming aplicados;
- DI aplicada o descartada con razón;
- validaciones incrementales;
- deuda o mejoras futuras fuera de alcance.

## No debe

- cambiar reglas de negocio;
- mezclar refactor amplio dentro de la migración técnica;
- crear carpetas o interfaces vacías;
- mover lógica no determinista dentro de Durable orchestrators;
- tratar un componente compartido como propiedad de una sola Function.

