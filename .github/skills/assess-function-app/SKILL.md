---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones necesitan migración o validación para alcanzar Node.js 24, Azure Functions Runtime v4 y Programming Model v4 sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el estado técnico de la Function App frente al target de migración.

El assessment debe responder qué dimensiones:

- ya cumplen;
- requieren cambio;
- requieren validación.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondición

Debe existir:

`.migration/repository/inventory.json`

Si el inventario es insuficiente o contradictorio, registrar el problema.

No reconstruir discovery desde cero.

## Entradas

Consumir primero:

`.migration/repository/inventory.json`

Consultar el repositorio únicamente cuando falte evidencia concreta.

## Estado objetivo

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- capacidad de ejecutar tests y validaciones requeridas.

El target no implica optimización ni rediseño.

## Dimensiones

Evaluar independientemente:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- tooling de tests;
- capacidad global de validación.

No inferir que una dimensión necesita migración porque otra esté desactualizada.

## Acción

Para cada dimensión usar:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

### REQUIRED

Se necesita cambio para alcanzar el target.

### NOT_REQUIRED

La dimensión ya cumple y debe preservarse.

### REQUIRES_VALIDATION

No existe evidencia suficiente para decidir.

## Node.js

Determinar:

- versión declarada actual;
- target;
- necesidad de actualización;
- riesgos globales conocidos.

No considerar que cambiar `engines.node` demuestra compatibilidad del código.

La compatibilidad detallada del source se analiza posteriormente Function por Function.

## Azure Functions Runtime

Determinar la versión actual cuando exista evidencia suficiente.

No confundir Runtime con Programming Model.

Cuando dependa de infraestructura externa no disponible:

`REQUIRES_VALIDATION`

## Programming Model

Si está confirmado v4:

`NOT_REQUIRED`

No recomendar una nueva migración.

Si está confirmado legacy:

evaluar necesidad de migración.

Si existen evidencias legacy y v4:

`REQUIRES_VALIDATION`

## Durable Functions

Si no está presente:

`NOT_APPLICABLE`

Si está presente, evaluar:

- versión del paquete;
- relación con Programming Model;
- necesidad de migración especializada.

No analizar todavía el workflow en profundidad.

## Dependencias

Evaluar solamente dependencias relevantes para:

- Node.js 24;
- Azure Functions;
- Durable Functions;
- Azure SDK;
- compilación;
- runtime.

No recomendar actualización únicamente porque una dependencia sea antigua.

No elegir una versión target sin evidencia oficial.

## TypeScript

Determinar:

- versión actual;
- compatibilidad relevante;
- necesidad de actualización.

No modificar configuración.

## Testabilidad global

Registrar señales globales únicamente cuando sean útiles, por ejemplo:

- Jest ya configurado;
- ausencia total de tests;
- uso extendido de `process.env`;
- construcción directa de SDKs;
- estructura legacy.

La testabilidad detallada pertenece a `analyze-function`.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

Y:

`.migration/lessons/assess-function-app/lessons.json`

`.migration/lessons/assess-function-app/lessons.md`

## assessment.json

Debe contener como mínimo:

- metadata;
- target;
- dimensiones;
- estado actual;
- acciones requeridas;
- riesgos globales;
- unknowns;
- evidencia oficial.

Ejemplo conceptual:

    {
      "dimensions": {
        "node": {
          "current": "20",
          "action": "REQUIRED"
        },
        "runtime": {
          "current": "v4",
          "action": "NOT_REQUIRED"
        },
        "programmingModel": {
          "current": "v4",
          "action": "NOT_REQUIRED"
        }
      }
    }

## assessment.md

Debe explicar:

- qué ya cumple;
- qué debe cambiar;
- qué necesita validación;
- riesgos globales;
- unknowns;
- evidencia relevante.

No debe producir el plan de implementación.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- `inventory.json` fue consumido;
- cada dimensión fue evaluada independientemente;
- lo ya cumplido quedó como `NOT_REQUIRED`;
- lo pendiente quedó como `REQUIRED`;
- las incertidumbres quedaron visibles;
- las afirmaciones de soporte tienen evidencia suficiente;
- no se modificó código;
- se generaron assessment y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- agregar tests;
- refactorizar;
- actualizar dependencias;
- migrar Node.js;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar;
- generar planes por Function.

El siguiente skill sugerido es:

`analyze-function`
