# Migración — <FunctionName>

## Objetivo

Registrar la migración técnica ejecutada sobre `<FunctionName>`.

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

## Dependencias y APIs

| Dependencia | Antes | Después | Adaptación realizada |
|-------------|-------|---------|----------------------|
|             |       |         |                      |

Registrar únicamente dependencias o APIs modificadas por esta Function.

No volver a resolver versiones objetivo en esta etapa.

## Compatibilidad Node.js

Cambios específicos de esta Function:

-

Si no fueron necesarios:

`NOT_APPLICABLE`

## Trigger

Tipo:

`<Trigger>`

Configuración preservada:

-

Registrar únicamente nombres de configuración cuando corresponda.

Nunca valores.

## Bindings

| Binding | Antes | Después | Estado |
|---------|-------|---------|--------|
|         |       |         |        |

## Adapter Azure

Archivo:

`<ruta del adapter migrado>`

Cambios realizados:

-

Preservar la convención existente del repositorio cuando sea coherente con el plan.

## Estructura preservada

Resultado:

`PASS | FAIL | REQUIRES_REVIEW`

Confirmar únicamente que la migración técnica no revirtió cambios estructurales requeridos por el plan.

No realizar refactorización adicional desde esta etapa.

## Recursos compartidos

| Resource ID | Uso | Estado |
|-------------|-----|--------|
|             |     |        |

Confirmar que no se duplicaron implementaciones compartidas.

No modificar recursos compartidos fuera de las acciones aprobadas.

## Artefactos legacy

| Artefacto | Acción | Resultado |
|-----------|--------|-----------|
|           |        |           |

No listar limpieza no relacionada.

No eliminar artefactos legacy salvo que el plan determine que quedaron reemplazados de forma segura.

## Archivos modificados

-

## Pruebas

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED | NOT_APPLICABLE | REQUIRES_REVIEW`

Esta etapa puede ejecutar la baseline existente.

No generar nuevas pruebas desde la migración técnica.

## Validaciones

| Validación | Resultado | Evidencia |
|------------|-----------|-----------|
|            |           |           |

Estados aplicables:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

No afirmar `PASS` sin evidencia.

## Desviaciones del plan

-

Registrar únicamente diferencias entre las acciones planificadas y las ejecutadas.

No introducir modernización adicional desde esta sección.

## Riesgos

-

## Incertidumbres

-

## Resultado

La migración de `<FunctionName>`:

`se completó / no aplicaba / quedó bloqueada / requiere revisión`.

El build global final todavía pertenece a:

`verify-function-app`
