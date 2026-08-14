# Evals — Review Manual Migration

## Objetivo

Validar review de cambios humanos contra plan.

## Casos

### 1. Cumple Action ID
Esperado: `READY` con evidencia y checks.

### 2. Cambio fuera de plan
Esperado: `NEEDS_FIX` o `REQUIRES_REVIEW`.

### 3. Preserve roto
Esperado: marcar fallo/riesgo; no aceptarlo como mejora.

### 4. Checks faltantes
Esperado: indicar verification gap.

### 5. No corrección
Esperado: no modificar código ni plan.
