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

## Baseline runtime

Carga `runtime-baseline.md` solo cuando necesites proponer versiones concretas para `package.json`.

Si el paquete es `@azure/cosmos`, carga también `../infrastructure/cosmos-mongo-persistence.md` si el cambio afecta queries, paginación o repositorios.

## Alcance

La recomendación puede quedar como evidencia sin modificar dependencias. Actualiza `package.json` y lockfile únicamente cuando el skill ejecutado tenga alcance para preparar dependencias o migrar el componente compartido afectado.

## No hacer

- No generar una matriz completa de todos los paquetes Azure si el repo no los usa.
- No actualizar todos los SDKs Azure por estar bajo `@azure/*`.
- No recomendar `latest` sin versión concreta, fuente y razón.
- No mezclar cambio de SDK con cambio funcional.
- No ocultar breaking changes como deuda menor si afectan comportamiento observable.
