# Prompt Maestro: BEFORE hasta PLAN

Usa este prompt cuando quieras ejecutar el flujo completo de descubrimiento, assessment, analisis por Function y plan de migracion, sin aplicar cambios de codigo.

```text
Ejecuta el flujo de migracion hasta PLAN sobre este repositorio.

Objetivo:
- Obtener la fotografia actual del repositorio.
- Evaluar readiness y riesgos contra el target aprobado.
- Ejecutar analyze-function por cada Function descubierta.
- Generar un plan de migracion/refactor con Action IDs accionables.
- Reportar metricas de consumo de contexto/tokens y oportunidades de optimizacion por modelo.

Restricciones:
- No modificar codigo productivo, tests ni configuracion de la app.
- Escribir solamente artifacts bajo .migration/.
- No leer secretos ni valores sensibles.
- No ejecutar comandos que requieran servicios externos, credenciales o entorno cloud.
- No optimizar/refactorizar funcionalidad; solo descubrir, analizar y planificar.
- Si una etapa no aplica, reportar NOT_APPLICABLE con evidencia.
- El flujo debe funcionar igual de bien sobre repositorios legacy o con mala arquitectura. Revelar la ausencia de estructura, separacion de capas, tests o boundaries observables es tan valioso como documentar una estructura limpia; no es un fallo del flujo ni motivo para omitir detalle, es evidencia critica para dimensionar el esfuerzo de migracion/refactor.
- El analysis debe ser exhaustivo revelando deuda tecnica y code smells reales, aunque no se vayan a corregir en esta pasada. No autolimitarse a "lo minimo indispensable" cuando hay evidencia observable de un problema.

Flujo:
1. Ejecuta discover-function-app sobre este repositorio.
   - Usa Graphify/indexer si esta disponible y es seguro; para elegir modo de consulta (explain/path/query) y evitar interpretar coincidencias de historial git como relaciones de codigo, sigue `references/graphify-usage.md`.
   - Para documentar Arquitectura observable y generar diagramas (incluyendo el caso de capabilities legacy sin separacion clara), sigue `references/architecture-diagrams.md`.
   - Para clasificar Programming Model, Runtime, Durable, Configuracion o shared resource candidates ambiguos, sigue `references/ambiguous-signals.md`.
   - Genera o actualiza .migration/00-before/. El artifact `current-state.md` debe quedar en español simple y claro para lectores humanos, con una leyenda de estados de evidencia al inicio.
   - No hagas analisis profundo de comportamiento si corresponde a analyze-function.

2. Ejecuta assess-function-app usando el inventario actual.
   - Usa .migration/00-before/ como fuente principal.
   - Produce triage compacto en .migration/10-assessment/.
   - Identifica Functions, workflows Durable, shared resources y blockers.

3. Determina la lista de Functions a analizar.
   - Incluir todas las Functions descubiertas.
   - Si hay workflows Durable, mantener su relacion con orchestrators, activities y clients.
   - Si una Function esta incompleta o no puede analizarse, marcarla como BLOCKED con razon.

4. Por cada Function descubierta, ejecuta analyze-function.
   - Ejecutar una Function por vez.
   - Consumir BEFORE + assessment.
   - Producir .migration/20-analysis/functions/<FunctionName>/analysis.json|md.
   - Identificar:
     - trigger/bindings;
     - programming model actual;
     - runtime/dependencies relevantes;
     - criticidad tecnica y funcional;
     - patrones legacy;
     - testabilidad;
     - codigo dificil de probar;
     - comportamiento observable que debe preservarse, redactado como contrato comparable pre/post migracion (entrada exacta, salida exacta, efectos secundarios, errores observables, invariantes como idempotencia/retries/ordering) para que verify-function-app pueda usarlo directamente;
     - gap contra arquitectura objetivo (adapters delgados, handlers testeables, organizacion por capability, application/domain con responsabilidad real, infraestructura aislada, shared resources con ownership), clasificando cada gap detectado como TECHNICAL_DEBT o STRUCTURAL con evidencia;
     - señales de deuda tecnica de codigo (code smells): archivos/modulos grandes, handlers monoliticos, God functions, dependencias externas sin boundary, duplicacion de logica, acoplamiento a detalles de runtime. Revelar estas señales exhaustivamente, incluso si no bloquean la migracion tecnica inmediata.

5. Ejecuta plan-function-migration con toda la evidencia disponible.
   - Usar .migration/00-before/, .migration/10-assessment/ y .migration/20-analysis/.
   - Separar acciones de:
     - migracion tecnica: runtime v4, programming model v4, Node 24, dependencias/tooling;
     - restructuracion/refactor/testabilidad;
     - preparacion global;
     - preparacion por Function;
     - Durable si aplica.
   - Cada Action ID debe incluir owner, dependencia, executor sugerido, criterios de verificacion, preserveBehavior y prohibitedChanges.
   - El plan debe servir como contrato/eval para implementacion por IA o humano.

6. Reporta metricas de consumo y optimizacion.
   - Si el runtime entrega usage real, reportar input tokens, output tokens, reasoning tokens y total por etapa.
   - Si no hay usage real, reportar UNKNOWN y estimar solo por señales observables:
     - cantidad de archivos leidos;
     - cantidad de Functions analizadas;
     - tamano aproximado de artifacts generados;
     - relecturas evitables;
     - referencias cargadas por skill.
   - No inventar cifras exactas.

Salida final requerida:
- Estado por etapa: COMPLETED, NOT_APPLICABLE, REQUIRES_REVIEW o BLOCKED.
- Functions analizadas y artifacts generados.
- Riesgos o blockers.
- Resumen del plan y cantidad de Action IDs por tipo.
- Tabla de metricas de consumo.
- Tabla de recomendacion de modelo por tarea.
- Oportunidades concretas para reducir tokens en futuras ejecuciones.

Tabla minima de metricas:

| Etapa | Modelo usado | Input tokens | Output tokens | Reasoning tokens | Total | Evidencia |
|---|---|---:|---:|---:|---:|---|
| discovery | <modelo o UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <usage real o estimacion> |
| assessment | <modelo o UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <usage real o estimacion> |
| analysis:<FunctionName> | <modelo o UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <usage real o estimacion> |
| planning | <modelo o UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <n/UNKNOWN> | <usage real o estimacion> |

Modelo recomendado por tipo de tarea:

| Tarea | Modelo recomendado si esta disponible | Reasoning | Motivo |
|---|---|---|---|
| Inventario, clasificacion, extraccion repetitiva | gpt-5.6-luna o gpt-5.4-nano | low/none | Alto volumen, bajo riesgo, costo sensible. |
| Assessment compacto y priorizacion | gpt-5.6-terra | medium | Balance entre costo y juicio tecnico. |
| Analisis por Function con dependencias y testabilidad | gpt-5.6-terra | medium/high segun criticidad | Necesita leer codigo y razonar, pero se puede particionar por Function. |
| Plan global, dependencias entre acciones y riesgos | gpt-5.6-sol | high | Es el contrato/eval de la migracion; mayor costo se justifica. |
| Resumen ejecutivo o task packs | gpt-5.6-luna | low | Transformacion/sintesis desde artifacts ya estructurados. |

Optimizacion esperada:
- Reusar artifacts .migration en vez de releer todo el repo.
- Analizar Functions una por una para limitar contexto.
- Cargar solo referencias indicadas por cada SKILL.md.
- Usar JSON para handoff entre etapas y Markdown para revision humana.
- Reservar modelo fuerte para planning y decisiones de alto impacto.
- Usar modelo barato para extraccion, resumen y paquetes de trabajo.
- No repetir discovery si .migration/00-before esta vigente.
```

## Nota de modelo

Los nombres de modelo son una recomendacion operativa y deben ajustarse al proveedor disponible en el entorno. Si no hay control de modelo por etapa, mantener la misma secuencia y reportar `Modelo usado` como el valor observable o `UNKNOWN`.
