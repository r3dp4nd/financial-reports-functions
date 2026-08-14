# Status Policy

## Objetivo

Usar un vocabulario pequeño y consistente para evidencia, acciones, ejecución y cierre.

## Evidence status

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## Action status

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

`requiredForMigration` sigue siendo un booleano de planificación, no un status.

## Execution status

- `COMPLETED`
- `FAILED`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Verification check

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

## Estados por etapa

### Assessment

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Analysis

- `READY`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Planning

- `READY`
- `PARTIAL`
- `BLOCKED`

### Global preparation

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Function preparation

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Migration

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Final verification

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Reglas de agregación

Aplicar en este orden:

1. un gate obligatorio `FAIL` → `BLOCKED`;
2. un gate obligatorio `NOT_EXECUTED` sin justificación → `BLOCKED`;
3. una acción requerida incompleta → `BLOCKED`;
4. una decisión humana pendiente que impide concluir → `REQUIRES_REVIEW`;
5. todos los gates obligatorios satisfechos con deuda no bloqueante → `VERIFIED_WITH_DEBT`;
6. todos los gates obligatorios satisfechos sin deuda relevante → `VERIFIED`.

## Distinciones

- `UNKNOWN` describe evidencia; `REQUIRES_REVIEW` describe una decisión/resultado que necesita intervención humana.
- `NOT_APPLICABLE` significa que una dimensión no corresponde; `NOT_REQUIRED` significa que una acción posible no es necesaria.
- `FAILED` indica una ejecución realizada y fallida; `BLOCKED` indica que el flujo no puede continuar o cerrar.
- `MIGRATED` pertenece a una etapa de cambio; `VERIFIED` pertenece al cierre global.
