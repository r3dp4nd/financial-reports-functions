# Prompt Maestro: BEFORE hasta PLAN

Usa este prompt cuando quieras ejecutar el flujo completo de descubrimiento, assessment, analisis por Function y plan de migracion, sin aplicar cambios de codigo.

```text
Ejecuta el flujo de migracion hasta PLAN sobre este repositorio.

Objetivo:
- Descubrir, evaluar, analizar por Function/slice y generar un plan de migracion/refactor accionable, sin modificar codigo.

Restricciones:
- No modificar codigo productivo, tests ni configuracion de la app.
- Escribir solamente artifacts bajo .migration/.
- No leer secretos ni valores sensibles.
- No ejecutar comandos que requieran servicios externos, credenciales o entorno cloud.
- Revelar exhaustivamente deuda tecnica, code smells y ausencia de estructura (incluyendo repositorios legacy); no es un fallo del flujo, es evidencia necesaria para dimensionar el esfuerzo.
- Si una etapa no aplica, reportar NOT_APPLICABLE con evidencia.
- Antes de releer un archivo o repetir una consulta de Graphify ya resuelta en esta misma ejecucion, verificar .migration/_cache/index.json y las relaciones ya persistidas en analysis.json/project-graph.json (ver _shared/context-cache-policy.md y _shared/references/graphify-usage.md).

Flujo:
1. Ejecuta discover-function-app -> .migration/00-before/
   - Si .migration/00-before/inventory.json existe, comparar su estado contra el commit/arbol de archivos actual antes de decidir si basta con reutilizarlo o si se requiere una nueva ejecucion completa.
2. Ejecuta assess-function-app -> .migration/10-assessment/
3. Ejecuta analyze-function por cada Function/slice descubierto -> .migration/20-analysis/
   - Agrupar en slice cuando discovery ya identifico un workflow Durable/Outbox/shared resource coherente en inventory.json/project-graph; no fragmentar ese slice en Functions aisladas ni re-derivar la agrupacion desde cero.
   - Analizar una Function/slice por vez (progressive disclosure); no cargar el repositorio completo por cada invocacion.
4. Ejecuta plan-function-migration con toda la evidencia disponible -> .migration/30-plan/
5. Reporta metricas de consumo y aprendizajes de eficiencia.
   - Si el runtime expone usage real, reportar input/output/reasoning/total tokens por etapa.
   - Si no hay usage real, usar UNKNOWN; no inventar cifras.
   - Senalar oportunidades de reuso de contexto observadas (ej. artifact reutilizado, entrada de _cache reusada, referencia releida sin necesidad, consulta Graphify repetida sin necesidad) como lesson OBSERVED en .migration/90-lessons/, siguiendo _shared/lessons-policy.md; no modificar el toolkit automaticamente por esto.

Salida final requerida:
- Estado por etapa: COMPLETED, NOT_APPLICABLE, REQUIRES_REVIEW o BLOCKED.
- Functions/slices analizados y artifacts generados.
- Riesgos o blockers.
- Resumen del plan y cantidad de Action IDs por tipo.
- Tabla de metricas de consumo por etapa: Etapa | Modelo usado | Input tokens | Output tokens | Reasoning tokens | Total | Evidencia (UNKNOWN si no es observable).
- Criterio de modelo por tipo de tarea (agnostico a proveedor): tareas de alto volumen/bajo riesgo (inventario, extraccion repetitiva) con modelo economico/bajo razonamiento; planning y decisiones de alto impacto con mas razonamiento.
- Resumen de uso de cache de contexto/Graphify: cuantas lecturas/consultas se evitaron reusando _cache/ o evidencia ya persistida, frente a las que se ejecutaron de nuevo.
- Lessons de eficiencia de contexto registradas, si las hubo.
