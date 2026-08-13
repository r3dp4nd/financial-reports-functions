---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones necesitan migración o validación para alcanzar Node.js 24, Azure Functions Runtime v4 y Programming Model v4, sin modificar código.
---

# Assess Function App

## Objetivo

Evaluar el estado técnico de una Azure Function App y determinar qué cambios son realmente necesarios antes de
planificar o modificar código.

Este skill no debe asumir que todas las dimensiones necesitan migración.

## Precondición

Debe existir:

`.migration/repository/inventory.json`

generado y revisado por `discover-function-app`.

Si el inventario es insuficiente o contradictorio, registrar el problema y recomendar volver a ejecutar discovery
únicamente cuando sea necesario.

## Entradas

Usar primero:

`.migration/repository/inventory.json`

Consultar el repositorio solo de forma selectiva cuando el inventario no contenga evidencia suficiente.

Usar documentación oficial vigente para evaluar:

- Node.js.
- Azure Functions Runtime.
- Programming Model.
- Durable Functions.
- dependencias relevantes.
- compatibilidad de plataforma.

## Principio de evaluación

Evaluar independientemente:

- Node.js.
- Azure Functions Runtime.
- Programming Model.
- Durable Functions.
- dependencias.
- TypeScript.
- testabilidad observable.
- configuración necesaria para validación.
- compatibilidad potencial con Node.js 24.

No inferir que una dimensión necesita migración porque otra esté desactualizada.

## Estado objetivo

Evaluar la aplicación frente a:

- Node.js 24.
- Azure Functions Runtime v4.
- Programming Model v4.
- dependencias compatibles.
- capacidad de ejecutar las validaciones y tests requeridos.

El estado objetivo no implica optimización ni rediseño arquitectónico.

## Clasificación

Para cada dimensión registrar un estado de evidencia:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Y una acción requerida:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

`NOT_REQUIRED` significa que esa dimensión ya cumple el objetivo y no debe modificarse innecesariamente.

## Evaluación de Node.js

Determinar:

- versión actual.
- evidencia utilizada.
- necesidad de actualización.
- compatibilidad conocida con el target.
- riesgos que requieran análisis posterior.

No asumir que actualizar `engines.node` garantiza compatibilidad del código.

La compatibilidad de APIs, sintaxis y comportamiento del código con Node.js 24 se profundizará posteriormente durante
`analyze-function`.

## Azure Functions Runtime

Determinar:

- versión actual cuando exista evidencia.
- compatibilidad con el target.
- necesidad de migración.

No confundir Azure Functions Runtime con Programming Model.

Si la versión no puede confirmarse con evidencia suficiente:

- `status = UNKNOWN`
- `action = REQUIRES_VALIDATION`

## Programming Model

Determinar:

- modelo actual.
- evidencia utilizada.
- si Programming Model v4 ya está cumplido.

Si ya está en v4:

- `action = NOT_REQUIRED`

No recomendar ni ejecutar nuevamente una migración del Programming Model.

Si existe evidencia legacy y v4 simultáneamente:

- `status = UNKNOWN`
- `action = REQUIRES_VALIDATION`

hasta resolver el estado real.

## Durable Functions

Si Durable Functions no está presente:

- `status = NOT_APPLICABLE`
- `action = NOT_REQUIRED`

Si está presente, evaluar:

- versión del paquete.
- Programming Model utilizado.
- compatibilidad documentada.
- necesidad de migración específica.

No analizar todavía el workflow Function por Function.

## Dependencias

Evaluar únicamente dependencias relevantes para:

- Node.js 24.
- Azure Functions.
- Durable Functions.
- Azure SDK.
- compilación.
- runtime.

Clasificar cada dependencia según corresponda como:

- compatible confirmada.
- requiere actualización.
- requiere validación.
- no relevante para esta etapa.

No actualizar dependencias.

No recomendar una versión concreta sin evidencia oficial vigente.

## TypeScript

Determinar cuando corresponda:

- versión actual.
- compatibilidad con el target.
- necesidad de actualización.
- posibles restricciones conocidas.

No modificar todavía configuración ni código TypeScript.

## Testabilidad

Registrar únicamente señales globales observables, por ejemplo:

- existencia de framework de tests.
- existencia de tests.
- acceso directo a `process.env`.
- construcción directa de clientes SDK.
- entrypoints con lógica de negocio mezclada.
- dependencias difíciles de sustituir.

No realizar todavía refactor.

El análisis detallado de testabilidad se realizará Function por Function.

## Configuración para validación

Usar el inventario generado por `discover-function-app`.

Determinar si futuras validaciones requerirán configuración local.

No leer valores sensibles.

Si faltan configuraciones necesarias, registrar qué claves serán requeridas mediante una configuración sanitizada o
expresamente aprobada por el desarrollador.

## Evidencia

Las decisiones sobre soporte y compatibilidad deben utilizar preferentemente:

1. Microsoft Learn o documentación oficial de Azure.
2. documentación oficial de Node.js.
3. documentación oficial del SDK o paquete.
4. npm oficial cuando sea necesario.

Guardar únicamente referencias mínimas necesarias.

No copiar documentación completa.

No reutilizar como hecho una recomendación antigua sin volver a verificarla cuando pueda haber cambiado.

## Salidas

Crear:

- `.migration/repository/assessment.json`
- `.migration/repository/assessment.md`
- `.migration/lessons/assess-function-app/lessons.json`
- `.migration/lessons/assess-function-app/lessons.md`

Crear únicamente las carpetas necesarias.

## assessment.json

Debe contener información estructurada reutilizable por otros skills.

Como mínimo:

- metadata de ejecución.
- estado objetivo.
- evaluación por dimensión.
- acciones requeridas.
- riesgos globales.
- unknowns.
- evidencia oficial.

Ejemplo conceptual:

    {
      "target": {
        "node": "24",
        "runtime": "v4",
        "programmingModel": "v4"
      },
      "dimensions": {
        "node": {
          "current": "20",
          "status": "CONFIRMED",
          "action": "REQUIRED"
        },
        "runtime": {
          "current": "v4",
          "status": "CONFIRMED",
          "action": "NOT_REQUIRED"
        },
        "programmingModel": {
          "current": "v4",
          "status": "CONFIRMED",
          "action": "NOT_REQUIRED"
        }
      }
    }

El ejemplo no define un schema exhaustivo.

No agregar campos sin necesidad demostrada.

## assessment.md

Debe explicar de forma breve:

- estado actual.
- qué ya cumple el objetivo.
- qué debe cambiar.
- qué necesita validación.
- principales riesgos globales.
- unknowns.
- evidencia oficial relevante.

No debe ser una copia textual del JSON.

No debe generar todavía el plan detallado de migración.

## Lecciones aprendidas

Registrar únicamente observaciones que puedan mejorar futuras ejecuciones:

- reglas de assessment insuficientes.
- estados no contemplados.
- incompatibilidades inesperadas.
- documentación oficial ambigua.
- falsos supuestos.
- contexto innecesario.
- oportunidades de simplificación.
- propuestas de mejora del skill.

Si no existe una lección relevante, generar el artefacto con una colección vacía.

No modificar automáticamente este skill.

Toda mejora requiere revisión humana antes de incorporarse.

## Criterio de cierre

El skill termina cuando:

- `inventory.json` fue consumido.
- cada dimensión objetivo fue evaluada independientemente.
- las dimensiones ya cumplidas están marcadas `NOT_REQUIRED`.
- las dimensiones pendientes están marcadas `REQUIRED`.
- las incertidumbres están marcadas `REQUIRES_VALIDATION`.
- las afirmaciones de soporte o compatibilidad tienen evidencia oficial cuando corresponde.
- los riesgos globales fueron registrados.
- no se modificó código.
- se generaron los artefactos de assessment.
- se generaron los artefactos de lecciones aprendidas.

## Fuera de alcance

Este skill no debe:

- modificar código.
- actualizar dependencias.
- agregar tests.
- refactorizar.
- migrar Node.js.
- migrar Azure Functions Runtime.
- migrar Programming Model.
- migrar Durable Functions.
- decidir arquitectura final.
- optimizar código.
- generar el plan detallado Function por Function.

El siguiente skill sugerido, después de revisión humana del assessment, es:

`analyze-function`
