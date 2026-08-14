# Artifacts de discovery

## inventory.json

Owner de los hechos estructurados BEFORE.

Debe incluir cuando aplique:

- `schemaVersion`;
- repository y Function Apps;
- platform observable;
- dependencies;
- Functions;
- triggers y bindings;
- configuration keys;
- relationships observables;
- architecture observations;
- patterns relevantes;
- shared resource candidates;
- protected files detected;
- warnings;
- unknowns;
- evidence/provenance.

No incluir:

- recomendaciones;
- target versions elegidas en discovery;
- acciones;
- migration plan;
- refactors.

## current-state.md

Usar `../_shared/templates/current-state.template.md`.

Representa exclusivamente BEFORE y no debe mutarse para describir AFTER.

## Catálogo por Function

Usar `../_shared/templates/function-current-state.template.md` cuando exista evidencia suficiente.

Debe documentar comportamiento y dependencias observables sin convertir análisis posterior en hechos retroactivos.
