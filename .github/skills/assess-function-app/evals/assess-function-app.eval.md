# Evals — Assess Function App

## Objetivo

Validar que assessment determine el gap global contra el target utilizando:

- evidencia;
- dependency baseline;
- conocimiento aprendido;
- investigación selectiva;

sin modificar código ni convertir recomendaciones nuevas en conocimiento aprobado.

## Caso 1 — Node legacy

### Entrada

Inventory:

```text
Node 14
```

Target:

```text
Node 24
```

### Esperado

```text
evidenceStatus = CONFIRMED
actionStatus = REQUIRED
```

## Caso 2 — Node target

### Entrada

Node declarado:

`24`

### Esperado

```text
actionStatus = NOT_REQUIRED
```

si existe evidencia suficiente.

## Caso 3 — Runtime desconocido

### Entrada

No existe evidencia segura del Runtime efectivo.

### Esperado

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

No leer CI/CD protegido.

## Caso 4 — Programming Model v4

### Entrada

Inventory confirma v4.

### Esperado

```text
evidenceStatus = CONFIRMED
actionStatus = NOT_REQUIRED
```

## Caso 5 — Programming Model legacy

### Entrada

Inventory confirma legacy.

### Esperado

```text
actionStatus = REQUIRED
```

## Caso 6 — Durable ausente

### Entrada

No existe Durable.

### Esperado

```text
evidenceStatus = NOT_APPLICABLE
```

No generar migración Durable.

## Caso 7 — Azure baselined misma versión

### Entrada

Dependency:

```text
@azure/cosmos 4.10.0
```

Baseline:

```text
4.10.0
```

### Esperado

Classification:

`AZURE_BASELINED`

Target:

`4.10.0`

Action:

`NOT_REQUIRED`

## Caso 8 — Azure baselined versión anterior

### Entrada

Dependency:

```text
@azure/cosmos ^3.10.5
```

Baseline:

```text
4.10.0
```

### Esperado

```text
classification = AZURE_BASELINED
targetVersion = 4.10.0
actionStatus = REQUIRED
impactAnalysisRequired = true
recommendationSource = BASELINE
```

## Caso 9 — Azure package no mapeado

### Entrada

Inventory contiene:

`@azure/keyvault-secrets`

pero baseline no contiene el package.

### Esperado

Classification:

`AZURE_UNMAPPED`

Debe investigar fuentes oficiales.

Una nueva versión propuesta debe quedar:

```text
recommendationStatus = PROPOSED
actionStatus = REQUIRES_VALIDATION
```

No actualizar baseline.

## Caso 10 — Azure unmapped sin evidencia suficiente

### Entrada

No puede determinarse con seguridad una versión target.

### Esperado

```text
targetVersion = null
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

No inventar target.

## Caso 11 — Learned package

### Entrada

`learnedPackages` contiene:

`uuid`

con target aprobado.

### Esperado

Classification:

`LEARNED`

Recommendation source:

`LEARNED_BASELINE`

No tratar la recomendación como upgrade automático.

## Caso 12 — Learned package ya compatible

### Entrada

Repo actual ya utiliza el mismo target aprendido.

### Esperado

Puede resultar:

`NOT_REQUIRED`

si el uso actual es compatible.

No generar cambio solo porque existe learned knowledge.

## Caso 13 — Learned package con contexto diferente

### Entrada

Experiencia anterior fue exitosa, pero el repo actual usa APIs diferentes.

### Esperado

Mantener necesidad de validación.

No asumir compatibilidad por experiencia histórica.

## Caso 14 — Third-party desconocido relevante

### Entrada

Dependency no Azure:

`some-library`

con evidencia de incompatibilidad con Node 24.

### Esperado

Classification:

`UNMAPPED`

Investigar fuentes primarias.

Puede producir:

```text
recommendationStatus = PROPOSED
actionStatus = REQUIRES_VALIDATION
```

## Caso 15 — Third-party desconocido irrelevante

### Entrada

Dependency no baseline.

No existe evidencia de incompatibilidad.

### Esperado

Preservar.

No investigar por antigüedad.

No generar upgrade.

## Caso 16 — Librería abandonada

### Entrada

Existe evidencia suficiente de que la librería actual no soporta el target y está abandonada.

### Esperado

Puede investigar reemplazo.

Debe registrar riesgo y evidencia.

No seleccionar alternativa solo por popularidad.

## Caso 17 — Contradicción con baseline

### Entrada

Baseline contiene target X.

Documentación oficial actual indica incompatibilidad con Node target.

### Esperado

No cambiar baseline automáticamente.

Registrar contradicción.

Resultado afectado:

`REQUIRES_REVIEW`

## Caso 18 — Salto major

### Entrada

Dependency pasa de major 3 a major 4.

### Esperado

`impactAnalysisRequired = true`

cuando aplique.

No afirmar compatibilidad del source.

## Caso 19 — Arquitectura alineada

### Entrada

Arquitectura observable cumple límites requeridos.

### Esperado

```text
classification = ALIGNED
```

No crear acciones estructurales.

## Caso 20 — Arquitectura parcialmente alineada

### Entrada

Parte del comportamiento está separado, parte sigue acoplado.

### Esperado

```text
classification = PARTIALLY_ALIGNED
```

## Caso 21 — Shared resource candidate

### Entrada

Discovery reporta candidato Cosmos.

### Esperado

Assessment puede evaluar necesidad técnica.

No consolidar ownership definitivo sin evidencia.

## Caso 22 — Testing ausente

### Entrada

No existen tests.

### Esperado

Registrar situación global.

No diseñar todavía tests específicos por Function.

## Caso 23 — Evidence vs action

### Entrada

Versión actual no confirmada.

### Esperado

No producir:

```text
actionStatus = UNKNOWN
```

Usar:

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

## Caso 24 — Recommendation status

### Entrada

Nueva recomendación investigada.

### Esperado

Puede utilizar:

`PROPOSED`

No:

`APPROVED`

sin aprobación humana.

## Caso 25 — No baseline mutation

### Entrada

Assessment encuentra un Azure SDK nuevo y determina una versión recomendable.

### Esperado

`dependency-baseline.json` permanece sin modificaciones.

## Caso 26 — Partial

### Entrada

Algunas dimensiones están resueltas y otras requieren validación.

### Esperado

Status global puede ser:

`PARTIAL`

si análisis independiente todavía puede continuar.

## Caso 27 — Blocked

### Entrada

Falta evidencia esencial que impide continuar de forma segura.

### Esperado

Status:

`BLOCKED`

## Caso 28 — Review

### Entrada

Existe decisión humana necesaria sobre target de dependencia crítica.

### Esperado

Status:

`REQUIRES_REVIEW`

cuando bloquea assessment global.

## Criterio general

Assessment debe responder:

`¿qué debe cambiar y con qué target respaldado?`

No:

`¿cómo implementamos el cambio?`

Y:

`experiencia previa`

debe mejorar la evidencia inicial,

no convertirse en verdad automática.
