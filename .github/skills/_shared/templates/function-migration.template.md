# Migración — <FunctionName>

## Objetivo

Registrar la migración de plataforma ejecutada sobre `<FunctionName>`.

## Referencias

Estado BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

Plan:

`.migration/functions/<FunctionName>/migration-plan.md`

Preparación:

`.migration/functions/<FunctionName>/preparation.md`

## Estado

`MIGRATED | NOT_APPLICABLE | BLOCKED | REQUIRES_REVIEW`

## Programming Model

| Dimensión         | Antes | Después |
|-------------------|-------|---------|
| Programming Model |       |         |

## Trigger

Tipo:

`<Trigger>`

Configuración preservada:

-

## Bindings

| Binding | Antes | Después | Estado |
|---------|-------|---------|--------|
|         |       |         |        |

## Adapter Azure

Archivo:

`src/functions/<function>.function.ts`

Cambios realizados:

-

## Arquitectura preservada

Resultado:

`PASS | FAIL | REQUIRES_REVIEW`

Confirmar únicamente aspectos definidos en el plan:

- lógica funcional permanece fuera del adapter;
- infraestructura permanece aislada;
- capability conserva sus límites.

## Recursos compartidos

| Resource ID | Uso | Estado |
|-------------|-----|--------|
|             |     |        |

Confirmar que no se duplicaron implementaciones compartidas.

## Artefactos legacy

| Artefacto | Acción | Resultado |
|-----------|--------|-----------|
|           |        |           |

No listar limpieza no relacionada.

## Archivos modificados

-

## Tests

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED`

## Validaciones

| Validación | Resultado |
|------------|-----------|
|            |           |

## Riesgos

-

## Unknowns

-

## Resultado

La migración de `<FunctionName>`:

`se completó / no aplicaba / quedó bloqueada / requiere revisión`.

El build global final todavía pertenece a:

`verify-function-app`
