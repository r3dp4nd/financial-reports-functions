# <FunctionName>

> Estado actual de la Function antes de la migración.
>
> Este documento representa la fotografía BEFORE y no debe reescribirse para mostrar el resultado futuro.

## Resumen

<!--
Descripción breve de qué hace la Function desde el comportamiento observable.
-->

## Identificación

| Campo             | Valor            |
|-------------------|------------------|
| Function          | `<FunctionName>` |
| Capability        |                  |
| Trigger           |                  |
| Programming Model |                  |
| Durable Role      |                  |

## Entrada

<!--
Describir entradas observables relevantes.

No copiar payloads completos si una descripción breve es suficiente.
-->

## Comportamiento actual

1.
2.
3.

Describir comportamiento observable, no implementación línea por línea.

## Salida

<!--
Resultado observable de la Function.
-->

## Errores

<!--
Errores o comportamientos de fallo relevantes confirmados.
-->

## Dependencias

| Dependencia | Tipo | Uso | Estado |
|-------------|------|-----|--------|
|             |      |     |        |

## Recursos compartidos

| Resource ID | Uso | Ownership | Estado |
|-------------|-----|-----------|--------|
|             |     |           |        |

Referenciar:

`.migration/resources/shared-resources.json`

cuando corresponda.

## Configuración

| Clave | Uso |
|-------|-----|
|       |     |

Registrar únicamente nombres.

Nunca valores.

## Relaciones

| Relación | Destino | Estado |
|----------|---------|--------|
|          |         |        |

Ejemplos:

- inicia;
- invoca;
- publica;
- consume;
- persiste mediante;
- pertenece a workflow.

## Arquitectura actual

### Azure adapter

<!--
Responsabilidades observadas actualmente en el entrypoint.
-->

### Lógica funcional

<!--
Dónde vive y cómo está organizada.
-->

### Infraestructura

<!--
SDKs, repositories, messaging, storage, etc.
-->

### Acoplamientos relevantes

-

## Patrones observados

| Patrón | Estado | Evidencia |
|--------|--------|-----------|
|        |        |           |

## Tests actuales

| Test | Tipo | Comportamiento cubierto |
|------|------|-------------------------|
|      |      |                         |

Si no existen:

`No se detectaron tests para esta Function.`

## Testabilidad

Estado:

`HIGH | MEDIUM | LOW`

Razones:

-

## Compatibilidad Node.js 24

| Elemento | Estado | Evidencia |
|----------|--------|-----------|
|          |        |           |

Estados posibles:

- `CONFIRMED_COMPATIBLE`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`
- `NOT_APPLICABLE`

## Deuda técnica observada

-

Registrar únicamente deuda observada.

No resolverla en este documento.

## Riesgos

-

## Unknowns

-

## Referencias

### Análisis estructurado

`.migration/functions/<FunctionName>/analysis.json`

### Plan de migración

`.migration/functions/<FunctionName>/migration-plan.md`

cuando exista.

## Estado del flujo

| Etapa       | Estado |
|-------------|--------|
| Analysis    |        |
| Plan        |        |
| Preparation |        |
| Migration   |        |

Esta sección puede utilizarse para navegación.

No alterar las secciones que representan el BEFORE.
