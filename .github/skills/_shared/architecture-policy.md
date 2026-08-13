# Architecture Policy

## Objetivo

Definir la arquitectura objetivo que deben seguir las refactorizaciones realizadas durante la migración.

La arquitectura debe permitir que futuras migraciones de runtime, SDK o Programming Model afecten principalmente
adapters y configuración, preservando la mayor parte del comportamiento funcional.

## Arquitectura objetivo

Usar como referencia la estructura y principios aplicados en `financial-reports-functions`.

Organizar el código por capability.

Los adapters o composition roots específicos de Azure Functions deben vivir bajo:

`src/functions/`

La implementación funcional debe vivir bajo:

`src/<Capability>/`

## Dirección de dependencias

El comportamiento funcional no debe depender directamente del runtime Azure Functions cuando pueda evitarse.

Dirección conceptual:

`Azure Runtime`

→ `src/functions`

→ `capability/application behavior`

→ `domain/contracts`

Las implementaciones de infraestructura satisfacen los contratos requeridos por la capability.

## Adapters Azure

`src/functions/` debe contener únicamente responsabilidades propias de integración con Azure Functions, como:

- registro de triggers;
- adaptación de request o message;
- acceso al contexto del runtime;
- construcción/composición de dependencias;
- transformación de response.

Evitar lógica de negocio dentro del adapter.

## Capabilities

Organizar comportamiento por capacidad funcional observable.

Ejemplos:

- `RequestReport`
- `GenerateReport`
- `CompleteReport`
- `Outbox`

No crear una capability únicamente por nombre de Function si varias Functions pertenecen al mismo proceso funcional.

## Materialización incremental

La arquitectura objetivo es requerida cuando se refactoriza código.

Esto no implica crear todas las capas posibles.

Crear únicamente carpetas y abstracciones que tengan responsabilidad real.

Ejemplo simple:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── request-report.service.ts
        └── tests/

Ejemplo con dominio e infraestructura:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── application/
        ├── domain/
        ├── infrastructure/
        └── tests/

No crear carpetas vacías.

## Contratos

Crear contratos internos cuando permitan aislar infraestructura o dependencias externas.

Usar nombres naturales del dominio o responsabilidad.

Ejemplos:

- `ReportRepository`
- `ReportGenerator`
- `MessagePublisher`
- `ReportStorage`

No exigir sufijos como `*.port.ts`.

## Infraestructura

Dependencias externas como:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs;

deben quedar aisladas de la lógica funcional cuando el código sea refactorizado.

La implementación concreta puede vivir bajo la capability propietaria o en un recurso compartido cuando exista reuse
real.

## Recursos compartidos

Un recurso compartido es una dependencia utilizada por más de una Function, capability o workflow y cuya modificación
puede afectar múltiples consumidores.

Ejemplos:

- repositorio Cosmos compartido;
- cliente MongoDB;
- acceso SQL;
- Service Bus client;
- storage client;
- configuración común;
- HTTP client;
- mapper o servicio realmente compartido.

No mover algo a `shared` únicamente porque aparezca dos veces.

Primero identificar ownership funcional.

## Ownership

Cada recurso compartido debe tener un ownership explícito.

Scopes permitidos inicialmente:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

La planificación debe definir una única acción propietaria para modificar el recurso.

Las Functions consumidoras deben declarar dependencia hacia esa acción.

## Shared

Crear `src/shared/` únicamente cuando exista un recurso transversal real sin ownership más natural dentro de una
capability.

Evitar convertir `shared` en una carpeta genérica para código sin ubicación clara.

## Testabilidad

El comportamiento funcional debe poder probarse sin requerir el Azure Functions Host ni conexiones reales cuando
corresponda a unit tests.

Aislar cuando sea necesario:

- SDK clients;
- configuración;
- persistencia;
- mensajería;
- almacenamiento;
- llamadas externas.

## Future-proofing

Una refactorización correcta debe reducir el impacto de futuras migraciones.

Idealmente, un cambio futuro de Programming Model o runtime debería concentrarse principalmente en:

- `src/functions/**`;
- dependencias;
- configuración;
- composition roots.

La lógica funcional y sus tests deberían permanecer estables salvo cambios reales de comportamiento.

## Cambios manuales o mediante IA

La arquitectura objetivo es independiente del ejecutor.

Una acción de migración debe poder realizarse:

- mediante un skill;
- mediante otro agente;
- manualmente por un desarrollador.

Los planes deben describir intención técnica y criterios de resultado, no depender de quién ejecuta el cambio.

## Principio

Arquitectura obligatoria.

Complejidad accidental prohibida.

Crear solo lo necesario para mantener límites claros, testabilidad y facilidad de evolución.
