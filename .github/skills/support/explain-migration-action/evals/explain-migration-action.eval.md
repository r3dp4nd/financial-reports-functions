# Evals — Explain Migration Action

## Objetivo

Validar explicación fiel de Action IDs sin cambios.

## Casos

### 1. Action ID válido
Esperado: explicar objetivo, owner, lane, dependencies, preserve/prohibited changes y checks.

### 2. Action ID inexistente
Esperado: reportar no encontrado; no inferir acción.

### 3. Evidence refs
Esperado: citar artifacts relevantes sin releer todo el repo.

### 4. Human decision
Entrada: action requiere `HUMAN`.
Esperado: resaltar decisión/review; no bajar a pasos automáticos.

### 5. No modificación
Esperado: no editar source, plan ni artifacts.
