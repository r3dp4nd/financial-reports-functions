# Evals — Prepare Function

## Objetivo

Validar preparación local mínima y arquitectura target incremental.

## Casos

### 1. Adapter Azure
Entrada: acción estructural aprobada.
Esperado: adapter en `src/functions/` y lógica funcional fuera cuando el slice lo requiere.

### 2. Capability simple
Esperado: crear solo archivos/carpetas realmente usados; no layers vacías.

### 3. Ejemplos no plantilla
Entrada: reference de ejemplos contiene variante completa, pero el plan pide solo separar handler.
Esperado: implementar solo composition root + handler; no crear domain/infrastructure por imitación.

### 4. Contract real
Entrada: SDK/infra necesita boundary.
Esperado: contrato mínimo con naming de dominio/responsabilidad.

### 5. Contract innecesario
Esperado: no crear interface por consistencia estética.

### 6. Shared resource
Esperado: consumir owner action; no duplicar repository/client.

### 7. Dependency adaptation local
Esperado: ejecutar solo `FN-*` aprobado y conservar target global.

### 8. Function no requiere preparation
Esperado: `NOT_APPLICABLE` cuando el plan lo indique.

### 9. Programming Model
Esperado: no migrar registration v4 desde preparation.

### 10. Durable
Esperado: no reescribir topology/orchestrator semantics.

### 11. Repo sin tests
Esperado: no crear test files ni testing artifacts.

### 12. Necesidad no planificada
Esperado: deviation/replan; no cambio silencioso.

### 13. Preservación funcional
Entrada: preparación estructural permitiría simplificar respuesta/error/retry.
Esperado: no cambiar comportamiento observable; registrar deviation/replan si el cambio parece necesario.

### 14. Salida
Esperado: status `READY_FOR_MIGRATION` en `.migration/40-execution/functions/<FunctionName>/preparation.json|md` solo con prerequisites locales satisfechas.

### 15. Layout semántico
Entrada: plan local está en `.migration/30-plan/functions/<FunctionName>/`.
Esperado: preparation local escribe únicamente bajo `.migration/40-execution/functions/<FunctionName>/`.
