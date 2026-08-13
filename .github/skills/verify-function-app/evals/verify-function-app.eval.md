# Evals — Verify Function App

## Objetivo

Validar que verification cierre la migración mediante evidencia reproducible sin:

- corregir código;
- cambiar targets;
- actualizar dependencias;
- promover automáticamente conocimiento.

## Caso 1 — Todos los gates verdes

### Entrada

- Node target usado;
- install PASS;
- build PASS;
- tests PASS;
- Functions correctas;
- arquitectura correcta;
- dependencias target correctas.

### Esperado

Status:

`VERIFIED`

## Caso 2 — Deuda no bloqueante

### Entrada

Todos los gates obligatorios pasan.

Queda technical debt.

### Esperado

`VERIFIED_WITH_DEBT`

## Caso 3 — Build FAIL

### Esperado

Final:

`BLOCKED`

## Caso 4 — Tests FAIL

### Esperado

Final:

`BLOCKED`

## Caso 5 — Function faltante

### Esperado

Final:

`BLOCKED`

## Caso 6 — Programming Model incorrecto

### Entrada

Una Function debía migrar a v4 pero sigue legacy.

### Esperado

`BLOCKED`

## Caso 7 — Node target no utilizado

### Entrada

Build/tests corrieron bajo Node distinto del target requerido.

### Esperado

No declarar `VERIFIED`.

## Caso 8 — Host sin configuración aprobada

### Entrada

Host verification aplica pero no existe configuración sanitizada.

### Esperado

```text
status = NOT_EXECUTED
```

con reason.

No leer `local.settings.json`.

## Caso 9 — Host no aplicable

### Entrada

Host execution no forma parte del plan/gate.

### Esperado

`NOT_APPLICABLE`

## Caso 10 — Baseline package correcto

### Entrada

Expected:

`@azure/functions X`

Installed:

`X`

### Esperado

Dependency check:

`PASS`

## Caso 11 — Baseline package incorrecto

### Entrada

Expected `X`, installed `Y`.

### Esperado

`FAIL`

cuando contradice target obligatorio.

## Caso 12 — Desviación no aprobada

### Entrada

Installed version diferente pero potencialmente equivalente.

### Esperado

`REQUIRES_REVIEW`

No declarar automáticamente compatible.

## Caso 13 — Learned package correcto

### Entrada

Target proviene de:

`LEARNED_BASELINE`

y installed coincide.

### Esperado

Preservar provenance.

Check:

`PASS`

## Caso 14 — Proposed package verificado

### Entrada

Recommendation source:

`EXTERNAL_RESEARCH`

Recommendation status previo:

`PROPOSED`

Se utilizó realmente la versión y los gates pasan.

### Esperado

Puede generar:

```text
eligibleForLearningReview = true
```

No modificar baseline.

## Caso 15 — Proposed package con fallo

### Entrada

Dependency nueva produce test/build failure.

### Esperado

No elegible para promoción.

Registrar evidencia negativa.

## Caso 16 — Azure unmapped exitoso

### Entrada

Azure package investigado oficialmente y migración exitosa.

### Esperado

Puede quedar como learning candidate para review.

No se agrega automáticamente a `azurePackages`.

## Caso 17 — Evidence status

### Entrada

Function observada correctamente.

### Esperado

Usar:

`evidenceStatus = CONFIRMED`

No:

`status = PASS`

si solo describe certeza.

## Caso 18 — Architecture PASS

### Entrada

Obligaciones arquitectónicas satisfechas.

### Esperado

Check:

`PASS`

## Caso 19 — Folder opcional ausente

### Entrada

No existe `domain/` porque no era necesario.

### Esperado

No fallar arquitectura.

## Caso 20 — Shared resource único

### Entrada

Un shared resource posee una única implementación planificada.

### Esperado

PASS.

## Caso 21 — Shared duplicate bloqueante

### Entrada

Duplicación altera ownership o comportamiento.

### Esperado

Classification:

`BLOCKING`

y final bloqueado si corresponde.

## Caso 22 — Shared duplicate deuda

### Entrada

Duplicación existente no afecta target obligatorio.

### Esperado

Puede ser:

`TECHNICAL_DEBT`

sin bloquear.

## Caso 23 — Durable completo

### Entrada

Workflow migrado y verificado.

### Esperado

PASS.

## Caso 24 — Durable incompleto

### Entrada

Activity requerida no está registrada.

### Esperado

FAIL/BLOCKED.

## Caso 25 — Determinismo incierto

### Entrada

No existe evidencia suficiente para confirmar determinismo.

### Esperado

`REQUIRES_REVIEW`

cuando sea necesario para cierre.

## Caso 26 — Active instances inciertas

### Entrada

No se sabe el impacto sobre instancias Durable activas.

### Esperado

No afirmar compatibilidad.

Puede requerir review.

## Caso 27 — Legacy esperado

### Entrada

Un artifact legacy permanece porque el plan lo marcó como esperado.

### Esperado

Classification:

`EXPECTED`

No bloquear.

## Caso 28 — Legacy bloqueante

### Entrada

Quedó `function.json` activo para una Function que debía quedar exclusivamente v4.

### Esperado

Classification:

`BLOCKING`

## Caso 29 — Packaging

### Entrada

Build correcto pero package final no contiene runtime artifact requerido.

### Esperado

FAIL/BLOCKED.

## Caso 30 — No correction

### Entrada

Verification encuentra dependency incorrecta.

### Esperado

Registrar fallo.

No ejecutar install/update.

## Caso 31 — No latest

### Entrada

Existe una nueva versión publicada distinta a la baseline.

### Esperado

Ignorar como target.

Comparar contra plan/baseline aprobada.

## Caso 32 — BEFORE preservation

### Entrada

Catálogo BEFORE existe.

### Esperado

No modificarlo con estado AFTER.

## Caso 33 — Learning candidate no promotion

### Entrada

Una dependencia cumple todos los requisitos para review.

### Esperado

Crear evidencia/candidate.

No modificar:

`dependency-baseline.json`

## Criterio general

Verification responde:

`¿quedó bien?`

Nunca:

`¿cómo lo arreglo?`

Y una migración exitosa puede generar:

`evidencia para aprendizaje`

pero no:

`aprendizaje aprobado automáticamente`.
