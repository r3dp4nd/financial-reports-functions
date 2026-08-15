# Manual de migracion y estandarizacion para Azure Functions

## 1. Audiencia

Este documento esta dirigido a:

- Developers junior que estan entrando a repositorios de Azure Functions.
- Developers que deben migrar funciones legacy de modelo v3 a modelo v4.
- Tech leads que quieren estandarizar la estructura de varios repositorios.
- Equipos que mantienen funciones con toda la logica dentro de `index.js`, `index.ts` o el archivo del trigger.
- Equipos que necesitan mejorar testabilidad sin cambiar la funcionalidad observable.

## 2. Objetivo

El objetivo no es solo cambiar sintaxis de Azure Functions. El objetivo es hacer una migracion segura y despues ordenar el codigo para que sea mantenible, testeable y preparado para migraciones futuras.

La guia separa el trabajo en dos fases:

1. **Migracion tecnica v3 -> v4**
   Convertir `function.json + index.js/index.ts` a Programming Model v4 con `app.*`, manteniendo el mismo comportamiento.

2. **Reestructura arquitectonica**
   Separar responsabilidades en `functions`, `handler`, `application`, `domain`, `repository`, `infrastructure` y `shared/infrastructure`.

Regla principal:

> Primero migrar sin romper. Despues reestructurar con tests.

## 3. Ruta general

```text
AS IS legacy
function.json + index.js/index.ts
logica monolitica
        |
        v
Migracion minima a modelo v4
src/functions/*.function.ts con app.*
misma ruta, mismo trigger, misma respuesta
        |
        v
Reestructura progresiva
function -> handler -> use case -> domain -> repository -> infrastructure
        |
        v
TO BE estandar
codigo testeable, desacoplado y preparado para futuras migraciones
```

## 4. Parte 1: Migracion de modelo v3 a modelo v4

La migracion debe ir primero. Si una funcion es legacy o tiene mucha logica mezclada, no conviene refactorizar mientras se cambia el runtime. Eso aumenta el riesgo porque si algo falla no sera claro si fallo la migracion o el refactor.

### 4.1. Como reconocer una funcion legacy

Una funcion legacy suele tener esta estructura:

```text
CreateEntity/
├── function.json
└── index.js
```

o:

```text
CreateEntity/
├── function.json
└── index.ts
```

Senales comunes:

- Existe `function.json`.
- La funcion exporta un handler desde `index.js` o `index.ts`.
- La respuesta HTTP se asigna con `context.res`.
- La funcion usa `Context`, `AzureFunction`, `context.log` o `context.done`.
- La logica de negocio esta mezclada con validacion HTTP, SDKs, variables de entorno y respuesta.
- Cosmos, Blob Storage, Service Bus o APIs externas se usan directamente dentro del handler.

### 4.2. Que identificar antes de tocar codigo

Antes de migrar, documentar el comportamiento actual:

```text
Trigger:        HTTP / Queue / Timer / Blob / Cosmos / Durable
Entrada:        body / query / headers / queue message / timer
Salida:         HTTP response / evento / documento / blob
Status codes:   200 / 201 / 202 / 400 / 404 / 409 / 500
Variables:      process.env.*
SDKs:           Cosmos / Service Bus / Blob / HTTP clients
Reglas:         validaciones, estados, calculos, idempotencia
Errores:        errores esperados y errores inesperados
Consumidores:   clientes HTTP, colas, topics, procesos aguas abajo
```

Leer en este orden:

1. `function.json`, para conocer trigger, bindings, ruta, metodo y auth.
2. `index.js` o `index.ts`, para conocer el flujo real.
3. Variables de entorno usadas.
4. Dependencias externas.
5. Contrato observable: entrada, salida, errores y efectos.

### 4.3. Ejemplo completo AS IS en modelo v3

`function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "entities"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

`index.js`:

```js
const crypto = require("node:crypto");
const {CosmosClient} = require("@azure/cosmos");

module.exports = async function (context, req) {
  try {
    const body = req.body;

    if (!body || !body.name || !body.name.trim()) {
      context.res = {
        status: 400,
        body: {
          code: "INVALID_REQUEST",
          message: "name is required"
        }
      };
      return;
    }

    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    const databaseName = process.env.COSMOS_DATABASE;
    const containerName = process.env.COSMOS_ENTITIES_CONTAINER;

    if (!endpoint || !key || !databaseName || !containerName) {
      throw new Error("Cosmos configuration is incomplete");
    }

    const client = new CosmosClient({
      endpoint,
      key
    });

    const container = client
      .database(databaseName)
      .container(containerName);

    const entityId = crypto.randomUUID();

    const entity = {
      id: entityId,
      entityId,
      name: body.name.trim(),
      status: "CREATED",
      createdAt: new Date().toISOString()
    };

    await container.items.create(entity);

    context.res = {
      status: 201,
      body: {
        entityId: entity.entityId,
        status: entity.status
      }
    };
  } catch (error) {
    context.log.error("Unexpected error creating entity", error);

    context.res = {
      status: 500,
      body: {
        code: "INTERNAL_ERROR",
        message: "Unable to create entity"
      }
    };
  }
};
```

Problemas del AS IS:

- La funcion mezcla transporte HTTP, configuracion, Cosmos, reglas, fechas, IDs y respuesta.
- Es dificil probar sin Cosmos.
- Es dificil saber que parte fallo.
- Es riesgoso cambiar una regla porque se toca el trigger.
- Migrar a otro storage o runtime implica reescribir demasiado.

### 4.4. Migracion minima a modelo v4

El primer paso es mover el registro del trigger a modelo v4, sin reestructurar todavia.

`src/functions/create-entity.function.ts`:

```ts
import crypto from "node:crypto";

