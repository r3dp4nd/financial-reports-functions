# Artifact de verification

## verification.json

Ruta nueva: `.migration/50-verification/verification.json`.

Incluir:

- `schemaVersion`;
- effective scope;
- target/baseline refs;
- plan compliance;
- verification checks;
- dependency results;
- Node/Runtime results;
- install/typecheck/build results;
- existing-test results solo si aplican;
- Functions/Programming Model/Durable results;
- structural/shared-resource results;
- host-local result cuando aplique;
- legacy residuals;
- debt/optimizations;
- blockers/review requirements;
- final status;
- evidence/provenance.

## verification.md

Usar `../templates/verification.template.md`.

No modificar artifacts previos para obtener un cierre positivo.

Ruta nueva: `.migration/50-verification/verification.md`.
