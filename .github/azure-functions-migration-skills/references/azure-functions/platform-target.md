# Plataforma objetivo: Runtime v4 y Node.js 24

## Propósito

Definir las comprobaciones mínimas para determinar si una Function App puede converger de forma segura hacia Azure Functions Runtime v4 y Node.js 24.

Esta referencia sustenta `assess-function-app`, `prepare-function-app` y `verify-function-app`.

## Reglas confirmadas

- Azure Functions solo mantiene soportado el runtime host 4.x; Runtime 2.x y 3.x están fuera de soporte.
- Node.js 24 está soportado para Function Apps Node.js y requiere una aplicación de 64 bits.
- Programming Model v4 requiere Azure Functions Runtime 4.25 o superior.
- Programming Model y Runtime son dimensiones distintas; que ambos tengan versión mayor 4 no implica que sean el mismo cambio.
- El entorno local, CI/CD y runtime hospedado deben usar versiones compatibles y, cuando sea posible, alineadas.

## Restricción de hosting

Node.js 24 no está disponible para Function Apps que permanezcan en **Linux Consumption**. Microsoft indica que Node.js 22 es la última versión agregada a ese plan.

Por tanto, si el objetivo es Node.js 24:

1. identifica sistema operativo y plan de hosting;
2. si es Linux Consumption, registra un bloqueo de plataforma;
3. evalúa la migración del hosting antes de declarar viable Node.js 24;
4. no cambies infraestructura automáticamente desde una skill de código.

Flex Consumption es el plan serverless recomendado por Microsoft para nuevos escenarios de consumo, pero la decisión de hosting pertenece al contexto de infraestructura del proyecto.

## Qué inspeccionar

Durante assessment o verificación, identifica sin leer secretos:

- versión declarada de Node.js en `package.json`;
- `FUNCTIONS_EXTENSION_VERSION` cuando pueda conocerse de forma segura;
- `FUNCTIONS_WORKER_RUNTIME` por nombre/valor no sensible cuando esté disponible mediante configuración aprobada;
- sistema operativo y plan de hosting si existe evidencia sanitizada;
- arquitectura 32/64 bits cuando aplique;
- versión de Azure Functions Core Tools usada para validación local;
- versión real de Node.js usada por build/test cuando pueda ejecutarse.

No abras pipelines o configuración sensible si están excluidos por la política del proyecto.

## Runtime v4, `host.json` y Extension Bundle

Para una Function App Node.js, comprueba también:

- `FUNCTIONS_EXTENSION_VERSION` objetivo `~4` en el entorno hospedado, cuando esa configuración sea parte de la evidencia aprobada;
- `host.json` con `version: "2.0"`;
- `extensionBundle` cuando el proyecto use bindings/extensiones no .NET.

La documentación vigente marca `Microsoft.Azure.Functions.ExtensionBundle` 4.x como **Active** y 2.x/3.x como **Deprecated**. Para una migración cuyo objetivo es Runtime v4, la referencia base recomendada es:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.0.0, 5.0.0)"
  }
}
```

No actualices el bundle como edición aislada sin revisar los bindings utilizados: un salto de extensión puede introducir cambios de configuración o comportamiento que deben verificarse contra la documentación del binding concreto.

## Criterio para Node.js 24

No basta con cambiar `engines.node`.

La convergencia requiere comprobar al menos:

```text
código y dependencias compatibles
        +
Node.js 24 en desarrollo/build
        +
Runtime v4 compatible
        +
hosting que soporte Node.js 24
        +
64 bits
```

## Validación local

Antes de modificar el runtime hospedado:

- instala dependencias con el lockfile del proyecto;
- compila con la versión objetivo de Node.js;
- ejecuta tests disponibles;
- ejecuta Azure Functions Core Tools v4 cuando sea viable;
- confirma que las Functions esperadas se registran.

No interpretes una compilación correcta como prueba suficiente de compatibilidad con el host Azure Functions.

## Fuentes oficiales

- Azure Functions Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
- Supported languages in Azure Functions: https://learn.microsoft.com/en-us/azure/azure-functions/supported-languages
- Compare Azure Functions runtime versions: https://learn.microsoft.com/en-us/azure/azure-functions/functions-versions
- Migrate Functions Runtime 3.x to 4.x: https://learn.microsoft.com/en-us/azure/azure-functions/migrate-version-3-version-4
- Azure Functions extension bundles: https://learn.microsoft.com/en-us/azure/azure-functions/extension-bundles
- `host.json` reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-host-json
- Develop and run Azure Functions locally: https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local
- Choose a Node.js version for Azure: https://learn.microsoft.com/en-us/azure/developer/javascript/choose-nodejs-version

## Vigencia

Las versiones soportadas y restricciones de hosting cambian. Antes de convertir estas reglas en una decisión de migración, confirma su vigencia en las fuentes oficiales anteriores.
