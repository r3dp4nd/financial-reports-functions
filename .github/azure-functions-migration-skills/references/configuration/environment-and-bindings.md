# Configuración, variables de entorno y bindings

## Propósito

Definir cómo inventariar y estructurar configuración durante una migración de Azure Functions sin leer ni exponer secretos.

Esta referencia sustenta `assess-function-app`, `prepare-function-app`, `analyze-function`, `migrate-function`, `migrate-shared-component` y `verify-function-app`.

## Principio

Registra nombres, usos y fuentes de configuración. No registres valores sensibles.

```text
nombre del setting -> permitido
valor secreto       -> no permitido
connection string   -> no permitido
```

## Qué inventariar

Busca settings usados en:

- `process.env.<SETTING>`;
- `process.env["SETTING"]`;
- helpers o factories de configuración;
- bindings legacy `function.json`;
- registros v4 con `connection`, `%SETTING%`, `schedule`, `route` u opciones equivalentes;
- clientes SDK construidos desde configuración;
- documentación no sensible;
- plantillas sanitizadas como `.env.example`, `local.settings.sample.json` o equivalentes.

No abras ni copies archivos sensibles excluidos por la política del proyecto. Si el usuario autoriza revisar un archivo local con secretos, no reproduzcas sus valores.

## Clasificación

Clasifica cada setting por propósito:

| Tipo | Ejemplos genéricos |
|---|---|
| Runtime | `FUNCTIONS_WORKER_RUNTIME`, `FUNCTIONS_EXTENSION_VERSION` |
| Host/local | `AzureWebJobsStorage` |
| Conexión externa | settings usados por SDKs o bindings de servicios |
| Recurso lógico | nombres de queues, topics, containers, databases |
| Comportamiento configurable | schedules, flags o límites operativos |

Registra también si el setting es:

- sensible;
- requerido para build;
- requerido para tests;
- requerido para ejecución local;
- requerido solo en entorno hospedado.

## Bindings

Para cada trigger/input/output:

- registra el tipo de binding;
- registra propiedades funcionales;
- registra nombres de settings usados en `connection` o expresiones `%SETTING%`;
- preserva route, methods, auth level, schedule, cardinalidad y expresiones relevantes;
- compara legacy y v4 propiedad por propiedad.

Consulta `../azure-functions/bindings-v4.md` para la traducción de bindings.

## Shared config vs configuración por capability

Usa configuración compartida cuando:

- representa un cliente o recurso transversal;
- varios capabilities consumen el mismo setting;
- centraliza validación de settings de infraestructura común;
- evita duplicar construcción de SDK clients.

Usa configuración por capability cuando:

- el setting pertenece a un flujo específico;
- la validación es propia de ese capability;
- compartirla introduciría un módulo genérico sin responsabilidad clara.

No crees un `shared config` global para todo por defecto.

## Local settings

El inventario de settings debe permitir pedir o preparar ejecución local.

Puedes crear o actualizar una plantilla segura como:

```text
local.settings.sample.json
```

La plantilla debe usar placeholders:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "<required-for-local-runtime>",
    "<SETTING_NAME>": "<required>"
  }
}
```

Para secretos usa placeholders como `<secret>` o `<required>`. No pidas al usuario que pegue secretos en el chat.

## Evidencia recomendada

Registra una tabla como:

| Setting | Uso | Fuente | Sensible | Local | Hospedado | Estado |
|---|---|---|---|---|---|---|
| `<SETTING_NAME>` | `<binding/sdk/config>` | `<archivo o patrón>` | sí/no | sí/no | sí/no | presente/faltante/desconocido |

En `.migration/` registra solo nombres de settings, nunca valores.

## Verificación

Antes de declarar lista la configuración:

- confirma que todos los settings requeridos tienen una fuente esperada;
- confirma que bindings v4 referencian los mismos settings funcionales que legacy;
- confirma que clientes SDK usan configuración validada;
- confirma que `local.settings.sample.json` o la documentación local no contiene secretos;
- marca explícitamente settings faltantes o desconocidos.

