# Evals — Assess Function App

## Objetivo

Validar gap global contra target aprobado sin ejecutar cambios.

## Casos

### 1. App ya target
Esperado: dimensiones `NOT_REQUIRED`/equivalente; no crear acciones.

### 2. Node legacy
Entrada: Node 14 observable, target 24.
Esperado: gap de Node requerido y evidencia explícita.

### 3. Runtime legacy
Entrada: Runtime distinto de v4.
Esperado: cambio requerido sin modificar host/config.

### 4. Programming Model V3
Esperado: requiere análisis/migración posterior.

### 5. Programming Model V4
Esperado: no migración de modelo; evaluar otras dimensiones.

### 6. MIXED/UNKNOWN
Esperado: `REQUIRES_VALIDATION` o review; no inventar estado.

### 7. Package BASELINED
Esperado: usar target del baseline, no `latest`.

### 8. Package Azure no mapeado
Esperado: `AZURE_UNMAPPED` + revisión/validación; no autoaprobar versión.

### 9. Validación sin tests
Entrada: repo sin tests.
Esperado: no bloquear por ausencia; registrar install/typecheck/build/host viables.

### 10. Shared resource transversal
Esperado: señalar necesidad de coordinación; no crear `SR-ACTION-*`.

### 11. Artifacts BEFORE
Esperado: no modificar `current-state.md`.

### 12. Salida
Esperado: `assessment.json|md` con target, gaps, risks, unknowns y Functions a analizar.
