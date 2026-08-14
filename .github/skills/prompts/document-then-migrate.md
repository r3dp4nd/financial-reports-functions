# Prompt Maestro: Documentar y luego migrar

Usa este prompt cuando quieras primero obtener la documentación oficial de línea base de la Function App
(`documentation/`), y a partir de esa evidencia decidir/ejecutar el flujo de migración hasta PLAN, reusando lo ya
generado en la etapa de documentación en vez de recomenzar desde cero.

```text
Ejecuta documentacion y luego migracion hasta PLAN sobre este repositorio.

Objetivo:
- Etapa 1: generar la documentacion de referencia de la Function App completa (documentation/) como baseline reutilizable.
- Etapa 2: usando esa misma evidencia, descubrir/evaluar/analizar por Function/slice y generar un plan de migracion/refactor accionable, sin modificar codigo.

Restricciones:
- No modificar codigo productivo, tests ni configuracion de la app.
- documentation/repository.md y documentation/functions/<FunctionName>.md se escriben en la raiz del repositorio objetivo (se commitean); todo lo demas (inventory, assessment, analyses, plan) se escribe solamente bajo .migration/ (no se commitea).
- No leer secretos ni valores sensibles.
- No ejecutar comandos que requieran servicios externos, credenciales o entorno cloud.
- Revelar exhaustivamente deuda tecnica, code smells y ausencia de estructura (incluyendo repositorios legacy); no es un fallo del flujo, es evidencia necesaria para dimensionar el esfuerzo.
- Si una etapa no aplica, reportar NOT_APPLICABLE con evidencia.
- Antes de releer un archivo o repetir una consulta de Graphify ya resuelta en esta misma ejecucion, verificar .migration/_cache/index.json y las relaciones ya persistidas en analysis.json/project-graph.json (ver _shared/context-cache-policy.md y _shared/references/graphify-usage.md).

Etapa 1 — Documentacion:
1. Ejecuta document-function-app sobre el repositorio completo -> documentation/repository.md + documentation/functions/<FunctionName>.md.
   - Este skill reusa o genera internamente .migration/00-before/inventory.json (y project-graph si Graphify esta disponible) como fuente primaria de hechos.
   - Registra la clasificacion de complejidad/criticidad/testabilidad por Function/slice (seccion 8 del documento) — esta clasificacion se reusara en la Etapa 2 en vez de re-derivarse.

Etapa 2 — Migracion (reusando la Etapa 1, sin recomenzar):
2. Verifica si .migration/00-before/inventory.json quedo generado/reusado por la Etapa 1 y sigue vigente contra el commit/arbol de archivos actual; si es asi, no repetir discover-function-app — pasar directo al paso 3.
   - Si no existe o no esta vigente, ejecuta discover-function-app -> .migration/00-before/.
3. Ejecuta assess-function-app -> .migration/10-assessment/.
4. Ejecuta analyze-function por cada Function/slice descubierto -> .migration/20-analysis/.
   - Reusar la clasificacion de criticidad/testabilidad/code smells ya calculada en documentation/repository.md (Etapa 1) en vez de re-derivarla desde cero; solo profundizar donde el analysis exija mas detalle (contrato exacto, relationships, checklist mecanico v3->v4) que la documentacion no cubre.
   - Agrupar en slice cuando discovery ya identifico un workflow Durable/Outbox/shared resource coherente en inventory.json/project-graph; no fragmentar ese slice en Functions aisladas ni re-derivar la agrupacion desde cero.
   - Analizar una Function/slice por vez (progressive disclosure); no cargar el repositorio completo por cada invocacion.
5. Ejecuta plan-function-migration con toda la evidencia disponible -> .migration/30-plan/.
6. Reporta metricas de consumo y aprendizajes de eficiencia.
   - Si el runtime expone usage real, reportar input/output/reasoning/total tokens por etapa (incluyendo la Etapa 1 de documentacion).
   - Si no hay usage real, usar UNKNOWN; no inventar cifras.
   - Senalar oportunidades de reuso de contexto observadas (ej. clasificacion de complejidad reusada de documentation/repository.md, artifact reutilizado, entrada de _cache reusada, referencia releida sin necesidad, consulta Graphify repetida sin necesidad) como lesson OBSERVED en .migration/90-lessons/, siguiendo _shared/lessons-policy.md; no modificar el toolkit automaticamente por esto.

Salida final requerida:
- Estado por etapa: COMPLETED, NOT_APPLICABLE, REQUIRES_REVIEW o BLOCKED (incluyendo la etapa de documentacion).
- Resumen de complejidad y deuda tecnica citado desde documentation/repository.md.
- Functions/slices analizados y artifacts generados.
- Riesgos o blockers.
- Resumen del plan y cantidad de Action IDs por tipo.
- Tabla de metricas de consumo por etapa: Etapa | Modelo usado | Input tokens | Output tokens | Reasoning tokens | Total | Evidencia (UNKNOWN si no es observable).
- Criterio de modelo por tipo de tarea (agnostico a proveedor): tareas de alto volumen/bajo riesgo (inventario, extraccion repetitiva) con modelo economico/bajo razonamiento; planning y decisiones de alto impacto con mas razonamiento.
- Resumen de cuanta evidencia de la Etapa 1 (documentacion) se reuso en la Etapa 2 (migracion), frente a lo que tuvo que recalcularse.
- Lessons de eficiencia de contexto registradas, si las hubo.
