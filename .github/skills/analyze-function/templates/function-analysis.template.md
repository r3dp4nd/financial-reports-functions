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

## Criticidad y testabilidad

| Dimensión | Estado | Rationale | Evidencia |
|---|---|---|---|
| Criticidad | `HIGH | MEDIUM | LOW` | | |
| Testabilidad | `GOOD | PARTIAL | POOR` | | |
| Recommended lane | `TECHNICAL_MIGRATION | REFACTOR_TESTABILITY | BOTH | NO_CHANGE` | | |

- Testability blockers:
- Testability enablers:

## Narrativa

> Traducción a prosa de hechos ya documentados en este mismo análisis (Contrato a preservar, Compatibilidad, Dependencias). Nunca introducir aquí un hecho que no esté respaldado por evidencia ya registrada en otra sección de este documento o en el BEFORE/`inventory.json` referenciados arriba.

### Narrativa funcional (para onboarding no-técnico)

> Qué problema de negocio resuelve esta Function/slice, en 2-4 frases, sin jerga técnica. Si el propósito de negocio no es 100% claro desde la evidencia disponible, decirlo explícitamente en vez de asumirlo.

### Narrativa técnica (para onboarding técnico)

> Cómo lo hace, en 3-6 frases de prosa fluida (paginación, batching, reintentos, validaciones, etc.), siempre trazable a la sección "Contrato a preservar" de abajo o al catálogo BEFORE de la Function.

## Contrato a preservar

> Snapshot verificable, no prosa libre. `verify-function-app` compara AFTER contra esta sección sin reinterpretación,
> por lo que cada campo debe ser lo más literal y concreto posible. Si algún elemento no puede confirmarse con
> evidencia directa, registrarlo como `UNKNOWN` en vez de asumirlo.

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

> Relaciones verificadas de este slice, persistidas aquí para que `plan-function-migration` y
> `migrate-durable-functions-v4` las reusen sin volver a consultar Graphify (ver `_shared/context-cache-policy.md`
> y `_shared/references/graphify-usage.md`). `INFERRED` por defecto, `CONFIRMED` solo tras verificar contra source real.

| Origen | Relación | Destino | Tipo de edge | Evidence status |
|---|---|---|---|---|

- Functions afectadas fuera del scope solicitado:

## Dependencias y configuración

- Dependencias internas:
- Dependencias externas:
- Configuration keys:
- Shared resources:

## Compatibilidad

| Dimensión | Hallazgo | Evidencia |
|---|---|---|
| Node.js 24 | | |
| Programming Model | | |
| Durable | | |
| Dependencias | | |

### Checklist mecánico v3 → v4 (Programming Model)

> Ver `_shared/references/official-sources.md` para el detalle completo de cada regla. Evaluar cada regla contra el
> código real de esta Function; `N/A` si la Function ya nació en v4 o la regla no aplica a su tipo de trigger.

| # | Regla | Cumple hoy | Evidencia |
|---|---|---|---|
| 1 | Orden de argumentos `(request, context)` | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 2 | Trigger input leído solo como primer argumento | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 3 | Output primario solo vía `return` | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 4 | Logging vía `context.<nivel>` (no `context.log.<nivel>`) | `SÍ \| NO \| N/A \| UNKNOWN` | |
| 5 | Tipos HTTP estándar Fetch/`undici` | `SÍ \| NO \| N/A \| UNKNOWN` | |

### Checklist Durable Client API (solo si esta Function invoca `df.getClient(context)`)

> Ver tabla completa de métodos afectados en `_shared/references/official-sources.md`.

| Método invocado | Firma detectada | v3 posicional / v4 options object | Evidencia |
|---|---|---|---|

- Versión de paquete `durable-functions` detectada:
- Versión esperada según Programming Model target (v3→`2.x`, v4→`3.x`):

## Arquitectura del slice

- Estado actual:
- Separación mínima requerida:
- Ownership/capability:
- Legacy coupling:

### Checklist de gap contra arquitectura objetivo

> Ver criterios completos en `_shared/references/target-architecture.md`. Clasificar cada gap detectado como
> `TECHNICAL_DEBT` (no bloquea el target aprobado) o `STRUCTURAL` (requerido por el scope de migración). No inventar
> gaps sin evidencia directa; marcar `UNKNOWN` si la evaluación es ambigua.

| Criterio | ¿Cumple? | Gap detectado | Clasificación | Evidencia |
|---|---|---|---|---|
| Adapters/composition roots delgados | | | | |
| Handlers testeables (sin SDK directo) | | | | |
| Organización por capability | | | | |
| Application/domain con responsabilidad real | | | | |
| Infraestructura aislada con boundary real | | | | |
| Shared resources con ownership único | | | | |

### Code smells (deuda técnica de código)

> Documentar exhaustivamente, incluso si no bloquea la migración técnica inmediata. Ver `analysis-rules.md` para el
> detalle de cada señal.

| Señal | Detectada | Evidencia |
|---|---|---|
| Archivo/módulo grande (mezcla de responsabilidades) | `SÍ \| NO` | |
| Servicio/handler monolítico | `SÍ \| NO` | |
| God function/method | `SÍ \| NO` | |
| Dependencias externas sin boundary | `SÍ \| NO` | |
| Duplicación de lógica | `SÍ \| NO` | |
| Acoplamiento a detalles de runtime | `SÍ \| NO` | |

## Migration needs

| Clasificación | Necesidad | required? decidido aquí | Evidencia |
|---|---|---|---|
| | | No — lo decide planning | |

## Refactor/testability needs

| Necesidad | Lane recomendado | Evidencia | Puede esperar |
|---|---|---|---|

## Riesgos, unknowns y revisión

- Riesgos:
- Unknowns:
- Revisión requerida:
