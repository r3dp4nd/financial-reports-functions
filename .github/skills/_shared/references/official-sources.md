# Fuentes oficiales

Usar estas fuentes únicamente cuando una etapa necesite verificar compatibilidad o comportamiento de plataforma. No convierten por sí solas una versión nueva en target aprobado.

## Agent Skills

- Specification: https://agentskills.io/specification
- Best practices: https://agentskills.io/skill-creation/best-practices

## Node.js

- Release status: https://nodejs.org/en/about/previous-releases
- Node.js 22 → 24 migration notes: https://nodejs.org/en/blog/migrations/v22-to-v24

## Azure Functions

- Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
- Node.js Programming Model v4 migration: https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4
- Runtime versions: https://learn.microsoft.com/en-us/azure/azure-functions/functions-versions
- Supported languages/Node.js versions: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages

## Durable Functions

- Node.js Programming Model v4 migration: https://learn.microsoft.com/en-us/azure/durable-task/durable-functions/durable-functions-node-model-upgrade
- Durable Functions overview: https://learn.microsoft.com/en-us/azure/durable-task/durable-functions/durable-functions-overview

---

## Checklist verificable: requisitos mínimos v4 (Programming Model)

Extraído de *Migrate to v4 of the Node.js programming model* (Microsoft Learn). Usar como checklist binario contra
`package.json`/`host.json` reales, no como narrativa.

| Requisito | Mínimo oficial | Cómo verificarlo en el repo |
|---|---|---|
| `@azure/functions` npm package | `v4.0.0+` | `package.json.dependencies["@azure/functions"]` — **debe estar en `dependencies`, no en `devDependencies`** (en v3 solo traía tipos y podía vivir en dev; en v4 contiene el código runtime real) |
| Node.js | `v18+` | `package.json.engines.node` o `@types/node` (ver `platform.node` de `inventory.json`) |
| Azure Functions Runtime | `v4.25+` | `host.json.extensionBundle.version`; una versión `v4` genérica no es suficiente, se requiere el minor `≥25` |
| Azure Functions Core Tools (solo si se ejecuta local) | `v4.0.5382+` | tooling local, no en el repositorio |
| TypeScript (si aplica) | `v4+` | `package.json.devDependencies.typescript` |

**Regla de oro que no debe perderse**: mover `@azure/functions` de `devDependencies` a `dependencies` es un cambio
obligatorio y fácil de omitir en la migración — su ausencia rompe el deploy silenciosamente en producción aunque
funcione localmente.

## Mapeo de versión: Programming Model ↔ paquete `durable-functions`

Extraído de *Migrate Durable Functions to Node.js Programming Model v4*. Este mapeo es contraintuitivo: el número de
versión del *Programming Model* no coincide con el número de versión del paquete `durable-functions`.

| Programming Model | Paquete `durable-functions` |
|---|---|
| v3 | `2.x` |
| v4 | `3.x` |

Al analizar o planificar, registrar explícitamente ambos números — nunca asumir que "migrar a v4" implica automáticamente
que `durable-functions` ya está en `3.x`.

## Checklist mecánico verificable: cambios de firma v3 → v4 (Programming Model)

Reglas exactas y verificables por código, extraídas de la fuente oficial. Cada Function puede evaluarse independientemente
contra este checklist con evidencia `CONFIRMED`/`INFERRED` según si se leyó el código real.

