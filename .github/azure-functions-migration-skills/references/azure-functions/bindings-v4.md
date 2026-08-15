# Migración de triggers y bindings a Programming Model v4

## Propósito

Evitar pérdidas de configuración al trasladar `function.json` hacia registro en código.

No es un catálogo completo de bindings. Define el procedimiento común y señala cuándo consultar la referencia oficial específica del binding detectado.

## Principio

Una Function tiene exactamente un trigger y puede tener cero o más inputs/outputs adicionales.

Durante la migración compara **propiedad por propiedad** el binding legacy con las opciones v4. No asumas que los defaults del modelo nuevo son equivalentes al comportamiento existente.

## Procedimiento

Para cada Function:

1. identifica el binding con `direction: in` que actúa como trigger;
2. registra nombre, tipo y todas sus propiedades funcionales;
3. identifica inputs secundarios;
4. identifica outputs, incluido `$return`;
5. identifica expresiones de binding y metadata usada por el handler;
6. localiza la API v4 oficial para ese tipo;
7. traslada la configuración;
8. adapta acceso a input/output sin cambiar lógica de negocio;
9. compara inventario antes/después.

## Mapeos frecuentes

| `function.json` legacy | Registro v4 habitual |
|---|---|
| `httpTrigger` | `app.http()` |
| `timerTrigger` | `app.timer()` |
| Queue Storage trigger | `app.storageQueue()` |
| Service Bus queue trigger | API v4 de Service Bus queue |
| Service Bus topic trigger | API v4 de Service Bus topic |
| Cosmos DB trigger | API v4 de Cosmos DB |
| Blob trigger | API v4 de Blob Storage |

Los nombres exactos y opciones pueden evolucionar. No uses esta tabla como sustituto de la documentación oficial del binding.

## Inputs y outputs secundarios

En v4 los bindings secundarios se declaran como objetos de `input`/`output` o APIs específicas y se agregan al registro de la Function. En ejecución se acceden mediante `context.extraInputs` y `context.extraOutputs` cuando corresponda.

No traduzcas mecánicamente:

```text
context.bindings.x -> context.extraInputs.get(...)
```

sin comprobar si `x` era trigger, input, output o `$return`.

## Propiedades que deben compararse

Según el binding, presta especial atención a:

- `connection`;
- nombres de queue/topic/subscription/container/database;
- `route`;
- `methods`;
- `authLevel`;
- `schedule`;
- cardinalidad;
- expresiones `{...}`;
- nombres usados por el código;
- retry/configuración relacionada alojada en el host o extensión.

Solo registra **nombres de claves de configuración**, nunca secretos o connection strings.

## Cuando el binding no está cubierto

No inventes una traducción.

1. identifica el tipo exacto;
2. consulta Microsoft Learn para ese trigger/binding y selecciona Node.js Programming Model v4;
3. registra la decisión específica;
4. si el conocimiento se reutiliza de forma recurrente, evalúa ampliar esta referencia o crear una referencia específica.

## Fuentes oficiales

- Triggers and bindings concepts: https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings
- Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
- HTTP trigger: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger
- Timer trigger: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer
- Service Bus bindings: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus
- Blob bindings: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob
- Cosmos DB trigger: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger
