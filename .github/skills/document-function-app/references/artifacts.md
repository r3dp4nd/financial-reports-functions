# Artifacts de documentación

## `repository.md`

Ruta: `.migration/documentation/repository.md`.

Documento único de referencia de toda la Function App. Ver `references/documentation-rules.md` para el estándar de
contenido completo (10 secciones obligatorias, incluyendo "Complejidad y deuda técnica").

Debe reusar, sin recopiar mecánicamente:

- `.migration/00-before/inventory.json` — hechos deterministas (Functions, dependencias, `largeFiles`, `configurationKeys`, `ciCdProviders`, `directoryTree`);
- `.migration/00-before/current-state.md` — arquitectura observable y diagramas, si ya existen y siguen vigentes;
- `.migration/00-before/graph/project-graph.json|md` — relaciones/slices, si existen;
- `.migration/20-analysis/**/analysis.json|md` — clasificación de criticidad/testabilidad/gaps ya hecha por
  `analyze-function`, cuando exista, en vez de re-clasificar desde cero.

No incluir:

- Action IDs, plan de migración, executor sugerido, orden de ejecución;
- checklist mecánico v3→v4 (pertenece a `analyze-function`/`migrate-programming-model-v4`);
- valores de configuración o secretos.

## `functions/<FunctionName>.md`

Ruta: `.migration/documentation/functions/<FunctionName>.md`.

Uno por Function/slice cuando el detalle lo justifique (criticidad `MEDIUM`/`HIGH`, o complejidad estructural
relevante). Para Functions triviales y sin hallazgos, puede bastar con la fila correspondiente en la tabla de
inventario de `repository.md`, sin generar un archivo dedicado.

Reusar `_shared/templates/function-current-state.template.md` como base estructural (fidelidad al código, fragmento
de código relevante citado literal), añadiendo la clasificación de complejidad de esta referencia.

## Regla de no duplicación con `.migration/00-before/`

Si `.migration/00-before/functions/<FunctionName>.md` ya existe (generado por `discover-function-app` o
`analyze-function`) y contiene el mismo nivel de detalle que exige este skill, no duplicarlo en
`.migration/documentation/functions/<FunctionName>.md`: referenciarlo directamente desde `repository.md` en su lugar.
Solo crear el archivo dedicado en `.migration/documentation/` cuando se necesite agregar contenido que el catálogo
BEFORE no cubre (por ejemplo la clasificación de complejidad agregada, si `analyze-function` nunca se ejecutó para
esa Function).

## Regenerabilidad

`.migration/documentation/` es una línea base, no evidencia de una ejecución de migración puntual. Puede
regenerarse en cualquier momento ejecutando el skill de nuevo; una ejecución nueva reemplaza la anterior en vez de
acumular versiones, salvo que el usuario pida explícitamente conservar un histórico.
