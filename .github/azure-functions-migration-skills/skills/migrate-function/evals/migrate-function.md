# Eval: migrate-function

## Escenario

Function comprendida con análisis previo. Puede estar en Programming Model v3, v4 parcial o Durable. Tiene handler, bindings, settings, dependencias y comportamiento observable.

## Prompt

```text
Usa migrate-function para migrar <FunctionName> a Programming Model v4 preservando trigger, bindings, settings y comportamiento.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/azure-functions/programming-model-v4.md`
- `references/azure-functions/bindings-v4.md`
- `references/configuration/environment-and-bindings.md`
- `references/evidence/migration-artifacts.md`
- `references/evidence/artifact-contracts.md` solo si necesita detalle completo de `migration.md`
- `references/azure-functions/durable-v4.md` solo si aplica

## Debe producir

Artefactos bajo `.migration/functions/<function-name>/` con:

- equivalencia de trigger, bindings y settings;
- adaptaciones obligatorias al Programming Model v4;
- cambios realizados y archivos tocados;
- validaciones incrementales;
- deuda o mejoras futuras fuera de alcance.

## No debe

- cambiar reglas de negocio;
- mezclar refactor amplio dentro de la migración técnica;
- crear carpetas o interfaces vacías;
- mover lógica no determinista dentro de Durable orchestrators;
- tratar un componente compartido como propiedad de una sola Function.
