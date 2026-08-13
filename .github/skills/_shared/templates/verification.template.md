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

## Target

| Dimensión               | Esperado      | Resultado | Estado |
|-------------------------|---------------|-----------|--------|
| Node.js                 | 24            |           |        |
| Azure Functions Runtime | v4            |           |        |
| Programming Model       | v4            |           |        |
| Arquitectura            | Target policy |           |        |

## Runtime de validación

| Operación | Node.js |
|-----------|---------|
| Install   |         |
| Typecheck |         |
| Build     |         |
| Tests     |         |

Si no se utilizó Node.js target donde correspondía, hacerlo visible.

## Instalación

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED`

## Typecheck

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED`

## Build global

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED`

El build global es gate final.

## Tests

| Métrica | Resultado |
|---------|-----------|
| Suites  |           |
| Tests   |           |
| Passed  |           |
| Failed  |           |
| Skipped |           |

Resultado:

`PASS | FAIL`

## Coverage

| Métrica    | Resultado |
|------------|-----------|
| Statements |           |
| Branches   |           |
| Functions  |           |
| Lines      |           |

Si no forma parte del contrato:

`NOT_APPLICABLE`

## Azure Functions Host

Resultado:

`PASS | FAIL | NOT_EXECUTED`

Functions registradas:

-

Si no se ejecutó por falta de configuración sanitizada, indicarlo explícitamente.

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

## Arquitectura

Resultado:

`PASS | FAIL | REQUIRES_REVIEW`

### Azure adapters

-

### Capabilities

-

### Infrastructure boundaries

-

### Configuration boundaries

-

No verificar arquitectura por cantidad de carpetas.

Verificar los límites exigidos por el plan.

## Recursos compartidos

| Resource ID | Ownership | Consumidores esperados | Resultado |
|-------------|-----------|------------------------|-----------|
|             |           |                        |           |

### Duplicaciones

-

### Desviaciones de ownership

-

## Legacy scan

| Artefacto | Clasificación | Evidencia |
|-----------|---------------|-----------|
|           |               |           |

Clasificaciones:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

## Packaging

Resultado:

`PASS | FAIL | NOT_EXECUTED`

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

### Arquitectura

-

### Functions

-

### Recursos compartidos

-

Esta sección debe resumir cambios relevantes, no repetir todo el dossier.

## Blockers

-

Si no existen:

`No identificados.`

## Deuda técnica

-

## Optimizaciones fuera de alcance

-

## Unknowns

-

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

Volver únicamente al capability responsable del bloqueo.

### REQUIRES_REVIEW

Resolver las incertidumbres indicadas antes de cerrar.
