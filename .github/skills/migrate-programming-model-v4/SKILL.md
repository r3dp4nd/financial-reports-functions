---
name: migrate-programming-model-v4
description: Migra una Function legacy de Azure Functions Node.js al Programming Model v4 usando su plan específico y preservando comportamiento, arquitectura y recursos compartidos.
---

# Migrate Programming Model v4

## Objetivo

Migrar únicamente la integración Azure de una Function legacy hacia Programming Model v4.

Preservar:

- comportamiento;
- contratos;
- trigger;
- bindings;
- capability;
- arquitectura preparada;
- shared resources;
- tests.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir:

- `analysis.json`;
- Function migration plan;
- preparation;
- global plan.

La Function debe estar:

`READY_FOR_MIGRATION`

salvo que el plan indique explícitamente que no requería preparación.

## Aplicabilidad

Programming Model ya v4:

`status = NOT_APPLICABLE`

Programming Model no confirmable:

`status = REQUIRES_REVIEW`

Function perteneciente a migración Durable coordinada:

delegar al skill Durable cuando corresponda.

## Acciones

Ejecutar únicamente acciones de plataforma referenciadas por el plan.

Las acciones locales conservan IDs:

`FN-*`

No recrear acciones con IDs nuevos.

## Arquitectura

La migración debe concentrarse principalmente en:

`src/functions/**`

cuando la separación ya fue preparada.

No volver a rediseñar la capability.

## Shared resources

Consumir recursos y límites existentes.

No:

- duplicar repository;
- duplicar factory;
- construir clientes alternativos;
- cambiar ownership sin nuevo plan.

Si una dependencia obligatoria sigue pendiente:

`status = BLOCKED`

## Registro v4

Transformar el registro correspondiente al trigger confirmado.

Preservar:

- Function name;
- trigger semantics;
- route;
- methods;
- schedules;
- queue/topic names por key/configuración;
- binding semantics.

No inventar configuración.

## Legacy artifacts

Retirar únicamente los artefactos legacy correspondientes a la Function cuando dejen de ser necesarios.

No hacer cleanup global no planificado.

## Código funcional

Modificar únicamente cuando sea imprescindible para adaptar el contrato de runtime.

Un cambio funcional no contemplado:

`status = REQUIRES_REVIEW`

## Tests

Ejecutar la baseline existente.

El resultado debe continuar:

`PASS`

No modificar tests únicamente para aceptar una regresión.

## Validaciones

Registrar checks mediante:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Ejemplos:

- tests;
- typecheck selectivo;
- registration check;
- static check.

No ejecutar build global como gate obligatorio.

## Salida estructurada

Crear:

`.migration/functions/<FunctionName>/migration.json`

Debe contener:

- `schemaVersion`;
- `function`;
- `status`;
- `planReference`;
- `previousProgrammingModel`;
- `resultingProgrammingModel`;
- `actionsExecuted`;
- `trigger`;
- `bindings`;
- `adapterChanges`;
- `architecturePreserved`;
- `sharedResourcesPreserved`;
- `filesModified`;
- `legacyArtifactsHandled`;
- `tests`;
- `validations`;
- `risks`;
- `unknowns`.

## Estado principal

Usar únicamente:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Architecture preserved

No usar `status = CONFIRMED`.

Usar un check:

    {
      "architecturePreserved": {
        "status": "PASS",
        "findings": []
      }
    }

## Evidencia interna

Cuando sea necesario representar certeza de un hallazgo:

usar:

`evidenceStatus`

No utilizar el status principal.

## Salida humana

Crear:

`.migration/functions/<FunctionName>/migration.md`

Usar:

`../_shared/templates/function-migration.template.md`

## Lecciones

Crear:

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.json`

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.md`

## Criterio de cierre

`MIGRATED` requiere:

- adapter migrado;
- acción de plataforma completada;
- arquitectura preservada;
- shared resources no duplicados;
- baseline verde;
- validaciones obligatorias exitosas;
- ausencia de blocker.

## Fuera de alcance

No debe:

- volver a refactorizar la capability sin necesidad;
- migrar Durable;
- cambiar comportamiento;
- redefinir recursos compartidos;
- actualizar dependencias no planificadas;
- resolver deuda;
- optimizar;
- ejecutar build global final;
- desplegar.

Siguiente skill:

`verify-function-app`

o migración Durable pendiente.
