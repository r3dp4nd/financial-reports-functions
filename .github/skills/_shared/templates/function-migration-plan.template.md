# Plan de migración — <FunctionName>

## Objetivo

Preparar y migrar `<FunctionName>` preservando su comportamiento actual y convergiendo hacia la arquitectura objetivo
definida.

## Referencias

Estado actual:

`.migration/catalog/functions/<FunctionName>.md`

Análisis:

`.migration/functions/<FunctionName>/analysis.json`

Plan global:

`.migration/plans/migration-plan.md`

## Estado

`READY | PARTIAL | BLOCKED`

## Capability

`<Capability>`

## Comportamiento a preservar

-
-
-

No duplicar la descripción completa del análisis.

Registrar únicamente los contratos observables que deben mantenerse durante la migración.

## Estado técnico actual

| Dimensión          | Estado |
|--------------------|--------|
| Programming Model  |        |
| Node compatibility |        |
| Testability        |        |
| Architecture       |        |

## Arquitectura objetivo

### Azure adapter

Ubicación objetivo:

`src/functions/<function>.function.ts`

Responsabilidad:

- registro;
- adaptación de input;
- composición;
- invocación;
- adaptación de output.

### Capability

Ubicación:

`src/<Capability>/`

Piezas requeridas:

-

Crear únicamente componentes con responsabilidad real.

## Architecture gap

-
-

## Acciones requeridas

| Action ID | Tipo | Acción |
|-----------|------|--------|
|           |      |        |

Referenciar `analysis.json`.

No copiar toda la evidencia.

## Dependencias globales

| Action ID  | Motivo |
|------------|--------|
| `GLOBAL-*` |        |

## Recursos compartidos

| Resource ID | Action ID | Uso |
|-------------|-----------|-----|
|             |           |     |

Una Function consumidora no debe volver a implementar una acción compartida.

## Preparación

### Paso 1

<!-- Acción neutral respecto del ejecutor. -->

Criterio:

-

### Paso 2

Criterio:

-

## Tests antes de migración

Agregar o preservar:

-

Baseline esperada:

`PASS`

No agregar integration tests en el alcance actual.

## Migración de plataforma

### Programming Model

`REQUIRED | NOT_REQUIRED | REQUIRES_VALIDATION`

Acciones:

-

Si ya está en v4:

`NOT_REQUIRED`

## Durable

Role:

`NOT_APPLICABLE | STARTER | CLIENT | ORCHESTRATOR | ACTIVITY | SUB_ORCHESTRATOR | ENTITY`

Si pertenece a un workflow Durable:

la migración de plataforma debe coordinarse mediante `migrate-durable-functions-v4`.

## Orden de ejecución

1.
2.
3.

Incluir únicamente acciones necesarias para esta Function.

## Validaciones

Durante preparación:

- tests;
- typecheck selectivo;
- validaciones estáticas cuando aporten evidencia.

Después de migración:

- misma baseline;
- registro esperado;
- trigger/bindings preservados.

## Criterios de cierre

La Function está lista cuando:

- comportamiento está protegido;
- arquitectura requerida está aplicada;
- shared dependencies están disponibles;
- tests requeridos están verdes;
- migración de plataforma está completa o `NOT_REQUIRED`;
- no existen blockers locales.

## Riesgos

-

## Unknowns

-

## Deuda fuera de alcance

-

## Ejecución

Este plan puede ser ejecutado:

- mediante un skill;
- mediante IA;
- manualmente.

El resultado esperado es el mismo.
