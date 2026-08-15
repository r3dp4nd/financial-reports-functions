# Eval: analyze-function

## Escenario

Function identificada en el assessment global, pero con comportamiento, dependencias o responsabilidades mezcladas todavía insuficientemente comprendidas.

## Prompt

```text
Usa analyze-function para comprender <FunctionName> y producir evidencia previa a cualquier migración o refactor.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/azure-functions/bindings-v4.md`
- `references/configuration/environment-and-bindings.md`
- `references/architecture/function-architecture.md`
- `references/evidence/migration-artifacts.md`
- `references/azure-functions/durable-v4.md` solo si detecta Durable Functions

## Debe producir

`.migration/functions/<function-name>/analysis.md` o salida equivalente con:

- trigger, bindings, entradas, salidas y settings usados;
- flujo funcional observable;
- reglas, side effects y manejo de errores;
- dependencias internas, externas y compartidas;
- separación conceptual mínima;
- escenarios de comportamiento a preservar;
- incertidumbres que requieran evidencia adicional.

## No debe

- mover archivos;
- crear capas o interfaces;
- migrar Programming Model;
- refactorizar;
- inventar reglas de negocio no sustentadas por código o evidencia.
