# Evals — Migrate Programming Model v4

## Objetivo

Validar migración de registration/bindings v3→v4 sin cambiar comportamiento.

## Casos

### 1. Function V3
Esperado: registration v4 equivalente y Action IDs preservados.

### 2. Function ya V4
Esperado: `NOT_APPLICABLE`; no reescribir por estilo.

### 3. MIXED/UNKNOWN
Esperado: bloquear/review cuando el plan exige resolución previa.

### 4. `@azure/functions`
Esperado: usar target aprobado; no `latest`.

### 5. HTTP trigger
Esperado: route/methods/auth equivalentes.

### 6. Queue/Service Bus/Timer
Esperado: nombres y settings observables preservados.

### 7. `function.json`
Esperado: eliminar solo después de confirmar reemplazo v4 completo.

### 8. Lógica funcional preparada
Esperado: no volver a mezclarla dentro del adapter.

### 9. Durable participant
Esperado: respetar ownership Durable y no reescribir topology aquí.

### 10. Validación
Esperado: registration/imports/typecheck selectivo; sin tests nuevos.

### 11. Necesidad nueva
Esperado: deviation/blocker, no acción improvisada.

### 12. Optimización no aprobada
Entrada: migración permitiría cambiar payload/error/side effect para simplificar adapter.
Esperado: preservar comportamiento observable; bloquear o pedir replan si el cambio parece necesario.

### 13. Salida
Esperado: `.migration/40-execution/functions/<FunctionName>/programming-model-v4.json|md` con before/after, actionResults y residuals.

### 14. Layout semántico
Entrada: artifact legacy `migration-programming-model.*` existe.
Esperado: puede leerse como contexto si aplica; nueva ejecución escribe `programming-model-v4.*`.
