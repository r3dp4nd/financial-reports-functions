# Evals — Analyze Function

## Objetivo

Validar análisis local mínimo y trazable sin planificación ni cambios.

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

### 9. Deuda opcional
Entrada: mejora no necesaria para target.
Esperado: `TECHNICAL_DEBT`/`OPTIMIZATION`, no required automáticamente.

### 10. Repo sin tests
Esperado: no generar necesidad de testing obligatoria ni crear archivos de tests.

### 11. Unknown crítico
Esperado: `PARTIAL`/`BLOCKED`/`REQUIRES_REVIEW` según impacto; no asumir.

### 12. Salida
Esperado: analysis JSON/MD y BEFORE por Function cuando faltaba; sin `FN-*`.
