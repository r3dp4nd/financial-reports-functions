# Evals — Verify Function App

## Objetivo

Validar que el skill emita un gate final basado en evidencia reproducible sin corregir código.

## Caso 1 — Migración completamente correcta

### Entrada

- `npm ci` pasa;
- typecheck pasa;
- build pasa;
- tests pasan;
- coverage cumple;
- Host registra todas las Functions;
- legacy scan limpio;
- packaging correcto.

### Esperado

Resultado:

`VERIFIED`

## Caso 2 — Correcta con deuda

### Entrada

Todas las verificaciones obligatorias pasan, pero quedan:

- duplicación;
- naming mejorable;
- dependencia antigua compatible.

### Esperado

Resultado:

`VERIFIED_WITH_DEBT`

La deuda no debe bloquear cierre.

## Caso 3 — Build falla

### Entrada

Typecheck o build final falla.

### Esperado

Resultado:

`BLOCKED`

Debe identificar el fallo y el skill responsable probable.

No debe corregir código.

## Caso 4 — Tests fallan

### Entrada

Build verde pero baseline funcional falla.

### Esperado

Resultado:

`BLOCKED`

No debe considerar build como evidencia suficiente.

## Caso 5 — Function desaparecida

### Entrada

Inventory original contiene `CompleteReport`, pero no aparece registrada al final.

### Esperado

Debe:

- detectar diferencia;
- marcar bloqueo;
- no declarar migración válida.

## Caso 6 — Function nueva no planificada

### Entrada

Host registra una Function adicional inesperada.

### Esperado

Debe:

- registrar inconsistencia;
- usar `REQUIRES_REVIEW` o `BLOCKED` según impacto.

## Caso 7 — Host no ejecutable por configuración

### Entrada

No existe configuración local sanitizada suficiente.

### Esperado

Host:

`NOT_EXECUTED`

con motivo.

No debe leer `local.settings.json` automáticamente.

El estado final dependerá de si esta verificación era obligatoria.

## Caso 8 — Legacy residual activo

### Entrada

Existe un `function.json` legacy que sigue afectando una Function migrada.

### Esperado

Debe:

- clasificarlo como `BLOCKING`;
- no eliminarlo.

## Caso 9 — Legacy residual inocuo

### Entrada

Archivo histórico no utilizado por runtime/build.

### Esperado

Debe:

- no marcar automáticamente bloqueo;
- clasificar según evidencia como `TECHNICAL_DEBT`, `EXPECTED` o `UNKNOWN`.

## Caso 10 — Packaging

### Entrada

El paquete incluye:

- `.migration`;
- tests;
- coverage.

### Esperado

Debe:

- registrar packaging incorrecto;
- indicar si bloquea deployment;
- no modificar `.funcignore`.

## Caso 11 — Node incorrecto durante validación

### Entrada

`package.json` declara Node 24 pero verificaciones se ejecutan con Node 20.

### Esperado

Debe:

- registrar ambas versiones;
- no afirmar validación completa bajo Node 24.

## Caso 12 — Durable incompleto

### Entrada

Orchestrator registrado, pero falta una Activity esperada.

### Esperado

Debe:

- detectar workflow incompleto;
- bloquear cierre.

## Caso 13 — Unknown sin resolver

### Entrada

Permanece una incompatibilidad crítica sin evidencia.

### Esperado

Resultado:

`REQUIRES_REVIEW`

No convertir uncertainty en `VERIFIED`.

## Caso 14 — Optimización pendiente

### Entrada

Existe oportunidad de performance pero todo el target de migración está cumplido.

### Esperado

La optimización:

- queda documentada;
- no bloquea `VERIFIED` o `VERIFIED_WITH_DEBT`.
