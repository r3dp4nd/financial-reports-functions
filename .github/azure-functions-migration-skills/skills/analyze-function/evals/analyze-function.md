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
- `references/architecture/naming-and-coverage.md` si propone naming, cobertura o exclusiones
- `references/architecture/di-and-composition.md` si propone puertos, factories o composición
- `references/architecture/capability-slicing.md` si detecta servicio monolítico o god file
- `references/infrastructure/exceljs-document-generation.md` si detecta ExcelJS, streams o templates de reporte
- `references/infrastructure/cosmos-mongo-persistence.md` si detecta Cosmos DB, MongoDB, queries o cursors
- `references/evidence/migration-artifacts.md`
- `references/evidence/artifact-contracts.md` solo si necesita detalle completo de `analysis.md`
- `references/azure-functions/durable-v4.md` solo si detecta Durable Functions

## Debe producir

`.migration/functions/<function-name>/analysis.md` o salida equivalente con:

- trigger, bindings, entradas, salidas y settings usados;
- flujo funcional observable;
- reglas, side effects y manejo de errores;
- dependencias internas, externas y compartidas;
- mapa de slicing por capability cuando aplique;
- smells de persistencia/query cuando aplique;
- smells de generación Excel/CSV cuando aplique;
- separación conceptual mínima;
- escenarios de comportamiento a preservar;
- incertidumbres que requieran evidencia adicional.

## No debe

- mover archivos;
- crear capas o interfaces;
- migrar Programming Model;
- refactorizar;
- inventar reglas de negocio no sustentadas por código o evidencia.
