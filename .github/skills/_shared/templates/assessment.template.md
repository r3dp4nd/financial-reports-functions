# Evaluación de la Function App

## Objetivo

Evaluar el estado actual de la Function App respecto del target técnico aprobado e identificar los gaps que requieren
análisis, validación o acciones posteriores.

## Referencias

Estado actual:

`.migration/catalog/current-state.md`

Inventario estructurado:

`.migration/repository/inventory.json`

Baseline técnico:

`.github/skills/_shared/dependency-baseline.json`

## Estado

`READY_FOR_ANALYSIS | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Target técnico

| Dimensión               | Actual | Target | Estado |
|-------------------------|--------|--------|--------|
| Node.js                 |        | 24     |        |
| Azure Functions Runtime |        | v4     |        |
| Programming Model       |        | v4     |        |
| Durable Functions       |        |        |        |

Estados de evidencia aplicables:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Estados de acción aplicables:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Node.js

Resultado:

`REQUIRED | NOT_REQUIRED | REQUIRES_VALIDATION`

Hallazgos:

-

No inferir compatibilidad únicamente a partir de la versión declarada.

## Azure Functions Runtime

Resultado:

`REQUIRED | NOT_REQUIRED | REQUIRES_VALIDATION`

Hallazgos:

-

## Programming Model

Resultado:

`REQUIRED | NOT_REQUIRED | REQUIRES_VALIDATION`

Hallazgos:

-

## Durable Functions

Resultado:

`REQUIRED | NOT_REQUIRED | REQUIRES_VALIDATION | NOT_APPLICABLE`

Workflows detectados:

-

Hallazgos:

-

La migración detallada de un workflow pertenece a su análisis y plan correspondiente.

## Dependencias

### Resumen

| Clasificación   | Cantidad |
|-----------------|----------|
| Azure baselined |          |
| Azure unmapped  |          |
| Learned         |          |
| Unmapped        |          |

### Dependencias que requieren atención

| Paquete | Actual | Clasificación | Estado | Motivo |
|---------|--------|---------------|--------|--------|
|         |        |               |        |        |

No seleccionar automáticamente versiones nuevas.

No utilizar `latest` como target.

Las versiones objetivo deben proceder del baseline aprobado o de investigación oficial posteriormente aprobada.

## Pruebas actuales

Framework:

-

Estado:

-

Hallazgos:

-

La ausencia de pruebas no implica automáticamente que la Function App esté bloqueada.

La testabilidad detallada se evalúa por Function.

## Arquitectura observable

Hallazgos globales relevantes para la migración:

-

Registrar únicamente condiciones que afecten potencialmente la migración.

No realizar aquí análisis detallado de slices ni proponer una modernización general.

## Recursos compartidos

Recursos confirmados o candidatos relevantes:

-

La confirmación de ownership y consumidores puede requerir análisis por Function.

No consolidar candidatos como recursos compartidos confirmados sin evidencia suficiente.

## Functions que requieren análisis

| Function | Motivo | Prioridad / dependencia |
|----------|--------|-------------------------|
|          |        |                         |

No realizar aquí el análisis detallado de cada Function.

## Riesgos

| Riesgo | Impacto | Evidencia | Acción requerida |
|--------|---------|-----------|------------------|
|        |         |           |                  |

## Incertidumbres

| Incertidumbre | Afecta | Acción necesaria |
|---------------|--------|------------------|
|               |        |                  |

Un estado `UNKNOWN` no debe convertirse automáticamente en `BLOCKED`.

Bloquear únicamente cuando la incertidumbre impida continuar de forma segura con trabajo necesario.

## Revisión requerida

-

Registrar únicamente decisiones que realmente requieran intervención humana.

## Resultado

La Function App:

`está lista para análisis / puede avanzar parcialmente / está bloqueada / requiere revisión`.

Siguiente etapa:

`analyze-function`
