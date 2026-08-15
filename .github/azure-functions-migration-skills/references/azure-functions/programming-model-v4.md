# Programming Model v4

## Propósito

Concentrar las reglas que deben preservarse al migrar una Function App Node.js/TypeScript desde Programming Model v3 hacia v4.

Esta referencia sustenta principalmente `migrate-function` y `verify-function-app`.

## Diferencia frente al Runtime

El Programming Model define **cómo se escriben y registran** las Functions Node.js. Azure Functions Runtime define el host donde se ejecutan.

No los trates como un único cambio.

## Requisitos mínimos del modelo v4

La guía oficial de Microsoft establece como mínimos:

- `@azure/functions` 4.0.0 o superior;
- Node.js 18 o superior;
- TypeScript 4 o superior cuando aplique;
- Azure Functions Runtime 4.25 o superior;
- Azure Functions Core Tools 4.0.5382 o superior para ejecución local.

El objetivo del toolkit es Node.js 24; los mínimos anteriores describen el Programming Model, no el objetivo final del proyecto.

## Regla de convergencia

**No mezcles Programming Model v3 y v4 como estado operacional de una misma Function App.**

Cuando se registra una Function v4, las Functions v3 registradas mediante `function.json` son ignoradas por el modelo Node.js.

Durante el trabajo puede existir un estado transitorio del repositorio donde unas Functions ya hayan sido transformadas y otras no, pero:

- no lo declares ejecutable como Function App completa;
- no uses ese estado para validar registro global;
- converge todas las Functions antes de la verificación integral.

## `@azure/functions`

En Programming Model v4:

- `@azure/functions` contiene código de runtime del modelo Node.js;
- debe estar en `dependencies`, no solo en `devDependencies`;
- su versión mayor determina el Programming Model.

No actualices el paquete de forma aislada si el repositorio todavía depende del registro v3 para funcionar como aplicación completa.

## Entry point

Programming Model v4 usa `main` de `package.json` para localizar el código que registra Functions.

Ejemplos válidos dependen de la salida real del build:

```json
{
  "main": "dist/src/functions/*.js"
}
```

No copies una ruta por convención. Comprueba `rootDir`, `outDir`, estructura compilada y scripts existentes.

## Cambio de handler

En v4:

- el trigger input es el primer argumento del handler;
- `InvocationContext` suele ser el segundo;
- el output primario se devuelve desde el handler;
- inputs/outputs secundarios se gestionan mediante `extraInputs` y `extraOutputs` cuando corresponda;
- no continúes usando `context.req`, `context.res` o `context.bindings` como si el código siguiera en v3.

## Registro en código

La configuración que antes vivía en `function.json` pasa al registro en código mediante `app` u objetos equivalentes exportados por `@azure/functions`.

Patrón conceptual:

```text
function.json + handler v3
        ↓
registro v4 + handler equivalente
```

Migra primero la semántica del trigger/binding. El refactor arquitectónico pertenece a otra responsabilidad.

## Eliminación de `function.json`

Elimina el `function.json` de una Function solo cuando:

1. su configuración haya sido trasladada al registro v4;
2. trigger y bindings hayan sido comparados;
3. el entry point incluya el archivo compilado que registra la Function;
4. no se necesite el archivo legacy como evidencia de una Function pendiente.

## Testabilidad

Programming Model v4 permite crear `InvocationContext` fuera del runtime, lo que facilita pruebas de adapters. Aun así, prioriza tests de aplicación/dominio cuando el código esté desacoplado.

## Fuentes oficiales

- Node.js model v4 migration guide: https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4
- Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
- Triggers and bindings: https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings
