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

## Vista C4: Contexto

Este diagrama muestra el sistema desde afuera. Ayuda a explicar a una persona nueva que la Function App es una pieza dentro de un ecosistema con usuarios, Azure y sistemas externos.

```mermaid
C4Context
  title Contexto general de una Azure Functions App estandarizada

  Person(user, "Cliente o sistema consumidor", "Invoca endpoints HTTP o envia mensajes")
  System(functionApp, "Azure Functions App", "Ejecuta triggers, handlers y casos de uso")
  System_Ext(cosmos, "Cosmos DB / Storage de datos", "Persiste entidades, estados e idempotencia")
  System_Ext(serviceBus, "Service Bus / Broker", "Transporta eventos y mensajes asincronos")
  System_Ext(blob, "Blob Storage / Document Storage", "Almacena archivos generados")
  System_Ext(externalLibs, "Librerias externas", "ExcelJS, PDFKit, SDKs de terceros")

  Rel(user, functionApp, "HTTP / Queue / Timer trigger")
  Rel(functionApp, cosmos, "Lee y escribe datos")
  Rel(functionApp, serviceBus, "Publica o consume mensajes")
  Rel(functionApp, blob, "Guarda o lee archivos")
  Rel(functionApp, externalLibs, "Usa mediante providers/adapters")
```

## Vista C4: Contenedores internos

Este diagrama baja un nivel y muestra como se organiza el codigo dentro del repositorio.

```mermaid
C4Container
  title Contenedores internos del repositorio

  Container(functions, "functions", "Azure Functions v4", "Registra triggers con app.* y compone dependencias")
  Container(handler, "handler", "TypeScript", "Adapta entrada/salida del trigger")
  Container(application, "application", "TypeScript", "Coordina casos de uso")
  Container(domain, "domain", "TypeScript", "Contiene reglas puras e invariantes")
  Container(infrastructure, "infrastructure", "TypeScript + SDKs", "Implementa repositorios, publishers, providers y gateways")
  Container(sharedInfra, "shared/infrastructure", "TypeScript + Azure SDKs", "Centraliza configuracion y clientes")
  System_Ext(azureSdks, "Azure SDKs / librerias externas", "Cosmos, Service Bus, Blob, ExcelJS, etc.")

  Rel(functions, handler, "delegates request/message")
  Rel(handler, application, "execute(command/query)")
  Rel(application, domain, "usa reglas y modelos")
  Rel(application, infrastructure, "depende de contratos implementados por adapters")
  Rel(infrastructure, sharedInfra, "usa clientes compartidos")
  Rel(sharedInfra, azureSdks, "crea clientes / usa SDKs")
```

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

```mermaid
flowchart TD
  Functions["functions<br/>registra triggers"]
  Handler["handler<br/>adapta entrada/salida"]
  Application["application<br/>coordina casos de uso"]
  Domain["domain<br/>protege reglas"]
  Contracts["contracts<br/>repository/publisher/generator"]
  Infrastructure["infrastructure<br/>adapters SDKs"]
  Shared["shared/infrastructure<br/>config y clientes"]
  SDKs["Azure SDKs / librerias externas"]

  Functions --> Handler
  Handler --> Application
  Application --> Domain
  Application --> Contracts
  Infrastructure -. implementa .-> Contracts
  Infrastructure --> Shared
  Shared --> SDKs
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