| # | Regla | v3 (antes) | v4 (después) | Cómo detectarlo en código |
|---|---|---|---|---|
| 1 | Orden de argumentos del handler | `(context, req)` — contexto primero | `(request, context)` — request primero, contexto opcional | firma de la función exportada/registrada |
| 2 | Forma de leer el trigger input | 3 formas válidas: `req`, `context.req`, `context.bindings.req` | 1 forma única: primer argumento (`request`) | uso de `context.req`/`context.bindings` en el body |
| 3 | Forma de setear el output primario | 5 formas válidas: `context.res =`, `context.done()`, `context.res.send()`, `context.bindings.res =`, `return` | 1 forma única: `return` | cualquier asignación a `context.res`/`context.bindings.res`/`context.done()` |
| 4 | Logging | `context.log.error(...)`, `context.log.warn(...)` (anidado) | `context.error(...)`, `context.warn(...)` (raíz) | uso de `context.log.<nivel>` vs `context.<nivel>` |
| 5 | Tipos HTTP (request/response) | `request.query.name` (propiedad), `request.body`/`.rawBody`/`.bufferBody` (inconsistente por tipo) | Estándar Fetch/`undici`: `request.query.get('name')`, `await request.text()/.json()/.formData()/.arrayBuffer()/.blob()` | acceso a `.query.<key>` como propiedad en vez de `.get()`; acceso directo a `.body` |

No inventar un cumplimiento parcial: si no se puede confirmar una regla por evidencia directa de código, marcarla
`UNKNOWN` en vez de asumir que ya se cumple.

## Checklist verificable: APIs de `DurableClient` con cambio de firma (v3 → v4)

Extraído de la misma fuente. Estas APIs (antes en `DurableOrchestrationClient`, ahora en `DurableClient`) cambian de
argumentos posicionales a un único objeto de opciones. Relevante para cualquier starter/trigger que invoque al cliente
Durable (`df.getClient(context)`).

| Método | v3 (posicional) | v4 (options object) |
|---|---|---|
| `getStatus` | `(instanceId, showHistory?, showHistoryOutput?, showInput?)` | `(instanceId, options?: GetStatusOptions)` |
| `getStatusBy` | `(createdTimeFrom, createdTimeTo, runtimeStatus[])` | `(options: OrchestrationFilter)` |
| `purgeInstanceHistoryBy` | `(createdTimeFrom, createdTimeTo?, runtimeStatus?[])` | `(options: OrchestrationFilter)` |
| `raiseEvent` | `(instanceId, eventName, eventData, taskHubName?, connectionName?)` | `(instanceId, eventName, eventData, options?: TaskHubOptions)` |
| `readEntityState` | `(entityId, taskHubName?, connectionName?)` | `(entityId, options?: TaskHubOptions)` |
| `rewind` | `(instanceId, reason, taskHubName?, connectionName?)` | `(instanceId, reason, options?: TaskHubOptions)` |
| `signalEntity` | `(entityId, operationName?, operationContent?, taskHubName?, connectionName?)` | `(entityId, operationName?, operationContent?, options?: TaskHubOptions)` |
| `startNew` | `(orchestratorFunctionName, instanceId?, input?)` | `(orchestratorFunctionName, options?: StartNewOptions)` |
| `waitForCompletionOrCreateCheckStatusResponse` | `(request, instanceId, timeoutInMilliseconds?, retryIntervalInMilliseconds?)` | `(request, instanceId, waitOptions?: WaitForCompletionOptions)` |

### Renombres en `callHttp` (orchestrator)

| v3 | v4 | Detalle |
|---|---|---|
| argumentos posicionales | objeto de opciones único | similar a Express |
| `uri` | `url` | renombrado por consistencia |
| `content` | `body` | renombrado por consistencia |
| `asynchronousPatternEnabled` | `enablePolling` | renombrado por claridad |

## Estado de soporte de Runtime (para citar en assessment con evidencia oficial, no solo "v4 genérico")

Extraído de *Compare Azure Functions Runtime Versions*.

- Solo el runtime **v4.x** está soportado (GA) para todos los lenguajes.
- Las versiones **2.x y 3.x del runtime ya no están soportadas** ("Retired versions").
- Function Apps en **Linux Consumption plan** ejecutando el runtime v3 end-of-life dejan de funcionar después del
  **30 de septiembre de 2026** — riesgo operativo real, no solo deuda técnica, si el runtime detectado en discovery
  es v2/v3.

Al registrar `platform.functionsRuntime` en `assessment.md`, si el valor detectado es v2/v3 (o `UNKNOWN` con indicios
de legacy), citar este riesgo de EOL explícitamente en vez de solo marcar "Target: v4" sin contexto de urgencia.
