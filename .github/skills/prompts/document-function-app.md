# Prompt Maestro: Solo documentación

Usa este prompt cuando quieras generar únicamente la documentación de referencia de la Function App como baseline
reutilizable, sin ejecutar ningún paso del flujo de migración (sin discovery, assessment, analysis ni planning como
resultado explícito de esta invocación).

```text
Ejecuta document-function-app sobre este repositorio.

Objetivo:
- Generar la documentacion de referencia de la Function App completa como baseline reutilizable, sin planificar ni ejecutar ninguna migracion.

Restricciones:
- No modificar codigo productivo, tests ni configuracion de la app.
- documentation/repository.md y documentation/functions/<FunctionName>.md se escriben en la raiz del repositorio objetivo (se commitean).
- Si el skill reusa o genera .migration/00-before/inventory.json internamente, eso permanece bajo .migration/ (no se commitea) y es solo evidencia de soporte, no el resultado final.
- No leer secretos ni valores sensibles.
- No ejecutar comandos que requieran servicios externos, credenciales o entorno cloud.
- Revelar exhaustivamente deuda tecnica, code smells y ausencia de estructura (incluyendo repositorios legacy); no es un fallo del flujo, es evidencia necesaria para dimensionar el esfuerzo.
- No generar Action IDs, plan de migracion ni checklist mecanico v3->v4 — esto no es una etapa de migracion.
- Dar el mismo nivel de detalle a Functions legacy (function.json) y modernas (Programming Model v4), y a repositorios con buena o mala estructura.

Flujo:
1. Ejecuta document-function-app -> documentation/repository.md + documentation/functions/<FunctionName>.md.
   - Reusa .migration/00-before/inventory.json (y project-graph si Graphify esta disponible) si existe y sigue vigente contra el commit/arbol de archivos actual; si no existe o no esta vigente, lo genera internamente.
   - Reusa .migration/20-analysis/**/analysis.json|md si ya existe para alguna Function/slice (criticidad, testabilidad, gaps), en vez de re-clasificar desde cero.
   - Para cada Function/slice sin analysis previo, clasificar directamente con _shared/references/complexity-debt-rubric.md.

Salida final requerida:
- Estado: COMPLETED, PARTIAL, BLOCKED o REQUIRES_REVIEW.
- Resumen ejecutivo de complejidad y deuda tecnica: cuantas Functions legacy vs. modernas, cuantas con criticidad HIGH, code smells/god files detectados, y la etiqueta agregada de complejidad del repo (BAJA/MEDIA/ALTA) con la combinacion de señales que la produjo.
- Cantidad de Functions/slices documentados y cuantos requirieron archivo dedicado en documentation/functions/ vs. cuantos quedaron solo en la tabla de inventario de documentation/repository.md.
- God files y deuda tecnica priorizada (top hallazgos por impacto).
- Riesgos/unknowns explicitos.
- Rutas exactas de los artifacts generados.
- Si el runtime expone usage real, reportar input/output/reasoning/total tokens; si no, UNKNOWN sin inventar cifras.
