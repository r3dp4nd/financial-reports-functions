# Evals — Analyze Function

## Objetivo

Validar análisis local/slice mínimo y trazable sin planificación ni cambios, incluyendo criticidad y testabilidad cuando afecten migración o refactor.

## Casos

### 1. Comportamiento observable
Esperado: trigger/input/output/side effects relevantes, sin pseudocódigo exhaustivo.

### 2. Progressive disclosure
Entrada: Function depende de un módulo grande.
Esperado: analizar solo el slice transitivo necesario.

### 3. Configuration keys
Esperado: nombres de claves sin valores.

### 4. Dependency impact
Entrada: package target aprobado requiere adaptación local.
Esperado: migration need, no Action ID.

### 5. Function ya V4
Esperado: modelo V4 registrado; no necesidad de migración de modelo.

### 6. Durable participant
Esperado: rol/relaciones y `affectedFunctionsOutsideScope` cuando aplique.

### 7. Shared resource
Esperado: confirmar/referenciar identidad y consumidores cuando exista evidencia.

### 8. Arquitectura
Entrada: lógica funcional acoplada al adapter que debe refactorizarse.
Esperado: necesidad `STRUCTURAL` mínima alineada con arquitectura objetivo.

### 9. Criticidad
Entrada: Function con trigger externo, persistencia, fan-out o mensajería.
Esperado: criticidad `HIGH|MEDIUM|LOW` con rationale/evidencia; no usar tamaño o nombre como única señal.

### 10. Testabilidad
Entrada: SDK/config/I/O/runtime mezclado con lógica o composition root.
Esperado: testabilidad `GOOD|PARTIAL|POOR`, blockers/enablers y necesidad `REFACTOR_TESTABILITY` cuando aplique; no generar tests.

### 11. Lane recomendado
Entrada: slice con necesidad técnica y refactor posterior.
Esperado: recommended lane `TECHNICAL_MIGRATION`, `REFACTOR_TESTABILITY`, `BOTH` o `NO_CHANGE`; planning decide acciones.

### 12. Slice multi-Function
Entrada: Durable workflow u Outbox cruza varias Functions.
Esperado: analysis puede producir artifact de slice y `affectedFunctionsOutsideScope`; no forzar Function aislada.

### 13. Deuda opcional
Entrada: mejora no necesaria para target.
Esperado: `TECHNICAL_DEBT`/`OPTIMIZATION`, no required automáticamente.

### 14. No optimizar comportamiento
Entrada: flujo con retry/idempotencia/status codes observables y oportunidad aparente de simplificación.
Esperado: registrar contrato a preservar y bloquear optimización funcional salvo cambio aprobado.

### 15. Repo sin tests
Esperado: no generar necesidad de testing obligatoria ni crear archivos de tests.

### 16. Unknown crítico
Esperado: `PARTIAL`/`BLOCKED`/`REQUIRES_REVIEW` según impacto; no asumir.

### 17. Salida
Esperado: analysis JSON/MD bajo `.migration/20-analysis/` y BEFORE por Function en `.migration/00-before/functions/` cuando faltaba; sin `FN-*`.

### 18. Layout semántico
Entrada: analysis legacy existe bajo `.migration/functions/<FunctionName>/analysis.json`.
Esperado: puede consumirlo como contexto, pero una nueva emisión owner usa `.migration/20-analysis/functions/<FunctionName>/analysis.json`.

### 19. Narrativa trazable a evidencia ya documentada
Entrada: analysis con "Contrato a preservar"/"Compatibilidad"/"Dependencias" ya completados con evidencia.
Esperado: "Narrativa funcional"/"Narrativa técnica" son prosa que traduce hechos ya documentados en ese mismo analysis o en el BEFORE referenciado, sin introducir afirmaciones no respaldadas; si el propósito de negocio no es claro desde la evidencia disponible, la narrativa funcional lo declara explícitamente en vez de asumirlo.
