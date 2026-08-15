# Durable Functions en Programming Model v4

## Cuándo cargar esta referencia

Solo cuando el assessment o análisis detecte `durable-functions`, `orchestrationTrigger`, `activityTrigger`, `entityTrigger`, `durableClient` o APIs Durable equivalentes.

No cargarla para Function Apps sin Durable Functions.

## Regla principal

Microsoft indica que primero debe completarse la migración general al Programming Model v4 y después aplicar los cambios específicos de Durable Functions.

No trates Durable como un trigger ordinario.

## Compatibilidad mínima confirmada

La guía oficial vigente relaciona:

| Programming Model | `durable-functions` |
|---|---|
| v3 | 2.x |
| v4 | 3.x |

Para Programming Model v4, la guía también requiere Azure Functions Runtime 4.25+ y Azure Functions Core Tools 4.0.5382+ para ejecución local.

## Registro v4

En v4, Durable registra sus Functions en código mediante el namespace `df.app`:

- orchestration → `df.app.orchestration()`;
- activity → `df.app.activity()`;
- entity → `df.app.entity()`.

El cliente Durable también se registra como input en código.

## Qué preservar

Antes de cambiar una Durable Function, registra:

- nombres de orchestrators;
- nombres de activities;
- entities;
- contratos de input/output;
- llamadas `callActivity`, sub-orchestrations y timers;
- client starter y rutas HTTP relacionadas;
- instance IDs cuando tengan semántica funcional;
- políticas/reintentos relevantes;
- comportamiento determinista del orchestrator.

## Riesgo arquitectónico

No muevas lógica no determinista dentro de un orchestrator durante un refactor. Las restricciones de replay/determinismo de Durable forman parte de su contrato técnico.

La separación arquitectónica debe respetar la frontera entre:

```text
orchestrator
   ├── coordina
   └── no ejecuta side effects directos

activities
   └── realizan side effects / trabajo externo
```

## APIs cambiadas

La migración de Durable v2.x a 3.x incluye cambios adicionales en APIs de cliente y otros métodos. No hagas reemplazos por memoria: consulta la tabla de la guía oficial para cada API encontrada.

## Verificación

Cuando Durable esté presente, la verificación global debe incluir:

- registro de orchestrators/activities/entities esperado;
- build;
- tests disponibles;
- arranque local cuando sea viable;
- ausencia de `function.json` Durable pendiente después de la convergencia;
- revisión de APIs Durable migradas.

## Fuente oficial

- Durable Functions Node.js v4 model upgrade: https://learn.microsoft.com/en-us/azure/durable-task/durable-functions/durable-functions-node-model-upgrade
- Durable Functions bindings: https://learn.microsoft.com/en-us/azure/durable-task/durable-functions/durable-functions-bindings
