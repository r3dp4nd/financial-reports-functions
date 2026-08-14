# Artifacts de analysis

## analysis.json

Owner de la interpretación técnica de una Function o slice.

Ruta nueva:

- Function: `.migration/20-analysis/functions/<FunctionName>/analysis.json`;
- slice: `.migration/20-analysis/slices/<SliceName>/analysis.json`.

Incluir cuando aplique:

- `function` o `slice`;
- `capability`;
- `status`;
- `analyzedSlice`;
- `narrative` (`functional` y `technical`, siguiendo la regla de trazabilidad: deben derivarse de hechos ya documentados en `behavior`/`dependencyImpact`/evidencia de este mismo analysis o del BEFORE referenciado, nunca introducir un hecho nuevo no respaldado);
- `criticality`;
- `testability`;
- `behavior`;
- `configuration`;
- `dependencies` y `dependencyImpact`;
- `sharedResources`;
- `currentStructure`;
- `structuralNeeds`;
- `relationships`;
- `affectedFunctionsOutsideScope`;
- `legacyCoupling`;
- `node24`;
- `programmingModel`;
- `durable`;
- `migrationNeeds`;
- `refactorTestabilityNeeds`;
- `recommendedLane`;
- `technicalDebt`;
- `optimizations`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

No incluir actions definitivas ni orden de ejecución.

## analysis.md

Usar `../_shared/templates/function-analysis.template.md`.

Rutas nuevas equivalentes a `analysis.json`.

## Catálogo BEFORE

Usar `../_shared/templates/function-current-state.template.md`.

No sobrescribirlo con AFTER.

Ruta nueva: `.migration/00-before/functions/<FunctionName>.md`.
