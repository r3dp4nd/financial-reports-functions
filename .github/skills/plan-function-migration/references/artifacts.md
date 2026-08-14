# Artifacts de planning

## Plan global

Owner de:

- target referenciado;
- requested/effective scope;
- acciones globales;
- shared resource actions;
- orden/dependencies globales;
- risks/unknowns que afectan ejecución;
- estado del plan.

Usar `../_shared/templates/migration-plan.template.md` para Markdown.

## Plan por Function

Owner de:

- acciones `FN-*`;
- dependencias hacia global/shared;
- aplicabilidad de Programming Model/Durable;
- criterios verificables locales.

Usar `../_shared/templates/function-migration-plan.template.md`.

## Shared resources

Usar `../_shared/templates/shared-resources.template.md` cuando aplique.

No duplicar la acción propietaria dentro de cada Function; referenciarla.
