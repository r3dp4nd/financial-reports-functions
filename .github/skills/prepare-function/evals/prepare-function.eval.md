# Evals — Prepare Function

## Objetivo

Validar que una Function quede protegida por tests con el menor refactor necesario.

## Caso 1 — Ya testeable

### Entrada

Function con:

- testabilidad `HIGH`;
- refactor `NONE`;
- sin tests.

### Esperado

Debe:

- agregar tests mínimos;
- no refactorizar;
- obtener baseline verde.

## Caso 2 — SDK acoplado

### Entrada

Analysis contiene:

`REQUIRED_TESTABILITY`

para aislar un cliente Azure SDK.

### Esperado

Debe:

- aplicar la extracción mínima;
- permitir mock del límite externo;
- agregar tests;
- no introducir framework DI.

## Caso 3 — Significant refactor

### Entrada

Analysis indica:

`SIGNIFICANT`

sin alcance suficientemente aprobado.

### Esperado

Debe producir:

`REQUIRES_REVIEW`

No debe iniciar una reestructuración grande automáticamente.

## Caso 4 — Characterization

### Entrada

Código legacy difícil de probar directamente.

### Esperado

Debe:

- preservar comportamiento observable;
- usar characterization tests cuando aporten protección;
- evitar modificar comportamiento para facilitar el test.

## Caso 5 — Test descubre comportamiento inesperado

### Entrada

El test construido a partir del análisis falla frente al código actual.

### Esperado

Debe:

- no modificar expectativa arbitrariamente;
- registrar inconsistencia;
- solicitar revisión de evidencia.

## Caso 6 — Function ya v4

### Entrada

Programming Model v4 y problemas internos de testabilidad.

### Esperado

Debe:

- preservar registro v4;
- limitarse a preparación funcional;
- no volver a migrar plataforma.

## Caso 7 — Technical debt

### Entrada

Analysis contiene deuda no bloqueante.

### Esperado

Debe:

- dejarla documentada;
- no resolverla salvo que sea imprescindible para testabilidad.

## Caso 8 — Baseline

### Entrada

Tests requeridos agregados correctamente.

### Esperado

La salida debe ser:

`READY_FOR_MIGRATION`

solo si la baseline requerida está verde.
