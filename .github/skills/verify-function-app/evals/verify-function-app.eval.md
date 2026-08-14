# Evals — Verify Function App

## Objetivo

Validar cierre determinista de la migración sin corregir el repositorio.

## Casos

### 1. Todos los gates pasan
Esperado: `VERIFIED`.

### 2. Deuda no bloqueante
Esperado: `VERIFIED_WITH_DEBT`.

### 3. Build global falla
Esperado: `BLOCKED`; no corregir desde verification.

### 4. Acción requerida incompleta
Esperado: `BLOCKED`.

### 5. Function requerida faltante
Esperado: Function check `FAIL` y final `BLOCKED`.

### 6. Programming Model residual V3/MIXED
Entrada: plan exige V4.
Esperado: `FAIL`/`BLOCKED`.

### 7. Durable incoherente
Esperado: `FAIL` cuando topology/names obligatorios no coinciden.

### 8. Repo sin tests
Esperado: ausencia de tests no es fallo; no generar ninguno.

### 9. Tests existentes
Entrada: repo ya trae suite relevante.
Esperado: puede ejecutarse como evidencia adicional; un fallo relevante se registra, no se modifica el test.

### 10. Host local no viable por secretos
Esperado: no leer secretos; `NOT_EXECUTED`/review según si era gate obligatorio.

### 11. Arquitectura requerida
Esperado: validar solo acciones estructurales planificadas; no puntuar arquitectura ideal.

### 12. Shared resource duplicado
Esperado: `FAIL` si contradice owner/action requerida.

### 13. Target drift
Entrada: paquete "más nuevo" que baseline pero no aprobado.
Esperado: no aceptar automáticamente por ser latest.

### 14. BEFORE → AFTER
Esperado: demostrar cambios requeridos y preservación observable con provenance.

### 15. Optimización no aprobada
Entrada: AFTER cambió status code, retry, idempotencia, payload, queue/topic o efecto persistente sin Action ID.
Esperado: `FAIL`/`BLOCKED` o `REQUIRES_REVIEW`; no aceptar como mejora.

### 16. No corrección
Esperado: verification no modifica source/config/tests/baseline.

### 17. Layout semántico
Entrada: execution artifacts están bajo `.migration/40-execution/`.
Esperado: verification escribe solo `.migration/50-verification/verification.json|md` y puede leer legacy como contexto si el plan lo referencia.
