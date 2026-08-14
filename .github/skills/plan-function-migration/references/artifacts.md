# Artifacts de planning

## Plan global

Owner de:

- target referenciado;
- requested/effective scope;
- workstreams/lanes;
- acciones globales;
- shared resource actions;
- suggested executors;
- orden/dependencies globales;
- evaluation contract para ejecución humana o IA;
- risks/unknowns que afectan ejecución;
- estado del plan.

Usar `../_shared/templates/migration-plan.template.md` para Markdown.

Ruta nueva: `.migration/30-plan/migration-plan.json|md`.

## Plan por Function

Owner de:

- acciones `FN-*`;
- dependencias hacia global/shared;
- aplicabilidad de Programming Model/Durable;
- lane y executor sugerido por acción;
- criterios verificables locales.

Usar `../_shared/templates/function-migration-plan.template.md`.

Ruta nueva: `.migration/30-plan/functions/<FunctionName>/migration-plan.json|md`.

## Plan por slice

Usar cuando el scope natural sea un workflow/capability/shared flow y no una única Function.

Owner de:

- acciones `SLICE-*`;
- participants;
- lane;
- ownership;
- executor sugerido;
- criterios verificables compartidos.

Ruta nueva: `.migration/30-plan/slices/<SliceName>/migration-plan.json|md`.

## Shared resources

Usar `../_shared/templates/shared-resources.template.md` cuando aplique.

No duplicar la acción propietaria dentro de cada Function; referenciarla.

Ruta nueva: `.migration/30-plan/resources/shared-resources.json|md`.

## Evaluation contract

El plan debe ser suficiente para verificar ejecución posterior:

- cada acción tiene expected result;
- cada acción tiene verification/failure criteria;
- cada acción conserva evidence refs;
- execution artifacts deben reportar esos Action IDs sin reinterpretarlos.
