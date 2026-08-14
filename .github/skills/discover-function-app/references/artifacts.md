# Artifacts de discovery

## inventory.json

Owner de los hechos estructurados BEFORE.

Ruta nueva: `.migration/00-before/inventory.json`.

Debe incluir cuando aplique:

- `schemaVersion`;
- repository y Function Apps;
- platform observable;
- dependencies (cada entrada incluye `usageDetected: true|false|null`, calculado de forma determinista por el script buscando el nombre del paquete en imports/requires del código fuente no protegido; `null` cuando no hay archivos de source escaneables para decidir);
- Functions;
- triggers y bindings;
- configuration keys;
- relationships observables;
- architecture observations;
- compact Mermaid diagram when relationships are sufficient;
- optional project graph summary and refs when Graphify/indexer was used;
- initial criticality and testability signals when directly observable;
- patterns relevantes;
- shared resource candidates;
- protected files detected, incluyendo `provider` cuando la categoría sea `CI_CD` (`GITHUB_ACTIONS`, `AZURE_DEVOPS`, `GITLAB_CI`, `JENKINS`, `BITBUCKET`, `UNKNOWN`);
- `ciCdProviders` como resumen agregado de proveedores CI/CD detectados en el repositorio;
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

Ruta nueva: `.migration/00-before/current-state.md`.

Si se usó Graphify/indexer, referenciar el grafo como evidencia auxiliar y resumir solo slices/relaciones útiles.

## project-graph.json / project-graph.md

Artifacts opcionales cuando se use Graphify o indexador equivalente.

Ruta nueva: `.migration/00-before/graph/project-graph.json|md`.

No reemplazan `inventory.json`; solo aceleran relaciones, slices, criticidad inicial y señales de testabilidad.

## Catálogo por Function

Usar `../_shared/templates/function-current-state.template.md` cuando exista evidencia suficiente.

Debe documentar comportamiento y dependencias observables sin convertir análisis posterior en hechos retroactivos.

Ruta nueva: `.migration/00-before/functions/<FunctionName>.md`.
