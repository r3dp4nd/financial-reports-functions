# Evals — Assess Function App

## Objetivo

Validar que assessment determine el gap global entre el estado actual de una Function App y el target técnico aprobado
utilizando:

- evidencia;
- dependency baseline;
- investigación selectiva cuando sea necesaria;

sin:

- modificar código;
- analizar impacto profundo por Function;
- generar acciones;
- construir migration plans;
- convertir candidatos investigados en targets aprobados.

## Caso 1 — Node requiere cambio

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

No afirmar todavía compatibilidad o incompatibilidad del source con Node.js 24.

## Caso 2 — Node ya en target

### Entrada

Node declarado:

`24`

### Esperado

```text
actionStatus = NOT_REQUIRED
```

cuando exista evidencia suficiente sobre la dimensión declarada.

No utilizar la versión declarada como prueba de compatibilidad de todo el source.

## Caso 3 — Runtime desconocido

### Entrada

No existe evidencia segura del Azure Functions Runtime efectivo.

### Esperado

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

No leer CI/CD protegido para resolverlo.

No confundir `host.json` con evidencia suficiente del Runtime efectivo desplegado.

## Caso 4 — Programming Model v4

### Entrada

Inventory confirma:

`V4`

### Esperado

```text
evidenceStatus = CONFIRMED
actionStatus = NOT_REQUIRED
```

## Caso 5 — Programming Model v3

### Entrada

Inventory confirma:

`V3`

### Esperado

```text
evidenceStatus = CONFIRMED
actionStatus = REQUIRED
```

cuando el target exige Programming Model v4.

## Caso 6 — Programming Model mixed

### Entrada

Inventory reporta:

`MIXED`

### Esperado

Mantener explícitamente la condición mixta.

No seleccionar silenciosamente:

- `V3`;
- `V4`.

Puede utilizar:

`REQUIRED`

o:

`REQUIRES_VALIDATION`

según la evidencia disponible.

## Caso 7 — Durable ausente

### Entrada

No existe Durable Functions en la Function App.

### Esperado

```text
evidenceStatus = NOT_APPLICABLE
```

No crear trabajo Durable.

No generar migration plan Durable.

## Caso 8 — Package baselined misma versión

### Entrada

Dependency:

```text
@azure/cosmos 4.10.0
```

`managedPackages` contiene target aprobado:

```text
4.10.0
```

### Esperado

```text
classification = BASELINED
targetVersion = 4.10.0
actionStatus = NOT_REQUIRED
recommendationSource = BASELINE
```

Registrar cuando corresponda:

- baselineId;
- baselineRevision.

## Caso 9 — Package baselined requiere cambio

### Entrada

Dependency:

```text
@azure/cosmos ^3.10.5
```

`managedPackages` contiene target aprobado:

```text
4.10.0
```

### Esperado

```text
classification = BASELINED
targetVersion = 4.10.0
actionStatus = REQUIRED
impactAnalysisRequired = true
recommendationSource = BASELINE
```

Debe preservar:

- baselineId;
- baselineRevision.

No volver a investigar una versión alternativa sin evidencia de posible invalidación del baseline.

## Caso 10 — Managed package no Azure

### Entrada

Inventory contiene:

```text
@types/node ^14.14.37
```

y `managedPackages` contiene un target aprobado para ese package.

### Esperado

Classification:

`BASELINED`

No clasificarlo como Azure únicamente porque forme parte del baseline.

La clasificación `BASELINED` no depende de que el package pertenezca al ecosistema Azure.

## Caso 11 — Azure package no mapeado

### Entrada

Inventory contiene:

`@azure/keyvault-secrets`

pero `managedPackages` no contiene ese package.

### Esperado

Classification:

`AZURE_UNMAPPED`

Puede realizar investigación oficial selectiva cuando sea necesaria.

Si existe evidencia suficiente para proponer una opción:

```text
candidateTarget = <researched-candidate>
actionStatus = REQUIRES_VALIDATION
```

No utilizar:

`targetVersion`

para representar un target todavía no aprobado.

No modificar baseline.

## Caso 12 — Azure unmapped sin evidencia suficiente

### Entrada

No puede determinarse con seguridad un candidate target.

### Esperado

