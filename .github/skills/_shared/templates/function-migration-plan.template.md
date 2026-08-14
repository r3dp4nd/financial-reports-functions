# Plan de migración — <FunctionName>

## Objetivo

Preparar y migrar `<FunctionName>` preservando su comportamiento actual y aplicando únicamente los cambios estructurales
requeridos para alcanzar el target técnico de forma segura y verificable.

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

## Alcance

- `requestedScope`:
- `effectiveScope`:
- `affectedFunctionsOutsideScope`:

El `effectiveScope` puede ampliarse únicamente cuando una dependencia técnica o funcional sea necesaria para migrar esta
Function de forma coherente.

## Comportamiento a preservar

-
-
-

No duplicar la descripción completa del análisis.

Registrar únicamente los contratos observables que deben mantenerse durante la migración.

## Estado técnico actual

| Dimensión              | Estado |
|------------------------|--------|
| Programming Model      |        |
| Compatibilidad Node.js |        |
| Testabilidad           |        |
| Estructura             |        |

## Cambios estructurales requeridos

Aplicar únicamente cambios estructurales aprobados y necesarios para la migración o testabilidad.

No reorganizar la capability completa si no es requerido.

### Azure adapter

Ubicación objetivo, cuando aplique:

`src/functions/<function>.function.ts`

Responsabilidad:

- registro;
- adaptación de input;
- composición;
- invocación;
- adaptación de output.

### Capability

Ubicación, cuando aplique:

`src/<Capability>/`

Piezas requeridas:

-

Crear únicamente componentes con responsabilidad real.

## Gap estructural

-
-

Distinguir entre cambios requeridos para migración y oportunidades posteriores.

## Acciones requeridas

| Action ID | Tipo | requiredForMigration | Acción |
|-----------|------|----------------------|--------|
|           |      |                      |        |

Referenciar `analysis.json`.

No copiar toda la evidencia.

Las acciones con `requiredForMigration: false` no forman parte obligatoria de la migración técnica.

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

## Pruebas antes de migración

Pruebas requeridas:

-

La generación puede ejecutarse mediante `generate-function-tests` cuando aplique.

Baseline esperada:

`PASS`

`PASS` significa que las pruebas requeridas para el slice seleccionado están verdes.

No agregar pruebas de integración en el alcance actual.

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

- pruebas selectivas;
- typecheck selectivo;
- validaciones estáticas cuando aporten evidencia.

Después de migración:

- misma baseline;
- registro esperado;
- trigger/bindings preservados.

## Criterios de cierre

La Function está lista cuando:

- comportamiento relevante está protegido;
- acciones estructurales requeridas están aplicadas;
- dependencias compartidas requeridas están disponibles;
- pruebas requeridas están verdes;
- migración de plataforma está completa o `NOT_REQUIRED`;
- no existen blockers locales.

## Riesgos

-

## Incertidumbres

-

## Deuda fuera de alcance

-

Registrar aquí cambios estructurales o mejoras no requeridas para completar la migración técnica.

## Ejecución

Este plan puede ser ejecutado:

- mediante un skill;
- mediante IA;
- manualmente.

El resultado esperado es el mismo.
