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
2. Ejecuta assess-function-app -> .migration/10-assessment/
3. Ejecuta analyze-function por cada Function/slice descubierto -> .migration/20-analysis/
4. Ejecuta plan-function-migration con toda la evidencia disponible -> .migration/30-plan/

Salida final requerida:
- Estado por etapa: COMPLETED, NOT_APPLICABLE, REQUIRES_REVIEW o BLOCKED.
- Functions/slices analizados y artifacts generados.
- Riesgos o blockers.
- Resumen del plan y cantidad de Action IDs por tipo.
```
