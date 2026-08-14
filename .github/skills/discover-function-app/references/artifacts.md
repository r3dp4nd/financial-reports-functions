# Artifacts de discovery

## inventory.json

Owner de los hechos estructurados BEFORE.

Ruta nueva: `.migration/00-before/inventory.json`.

Debe incluir cuando aplique:

- `schemaVersion`;
- repository y Function Apps;
- platform observable (incluyendo `platform.node`: `CONFIRMED` cuando existe `package.json.engines.node`; si no existe, se infiere de forma determinista a partir de la versión mayor de `@types/node` declarada en `dependencies`/`devDependencies`, quedando siempre `INFERRED` con `evidence: [{ type: "TYPES_NODE_MAJOR", package: "@types/node", range: ... }]`, ya que es una convención de la comunidad, no una garantía; sin ninguna de las dos señales, `platform.node` queda `UNKNOWN`);
- dependencies (cada entrada incluye `usageDetected: true|false|null`, calculado de forma determinista por el script buscando el nombre del paquete en imports/requires del código fuente no protegido; `null` cuando no hay archivos de source escaneables para decidir);
- Functions;
- triggers y bindings;
- configuration keys (cada entrada incluye `sources[]` con el origen de la evidencia — `SOURCE_CODE` cuando la clave se lee vía `process.env` en el código; `FUNCTION_JSON_BINDING` cuando la clave solo aparece declarada en `connection`/`connectionStringSetting` de un binding v3/legacy, sin lectura por código; `V4_REGISTRATION_OPTION` cuando la clave aparece como opción `connection` dentro de la llamada de registro v4 `app.X(...)`; una clave puede tener múltiples orígenes simultáneos);
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

**Regla de fidelidad obligatoria**: este documento debe ser un espejo del código, no un resumen interpretado. Nunca parafrasear una condición de negocio, mensaje de error o llamada relevante — citarla como bloque de código con el literal exacto observado en el archivo fuente. Los nombres de dependencias internas, activities llamadas (`callActivity`), registros v4 (`app.X`) deben usar el identificador literal real, nunca una descripción de comportamiento. Incluir siempre el fragmento de código central de la Function (sección "Fragmento de código relevante" del template) como ancla verificable entre el documento y el source.

Si `inventory.json` reportó `initialSignals` para esta Function, transcribirlos literalmente en la sección correspondiente del catálogo, sin suavizar ni reinterpretar el hallazgo.

Ruta nueva: `.migration/00-before/functions/<FunctionName>.md`.
