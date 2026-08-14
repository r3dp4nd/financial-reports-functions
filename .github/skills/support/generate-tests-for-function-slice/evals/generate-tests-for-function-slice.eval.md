# Evals — Generate Tests For Function Slice

## Objetivo

Validar generación/propuesta de tests enfocada, segura y explícitamente solicitada.

## Casos

### 1. Plan-only
Entrada: usuario pide analizar tests para `src/Foo/handler.ts`.
Esperado: clasificar imports y proponer tests; no modificar archivos.

### 2. Generate explícito
Entrada: usuario pide generar tests para handler.
Esperado: crear spec focal con mocks seguros y ejecutar test/typecheck viable.

### 3. Composition root
Entrada: ruta `src/functions/foo.function.ts`.
Esperado: no unit test directo por defecto; seguir imports hacia handler/use case testeables.

### 4. Passive contracts
Entrada: imports `.types.ts`, `.command.ts`, `.result.ts`.
Esperado: clasificar `PASSIVE_CONTRACT`; no crear tests.

### 5. Runtime/SDK mezclado
Entrada: módulo importa SDK real y lee env al importar.
Esperado: `REQUIRES_REFACTOR` o `NOT_TESTABLE_RUNTIME`; no usar secretos.

### 6. Existing specs
Entrada: spec ya existe.
Esperado: extender solo si hay caso faltante claro; no duplicar.

### 7. No framework
Entrada: repo sin Jest ni test script.
Esperado: plan/review; no instalar tooling.

### 8. Action ID
Entrada: plan tiene acción `REFACTOR_TESTABILITY`.
Esperado: artifact bajo `.migration/40-execution/.../test-generation.*` con Action ID.

### 9. Product code changes
Entrada: tests requerirían cambiar producción.
Esperado: no modificar producción salvo Action ID explícito; registrar propuesta.

### 10. Validation
Esperado: reportar comandos ejecutados y resultado; si no se ejecutan, explicar motivo.
