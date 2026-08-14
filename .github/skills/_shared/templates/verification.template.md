# Verificación final de migración

## Resumen ejecutivo

Estado final:

`VERIFIED | VERIFIED_WITH_DEBT | BLOCKED | REQUIRES_REVIEW`

Resumen breve:

<!--
Responder directamente si la migración técnica puede considerarse cerrada.
-->

## Referencias

BEFORE:

`.migration/catalog/current-state.md`

PLAN:

`.migration/plans/migration-plan.md`

AFTER estructurado:

`.migration/verification/verification.json`

Estados aplicables a las verificaciones:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

## Target técnico

| Dimensión               | Esperado | Resultado | Estado |
|-------------------------|----------|-----------|--------|
| Node.js                 | 24       |           |        |
| Azure Functions Runtime | v4       |           |        |
| Programming Model       | v4       |           |        |

## Runtime de validación

| Operación   | Node.js |
|-------------|---------|
| Instalación |         |
| Typecheck   |         |
| Build       |         |
| Pruebas     |         |

Si no se utilizó Node.js target donde correspondía, hacerlo visible.

## Dependencias

| Paquete | Esperado | Detectado | Estado |
|---------|----------|-----------|--------|
|         |          |           |        |

Comparar contra las versiones aprobadas por el plan o baseline.

No resolver nuevas versiones target durante verification.

## Instalación

Comando:

`<command>`

Resultado:

`<estado>`

## Typecheck

Comando:

`<command>`

Resultado:

`<estado>`

## Build global

Comando:

`<command>`

Resultado:

`<estado>`

El build global es gate final.

## Pruebas

| Métrica | Resultado |
|---------|-----------|
| Suites  |           |
| Pruebas |           |
| Passed  |           |
| Failed  |           |
| Skipped |           |

Resultado:

`<estado>`

## Cobertura

| Métrica    | Resultado |
|------------|-----------|
| Statements |           |
| Branches   |           |
| Functions  |           |
| Lines      |           |

Estado:

`<estado>`

Si no forma parte del contrato:

`NOT_APPLICABLE`

No excluir código únicamente para mejorar porcentajes de cobertura.

## Contratos observables preservados

| Function / Workflow | Contrato | Estado | Evidencia |
|---------------------|----------|--------|-----------|
|                     |          |        |           |

Verificar únicamente contratos comprometidos por el plan.

No inferir preservación de comportamiento únicamente a partir de un build exitoso.

## Azure Functions Host

Resultado:

`<estado>`

Functions registradas:

-

Si no se ejecutó por falta de configuración sanitizada, indicarlo explícitamente.

No leer archivos protegidos ni secretos para habilitar esta validación.

## Functions

| Function | BEFORE | Esperada | AFTER | Estado |
|----------|--------|----------|-------|--------|
|          |        |          |       |        |

### Faltantes

-

### Inesperadas

-

## Programming Model

| Function | Esperado | Detectado | Estado |
|----------|----------|-----------|--------|
|          |          |           |        |

## Durable

| Workflow | Estado |
|----------|--------|
|          |        |

### Hallazgos

-

No duplicar el detalle de `.migration/workflows/<WorkflowName>/durable-migration.md`.

## Cumplimiento del plan

| Action ID | Requerida para migración | Resultado | Evidencia |
|-----------|--------------------------|-----------|-----------|
|           |                          |           |           |

Las acciones requeridas para migración deben estar completadas o justificadas por el estado final.

Las acciones con `requiredForMigration: false` no son gate obligatorio para `VERIFIED`.

## Estructura comprometida por el plan

Resultado:

`PASS | FAIL | NOT_APPLICABLE | REQUIRES_REVIEW`

Verificar únicamente límites o cambios estructurales exigidos por acciones aprobadas con `requiredForMigration: true`.

### Azure adapters

-

### Capabilities

-

### Límites de infraestructura

-

### Límites de configuración

-

Omitir subsecciones que no apliquen.

No verificar estructura por cantidad de carpetas.

No convertir verification en una revisión general de arquitectura o modernización.

## Recursos compartidos

| Resource ID | Ownership | Consumidores esperados | Resultado |
|-------------|-----------|------------------------|-----------|
|             |           |                        |           |

### Duplicaciones

-

### Desviaciones de ownership

-

## Legacy residual

| Artefacto | Clasificación | Evidencia |
|-----------|---------------|-----------|
|           |               |           |

Clasificaciones:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

Revisar únicamente artefactos legacy relacionados con el scope efectivo, el target técnico o acciones comprometidas por
el plan.

`TECHNICAL_DEBT` y `EXPECTED` no bloquean automáticamente el cierre.

## Packaging

Resultado:

`<estado>`

Comprobar cuando corresponda:

- `dist`;
- `package.json`;
- lockfile;
- `host.json`;
- runtime dependencies;
- `.funcignore`.

### Contenido inesperado

-

## Comparación BEFORE → AFTER

### Plataforma

-

### Estructura

-

### Functions

-

### Recursos compartidos

-

Esta sección debe resumir cambios relevantes, no repetir todo el dossier.

## Bloqueos

-

Si no existen:

`No identificados.`

## Deuda técnica

-

La deuda no bloqueante puede producir `VERIFIED_WITH_DEBT`.

## Optimizaciones fuera de alcance

-

## Incertidumbres

-

No reemplazar incertidumbres por supuestos.

## Riesgos posteriores a migración

-

## Conclusión

Responder explícitamente:

- si la migración puede cerrarse;
- qué queda pendiente;
- si requiere intervención humana;
- si existe deuda no bloqueante.

## Siguiente acción

### VERIFIED

Migración técnica cerrada.

### VERIFIED_WITH_DEBT

Migración técnica cerrada con deuda documentada.

### BLOCKED

Volver únicamente a la etapa o acción responsable del bloqueo.

### REQUIRES_REVIEW

Resolver las incertidumbres indicadas antes de cerrar.