```text
candidateTarget = null
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

No inventar target.

No seleccionar `latest`.

## Caso 13 — Candidate target no es target aprobado

### Entrada

Investigación oficial encuentra una versión técnicamente viable para un Azure package no gestionado.

### Esperado

Puede registrarse:

`candidateTarget`

No debe registrarse como:

`targetVersion`

aprobado.

No debe incorporarse automáticamente a:

`managedPackages`.

## Caso 14 — Third-party desconocido relevante

### Entrada

Dependency no Azure:

`some-library`

con evidencia de posible incompatibilidad con Node.js 24.

### Esperado

Classification:

`UNMAPPED`

Puede investigar únicamente lo necesario para evaluar el riesgo de migración.

Si encuentra una opción plausible:

```text
candidateTarget = <candidate>
actionStatus = REQUIRES_VALIDATION
```

No convertir la investigación en target aprobado.

## Caso 15 — Third-party desconocido irrelevante

### Entrada

Dependency no baselined.

No existe evidencia de incompatibilidad ni impacto sobre la migración.

### Esperado

Preservar.

No investigar por antigüedad.

No generar upgrade.

No generar `candidateTarget` sin necesidad.

## Caso 16 — Librería sin soporte relevante

### Entrada

Existe evidencia suficiente de que la librería actual no soporta el target técnico.

### Esperado

Assessment puede investigar alternativas cuando sea necesario para determinar viabilidad.

Debe registrar:

- evidencia;
- riesgo;
- incertidumbres.

No seleccionar una alternativa únicamente por:

- popularidad;
- novedad;
- preferencia tecnológica.

## Caso 17 — Contradicción con baseline

### Entrada

Baseline contiene target X.

Evidencia oficial confiable indica que X puede ser incompatible con el target de campaña.

### Esperado

No cambiar baseline automáticamente.

Registrar la contradicción.

Registrar revisión humana cuando sea necesaria.

El resultado afectado puede utilizar:

`REQUIRES_REVIEW`

No elegir silenciosamente otra versión.

## Caso 18 — Salto major

### Entrada

Una dependencia relevante pasa de major 3 a major 4 según target aprobado.

### Esperado

Cuando el baseline lo marque:

```text
impactAnalysisRequired = true
```

Assessment no debe afirmar compatibilidad del source.

El análisis de consumidores pertenece a:

`analyze-function`

## Caso 19 — Dependencia irrelevante preservada

### Entrada

`package.json` contiene una dependencia antigua que:

- no está en baseline;
- no presenta evidencia de incompatibilidad;
- no participa en las dimensiones relevantes de migración.

### Esperado

Preservar.

No investigar.

No generar una acción.

## Caso 20 — TypeScript sin target aprobado

### Entrada

Inventory contiene una versión actual de TypeScript.

El baseline no define target aprobado para TypeScript.

### Esperado

Assessment puede registrar:

- current version;
- riesgos observables;
- necesidad de validación.

No inventar una versión target.

## Caso 21 — Testing ausente

### Entrada

No existen tests.

### Esperado

Registrar la situación global en testing assessment.

No:

- diseñar tests específicos por Function;
- generar tests;
- afirmar automáticamente que la migración está bloqueada.

La testabilidad detallada pertenece a análisis posterior.

## Caso 22 — Testing global existente

### Entrada

Inventory muestra:

- Jest;
- test script;
- tests existentes.

### Esperado

Assessment puede registrar capacidad global observable.

No asumir:

```text
all Functions are testable
```

No ejecutar análisis de testabilidad por Function.

## Caso 23 — Evidence vs action

### Entrada

Una dimensión actual no puede confirmarse.

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

## Caso 24 — Structural observation

### Entrada

Varias Functions construyen directamente el mismo tipo de cliente externo.

### Esperado

Assessment puede registrar una observación estructural transversal relevante.

No producir automáticamente:

- `ALIGNED`;
- `PARTIALLY_ALIGNED`;
- `CHANGE_REQUIRED`;
- target architecture;
- structural action.

La necesidad concreta pertenece a analysis y planning.

## Caso 25 — Estructura existente coherente

### Entrada

La Function App presenta boundaries claros y estructura coherente.

### Esperado

Assessment puede registrar observaciones relevantes cuando aporten evidencia.

No necesita emitir una clasificación arquitectónica global.

No generar acciones estructurales por ausencia de problemas.

## Caso 26 — Shared resource candidate

### Entrada

Discovery reporta un candidato Cosmos.

### Esperado

Assessment puede evaluar:

- relevancia global;
- evidencia disponible;
- necesidad técnica general.

No consolidar ownership definitivo sin evidencia.

No crear:

`SR-ACTION-*`

La consolidación ejecutable pertenece a planning.

## Caso 27 — Dos candidatos con misma tecnología

### Entrada

Discovery reporta dos candidatos basados en Cosmos DB.

Existen señales de que representan recursos funcionales distintos.

### Esperado

Assessment no debe fusionarlos únicamente por compartir:

`@azure/cosmos`

Debe preservar la incertidumbre o separación observable.

## Caso 28 — Functions requiring analysis

### Entrada

Assessment detecta:

- `RequestReport` en Programming Model v3;
- impacto potencial de una dependencia con `impactAnalysisRequired = true`.

### Esperado

Debe registrar la Function en:

`functionsRequiringAnalysis`

con motivos trazables.

Ejemplo conceptual:

```json
{
  "function": "RequestReport",
  "reasons": [
    "PROGRAMMING_MODEL_V3",
    "DEPENDENCY_IMPACT"
  ]
}
```

No ejecutar el análisis profundo desde assessment.

## Caso 29 — No generar Action IDs

### Entrada

Assessment confirma varios gaps globales y locales.

### Esperado

No generar:

- `GLOBAL-*`;
- `FN-*`;
- `SR-ACTION-*`.

Assessment describe:

- gap;
- necesidad;
- acción requerida o validación a nivel de dimensión;

pero planning es owner de los Action IDs ejecutables.

## Caso 30 — No baseline mutation

### Entrada

Assessment encuentra un Azure SDK nuevo y determina un `candidateTarget`.

### Esperado

`dependency-baseline.json` permanece sin modificaciones.

No incrementar:

`baselineRevision`

No agregar el package a:

`managedPackages`.

## Caso 31 — Baseline reference reproducible

### Entrada

Assessment utiliza un baseline aprobado.

### Esperado

`assessment.json` debe conservar referencia suficiente como:

```text
baselineId
baselineRevision
```

No copiar innecesariamente el baseline completo.

## Caso 32 — Partial

### Entrada

Algunas dimensiones están resueltas y otras requieren validación.

Existe suficiente evidencia para continuar analysis de trabajo independiente.

### Esperado

Status global:

`PARTIAL`

No convertir toda incertidumbre en `BLOCKED`.

## Caso 33 — Blocked

### Entrada

Falta evidencia esencial sin la cual no puede continuarse de forma segura con el análisis requerido.

### Esperado

Status:

`BLOCKED`

Debe registrar qué información necesaria falta.

## Caso 34 — Requires review

### Entrada

Existe una decisión humana necesaria que impide cerrar assessment de forma segura.

Ejemplo:

target aprobado de una dependencia crítica contradicho por evidencia oficial.

### Esperado

Status:

`REQUIRES_REVIEW`

No resolver silenciosamente la decisión.

## Caso 35 — Ready for analysis

### Entrada

Existen gaps e incertidumbres menores, pero hay evidencia suficiente para comenzar de forma segura los analyses
necesarios.

### Esperado

Status:

`READY_FOR_ANALYSIS`

Este estado no significa que todas las dimensiones estén completamente resueltas.

## Caso 36 — Lessons opcionales

### Entrada

Assessment concluye normalmente sin producir aprendizaje reutilizable.

### Esperado

La ausencia de artifacts bajo:

`.migration/lessons/assess-function-app/`

no debe impedir cerrar assessment.

No crear lessons vacías únicamente por contrato.

## Criterio general

Assessment debe responder:

```text
¿cuál es el gap global respecto del target técnico aprobado?
```

y:

```text
¿qué requiere cambio, validación o análisis posterior?
```

No debe responder todavía:

```text
¿cómo implementamos cada cambio?
```

Invariantes:

```text
assessment
≠ analyze-function
≠ planning
```

```text
baseline target
≠ candidateTarget
```

```text
candidateTarget
≠ target aprobado
```

```text
evidenceStatus
≠ actionStatus
```

```text
shared candidate
≠ shared resource consolidado
```

```text
structural observation
≠ architecture target
```

```text
impactAnalysisRequired
→ analyze-function
```

```text
migrationNeed / gap
≠ Action ID
```

```text
assessment
→ nunca modifica dependency baseline
```
