---
name: migrate-programming-model-v4
description: Migra una Function legacy de Azure Functions Node.js al Programming Model v4 usando su plan específico, preservando comportamiento, arquitectura objetivo y dependencias hacia recursos compartidos.
---

# Migrate Programming Model v4

## Objetivo

Migrar una Function legacy hacia Programming Model v4.

El cambio debe concentrarse en la integración Azure.

No modificar intencionalmente comportamiento funcional ni arquitectura ya preparada.

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

`.migration/plans/migration-plan.json`

La Function debe estar preparada para migración.

## Entradas

Consumir:

- analysis;
- plan global;
- plan específico;
- preparation;
- shared dependencies.

No volver a analizar toda la App.

## Aplicabilidad

Ya v4:

`NOT_APPLICABLE`

Programming Model desconocido:

`REQUIRES_REVIEW`

Workflow Durable:

delegar a `migrate-durable-functions-v4` cuando corresponda.

## Principio

Transformar:

`Azure adapter legacy`

hacia:

`Azure adapter Programming Model v4`

Preservando:

- comportamiento;
- trigger;
- bindings;
- contratos;
- nombres;
- capability;
- shared resources;
- tests.

## Arquitectura

Usar la estructura preparada por `prepare-function`.

No reorganizar nuevamente la capability.

La migración debe concentrarse principalmente en:

`src/functions/**`

cuando el aislamiento ya exista.

## Plan específico

Ejecutar únicamente acciones de plataforma aprobadas.

Principalmente:

`REQUIRED_PLATFORM`

Si queda pendiente una acción estructural obligatoria:

`BLOCKED`

## Shared resources

No:

- recrear repositories;
- duplicar factories;
- construir clientes alternativos;
- cambiar ownership.

Consumir los límites ya preparados.

## Registro v4

Usar la API correspondiente al trigger confirmado.

Preservar configuración observable y nombres.

No inventar mappings.

## function.json

Retirar únicamente el correspondiente a la Function migrada cuando deje de ser requerido.

No realizar cleanup global.

## Bindings

Preservar semántica relevante del trigger/binding real.

Nunca leer valores de configuración.

## context

Adaptar únicamente usos necesarios del modelo legacy.

No ejecutar reemplazos globales mecánicos.

## Composition

El adapter puede realizar wiring de dependencias según la arquitectura preparada.

No introducir framework DI.

## Código funcional

No modificar la capability salvo incompatibilidad estrictamente necesaria.

Si se requiere un cambio fuera del plan:

`REQUIRES_REVIEW`

## Tests

Ejecutar la misma baseline preparada previamente.

Debe continuar verde.

No cambiar tests para aceptar una regresión.

## Validación

Ejecutar cuando corresponda:

- tests;
- typecheck selectivo;
- registration checks;
- static checks.

No exigir build global.

## Catálogo

No modificar documentación BEFORE.

## Salidas estructuradas

Crear:

`.migration/functions/<FunctionName>/migration.json`

Debe registrar:

- status;
- plan reference;
- previous model;
- resulting model;
- trigger/bindings;
- adapter changes;
- architecture preserved;
- shared resources preserved;
- files modified;
- legacy artifacts;
- tests;
- validations;
- risks;
- unknowns.

## Salida humana

Crear:

`.migration/functions/<FunctionName>/migration.md`

Usar:

`../_shared/templates/function-migration.template.md`

## Lecciones

Crear:

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.json`

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.md`

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Criterio de cierre

`MIGRATED` requiere:

- adapter migrado;
- configuración preservada;
- arquitectura preservada;
- shared resources no duplicados;
- baseline verde;
- ausencia de blocker específico.

## Fuera de alcance

No debe:

- refactorizar nuevamente sin necesidad;
- migrar Durable;
- modificar lógica de negocio;
- redefinir shared resources;
- actualizar dependencias no planificadas;
- resolver deuda;
- optimizar;
- ejecutar build final;
- desplegar.

Siguiente skill:

- `migrate-durable-functions-v4`
- o `verify-function-app`
