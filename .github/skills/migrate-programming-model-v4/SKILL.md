---
name: migrate-programming-model-v4
description: Migra una Function legacy de Azure Functions Node.js al Programming Model v4 usando su plan específico, preservando comportamiento, arquitectura objetivo y dependencias hacia recursos compartidos.
---

# Migrate Programming Model v4

## Objetivo

Migrar una Function legacy hacia Programming Model v4.

El cambio debe concentrarse en la integración con Azure Functions.

La arquitectura funcional preparada previamente debe permanecer estable.

No modificar comportamiento funcional intencionalmente.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/preparation.json`

También debe existir:

`.migration/plans/migration-plan.json`

La Function debe estar:

`READY_FOR_MIGRATION`

salvo que el plan indique explícitamente que la migración no requiere preparación adicional.

## Entradas

Consumir primero:

- analysis;
- plan global;
- plan específico;
- preparation;
- shared resource dependencies relacionadas.

No volver a analizar toda la Function App.

## Aplicabilidad

Si la Function ya utiliza Programming Model v4:

`NOT_APPLICABLE`

Si Programming Model no puede confirmarse:

`REQUIRES_REVIEW`

Si forma parte de un workflow Durable cuya migración debe ejecutarse de forma coordinada:

delegar a:

`migrate-durable-functions-v4`

No migrar componentes Durable de forma independiente cuando ello pueda alterar el workflow.

## Principio

Transformar principalmente:

`Azure adapter legacy`

en:

`Azure adapter Programming Model v4`

Preservando:

- comportamiento;
- trigger;
- contratos externos;
- nombres;
- arquitectura preparada;
- dependencias internas;
- shared resources;
- tests.

## Arquitectura preparada

Usar como base la estructura resultante de:

`prepare-function`

La migración no debe volver a reorganizar la capability.

Idealmente:

    src/
    ├── functions/
    │   └── <function>.function.ts
    └── <Capability>/
        └── ...

El cambio de Programming Model debe concentrarse en:

`src/functions/**`

cuando la preparación haya logrado ese aislamiento.

## Adapter Azure

El adapter debe encargarse únicamente de responsabilidades de runtime como:

- registro;
- trigger configuration;
- request/message mapping;
- invocation;
- response mapping;
- composition cuando corresponda.

No introducir nueva lógica funcional.

## Plan específico

Ejecutar únicamente los pasos de plataforma incluidos en:

`.migration/functions/<FunctionName>/migration-plan.json`

No ejecutar:

- refactors arquitectónicos ya completados;
- deuda técnica;
- optimizaciones;
- shared resource actions globales ya ejecutadas.

## requiredActions

Consumir acciones relevantes del análisis y plan.

Principalmente:

- `REQUIRED_PLATFORM`.

Las acciones `STRUCTURAL` deberían haber sido resueltas durante preparación.

Si una acción estructural necesaria sigue pendiente y bloquea la migración:

`BLOCKED`

## Shared resources

Respetar las dependencias declaradas en el plan.

Una Function puede depender de:

`SR-ACTION-*`

La migración del adapter no debe:

- recrear repositories;
- crear nuevos SDK clients alternativos;
- duplicar factories;
- modificar ownership.

Debe consumir la arquitectura preparada.

## Registro v4

Migrar el registro usando la API correspondiente al trigger confirmado.

Preservar:

- nombre lógico;
- configuración;
- bindings;
- metadata relevante.

No inventar equivalencias.

## function.json

Cuando una Function legacy haya sido migrada correctamente:

- trasladar al registro v4 la configuración requerida;
- retirar únicamente el `function.json` correspondiente cuando ya no sea necesario.

No eliminar archivos legacy de otras Functions pendientes.

## HTTP

Preservar:

- methods;
- route;
- authorization level;
- input;
- status;
- headers;
- body;
- errores observables.

## Timer

Preservar:

- schedule;
- configuración relevante;
- comportamiento funcional invocado.

## Service Bus

Preservar cuando aplique:

- queue;
- topic;
- subscription;
- connection setting name;
- cardinalidad;
- metadata relevante.

Nunca resolver valores de configuración.

## Cosmos DB

Cuando exista binding Cosmos:

preservar las propiedades necesarias del binding.

Si la arquitectura preparada ya aisló Cosmos mediante infraestructura propia:

no reintroducir acceso directo a Cosmos dentro del Azure adapter.

## Otros bindings

Usar evidencia y documentación correspondiente al binding real.

No transformar mediante reglas genéricas si la semántica no está confirmada.

## context

Adaptar únicamente usos reales relacionados con el Programming Model.

Ejemplos:

- logging;
- request;
- response;
- invocation metadata;
- bindings.

No realizar reemplazos globales mecánicos sobre todo el source.

## Composition root

Cuando el adapter actúe como composition root:

puede construir o recibir las implementaciones necesarias según arquitectura existente.

No introducir un DI framework.

No modificar ownership de dependencias compartidas.

## Código funcional

No modificar la capability salvo que exista una incompatibilidad estrictamente necesaria causada por el cambio de
Programming Model.

Si ocurre:

- justificar;
- mantener el cambio mínimo;
- ejecutar nuevamente tests;
- registrar la desviación.

Si el cambio supera el plan:

`REQUIRES_REVIEW`

## Tests

Ejecutar la misma baseline definida en preparación.

Los tests deben continuar verdes.

Registrar:

- comando;
- runtime;
- suites;
- pass/fail;
- diferencias observadas.

No cambiar tests para aceptar una regresión no justificada.

## Validación selectiva

Ejecutar cuando corresponda:

- unit tests;
- typecheck selectivo;
- imports;
- registration validation;
- static checks.

No exigir build global después de esta Function.

## Estado intermedio

Una Function App puede contener temporalmente:

- Functions legacy;
- Functions v4;

durante la migración.

Esto no significa que el estado mixto sea válido como cierre final.

`verify-function-app` determinará el estado final.

## Catálogo

No modificar:

`.migration/catalog/functions/<FunctionName>.md`

para describir el estado migrado.

Ese archivo representa la fotografía BEFORE.

La migración se documenta en:

`.migration/functions/<FunctionName>/migration.md`

## Salidas

Crear:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

Y:

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.json`

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.md`

## migration.json

Debe incluir como mínimo:

- metadata;
- function;
- capability;
- plan reference;
- previous programming model;
- resulting programming model;
- trigger;
- bindings;
- adapter changes;
- architecture preserved;
- shared resources preserved;
- files modified;
- legacy artifacts handled;
- tests;
- validations;
- risks;
- unknowns;
- status.

## migration.md

Debe explicar:

- qué adapter fue migrado;
- qué configuración legacy fue reemplazada;
- qué comportamiento permaneció estable;
- qué arquitectura fue preservada;
- qué shared resources utiliza;
- qué tests fueron ejecutados;
- qué quedó pendiente.

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## MIGRATED

Usar únicamente cuando:

- el adapter fue migrado;
- la configuración requerida fue preservada;
- la arquitectura preparada sigue válida;
- los shared resources no fueron duplicados;
- los tests requeridos continúan verdes;
- no existe blocker conocido específico de esta Function.

## NOT_APPLICABLE

Usar cuando:

- la Function ya estaba en Programming Model v4;
- o su migración pertenece íntegramente al workflow Durable especializado.

## BLOCKED

Ejemplos:

- preparation incompleta;
- shared dependency obligatoria pendiente;
- baseline falla;
- configuración de trigger no puede preservarse.

## REQUIRES_REVIEW

Ejemplos:

- Programming Model contradictorio;
- binding no puede mapearse con suficiente evidencia;
- el cambio requiere alterar comportamiento;
- el cambio excede el plan.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se verificó aplicabilidad;
- se consumió el plan específico;
- el adapter fue migrado cuando correspondía;
- arquitectura y ownership fueron preservados;
- trigger y bindings fueron preservados;
- tests continúan verdes;
- no se duplicaron shared resources;
- no se introdujeron optimizaciones;
- se generaron migration y lessons.

## Fuera de alcance

Este skill no debe:

- refactorizar nuevamente la capability sin necesidad;
- migrar workflows Durable;
- modificar lógica de negocio;
- redefinir shared resources;
- actualizar dependencias no planificadas;
- resolver deuda no bloqueante;
- optimizar;
- ejecutar build global final;
- desplegar.

El siguiente skill depende del caso:

- `migrate-durable-functions-v4`
- `verify-function-app`
