# Azure SDK para JavaScript

## Propósito

Guiar recomendaciones de versiones para paquetes Azure SDK durante migraciones a Azure Functions Runtime v4, Programming Model v4 y Node.js objetivo.

Esta referencia sustenta `assess-function-app`, `prepare-function-app` y `migrate-shared-component` cuando el repositorio usa paquetes `@azure/*`, `@azure-rest/*` o SDKs Azure legacy.

## Regla base

No fijes una versión objetivo por memoria ni por `latest` automático. Para cada paquete detectado:

1. identifica versión actual desde `package.json` y lockfile;
2. confirma si el paquete se usa en runtime, tooling o pruebas;
3. consulta fuente oficial vigente del paquete;
4. identifica la última versión estable aplicable y versiones preview relevantes;
5. revisa changelog, migration guide o README oficial si hay salto mayor;
6. valida compatibilidad con Node.js objetivo y TypeScript del repo;
7. recomienda el mínimo salto razonable para el objetivo;
8. registra riesgos, breaking changes y validaciones requeridas.

## Fuentes oficiales

Usa estas fuentes como punto de entrada y registra la URL concreta consultada:

- Azure SDK package index para JavaScript: https://learn.microsoft.com/en-us/azure/developer/javascript/azure-sdk-library-package-index
- Azure SDK for JavaScript repository/docs: https://azure.github.io/azure-sdk-for-js/
- Azure SDK releases para JavaScript: https://azure.github.io/azure-sdk/releases/latest/js.html
- npm package page del paquete detectado.
- README/changelog oficial del paquete detectado.

Si las fuentes difieren, prioriza documentación oficial del paquete y registra la discrepancia.

## Catálogo detectable

Detecta paquetes por scope y familia. La lista operativa no reemplaza el índice oficial.

```text
@azure/functions
@azure-rest/*
@azure/arm-*
@azure/core-*
@azure/identity
@azure/app-configuration
@azure/cosmos
@azure/data-tables
@azure/eventgrid
@azure/event-hubs
@azure/keyvault-*
@azure/monitor-*
@azure/search-documents
@azure/service-bus
@azure/storage-blob
@azure/storage-file-datalake
@azure/storage-file-share
@azure/storage-queue
@azure/communication-*
@azure/ai-*
@azure/openai
```

También identifica SDKs legacy o no alineados con el scope moderno, por ejemplo paquetes `azure-*`, `documentdb` o clientes antiguos reemplazados por paquetes `@azure/*`.

## Client libraries vs management libraries

Clasifica el tipo de SDK:

- client libraries: consumen servicios existentes desde la aplicación;
- management libraries `@azure/arm-*`: administran recursos Azure;
- runtime package `@azure/functions`: define el Programming Model de Functions.

No reemplaces una client library por una management library ni al revés. Si el repo usa `@azure/arm-*` en runtime, registra el riesgo y confirma si corresponde al comportamiento existente.

## Criterio de versión

Recomendación preferida:

```text
paquete
actual
objetivo sugerido
fuente oficial consultada
razón
breaking changes relevantes
archivos/APIs impactados
validación requerida
```

Usa versiones estables cuando exista una ruta estable suficiente. Propón preview solo si:

- el repo ya depende de preview;
- una capacidad requerida existe únicamente en preview;
- la documentación oficial indica que esa ruta es necesaria para el objetivo.

## Baseline candidato para Runtime v4

Cuando el repo use alguno de estos paquetes, considera esta baseline estabilizada como versión objetivo inicial, siempre verificando fuente oficial vigente antes de modificar `package.json`:

```json
{
  "dependencies": {
    "@azure/cosmos": "^4.10.0",
    "@azure/functions": "~4.16.2",
    "@azure/service-bus": "^7.9.5",
    "@azure/storage-blob": "^12.33.0",
    "durable-functions": "~3.5.0"
  }
}
```

Criterios:

- `@azure/functions` usa `~` para evitar saltos menores inesperados del Programming Model durante una migración.
- `durable-functions` usa `~` porque el paquete define APIs de orquestación sensibles al modelo v4.
- Azure SDK clients pueden usar `^` cuando el paquete mantiene semver estable y no se detectan breaking changes relevantes.
- No agregues un SDK ausente solo porque está en la baseline; debe existir uso real o una migración desde SDK legacy equivalente.
- Si el paquete oficial publicó una versión estable más reciente, registra si conviene mantener esta baseline por reproducibilidad o adoptar la nueva por compatibilidad/seguridad.

Fuentes a comprobar por paquete:

- `@azure/functions`: npm y guía oficial de Programming Model v4.
- `durable-functions`: npm y guía oficial Durable Functions Node.js v4.
- SDKs `@azure/*`: índice oficial Azure SDK, releases oficiales y README/changelog del paquete.
- `@azure/cosmos`: carga también `../infrastructure/cosmos-mongo-persistence.md` si el cambio afecta queries, paginación o repositorios.

## Alcance

La recomendación puede quedar como evidencia sin modificar dependencias. Actualiza `package.json` y lockfile únicamente cuando el skill ejecutado tenga alcance para preparar dependencias o migrar el componente compartido afectado.

## No hacer

- No generar una matriz completa de todos los paquetes Azure si el repo no los usa.
- No actualizar todos los SDKs Azure por estar bajo `@azure/*`.
- No recomendar `latest` sin versión concreta, fuente y razón.
- No mezclar cambio de SDK con cambio funcional.
- No ocultar breaking changes como deuda menor si afectan comportamiento observable.
