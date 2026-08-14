# Artifacts de assessment

## assessment.json

Owner del gap global frente al target.

Ruta nueva: `.migration/10-assessment/assessment.json`.

Campos esperados cuando apliquen:

- `schemaVersion`;
- `baselineRef`;
- `target`;
- `decision`;
- `technicalDimensions`;
- `dependencyAssessment`;
- `dependencyAttention`;
- `toolingAssessment`;
- `validationCapability`;
- `structuralObservations`;
- `sharedResourcesAssessment`;
- `functionsRequiringAnalysis`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `externalEvidence`;
- `status`.

No incluir Action IDs ni cambios ejecutados.

Evitar duplicar inventario completo. Referenciar `inventory.json` y `current-state.md` para facts extensos.

## assessment.md

Usar `../_shared/templates/assessment.template.md` como vista humana compacta.

Debe abrir con decision/gates y dejar el detalle estructurado para `assessment.json`.

No modificar BEFORE.

Ruta nueva: `.migration/10-assessment/assessment.md`.