import {CosmosClient} from "@azure/cosmos";
import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";

async function createEntity(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as { name?: string };

    if (!body || !body.name || !body.name.trim()) {
      return {
        status: 400,
        jsonBody: {
          code: "INVALID_REQUEST",
          message: "name is required"
        }
      };
    }

    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;
    const databaseName = process.env.COSMOS_DATABASE;
    const containerName = process.env.COSMOS_ENTITIES_CONTAINER;

    if (!endpoint || !key || !databaseName || !containerName) {
      throw new Error("Cosmos configuration is incomplete");
    }

    const client = new CosmosClient({
      endpoint,
      key
    });

    const container = client
      .database(databaseName)
      .container(containerName);

    const entityId = crypto.randomUUID();

    const entity = {
      id: entityId,
      entityId,
      name: body.name.trim(),
      status: "CREATED",
      createdAt: new Date().toISOString()
    };

    await container.items.create(entity);

    return {
      status: 201,
      jsonBody: {
        entityId: entity.entityId,
        status: entity.status
      }
    };
  } catch (error: unknown) {
    context.error("Unexpected error creating entity", error);

    return {
      status: 500,
      jsonBody: {
        code: "INTERNAL_ERROR",
        message: "Unable to create entity"
      }
    };
  }
}

app.http("CreateEntity", {
  methods: ["POST"],
  route: "entities",
  authLevel: "function",
  handler: createEntity
});
```

Esta version no es la estructura final. Todavia tiene logica monolitica. Pero ya esta en modelo v4.

### 4.5. Equivalencias v3 -> v4

```text
Modelo v3                         Modelo v4
---------------------------------------------------------------------
function.json                     app.http / app.timer / app.storageQueue
index.js / index.ts               src/functions/*.function.ts
context.res = {...}               return HttpResponseInit
Context                           InvocationContext
req.body                          await request.json()
bindings declarativos             bindings registrados en codigo
carpeta por funcion legacy         archivo de registro en src/functions
```

### 4.6. Checklist de migracion v3 -> v4

Validar que se mantenga:

- Misma ruta HTTP.
- Mismos metodos.
- Mismo `authLevel`.
- Mismo nombre de queue, topic, timer o trigger.
- Mismas variables de entorno.
- Mismos status codes.
- Mismo body de respuesta.
- Mismos eventos o documentos generados.
- Mismo manejo de errores esperado.

La migracion tecnica termina cuando el comportamiento observable es el mismo en modelo v4.

## 5. Parte 2: Reestructuracion despues de migrar

Una vez que la funcion ya corre en modelo v4, se puede reestructurar. Esta segunda fase busca testabilidad, mantenibilidad y menor acoplamiento.

### 5.1. AS IS despues de migracion minima

```text
src/functions/create-entity.function.ts
├── registra trigger
├── lee request
├── valida body
├── lee variables de entorno
├── crea CosmosClient
├── aplica reglas
├── crea documento
├── guarda en Cosmos
├── maneja errores
└── arma respuesta HTTP
```

### 5.2. TO BE deseado

```text
src/functions/create-entity.function.ts
        |
        v
src/CreateEntity/handler.ts
        |
        v
src/CreateEntity/application/create-entity.use-case.ts
        |
        v
src/CreateEntity/domain/entity.ts
        |
        v
src/CreateEntity/domain/entity.repository.ts
        ^
        |
src/CreateEntity/infrastructure/persistence/cosmos-entity.repository.ts
        |
        v
src/shared/infrastructure/azure/cosmos/cosmos.client.ts
```

Beneficio de esta estructura:

- `functions` solo registra triggers y compone dependencias.
- `handler` adapta HTTP, queue, timer o activity al caso de uso.
- `application` coordina la accion.
- `domain` protege reglas puras.
- `repository` define contratos.
- `infrastructure` encapsula Azure SDKs.
- `shared/infrastructure` centraliza clientes y configuracion.
- Los tests pueden cubrir comportamiento sin levantar Azure.

## 6. Ejemplo completo TO BE

### 6.1. Estructura final

```text
src/
├── functions/
│   └── create-entity.function.ts
├── CreateEntity/
│   ├── application/
│   │   ├── create-entity.command.ts
│   │   ├── create-entity.result.ts
│   │   ├── create-entity.use-case.ts
│   │   └── create-entity-validation.error.ts
│   ├── domain/
│   │   ├── entity.ts
│   │   └── entity.repository.ts
│   ├── infrastructure/
│   │   └── persistence/
│   │       └── cosmos-entity.repository.ts
│   └── handler.ts
└── shared/
    └── infrastructure/
        └── azure/
            ├── config/
            │   └── cosmos.config.ts
            └── cosmos/
                └── cosmos.client.ts
```

### 6.2. Composition root

El composition root es el unico lugar donde se construyen dependencias reales. Aqui se decide que implementacion concreta usara el caso de uso: Cosmos, Service Bus, Blob, un generador de IDs real, reloj real, etc.

Esto ayuda a que el resto del codigo trabaje contra contratos y no contra SDKs.

`src/functions/create-entity.function.ts`:

```ts
import crypto from "node:crypto";

import {app} from "@azure/functions";

import {CreateEntityUseCase} from "../CreateEntity/application/create-entity.use-case";
import {createCreateEntityHandler} from "../CreateEntity/handler";
import {CosmosEntityRepository} from "../CreateEntity/infrastructure/persistence/cosmos-entity.repository";
import {entitiesContainer} from "../shared/infrastructure/azure/cosmos/cosmos.client";

const repository = new CosmosEntityRepository(entitiesContainer);

const useCase = new CreateEntityUseCase({
  repository,
  createEntityId: () => crypto.randomUUID()
});

const handler = createCreateEntityHandler({
  useCase,
  now: () => new Date().toISOString()
});

app.http("CreateEntity", {
  methods: ["POST"],
  route: "entities",
  authLevel: "function",
  handler
});
```

Puntos importantes:

- `CosmosEntityRepository` es la implementacion real de persistencia.
- `CreateEntityUseCase` recibe dependencias por constructor.
- `createEntityId` y `now` se inyectan para poder reemplazarlos en tests.
- `app.http` queda limitado al registro del trigger.

### 6.3. Handler

El handler es el adaptador de entrada. En este ejemplo adapta una solicitud HTTP al comando que entiende la aplicacion.

La interfaz `CreateEntityHandlerDependencies` existe para que el handler no cree dependencias internamente. Gracias a eso se puede probar con un `useCase` falso y un reloj controlado.

`src/CreateEntity/handler.ts`:

```ts
import {HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions";

import {CreateEntityCommand} from "./application/create-entity.command";
import {CreateEntityResult} from "./application/create-entity.result";
import {CreateEntityValidationError} from "./application/create-entity-validation.error";

export interface CreateEntityHandlerDependencies {
  useCase: {
    execute(command: CreateEntityCommand): Promise<CreateEntityResult>;
  };
  now: () => string;
}

interface CreateEntityHttpRequest {
  name?: string;
}

export function createCreateEntityHandler(dependencies: CreateEntityHandlerDependencies) {
  return async function (
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    try {
      const body = await readBody(request);

      const result = await dependencies.useCase.execute({
        name: body.name,
        requestedAt: dependencies.now()
      });

      return {
        status: 201,
        jsonBody: result
      };
    } catch (error: unknown) {
      if (error instanceof CreateEntityValidationError) {
        return {
          status: 400,
          jsonBody: {
            code: "INVALID_REQUEST",
            message: error.message
          }
        };
      }

      context.error("Unexpected error creating entity", error);

      return {
        status: 500,
        jsonBody: {
          code: "INTERNAL_ERROR",
          message: "Unable to create entity"
        }
      };
    }
  };
}

async function readBody(request: HttpRequest): Promise<CreateEntityHttpRequest> {
  try {
    const body = await request.json();

    if (typeof body !== "object" || body === null) {
      return {};
    }

    return body as CreateEntityHttpRequest;
  } catch {
    return {};
  }
}
```

Puntos importantes:

- `CreateEntityHttpRequest` representa el contrato del body HTTP.
- `CreateEntityCommand` representa la entrada interna del caso de uso.
- `CreateEntityResult` representa la salida interna del caso de uso.
- `CreateEntityValidationError` permite traducir errores de validacion a HTTP `400`.
- El handler sabe de HTTP, pero no sabe de Cosmos.

### 6.4. Command, result y error

Estos archivos parecen pequenos, pero son importantes porque documentan las fronteras del caso de uso.

`CreateEntityCommand` define que necesita la aplicacion para ejecutar la accion. `CreateEntityResult` define que devuelve. El error especifico permite diferenciar fallos esperados de fallos inesperados.

`src/CreateEntity/application/create-entity.command.ts`:

```ts
export interface CreateEntityCommand {
  name: string | undefined;
  requestedAt: string;
}
```

`src/CreateEntity/application/create-entity.result.ts`:

```ts
export interface CreateEntityResult {
  entityId: string;
  status: "CREATED";
}
```

`src/CreateEntity/application/create-entity-validation.error.ts`:

```ts
export class CreateEntityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateEntityValidationError";
  }
}
```

Beneficio:

- Si cambia el contrato interno, TypeScript muestra que archivos deben actualizarse.
- Los tests pueden construir comandos claros.
- El handler no necesita conocer detalles internos del dominio.

### 6.5. Use case

El use case coordina la accion de negocio. No sabe si la funcion fue llamada por HTTP, queue o timer. Tampoco sabe si se guarda en Cosmos, SQL o memoria.

La interfaz `CreateEntityUseCaseDependencies` agrupa las dependencias que el caso de uso necesita. En este ejemplo son un repositorio y una funcion para crear IDs.

`src/CreateEntity/application/create-entity.use-case.ts`:

```ts
import {Entity} from "../domain/entity";
import {EntityRepository} from "../domain/entity.repository";
import {CreateEntityCommand} from "./create-entity.command";
import {CreateEntityResult} from "./create-entity.result";
import {CreateEntityValidationError} from "./create-entity-validation.error";

export interface CreateEntityUseCaseDependencies {
  repository: EntityRepository;
  createEntityId: () => string;
}

export class CreateEntityUseCase {
  constructor(private readonly dependencies: CreateEntityUseCaseDependencies) {
  }

  async execute(command: CreateEntityCommand): Promise<CreateEntityResult> {
    if (!command.name?.trim()) {
      throw new CreateEntityValidationError("name is required");
    }

    if (!command.requestedAt?.trim()) {
      throw new CreateEntityValidationError("requestedAt is required");
    }

    const entity = Entity.create({
      entityId: this.dependencies.createEntityId(),
      name: command.name.trim(),
      createdAt: command.requestedAt
    });

    await this.dependencies.repository.save(entity);

    return {
      entityId: entity.entityId,
      status: entity.status
    };
  }
}
```

Puntos importantes:

- `repository` es un contrato, no una implementacion concreta.
- `createEntityId` evita usar `crypto.randomUUID()` dentro del caso de uso.
- Las validaciones del flujo se convierten en errores esperados.
- La entidad se crea mediante dominio, no como objeto libre.

### 6.6. Dominio

El dominio contiene reglas que deben cumplirse siempre, sin importar desde donde se invoque la operacion.

Las interfaces `CreateEntityInput` y `RestoreEntityInput` separan dos intenciones distintas:

- `create`: crear una entidad nueva aplicando reglas.
- `restore`: reconstruir una entidad desde persistencia.

`src/CreateEntity/domain/entity.ts`:

```ts
export interface CreateEntityInput {
  entityId: string;
  name: string;
  createdAt: string;
}

export interface RestoreEntityInput {
  entityId: string;
  name: string;
  status: "CREATED";
  createdAt: string;
}

export class Entity {
  private constructor(
    public readonly entityId: string,
    public readonly name: string,
    public readonly status: "CREATED",
    public readonly createdAt: string
  ) {
  }

  static create(input: CreateEntityInput): Entity {
    if (!input.entityId.trim()) {
      throw new Error("entityId is required");
    }

    if (!input.name.trim()) {
      throw new Error("name is required");
    }

    if (!input.createdAt.trim()) {
      throw new Error("createdAt is required");
    }

    const createdAtDate = new Date(input.createdAt);

    if (Number.isNaN(createdAtDate.getTime())) {
      throw new Error("createdAt is invalid");
    }

    return new Entity(
      input.entityId,
      input.name,
      "CREATED",
      input.createdAt
    );
  }

  static restore(input: RestoreEntityInput): Entity {
    return new Entity(
      input.entityId,
      input.name,
      input.status,
      input.createdAt
    );
  }
}
```

Puntos importantes:

- El constructor es privado para obligar a crear entidades por metodos controlados.
- `create` valida invariantes.
- `restore` evita duplicar logica de mapeo cuando se lee desde base de datos.
- El dominio no importa Azure ni lee variables de entorno.

### 6.7. Repository contract

El repository contract expresa lo que el negocio necesita de la persistencia. No debe parecerse demasiado al SDK externo.

`src/CreateEntity/domain/entity.repository.ts`:

```ts
import {Entity} from "./entity";

export interface EntityRepository {
  save(entity: Entity): Promise<void>;
  findById(entityId: string): Promise<Entity | null>;
}
```

Beneficio:

- El use case puede guardar y leer entidades sin saber que existe Cosmos.
- Para migrar a PostgreSQL, SQL Server o MongoDB se crea otra implementacion del mismo contrato.
- Los tests del use case pueden usar mocks simples.

### 6.8. Cosmos repository

Este archivo es un adaptador. Traduce el contrato `EntityRepository` a operaciones concretas de Cosmos DB.

La interfaz `CosmosEntityDocument` representa el documento como se guarda fisicamente. Separarla de `Entity` evita que el modelo de base de datos contamine el dominio.

`src/CreateEntity/infrastructure/persistence/cosmos-entity.repository.ts`:

```ts
import {Container} from "@azure/cosmos";

import {Entity} from "../../domain/entity";
import {EntityRepository} from "../../domain/entity.repository";

interface CosmosEntityDocument {
  id: string;
  entityId: string;
  name: string;
  status: "CREATED";
  createdAt: string;
}

export class CosmosEntityRepository implements EntityRepository {
  constructor(private readonly container: Container) {
  }

  async save(entity: Entity): Promise<void> {
    const document: CosmosEntityDocument = {
      id: entity.entityId,
      entityId: entity.entityId,
      name: entity.name,
      status: entity.status,
      createdAt: entity.createdAt
    };

    await this.container.items.create(document);
  }

  async findById(entityId: string): Promise<Entity | null> {
    try {
      const response = await this.container
        .item(entityId, entityId)
        .read<CosmosEntityDocument>();

      if (!response.resource) {
        return null;
      }

      return Entity.restore({
        entityId: response.resource.entityId,
        name: response.resource.name,
        status: response.resource.status,
        createdAt: response.resource.createdAt
      });
    } catch (error: unknown) {
      if (this.hasStatusCode(error, 404)) {
        return null;
      }

      throw error;
    }
  }

  private hasStatusCode(error: unknown, expectedStatusCode: number): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      (
        ("code" in error && error.code === expectedStatusCode) ||
        ("statusCode" in error && error.statusCode === expectedStatusCode)
      )
    );
  }
}
```

Puntos importantes:

- Aqui si es correcto importar `@azure/cosmos`.
- `save` mapea una entidad de dominio a un documento Cosmos.
- `findById` mapea un documento Cosmos de regreso al dominio con `Entity.restore`.
- Los errores tecnicos se manejan en infraestructura, no en el use case.

### 6.9. Shared infrastructure config

La configuracion compartida centraliza variables de entorno y clientes Azure. Esto evita duplicar configuracion en cada function o repository.

`CosmosConfig` define un contrato tecnico de configuracion. `getCosmosConfig` valida temprano que la aplicacion tenga todo lo necesario para arrancar.

`src/shared/infrastructure/azure/config/cosmos.config.ts`:

```ts
export interface CosmosConfig {
  endpoint: string;
  key: string;
  databaseName: string;
  entitiesContainerName: string;
}

export function getCosmosConfig(): CosmosConfig {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseName = process.env.COSMOS_DATABASE;
  const entitiesContainerName = process.env.COSMOS_ENTITIES_CONTAINER;

  if (!endpoint) {
    throw new Error("COSMOS_ENDPOINT is required");
  }

  if (!key) {
    throw new Error("COSMOS_KEY is required");
  }

  if (!databaseName) {
    throw new Error("COSMOS_DATABASE is required");
  }

  if (!entitiesContainerName) {
    throw new Error("COSMOS_ENTITIES_CONTAINER is required");
  }

  return {
    endpoint,
    key,
    databaseName,
    entitiesContainerName
  };
}
```

`src/shared/infrastructure/azure/cosmos/cosmos.client.ts`:

```ts
import {Container, CosmosClient} from "@azure/cosmos";

import {getCosmosConfig} from "../config/cosmos.config";

const config = getCosmosConfig();

export const cosmosClient = new CosmosClient({
  endpoint: config.endpoint,
  key: config.key
});

const database = cosmosClient.database(config.databaseName);

export const entitiesContainer: Container = database.container(
  config.entitiesContainerName
);
```

Puntos importantes:

- Las variables de entorno se leen en infraestructura, no en dominio ni use cases.
- El cliente Cosmos se crea una vez y se reutiliza.
- Cambiar nombres de contenedores o agregar nuevos containers queda centralizado.
- Esta capa es tecnica; no debe contener reglas de negocio.

## 7. Como afrontar funciones o servicios monoliticos

La estrategia para partir logica monolitica no es mover archivos por moverlos. Primero hay que clasificar responsabilidades.

```text
Codigo actual                         Destino recomendado
-----------------------------------------------------------------
req.body / headers / params           handler
status code / response body           handler
validacion de contrato HTTP           handler
validacion de regla de negocio        use case o domain
calculos                              domain
transiciones de estado                domain
flujo de pasos                        use case
Cosmos / SQL / Mongo                  infrastructure repository
Service Bus / Kafka / Event Grid      infrastructure publisher
HTTP externo                          infrastructure gateway
process.env                           shared/infrastructure/config
new Date / randomUUID                 dependency inyectada
```

### 7.1. Servicio monolitico AS IS

```ts
import crypto from "node:crypto";

import {Container} from "@azure/cosmos";
import {ServiceBusSender} from "@azure/service-bus";

export class EntityService {
  constructor(
    private readonly container: Container,
    private readonly sender: ServiceBusSender
  ) {
  }

  async create(input: {
    customerId: string;
    items: Array<{ sku: string; quantity: number }>;
  }): Promise<{ entityId: string; total: number }> {
    if (!input.customerId?.trim()) {
      throw new Error("customerId is required");
    }

    if (!input.items.length) {
      throw new Error("items are required");
    }

    let total = 0;

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new Error("quantity must be greater than zero");
      }

      total += item.quantity * 10;
    }

    const entityId = crypto.randomUUID();

    await this.container.items.create({
      id: entityId,
      entityId,
      customerId: input.customerId,
      items: input.items,
      total,
      status: "CREATED",
      createdAt: new Date().toISOString()
    });

    await this.sender.sendMessages({
      body: {
        eventType: "EntityCreated",
        entityId,
        total
      }
    });

    return {
      entityId,
      total
    };
  }
}
```

Problema:

- El servicio parece ordenado porque esta en una clase, pero sigue siendo monolitico.
- Mezcla calculo, validacion, persistencia, mensajeria, fecha e ID.
- No se puede probar el calculo sin construir dependencias de Azure.

### 7.2. Servicio separado TO BE

La separacion de un servicio monolitico debe empezar por reglas puras. En este ejemplo, el calculo del total no necesita Azure, por eso se mueve al dominio.

`domain/calculate-total.ts`:

```ts
export interface PricedItem {
  sku: string;
  quantity: number;
  unitPrice: number;
}

export function calculateTotal(items: PricedItem[]): number {
  if (!items.length) {
    throw new Error("items are required");
  }

  return items.reduce((total, item) => {
    if (item.quantity <= 0) {
      throw new Error("quantity must be greater than zero");
    }

    return total + item.quantity * item.unitPrice;
  }, 0);
}
```

Luego el caso de uso coordina dependencias externas a traves de interfaces. `EntityRepository` guarda estado y `EntityCreatedPublisher` publica eventos, pero el caso de uso no sabe si detras hay Cosmos, Service Bus, Kafka o una implementacion en memoria para tests.

`application/create-composite-entity.use-case.ts`:

```ts
import {calculateTotal} from "../domain/calculate-total";
import {EntityRepository} from "../domain/entity.repository";
import {EntityCreatedPublisher} from "./entity-created.publisher";

export interface CreateCompositeEntityUseCaseDependencies {
  repository: EntityRepository;
  publisher: EntityCreatedPublisher;
  createEntityId: () => string;
}

export class CreateCompositeEntityUseCase {
  constructor(private readonly dependencies: CreateCompositeEntityUseCaseDependencies) {
  }

  async execute(command: {
    customerId: string;
    items: Array<{ sku: string; quantity: number; unitPrice: number }>;
    requestedAt: string;
  }): Promise<{ entityId: string; total: number }> {
    if (!command.customerId?.trim()) {
      throw new Error("customerId is required");
    }

    const total = calculateTotal(command.items);
    const entityId = this.dependencies.createEntityId();

    await this.dependencies.repository.save({
      entityId,
      customerId: command.customerId,
      items: command.items,
      total,
      status: "CREATED",
      createdAt: command.requestedAt
    });

    await this.dependencies.publisher.publish({
      eventId: `${entityId}:EntityCreated`,
      eventType: "EntityCreated",
      entityId,
      total,
      occurredAt: command.requestedAt
    });

    return {
      entityId,
      total
    };
  }
}
```

Puntos importantes:

- `calculateTotal` se prueba como funcion pura.
- `repository` y `publisher` se reemplazan facilmente en tests.
- `createEntityId` se inyecta para evitar resultados aleatorios.
- Si publicar eventos es critico, se puede reemplazar `publisher.publish` por outbox.

Si guardar y publicar deben ser consistentes, usar outbox:

```ts
await this.dependencies.repository.saveWithOutbox({
  entity,
  event: {
    eventId: `${entity.entityId}:EntityCreated`,
    eventType: "EntityCreated",
    occurredAt: command.requestedAt,
    payload: {
      entityId: entity.entityId,
      total: entity.total
    }
  }
});
```

## 8. Tests y beneficio de testabilidad

La nueva estructura permite probar por capas.

```text
Domain tests
reglas puras, estados, calculos
        |
        v
Use case tests
flujo con repositorios y publishers mockeados
        |
        v
Handler tests
contrato HTTP, queue, timer, errores
        |
        v
Infrastructure tests
queries, patches, batches, payloads
```

Beneficios:

- Menos dependencia de Azure para validar reglas.
- Refactors mas seguros.
- Migraciones futuras con menor riesgo.
- Tests como documentacion de comportamiento para onboarding.
- Errores mas faciles de ubicar.
- Menos pruebas manuales repetitivas.

### 8.1. Test completo de dominio

Este test no necesita Azure, mocks ni variables de entorno. Solo valida reglas del dominio.

```ts
import {Entity} from "./entity";

describe("Entity", () => {
  it("should create entity", () => {
    const entity = Entity.create({
      entityId: "ENT-100",
      name: "Example",
      createdAt: "2026-08-15T10:00:00.000Z"
    });

    expect(entity.entityId).toBe("ENT-100");
    expect(entity.name).toBe("Example");
    expect(entity.status).toBe("CREATED");
  });

  it("should reject invalid createdAt", () => {
    expect(() => Entity.create({
      entityId: "ENT-100",
      name: "Example",
      createdAt: "invalid-date"
    })).toThrow("createdAt is invalid");
  });
});
```

### 8.2. Test completo de use case

Este test verifica el flujo del caso de uso usando un repositorio falso. No prueba Cosmos; prueba que el caso de uso crea la entidad correcta y pide guardarla.

```ts
import {CreateEntityUseCase} from "./create-entity.use-case";

describe("CreateEntityUseCase", () => {
  it("should create entity", async () => {
    const repository = {
      save: jest.fn()
    };

    const useCase = new CreateEntityUseCase({
      repository,
      createEntityId: () => "ENT-100"
    });

    const result = await useCase.execute({
      name: "Example",
      requestedAt: "2026-08-15T10:00:00.000Z"
    });

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      entityId: "ENT-100",
      name: "Example",
      status: "CREATED"
    }));

    expect(result).toEqual({
      entityId: "ENT-100",
      status: "CREATED"
    });
  });
});
```

### 8.3. Test completo de handler

Este test valida el contrato HTTP. El `useCase` se simula para forzar un error de validacion y comprobar que el handler responde `400`.

```ts
import {createCreateEntityHandler} from "../handler";
import {CreateEntityValidationError} from "./create-entity-validation.error";

describe("createCreateEntityHandler", () => {
  it("should return 400 for validation error", async () => {
    const useCase = {
      execute: jest.fn().mockRejectedValue(
        new CreateEntityValidationError("name is required")
      )
    };

    const handler = createCreateEntityHandler({
      useCase,
      now: () => "2026-08-15T10:00:00.000Z"
    });

    const request = {
      json: jest.fn().mockResolvedValue({})
    } as any;

    const context = {
      error: jest.fn()
    } as any;

    const response = await handler(request, context);

    expect(response).toEqual({
      status: 400,
      jsonBody: {
        code: "INVALID_REQUEST",
        message: "name is required"
      }
    });
  });
});
```

### 8.4. Test completo de infraestructura

Este test valida el adaptador Cosmos. Aqui si interesa verificar el documento que se envia al SDK.

```ts
import {CosmosEntityRepository} from "./cosmos-entity.repository";

describe("CosmosEntityRepository", () => {
  it("should save entity document", async () => {
    const create = jest.fn().mockResolvedValue({});

    const container = {
      items: {
        create
      }
    } as any;

    const repository = new CosmosEntityRepository(container);

    await repository.save({
      entityId: "ENT-100",
      name: "Example",
      status: "CREATED",
      createdAt: "2026-08-15T10:00:00.000Z"
    } as any);

    expect(create).toHaveBeenCalledWith({
      id: "ENT-100",
      entityId: "ENT-100",
      name: "Example",
      status: "CREATED",
      createdAt: "2026-08-15T10:00:00.000Z"
    });
  });
});
```

## 9. Proveedores para librerias externas

Cuando se usa una libreria externa como ExcelJS, PDFKit, Sharp, CSV parsers o clientes de terceros, no conviene llamarla directamente desde el use case ni desde el dominio.

La recomendacion es crear un contrato interno y una implementacion en infraestructura. A este adaptador se le puede llamar `provider`, `generator`, `client`, `gateway` o `adapter`, segun el caso.

```text
UseCase
  |
  v
ReportDocumentGenerator interface
  ^
  |
ExcelJsReportDocumentGenerator
  |
  v
exceljs
```

Beneficio:

- El use case no depende de ExcelJS.
- La libreria externa queda encapsulada.
- Se puede cambiar ExcelJS por otra libreria sin tocar el flujo de negocio.
- Los tests del use case pueden usar un generator falso.
- Los tests de infraestructura validan solo el uso de ExcelJS.

### 9.1. Contrato interno del proveedor

El contrato describe lo que la aplicacion necesita, no como trabaja la libreria.

`application/document-generator.ts`:

```ts
export interface DocumentGeneratorInput {
  entityId: string;
  title: string;
  rows: Array<{
    label: string;
    value: string | number;
  }>;
}

export interface DocumentGenerator {
  generate(input: DocumentGeneratorInput): Promise<Uint8Array>;
}
```

Puntos importantes:

- El contrato no menciona ExcelJS.
- El resultado es un `Uint8Array`, que es portable.
- El use case solo sabe que puede generar un documento.

### 9.2. Uso desde el use case

`application/generate-document.use-case.ts`:

```ts
import {DocumentGenerator} from "./document-generator";
import {DocumentStorage} from "./document-storage";

export interface GenerateDocumentUseCaseDependencies {
  generator: DocumentGenerator;
  storage: DocumentStorage;
}

export class GenerateDocumentUseCase {
  constructor(private readonly dependencies: GenerateDocumentUseCaseDependencies) {
  }

  async execute(command: {
    entityId: string;
    title: string;
    rows: Array<{ label: string; value: string | number }>;
  }): Promise<{ entityId: string; fileName: string }> {
    if (!command.entityId?.trim()) {
      throw new Error("entityId is required");
    }

    const content = await this.dependencies.generator.generate({
      entityId: command.entityId,
      title: command.title,
      rows: command.rows
    });

    const stored = await this.dependencies.storage.save({
      entityId: command.entityId,
      content,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    return {
      entityId: command.entityId,
      fileName: stored.fileName
    };
  }
}
```

Puntos importantes:

- `generator` es un proveedor de documentos.
- `storage` es otro contrato, separado de la generacion.
- El caso de uso coordina, pero no sabe construir hojas de Excel.

### 9.3. Implementacion con ExcelJS

`infrastructure/document/exceljs-document.generator.ts`:

```ts
import ExcelJS from "exceljs";

import {DocumentGenerator, DocumentGeneratorInput} from "../../application/document-generator";

export class ExcelJsDocumentGenerator implements DocumentGenerator {
  async generate(input: DocumentGeneratorInput): Promise<Uint8Array> {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Azure Functions App";

    const worksheet = workbook.addWorksheet("Summary");

    worksheet.columns = [{
      header: "Label",
      key: "label",
      width: 30
    }, {
      header: "Value",
      key: "value",
      width: 40
    }];

    worksheet.addRow({
      label: "Entity ID",
      value: input.entityId
    });

    worksheet.addRow({
      label: "Title",
      value: input.title
    });

    for (const row of input.rows) {
      worksheet.addRow({
        label: row.label,
        value: row.value
      });
    }

    worksheet.getRow(1).font = {
      bold: true
    };

    const buffer = await workbook.xlsx.writeBuffer();

    return new Uint8Array(buffer);
  }
}
```

Puntos importantes:

- ExcelJS solo aparece en infraestructura.
- Si cambia el formato del Excel, se modifica este provider.
- Si se reemplaza Excel por PDF o CSV, se crea otra implementacion del contrato.

### 9.4. Composition root con proveedor

```ts
const generator = new ExcelJsDocumentGenerator();
const storage = new BlobDocumentStorage(containerClient);

const useCase = new GenerateDocumentUseCase({
  generator,
  storage
});
```

### 9.5. Test del use case sin ExcelJS

```ts
it("should generate and store document", async () => {
  const generator = {
    generate: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
  };

  const storage = {
    save: jest.fn().mockResolvedValue({
      fileName: "ENT-100.xlsx"
    })
  };

  const useCase = new GenerateDocumentUseCase({
    generator,
    storage
  });

  const result = await useCase.execute({
    entityId: "ENT-100",
    title: "Example",
    rows: [{
      label: "Total",
      value: 100
    }]
  });

  expect(generator.generate).toHaveBeenCalledTimes(1);
  expect(storage.save).toHaveBeenCalledWith(expect.objectContaining({
    entityId: "ENT-100",
    content: new Uint8Array([1, 2, 3])
  }));

  expect(result).toEqual({
    entityId: "ENT-100",
    fileName: "ENT-100.xlsx"
  });
});
```

Regla:

> Toda libreria externa debe entrar al sistema mediante un proveedor/adaptador ubicado en infraestructura.

## 10. Beneficios para migraciones futuras

La estructura TO BE reduce el costo de cambios futuros.

```text
Cambia:
runtime / trigger / storage / broker / SDK / proveedor cloud

Permanece:
domain / use cases / contracts / tests de comportamiento
```

Escenarios:

- Si se migra de Azure Functions a NestJS, Express, Fastify o containers, se reemplaza principalmente `functions` y `handler`.
- Si se migra de Cosmos a PostgreSQL, SQL Server o MongoDB, se reemplaza `infrastructure/persistence`.
- Si se migra de Service Bus a Kafka, Event Grid, RabbitMQ o SQS, se reemplaza el publisher.
- Si se cambia Blob Storage por S3 u otro storage, se reemplaza el adaptador de storage.
- Si un flujo HTTP pasa a queue o Durable activity, se reutiliza el mismo use case.
- Si cambia una regla de negocio, se actualiza dominio y tests sin tocar Azure SDKs.

La ventaja no es solo tener carpetas ordenadas. La ventaja es que cada tipo de cambio tiene un lugar claro.

## 11. Estandar recomendado para repos Azure Functions

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

Reglas:

- `functions` registra triggers y compone dependencias.
- `handler` adapta entrada y salida.
- `application` coordina casos de uso.
- `domain` contiene reglas puras.
- `infrastructure` implementa SDKs externos.
- `shared/infrastructure` centraliza configuracion y clientes.

Dependencias:

```text
functions -> handler -> application -> domain
                         infrastructure -> contracts/domain
shared/infrastructure -> SDKs y configuracion
```

## 12. Checklist de onboarding

Para entender una funcion existente, responder:

- Donde se registra el trigger?
- Es modelo v3 o v4?
- Que entrada recibe?
- Que salida observable produce?
- Que handler ejecuta?
- Que use case llama?
- Que reglas de dominio aplica?
- Que repositorios, publishers o gateways usa?
- Que variables de entorno necesita?
- Que tests documentan su comportamiento?

## 13. Checklist de migracion y entrega

Antes de migrar:

- Identificar `function.json`.
- Identificar `index.js` o `index.ts`.
- Documentar trigger, ruta, metodo, auth y bindings.
- Documentar payloads de entrada y salida.
- Documentar variables de entorno.
- Documentar dependencias externas.

Durante v3 -> v4:

- Registrar trigger con `app.*`.
- Mantener ruta, metodo, auth, queue o schedule.
- Usar `InvocationContext`.
- Retornar `HttpResponseInit` en HTTP.
- Mantener comportamiento observable.

Durante reestructura:

- Extraer handler.
- Extraer use case.
- Extraer dominio.
- Crear repository interface.
- Mover SDKs a infrastructure.
- Mover clientes a shared infrastructure.
- Agregar tests por capa.

Antes de entregar:

- Ejecutar typecheck.
- Ejecutar tests.
- Ejecutar build.
- Verificar que no queden bindings duplicados.
- Verificar que no se cambio funcionalidad sin aprobacion.

## 14. Antipatrones a evitar

- Migrar a modelo v4 y dejar toda la logica dentro de `app.http`.
- Cambiar funcionalidad durante una migracion tecnica.
- Meter Cosmos, Blob o Service Bus en dominio.
- Leer variables de entorno desde use cases.
- Crear un servicio monolitico nuevo solo para sacar codigo de la function.
- Usar `shared` como carpeta generica de cualquier cosa.
- Crear interfaces que copian exactamente el SDK externo.
- Hacer tests que solo prueban mocks y no comportamiento.

## 15. Conclusion

La migracion debe ir primero. La reestructura debe venir despues.

El flujo recomendado es:

```text
legacy v3 -> modelo v4 funcional -> arquitectura testeable -> estandar migrable
```

El resultado esperado:

```text
functions registra
handler adapta
application coordina
domain protege reglas
infrastructure conecta tecnologia
shared/infrastructure reutiliza clientes
tests documentan comportamiento
```

Con esta separacion, el equipo gana claridad para onboarding, seguridad para refactorizar y flexibilidad para migraciones futuras.
