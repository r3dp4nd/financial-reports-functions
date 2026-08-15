# Análisis — <FunctionName>

## Referencias

- Inventory: `.migration/00-before/inventory.json`
- Assessment: `.migration/10-assessment/assessment.json`
- BEFORE (catálogo de la Function): `.migration/00-before/functions/<FunctionName>.md`
- BEFORE (estado global): `.migration/00-before/current-state.md`
- Grafo, si existe: `.migration/00-before/graph/project-graph.json|md`

## Estado

`READY | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Scope

- Requested:
- Slice analizado:
- Fuera del scope afectado:

## Narrativa

Antes de entrar en tablas y checklists, esta sección explica en prosa qué hace esta Function/slice y cómo lo hace
— es la traducción a lenguaje humano de todo lo que las secciones siguientes documentan de forma verificable.
Nunca introducir aquí un hecho que no esté respaldado por evidencia ya registrada en otra sección de este
documento o en el BEFORE/`inventory.json` referenciados arriba.

### Narrativa funcional (para onboarding no-técnico)

Qué problema de negocio resuelve esta Function/slice, en 2-4 frases, sin jerga técnica. Si el propósito de negocio
no es 100% claro desde la evidencia disponible, decirlo explícitamente en vez de asumirlo.

### Narrativa técnica (para onboarding técnico)

Cómo lo hace, en 3-6 frases de prosa fluida (paginación, batching, reintentos, validaciones, etc.), siempre
trazable a la sección "Contrato a preservar" de abajo o al catálogo BEFORE de la Function.

## Criticidad y testabilidad

Con el comportamiento ya descrito en la narrativa, esta tabla lo traduce en dos preguntas concretas para
planning: ¿qué tan crítico es que esto no se rompa?, y ¿qué tan fácil sería probar que sigue funcionando después de
un cambio?

| Dimensión | Estado | Rationale | Evidencia |
|---|---|---|---|
| Criticidad | `HIGH | MEDIUM | LOW` | | |
| Testabilidad | `GOOD | PARTIAL | POOR` | | |
| Recommended lane | `TECHNICAL_MIGRATION | REFACTOR_TESTABILITY | BOTH | NO_CHANGE` | | |

- Testability blockers:
- Testability enablers:

## Contrato a preservar

La narrativa contó la historia; esta sección es su versión exacta y verificable — el snapshot que
`verify-function-app` usará para comparar AFTER contra BEFORE/PLAN sin reinterpretación. Si algún elemento no puede
confirmarse con evidencia directa, registrarlo como `UNKNOWN` en vez de asumirlo; un contrato con gaps explícitos es
más útil para verification que uno completo pero especulativo.

### Entrada exacta

- Shape del trigger (payload HTTP/mensaje/evento), parámetros, headers/campos relevantes, tipos esperados:

### Salida exacta

- Status codes / forma de la respuesta:
- Mensajes publicados (topic/queue + shape):
- Documentos persistidos (container + shape):

### Efectos secundarios exactos

- Qué se escribe, publica o muta, y bajo qué condición:

### Errores observables

- Qué errores/status/mensajes se producen ante qué condición, y si son recuperables:

### Invariantes de comportamiento a preservar

- Idempotencia:
- Retries:
- Ordering:
- Concurrencia:
- Fan-out/fan-in:
- Compensación:

## Relaciones

Con el contrato ya fijado, esta tabla ubica a la Function/slice dentro del resto del sistema — quién la invoca y a
quién invoca ella. Relaciones verificadas, persistidas aquí para que `plan-function-migration` y
`migrate-durable-functions-v4` las reusen sin volver a consultar Graphify (ver `_shared/context-cache-policy.md` y
`_shared/references/graphify-usage.md`). `INFERRED` por defecto, `CONFIRMED` solo tras verificar contra source
real.

| Origen | Relación | Destino | Tipo de edge | Evidence status |
|---|---|---|---|---|

- Functions afectadas fuera del scope solicitado:

## Dependencias y configuración

Las relaciones de arriba se sostienen sobre dependencias concretas — módulos internos, paquetes externos y claves
de configuración que esta Function necesita para cumplir su contrato.

- Dependencias internas:
- Dependencias externas:
- Configuration keys:
- Shared resources:

## Compatibilidad con la plataforma objetivo

Con el contrato, relaciones y dependencias ya claros, esta sección responde qué tan lejos está esta Function de
Node.js 24, Programming Model v4 y Durable v4 — primero el resumen por dimensión, luego el detalle mecánico
verificable regla por regla, sin repetir el mismo hallazgo dos veces con distintas palabras.

| Dimensión | Hallazgo | Evidencia |
|---|---|---|
| Node.js 24 | | |
| Programming Model | | |
| Durable | | |
| Dependencias | | |

### Checklist mecánico v3 → v4 (detalle verificable de "Programming Model")

Ver `_shared/references/official-sources.md` para el detalle completo de cada regla. Evaluar cada regla contra el
código real de esta Function; `N/A` si la Function ya nació en v4 o la regla no aplica a su tipo de trigger.

| # | Regla | Cumple hoy | Evidencia |
|---|---|---|---|
| 1 | Orden de argumentos `(request, context)` | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 2 | Trigger input leído solo como primer argumento | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 3 | Output primario solo vía `return` | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 4 | Logging vía `context.<nivel>` (no `context.log.<nivel>`) | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 5 | Tipos HTTP estándar Fetch/`undici` | `SÍ \| NO \| N/A \| UNKNOWN` | |

### Checklist Durable Client API (detalle verificable de "Durable", solo si invoca `df.getClient(context)`)

Ver tabla completa de métodos afectados en `_shared/references/official-sources.md`.

| Método invocado | Firma detectada | v3 posicional / v4 options object | Evidencia |
|---|---|---|---|

- Versión de paquete `durable-functions` detectada:
- Versión esperada según Programming Model target (v3→`2.x`, v4→`3.x`):

## Arquitectura del slice y hallazgos de deuda técnica

Con la compatibilidad de plataforma ya evaluada, esta sección responde la otra mitad de la pregunta: ¿la
*estructura* del código (no solo su versión de API) está lista para sostener el cambio con seguridad? Todo hallazgo
de gap, code smell o necesidad de refactor se consolida aquí en una sola tabla de hallazgos — nunca repetido en
"Migration needs" y "Refactor/testability needs" como si fueran descubrimientos distintos.

- Estado actual:
- Separación mínima requerida (propuesta concreta: qué interfaz, qué módulo, cómo queda el handler después — no
  solo "necesita boundary"):
- Ownership/capability:
- Legacy coupling:

### Hallazgos de arquitectura y deuda técnica (tabla única, sin duplicar)

Ver criterios completos en `_shared/references/target-architecture.md` y `_shared/references/complexity-debt-rubric.md`.
Cada fila es un hallazgo único: no repetir el mismo gap en "Migration needs" más abajo. Clasificar
`STRUCTURAL` cuando bloquea el target aprobado, `TECHNICAL_DEBT` cuando no lo bloquea. No inventar hallazgos sin
evidencia directa; marcar `UNKNOWN` si la evaluación es ambigua.

| Hallazgo | Tipo | Clasificación | Evidencia | Propuesta concreta de solución |
|---|---|---|---|---|

## Migration needs (síntesis para planning)

Los hallazgos de arriba, convertidos en necesidades que `plan-function-migration` deberá transformar en Action
IDs — cada fila referencia un hallazgo ya documentado en la tabla anterior, no introduce uno nuevo aquí.

| Clasificación | Necesidad | Referencia al hallazgo | Evidencia |
|---|---|---|---|

## Riesgos, unknowns y revisión

Cierre del análisis: qué de todo lo anterior representa un riesgo real si se ignora, qué preguntas siguen sin
respuesta confirmable, y qué requiere aprobación humana antes de que planning avance.

- Riesgos:
- Unknowns:
- Revisión requerida:
