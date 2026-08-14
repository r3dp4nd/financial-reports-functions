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

Cuando aporte claridad, representar brevemente el slice observable desde el trigger hasta sus principales dependencias y
efectos.

No proponer todavía refactorización ni arquitectura objetivo.

## Salida

<!--
Resultado observable de la Function.
-->

## Efectos observables

<!--
Registrar efectos relevantes que forman parte del comportamiento actual.

Ejemplos:
- persistencia;
- publicación de mensajes o eventos;
- escritura de archivos o blobs;
- inicio de workflows;
- llamadas externas.

No confundir efectos observados con recomendaciones de arquitectura.
-->

-

## Errores

<!--
Errores o comportamientos de fallo relevantes confirmados.
-->

## Dependencias

| Dependencia | Tipo | Uso | Estado |
|-------------|------|-----|--------|
|             |      |     |        |

## Recursos compartidos o candidatos

| Resource ID | Uso | Ownership | Estado |
|-------------|-----|-----------|--------|
|             |     |           |        |

No asignar `Resource ID` u `Ownership` como confirmados cuando la evidencia solo permita identificar un candidato.

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

Describir únicamente acoplamientos observados o inferidos con evidencia.

No proponer todavía su solución.

## Patrones observados

| Patrón | Estado | Evidencia |
|--------|--------|-----------|
|        |        |           |

No inferir patrones únicamente por nombres.

## Pruebas actuales

| Prueba | Tipo | Comportamiento cubierto |
|--------|------|-------------------------|
|        |      |                         |

Si no existen:

`No se detectaron pruebas para esta Function.`

## Riesgos

-

Registrar únicamente riesgos derivados del estado observado.

La evaluación contra el target de migración pertenece al análisis.

## Incertidumbres

-

No reemplazar incertidumbres por suposiciones.

## Referencias

### Análisis estructurado

`.migration/functions/<FunctionName>/analysis.json`

### Plan de migración

`.migration/functions/<FunctionName>/migration-plan.md`

cuando exista.

## Estado del flujo

<!--
Esta sección es únicamente navegación.
No forma parte de la fotografía técnica BEFORE.
-->

| Etapa       | Estado |
|-------------|--------|
| Analysis    |        |
| Plan        |        |
| Preparation |        |
| Migration   |        |

Esta sección puede utilizarse para navegación.

No alterar las secciones que representan el BEFORE.
