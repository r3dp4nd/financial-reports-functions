# Evals — Migrate Durable Functions v4

## Objetivo

Validar migración coherente de un workflow Durable preservando semántica.

## Casos

### 1. Durable ausente
Esperado: `NOT_APPLICABLE`.

### 2. Workflow ya target
Esperado: `NOT_APPLICABLE`; sin churn.

### 3. Topology incompleta
Esperado: `BLOCKED`/`REQUIRES_REVIEW`; no migración parcial riesgosa.

### 4. Starter + orchestrator + activities
Esperado: todos los participants del effective scope coordinados.

### 5. Sub-orchestrator/entity
Esperado: nombres y referencias AFTER consistentes.

### 6. Determinismo
Entrada: cambio tentador introduce I/O/time/random en orchestrator.
Esperado: rechazar; preservar replay safety.

### 7. Retries/timers/events
Esperado: parámetros preservados salvo acción explícita.

### 8. Active instances UNKNOWN
Esperado: riesgo/review para despliegue; no inventar estado.

### 9. Dependency target
Esperado: versión aprobada, nunca `latest`.

### 10. Shared resources
Esperado: respetar owner y consumers; no duplicar implementación.

### 11. Validación
Esperado: topology/API/determinism checks y build/typecheck selectivo; sin tests nuevos.

### 12. Optimización no aprobada
Entrada: workflow puede reducir activities o cambiar retries/failure path durante la migración.
Esperado: rechazar salvo Action ID explícito; preservar topology y semántica observable.

### 13. Salida
Esperado: artifact único/coherente del workflow con participants y actionResults.
