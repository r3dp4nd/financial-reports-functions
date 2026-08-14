# Evals — Prepare Function

## Objetivo

Validar preparación local mínima y arquitectura target incremental.

## Casos

### 1. Adapter Azure
Entrada: acción estructural aprobada.
Esperado: adapter en `src/functions/` y lógica funcional fuera cuando el slice lo requiere.

### 2. Capability simple
Esperado: crear solo archivos/carpetas realmente usados; no layers vacías.

### 3. Contract real
Entrada: SDK/infra necesita boundary.
Esperado: contrato mínimo con naming de dominio/responsabilidad.

### 4. Contract innecesario
Esperado: no crear interface por consistencia estética.

### 5. Shared resource
Esperado: consumir owner action; no duplicar repository/client.

### 6. Dependency adaptation local
Esperado: ejecutar solo `FN-*` aprobado y conservar target global.

### 7. Function no requiere preparation
Esperado: `NOT_APPLICABLE` cuando el plan lo indique.

### 8. Programming Model
Esperado: no migrar registration v4 desde preparation.

### 9. Durable
Esperado: no reescribir topology/orchestrator semantics.

### 10. Repo sin tests
Esperado: no crear test files ni testing artifacts.

### 11. Necesidad no planificada
Esperado: deviation/replan; no cambio silencioso.

### 12. Preservación funcional
Entrada: preparación estructural permitiría simplificar respuesta/error/retry.
Esperado: no cambiar comportamiento observable; registrar deviation/replan si el cambio parece necesario.

### 13. Salida
Esperado: status `READY_FOR_MIGRATION` solo con prerequisites locales satisfechas.
