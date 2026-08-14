# Evals — Plan Function Migration

## Objetivo

Validar un plan global + planes por Function sin duplicar ownership.

## Casos

### 1. Acción global
Entrada: upgrade de runtime/dependency común.
Esperado: `GLOBAL-*`, no una acción por Function.

### 2. Shared resource
Entrada: un repository/client confirmado con N consumidores.
Esperado: una única `SR-ACTION-*`; consumidores dependen de ella.

### 3. Acción local
Entrada: adaptación solo de una Function.
Esperado: `FN-*` con owner local.

### 4. requiredForMigration
Entrada: cambio necesario para target.
Esperado: `true` y criterio verificable.

### 5. Deuda opcional
Esperado: `requiredForMigration = false`; no bloquea completion.

### 6. Function ya V4
Esperado: no acción de Programming Model; conservar otras acciones necesarias.

### 7. Durable amplía scope
Esperado: participants necesarios incluidos en effective scope.

### 8. Dependencia sin target aprobado
Esperado: plan `PARTIAL`/`BLOCKED`; no usar `latest`.

### 9. Arquitectura incremental
Esperado: solo layers/boundaries reales para el slice refactorizado.

### 10. Sin tests generados
Esperado: no etapa ni artifact obligatorio de generación de tests en el repositorio objetivo.

### 11. Orden
Esperado: dependencies explícitas, shared/global antes de consumers cuando corresponda.

### 12. Salidas
Esperado: plan global, planes por Function y shared-resources artifact solo si aplica.
