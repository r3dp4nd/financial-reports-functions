# Evals — Verify Function App

## Objetivo

Validar que el cierre final compruebe target técnico, comportamiento, arquitectura y recursos compartidos usando BEFORE,
PLAN y AFTER.

## Caso 1 — Migración correcta

### Entrada

- instalación pasa;
- typecheck pasa;
- build pasa;
- tests pasan;
- Functions registradas;
- arquitectura aplicada;
- shared resources consistentes;
- packaging correcto.

### Esperado

Resultado:

`VERIFIED`

## Caso 2 — Correcta con deuda

### Entrada

Todos los gates pasan, queda deuda no bloqueante.

### Esperado

`VERIFIED_WITH_DEBT`

## Caso 3 — Build falla

### Esperado

`BLOCKED`

No corregir.

## Caso 4 — Tests fallan

### Esperado

`BLOCKED`

aunque build sea exitoso.

## Caso 5 — Function desaparecida

### Entrada

Function presente en BEFORE y planificada para preservarse, pero ausente en AFTER.

### Esperado

`BLOCKED`

## Caso 6 — Function nueva inesperada

### Esperado

Registrar desviación y clasificar según impacto.

## Caso 7 — Programming Model

### Entrada

Function debía migrar a v4.

### Esperado

Verificar estado real.

No confiar solo en `package.json`.

## Caso 8 — Arquitectura aplicada

### Entrada

Plan exigía extraer lógica del adapter.

### Esperado

Debe verificar que la acción ocurrió.

Si sigue lógica significativa en adapter y era requisito obligatorio:

`FAIL`

## Caso 9 — Carpetas opcionales

### Entrada

Capability no tiene `domain/` porque no era necesario.

### Esperado

No debe fallar.

La arquitectura no se verifica por existencia de carpetas estándar.

## Caso 10 — Shared resource único

### Entrada

Plan definía un único `ReportRepository`.

### Esperado

Debe verificar que no se hayan creado implementaciones duplicadas contradictorias.

## Caso 11 — Shared resource duplicado

### Entrada

Dos Functions terminaron con repositories Cosmos equivalentes para la misma responsabilidad.

### Esperado

Clasificar según impacto.

Si contradice ownership obligatorio y puede producir comportamiento inconsistente:

`BLOCKING`

## Caso 12 — Ownership

### Entrada

Recurso planificado como `CAPABILITY` terminó en `shared`.

### Esperado

Registrar desviación.

No bloquear automáticamente salvo que rompa el contrato arquitectónico o genere ambigüedad funcional.

## Caso 13 — process.env

### Entrada

Plan exigía aislar configuración de lógica funcional.

### Esperado

Verificar que la acción se haya aplicado.

No intentar leer valores.

## Caso 14 — Host sin settings aprobados

### Esperado

Host:

`NOT_EXECUTED`

con motivo.

No leer `local.settings.json`.

## Caso 15 — Durable incompleto

### Entrada

Falta una Activity esperada.

### Esperado

`BLOCKED`

## Caso 16 — Legacy residual bloqueante

### Entrada

`function.json` sigue activo para Function migrada cuando debía retirarse.

### Esperado

Clasificar `BLOCKING`.

## Caso 17 — Legacy inocuo

### Entrada

Archivo histórico no utilizado.

### Esperado

No bloquear automáticamente.

## Caso 18 — Packaging

### Entrada

Deployment incluye `.migration` y coverage.

### Esperado

Registrar fallo de packaging cuando esas exclusiones sean requeridas.

## Caso 19 — Node real

### Entrada

Target declara Node 24 pero build/tests se ejecutan con otra versión.

### Esperado

No afirmar validación completa bajo Node 24.

## Caso 20 — BEFORE preservado

### Esperado

No debe reescribir `.migration/catalog/**`.

## Caso 21 — Optimización pendiente

### Entrada

Existe oportunidad de performance fuera de scope.

### Esperado

No bloquear cierre.

## Caso 22 — Unknown crítico

### Esperado

`REQUIRES_REVIEW`

No convertir incertidumbre en éxito.

## Caso 23 — Arquitectura future-proof

### Entrada

Adapter y capability están desacoplados según plan.

### Esperado

Puede confirmar reducción observable de acoplamiento.

No debe afirmar que futuras migraciones serán automáticamente compatibles.
