# Artifacts de analysis

## analysis.json

Owner de la interpretación técnica de una Function o slice.

Incluir cuando aplique:

- `function` o `slice`;
- `capability`;
- `status`;
- `analyzedSlice`;
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

## Catálogo BEFORE

Usar `../_shared/templates/function-current-state.template.md`.

No sobrescribirlo con AFTER.
