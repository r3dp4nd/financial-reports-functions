---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones técnicas, arquitectónicas y de recursos compartidos requieren cambio o validación para alcanzar el target sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el gap global entre el estado actual de la Function App y el target.

Debe responder qué dimensiones:

- ya cumplen;
- requieren cambio;
- requieren validación;
- presentan gap arquitectónico;
- presentan riesgo transversal.

No analiza todavía comportamiento detallado por Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/catalog/current-state.md`

Si existen contradicciones o información insuficiente:

- registrarlas;
- no reconstruir discovery;
- utilizar los estados definidos en `status-policy.md`.

## Entradas

Consumir primero:

- inventory;
- catálogo BEFORE;
- shared resource candidates.

Consultar source únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión.

No cargar el repositorio completo.

## Target

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- capacidad de build y tests;
- arquitectura objetivo;
- recursos compartidos con ownership y límites coherentes.

El target no implica optimización.

## Modelo de dimensión

Cada dimensión evaluada debe separar cuando corresponda:

- `current`;
- `target`;
- `evidenceStatus`;
- `actionStatus`;
- `evidence`.

Ejemplo:

    {
      "current": "20",
      "target": "24",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRED"
    }

No utilizar `status` para representar evidencia interna.

## Dimensiones técnicas

Evaluar independientemente:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- testing;
- capacidad global de validación.

No convertir estas dimensiones en una única conclusión genérica.

## Node.js

Determinar:

- versión declarada;
- target;
- necesidad de cambio;
- riesgos globales.

Ejemplo:

    {
      "current": "14",
      "target": "24",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRED"
    }

No considerar una declaración de Node.js como evidencia suficiente de compatibilidad del source.

## Azure Functions Runtime

Determinar la versión cuando exista evidencia suficiente.

No confundir Runtime con Programming Model.

Cuando no pueda observarse:

    {
      "current": null,
      "target": "v4",
      "evidenceStatus": "UNKNOWN",
      "actionStatus": "REQUIRES_VALIDATION"
    }

No leer CI/CD protegido para resolverlo.

## Programming Model

Si está confirmado v4:

    {
      "current": "v4",
      "target": "v4",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "NOT_REQUIRED"
    }

Si está confirmado legacy:

`actionStatus = REQUIRED`

cuando el target exige v4.

Si existe evidencia contradictoria:

- mantener la contradicción;
- no seleccionar silenciosamente una versión;
- usar `UNKNOWN` o revisión según corresponda.

## Durable Functions

Si no existe:

`evidenceStatus = NOT_APPLICABLE`

Si existe:

evaluar globalmente:

- paquete;
- modelo;
- workflows observables;
- necesidad de migración especializada.

El detalle pertenece al análisis posterior.

## Dependencias

Evaluar únicamente paquetes relevantes para:

- Node.js 24;
- Azure Functions;
- Durable;
- Azure SDK;
- build;
- tests;
- infraestructura compartida.

Cada dependencia relevante debe separar:

- evidencia;
- necesidad de cambio.

No actualizar por antigüedad.

## TypeScript

Determinar:

- versión actual;
- necesidad de cambio;
- riesgos relevantes.

No modificar configuración.

## Testing global

Registrar:

- framework;
- scripts;
- presencia general de tests;
- coverage observable;
- capacidad aparente de baseline.

No evaluar todavía testabilidad detallada por Function.

## Architecture assessment

Evaluar globalmente frente a:

`../_shared/architecture-policy.md`

Considerar:

- adapters;
- mezcla runtime/lógica;
- organización por capability;
- acoplamiento a SDKs;
- configuración;
- contracts;
- infraestructura;
- ownership.

La conclusión arquitectónica puede usar:

- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`

Este campo representa una clasificación arquitectónica, no un `status` transversal.

Ejemplo:

    {
      "classification": "PARTIALLY_ALIGNED",
      "evidenceStatus": "CONFIRMED"
    }

No decidir todavía archivos concretos a mover.

## Shared resources assessment

Evaluar candidatos detectados durante discovery.

Para cada recurso usar cuando corresponda:

- `evidenceStatus`;
- `actionStatus`.

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION"
    }

No fusionar recursos únicamente porque compartan tecnología.

## Riesgos globales

Registrar únicamente riesgos relevantes.

Ejemplos:

- recurso compartido con muchos consumidores;
- SDK construido repetidamente;
- configuración transversal acoplada;
- workflow Durable complejo;
- estado legacy/v4 mixto;
- ausencia de baseline;
- arquitectura altamente acoplada.

Un riesgo no es automáticamente un blocker.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

## assessment.json

Debe contener como mínimo:

- schemaVersion;
- target;
- technicalDimensions;
- architectureAssessment;
- sharedResourcesAssessment;
- testingAssessment;
- risks;
- unknowns;
- externalEvidence;
- status.

`status` principal usa:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Ejemplo conceptual

    {
      "schemaVersion": "1",
      "status": "READY_FOR_ANALYSIS",
      "technicalDimensions": {
        "node": {
          "current": "14",
          "target": "24",
          "evidenceStatus": "CONFIRMED",
          "actionStatus": "REQUIRED"
        },
        "runtime": {
          "current": null,
          "target": "v4",
          "evidenceStatus": "UNKNOWN",
          "actionStatus": "REQUIRES_VALIDATION"
        },
        "programmingModel": {
          "current": "v4",
          "target": "v4",
          "evidenceStatus": "CONFIRMED",
          "actionStatus": "NOT_REQUIRED"
        }
      }
    }

## Markdown

`assessment.md` debe responder:

- qué ya cumple;
- qué necesita cambio;
- qué necesita validación;
- estado arquitectónico;
- recursos compartidos relevantes;
- riesgos;
- unknowns.

No generar el plan.

## Catálogo

No modificar las secciones BEFORE de:

`.migration/catalog/current-state.md`

## Lecciones

Crear:

`.migration/lessons/assess-function-app/lessons.json`

`.migration/lessons/assess-function-app/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory y catálogo fueron consumidos;
- dimensiones técnicas fueron evaluadas independientemente;
- evidencia y acción están separadas;
- arquitectura global fue evaluada;
- shared resources fueron considerados;
- lo satisfecho quedó como `NOT_REQUIRED`;
- unknowns permanecen visibles;
- riesgos fueron registrados;
- no se modificó código;
- se generaron assessment y lessons.

## Fuera de alcance

No debe:

- modificar código;
- generar planes;
- analizar comportamiento detallado por Function;
- decidir estructura concreta;
- crear contracts;
- mover shared resources;
- agregar tests;
- migrar;
- optimizar.

Siguiente skill sugerido:

`analyze-function`
