# Manual de migracion y estandarizacion para Azure Functions

Este documento es la entrada principal del manual para migrar y estandarizar repositorios de Azure Functions en Node.js/TypeScript.

La guia esta separada en archivos para que sea facil usarla en tres momentos distintos:

- Onboarding de una persona nueva.
- Migracion tecnica de Azure Functions modelo v3 a modelo v4.
- Reestructuracion de codigo legacy hacia una arquitectura testeable y preparada para cambios futuros.

La idea central es sencilla: **la Azure Function debe ser un borde de entrada, no el lugar donde vive todo el negocio**.

## Audiencia

- Desarrolladores junior que estan entrando a repositorios de Azure Functions.
- Desarrolladores que deben migrar funciones legacy de modelo v3 a modelo v4.
- Lideres tecnicos que quieren estandarizar varios repositorios.
- Equipos que mantienen funciones con logica monolitica en `index.js`, `index.ts` o en el archivo del trigger.
- Equipos que quieren mejorar testabilidad sin cambiar la funcionalidad observable.

## Ruta recomendada

El proceso completo tiene cuatro pasos. La migracion tecnica va primero; la reestructura viene despues, cuando ya sabemos que el comportamiento en modelo v4 sigue siendo el mismo.

```mermaid
flowchart TD
  A["1. Migracion tecnica<br/>v3 -> v4<br/>mantener comportamiento"]
  B["2. Reestructura<br/>separar function, handler, use case, domain, infrastructure"]
  C["3. Proveedores<br/>encapsular librerias externas como ExcelJS"]
  D["4. Tests y migraciones futuras<br/>validar comportamiento y reducir acoplamiento"]

  A --> B --> C --> D
```

Regla principal:

> Primero migrar sin romper. Despues reestructurar con tests.

## Decision de arquitectura

El estandar propuesto separa el sistema en capas con responsabilidades claras:

- `functions`: registra triggers y compone dependencias reales.
- `handler`: adapta HTTP, queue, timer o activity hacia comandos internos.
- `application`: coordina casos de uso.
- `domain`: protege reglas puras.
- `infrastructure`: implementa detalles tecnicos con SDKs externos.
- `shared/infrastructure`: centraliza configuracion y clientes reutilizables.

Esta separacion no busca crear carpetas por estetica. Busca que cada cambio tenga un lugar natural:

- Cambio de runtime: tocar `functions` y `handler`.
- Cambio de storage: tocar `infrastructure/persistence`.
- Cambio de broker: tocar `infrastructure/messaging`.
- Cambio de libreria como ExcelJS: tocar el provider.
- Cambio de regla: tocar `domain` y tests.

## Vista de contexto

Esta vista cumple el rol de un C4 Context, pero usa `flowchart` para evitar texto sobre flechas. Las relaciones se explican en la tabla posterior.

```mermaid
flowchart LR
  Consumer["Cliente o sistema consumidor"]

  subgraph Azure["Azure / Runtime"]
    FunctionApp["Azure Functions App<br/>triggers + handlers + use cases"]
  end

  subgraph Data["Datos y archivos"]
    Cosmos["Cosmos DB<br/>entidades, estados, idempotencia"]
    Blob["Blob Storage<br/>archivos generados"]
  end

  subgraph Messaging["Mensajeria"]
    Bus["Service Bus / Broker<br/>eventos y comandos asincronos"]
  end

  subgraph External["Dependencias externas"]
    Libraries["Providers / librerias<br/>ExcelJS, PDFKit, SDKs terceros"]
  end

  Consumer --> FunctionApp
  FunctionApp --> Cosmos
  FunctionApp --> Blob
  FunctionApp --> Bus
  FunctionApp --> Libraries

  classDef actor fill:#374151,stroke:#111827,color:#FFFFFF
  classDef app fill:#1D4ED8,stroke:#1E3A8A,color:#FFFFFF
  classDef data fill:#15803D,stroke:#14532D,color:#FFFFFF
  classDef msg fill:#B45309,stroke:#78350F,color:#FFFFFF
  classDef ext fill:#BE185D,stroke:#831843,color:#FFFFFF

  class Consumer actor
  class FunctionApp app
  class Cosmos,Blob data
  class Bus msg
  class Libraries ext
```

| Relacion | Significado |
| --- | --- |
| Consumidor -> Function App | Invoca HTTP, envia mensajes o dispara procesos. |
| Function App -> Cosmos DB | Lee y escribe datos de negocio, estados e idempotencia. |
| Function App -> Blob Storage | Guarda o lee archivos generados. |
| Function App -> Broker | Publica o consume eventos asincronos. |
| Function App -> Providers | Usa librerias externas mediante adaptadores. |

## Vista de contenedores internos

Esta vista cumple el rol de un C4 Container. Muestra los contenedores logicos del repositorio sin saturar las flechas.

