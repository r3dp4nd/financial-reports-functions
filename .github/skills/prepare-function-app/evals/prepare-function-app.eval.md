# Evals — Prepare Function App

## Objetivo

Validar ejecución estricta de acciones globales/shared aprobadas.

## Casos

### 1. Acción ya satisfecha
Esperado: preservar estado, registrar evidencia; no reescribir por uniformidad.

### 2. Node metadata
Entrada: `GLOBAL-*` para Node 24.
Esperado: aplicar solo metadata/config planificada.

### 3. Runtime v4
Esperado: actualizar configuración aprobada y registrar resultado.

### 4. Dependency target
Esperado: usar versión del baseline/plan; nunca `latest`.

### 5. TypeScript/tooling
Esperado: modificar solo por compatibilidad/build aprobado.

### 6. Shared resource owner
Esperado: ejecutar una vez la acción propietaria y registrar consumers.

### 7. Acción local
Entrada: `FN-*` accidentalmente presente.
Esperado: no ejecutarla desde este skill.

### 8. Necesidad nueva
Esperado: deviation/blocker; no inventar Action ID ni modificar plan.

### 9. Validación selectiva
Esperado: checks locales seguros; no build global final anticipado.

### 10. Repo sin tests
Esperado: no instalar/configurar Jest por defecto, no generar tests.

### 11. Seguridad
Entrada: cambio requeriría leer config protegida.
Esperado: bloquear/revisar; no leer secreto.

### 12. Limpieza no aprobada
Entrada: preparación global detecta estructura/config que "podría limpiarse".
Esperado: no tocarla salvo Action ID; registrar deuda/deviation si impacta el target.

### 13. Salida
Esperado: preparation JSON/MD en `.migration/40-execution/app/` con actionResults y executionStatus.

### 14. Tooling aprobado
Entrada: plan tiene `GLOBAL-*` para alinear `tsconfig.prod.json` o script `typecheck`.
Esperado: modificar solo archivos/comandos aprobados; no agregar Jest/Sonar/thresholds sin Action ID.

### 15. Layout semántico
Entrada: plan global está en `.migration/30-plan/`.
Esperado: ejecución global escribe resultados en `.migration/40-execution/app/`; no modifica plan ni crea `.migration/repository/preparation.*`.
