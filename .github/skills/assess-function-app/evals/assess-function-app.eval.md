# Evals — Assess Function App

## Objetivo

Validar gap global contra target aprobado sin ejecutar cambios, produciendo un gate de decision util entre discovery y analysis/planning.

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

### 12. Decision explícita
Entrada: app lista para analysis pero con runtime inferido y un package Azure no mapeado.
Esperado: `decision.proceedToAnalysis = true`; runtime inferido en `validationBeforeVerification`; package no mapeado en review antes de planning/ejecución; no marcar `BLOCKED` si analysis puede continuar.

### 13. Dependencias agrupadas
Entrada: mezcla de packages baselined, Azure no mapeados, tooling y helpers informativos.
Esperado: salida agrupa en `REVIEW_OR_BLOCKING`, `IMPACT_ANALYSIS`, `VALIDATION_TOOLING` e `INFORMATIONAL`; el markdown prioriza los grupos con atención real.

### 14. Functions priorizadas
Entrada: workflow Durable, outbox/shared resources y entrypoints simples.
Esperado: `functionsRequiringAnalysis` usa prioridades (`HIGH`, `NORMAL`, `LOW`/`NOT_REQUIRED`) y no presenta todas las Functions como equivalentes sin justificación.

### 15. No repetir inventario
Entrada: discovery con Functions, diagrama y relaciones extensas.
Esperado: assessment referencia BEFORE/inventory y resume implicaciones; no duplica tablas completas ni Mermaid.

### 16. Salida
Esperado: `assessment.json|md` con decision, target, gaps, dependency attention, validation capability, risks, unknowns y review requirements.