```mermaid
flowchart TD
  subgraph Entry["Entrada y composicion"]
    Functions["functions<br/>registra triggers app.*"]
    Handler["handler<br/>adapta entrada/salida"]
  end

  subgraph Core["Nucleo de aplicacion"]
    Application["application<br/>casos de uso"]
    Domain["domain<br/>reglas puras"]
    Contracts["contracts<br/>repository / publisher / provider"]
  end

  subgraph Adapters["Adaptadores tecnicos"]
    Infrastructure["infrastructure<br/>Cosmos, Service Bus, providers"]
    Shared["shared/infrastructure<br/>configuracion y clientes"]
    SDKs["Azure SDKs / librerias externas"]
  end

  Functions --> Handler
  Handler --> Application
  Application --> Domain
  Application --> Contracts
  Infrastructure -.-> Contracts
  Infrastructure --> Shared
  Shared --> SDKs

  classDef entry fill:#1D4ED8,stroke:#1E3A8A,color:#FFFFFF
  classDef core fill:#15803D,stroke:#14532D,color:#FFFFFF
  classDef contract fill:#B45309,stroke:#78350F,color:#FFFFFF
  classDef adapter fill:#BE185D,stroke:#831843,color:#FFFFFF
  classDef shared fill:#6D28D9,stroke:#4C1D95,color:#FFFFFF
  classDef external fill:#374151,stroke:#111827,color:#FFFFFF

  class Functions,Handler entry
  class Application,Domain core
  class Contracts contract
  class Infrastructure adapter
  class Shared shared
  class SDKs external
```

| Contenedor | Responsabilidad |
| --- | --- |
| `functions` | Registra triggers y construye dependencias reales. |
| `handler` | Traduce entrada/salida del trigger. |
| `application` | Coordina casos de uso. |
| `domain` | Protege reglas e invariantes. |
| `contracts` | Define interfaces que necesita el caso de uso. |
| `infrastructure` | Implementa contratos usando SDKs o librerias reales. |
| `shared/infrastructure` | Centraliza configuracion y clientes reutilizables. |

## Indice

1. [Migracion de Azure Functions v3 a v4](./azure-functions-standard/01-migracion-v3-v4.md)
   - Como reconocer una funcion legacy.
   - Que identificar antes de tocar codigo.
   - Ejemplo legacy completo con `function.json` + `index.js`.
   - Migracion minima a Programming Model v4.
   - Checklist de validacion.

2. [Reestructuracion hacia una arquitectura testeable](./azure-functions-standard/02-reestructuracion-testable.md)
   - AS IS despues de migrar.
   - TO BE por capas.
   - Composition root.
   - Handler.
   - Use case.
   - Domain.
   - Repository e infrastructure.
   - Shared infrastructure.

3. [Proveedores para librerias externas](./azure-functions-standard/03-proveedores-librerias.md)
   - Concepto de proveedor/adaptador.
   - Ejemplo con ExcelJS.
   - Contratos internos.
   - Tests sin depender de la libreria real.

4. [Tests, beneficios y migraciones futuras](./azure-functions-standard/04-tests-y-migraciones-futuras.md)
   - Tests por capa.
   - Beneficios de testabilidad.
   - Migraciones futuras de runtime, storage, broker o librerias.
   - Checklist de onboarding, migracion y entrega.

## Guia rapida de lectura

| Situacion | Por donde empezar |
| --- | --- |
| El repo tiene `function.json` e `index.js` | [Migracion v3 a v4](./azure-functions-standard/01-migracion-v3-v4.md) |
| Ya usa `app.http` pero todo esta en la function | [Reestructuracion testeable](./azure-functions-standard/02-reestructuracion-testable.md) |
| Hay librerias externas como ExcelJS en el use case | [Proveedores para librerias](./azure-functions-standard/03-proveedores-librerias.md) |
| Se quiere validar calidad antes de entregar | [Tests y migraciones futuras](./azure-functions-standard/04-tests-y-migraciones-futuras.md) |
| Una persona nueva necesita entender el repo | Leer este documento y luego el checklist de onboarding |

## Diagramas incluidos

Cada diagrama tiene un objetivo distinto:

| Diagrama | Ubicacion | Proposito |
| --- | --- | --- |
| Ruta recomendada | Documento principal | Mostrar el orden de trabajo: migrar, reestructurar, providers, tests. |
| Vista de contexto | Documento principal | Explicar como la Function App se relaciona con consumidores y servicios externos. |
| Vista de contenedores internos | Documento principal | Explicar las capas internas del repositorio. |
| Equivalencias v3 -> v4 | Guia de migracion | Mapear elementos legacy a Programming Model v4. |
| AS IS / TO BE | Guia de reestructuracion | Comparar logica monolitica contra flujo separado por capas. |
| Proveedor por capas | Guia de proveedores | Mostrar como encapsular librerias como ExcelJS. |
| Estrategia de tests | Guia de tests | Mostrar que se prueba en cada capa. |
| Migraciones futuras | Guia de tests | Separar lo estable de lo reemplazable. |

## Estandar final esperado

```text
src/
├── functions/
├── Capability/
│   ├── api/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   └── handler.ts
└── shared/
    └── infrastructure/
```

## Como usar este manual

- Si el repo todavia usa `function.json`, empezar por la guia de migracion.
- Si ya esta en modelo v4 pero la logica esta mezclada, ir a la guia de reestructuracion.
- Si se usan librerias como ExcelJS, revisar proveedores.
- Antes de cerrar un cambio, revisar tests, beneficios y checklists.

## Resultado esperado

Al aplicar este manual, el equipo deberia poder:

- Migrar funciones v3 a v4 sin cambiar comportamiento.
- Separar funciones monoliticas en piezas comprensibles.
- Probar reglas y casos de uso sin levantar Azure.
- Cambiar proveedores tecnicos sin reescribir negocio.
- Hacer onboarding leyendo flujo, contratos y tests.
