# Evals — Generate Dev Task Pack

## Objetivo

Validar task packs útiles para ejecución humana.

## Casos

### 1. Un Action ID
Esperado: artifact en `dev-tasks/<ActionId>.md` con checklist y criterios.

### 2. Varios Action IDs
Esperado: ordenar por dependencies y agrupar por owner.

### 3. Action bloqueado
Esperado: task pack indica blocker/review; no lo presenta como listo.

### 4. Preserve/prohibited
Esperado: ambos aparecen claramente.

### 5. No modificación
Esperado: no tocar source ni plan.
