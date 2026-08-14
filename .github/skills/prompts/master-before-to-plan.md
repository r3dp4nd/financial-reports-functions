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

Flujo:
1. Ejecuta discover-function-app -> .migration/00-before/
   - Si .migration/00-before/inventory.json ya existe y sigue vigente contra el commit actual, reusarlo en vez de rediscover completo.
2. Ejecuta assess-function-app -> .migration/10-assessment/
3. Ejecuta analyze-function por cada Function/slice descubierto -> .migration/20-analysis/
   - Analizar una Function/slice por vez (progressive disclosure); no cargar el repositorio completo por cada invocacion.
4. Ejecuta plan-function-migration con toda la evidencia disponible -> .migration/30-plan/
5. Reporta metricas de consumo y aprendizajes de eficiencia.
   - Si el runtime expone usage real, reportar input/output/reasoning/total tokens por etapa.
   - Si no hay usage real, usar UNKNOWN; no inventar cifras.
   - Senalar oportunidades de reuso de contexto observadas (ej. artifact reutilizado, referencia releida sin necesidad) como lesson OBSERVED en .migration/90-lessons/, siguiendo _shared/lessons-policy.md; no modificar el toolkit automaticamente por esto.

Salida final requerida:
- Estado por etapa: COMPLETED, NOT_APPLICABLE, REQUIRES_REVIEW o BLOCKED.
- Functions/slices analizados y artifacts generados.
- Riesgos o blockers.
- Resumen del plan y cantidad de Action IDs por tipo.
- Tabla de metricas de consumo por etapa: Etapa | Modelo usado | Input tokens | Output tokens | Reasoning tokens | Total | Evidencia (UNKNOWN si no es observable).
- Criterio de modelo por tipo de tarea (agnostico a proveedor): tareas de alto volumen/bajo riesgo (inventario, extraccion repetitiva) con modelo economico/bajo razonamiento; planning y decisiones de alto impacto con mas razonamiento.
- Lessons de eficiencia de contexto registradas, si las hubo.
