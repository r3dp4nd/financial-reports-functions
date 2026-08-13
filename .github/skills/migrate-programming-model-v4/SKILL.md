---
name: migrate-programming-model-v4
description: Migra una Function legacy de Azure Functions Node.js al Programming Model v4 transformando su integración con Azure Functions y preservando el comportamiento protegido por tests.
---

# Migrate Programming Model v4

## Objetivo

Transformar una Function legacy hacia Programming Model v4.

El cambio debe concentrarse en el adapter Azure.

No modificar comportamiento funcional intencionalmente.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Debe existir:

`.migration/functions/<FunctionName>/preparation.json`

La Function debe estar:

`READY_FOR_MIGRATION`

La baseline requerida debe estar verde.

## Aplicabilidad

Si ya utiliza Programming Model v4:

`NOT_APPLICABLE`

Si el modelo es desconocido:

`REQUIRES_REVIEW`

Si pertenece a un workflow Durable que requiere migración especializada:

delegar a:

`migrate-durable-functions-v4`

## Principio

Transformar:

`adapter legacy`

en:

`adapter Programming Model v4`

preservando:

- trigger;
- inputs;
- validaciones;
- salida;
- errores;
- efectos secundarios;
- nombres lógicos;
- contratos externos.

## requiredActions

Ejecutar las acciones `REQUIRED_PLATFORM` correspondientes registradas en `analysis.json`.

No redescubrir el alcance técnico completo.

## Registro v4

Usar la API oficial correspondiente al trigger real, por ejemplo:

- `app.http`;
- `app.timer`;
- `app.serviceBusQueue`;
- `app.serviceBusTopic`;
- registros Cosmos;
- otros bindings documentados.

No inventar equivalencias.

## function.json

Tras una migración correcta:

- trasladar configuración necesaria al código;
- eliminar únicamente el `function.json` correspondiente cuando deje de ser necesario.

No eliminar artefactos legacy globalmente.

## HTTP

Preservar:

- methods;
- route;
- auth level;
- status;
- headers;
- body;
- manejo de errores.

## Timer

Preservar:

- schedule;
- configuración relevante;
- comportamiento.

## Service Bus

Preservar:

- queue/topic;
- subscription;
- connection setting name;
- cardinalidad;
- metadata relevante.

Nunca leer la connection string.

## Cosmos DB

Preservar configuración relevante del binding:

- database;
- container;
- connection setting;
- lease options cuando apliquen.

## context

No hacer reemplazos globales mecánicos.

Adaptar solamente los usos reales:

- logging;
- response;
- bindings;
- metadata.

## Código funcional

Preferir no modificar la implementación funcional preparada previamente.

Si un cambio interno resulta inevitable:

- justificarlo;
- mantenerlo mínimo;
- volver a ejecutar tests.

## Estructura

Cuando ya esté preparada:

- `src/functions/` contiene adapters Azure;
- `src/<Capability>/` contiene implementación.

No mover archivos nuevamente sin necesidad.

## Tests

Ejecutar la misma baseline utilizada antes de migrar.

Debe continuar verde.

Un fallo debe investigarse como posible cambio de comportamiento.

## Validación

Ejecutar cuando corresponda:

- tests;
- typecheck selectivo;
- validaciones estáticas.

El build global final pertenece al cierre de la Function App.

## Salidas

Crear:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

Y:

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.json`

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.md`

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## migration.json

Registrar:

- Function;
- modelo anterior;
- modelo resultante;
- trigger;
- bindings;
- archivos modificados;
- artefactos legacy tratados;
- tests;
- validaciones;
- resultados;
- riesgos;
- unknowns.

## migration.md

Explicar:

- qué se migró;
- qué configuración legacy fue reemplazada;
- qué comportamiento se preservó;
- tests ejecutados;
- resultado;
- pendientes.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se verificó aplicabilidad;
- el adapter fue migrado;
- trigger y bindings fueron preservados;
- los tests continúan verdes;
- no se modificó comportamiento intencionalmente;
- no se aplicaron optimizaciones;
- se generaron migration y lessons.

## Fuera de alcance

Este skill no debe:

- migrar Functions ya v4;
- migrar workflows Durable;
- modificar lógica de negocio;
- optimizar;
- resolver deuda no bloqueante;
- actualizar dependencias no planificadas;
- desplegar.

El siguiente skill depende del caso:

- `migrate-durable-functions-v4`
- `verify-function-app`
