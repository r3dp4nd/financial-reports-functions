# Evals — Plan Function Migration

## Objetivo

Validar un plan global + planes por Function/slice sin duplicar ownership, útil como contrato de ejecución/evaluación para humanos o IA.

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

### 12. Carriles de trabajo
Entrada: necesidades de migración técnica y refactor/testabilidad.
Esperado: acciones separadas en `TECHNICAL_MIGRATION` y `REFACTOR_TESTABILITY`; no mezclar refactor amplio con cambio técnico mínimo salvo precondición justificada.

### 13. Executor sugerido
Entrada: acciones mecánicas, acciones con decisión humana y acciones mixtas.
Esperado: `suggestedExecutor` es `AI_AGENT`, `HUMAN` o `EITHER` con rationale; no elimina review requirements.

### 14. Plan como eval
Esperado: cada acción tiene `expectedResult`, `verificationCriteria`, `failureCriteria` y `evidenceRefs` suficientes para verificar ejecución humana o IA.

### 15. Slice no Function
Entrada: Durable workflow u Outbox involucra varias Functions.
Esperado: `SLICE-*` o plan por slice propietario; Functions participantes referencian la acción sin duplicarla.

### 16. Preservación funcional
Entrada: analysis registra status codes, retries, idempotencia, mensajes o efectos persistentes.
Esperado: las acciones incluyen preserve/failure criteria; cualquier cambio funcional no aprobado bloquea el plan o requiere decisión humana.

### 17. Salidas
Esperado: plan global, planes por Function y shared-resources artifact solo si aplica.
