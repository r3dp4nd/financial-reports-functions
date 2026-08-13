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

Usar como baseline de dependencias:

`../_shared/dependency-baseline.json`

La baseline define versiones objetivo aprobadas.

No implica upgrade automático.

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
- dependency baseline;
- shared resource candidates.

Consultar source únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión.

No cargar el repositorio completo.

## Target

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependency baseline aprobada;
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
- versión actual;
- versión target aprobada cuando exista en baseline;
- modelo;
- workflows observables;
- necesidad de migración especializada.

El impacto detallado pertenece al análisis posterior.

## Dependencias

Evaluar únicamente paquetes relevantes para:

- Node.js 24;
- Azure Functions;
- Durable;
- Azure SDK;
- build;
- tests;
- infraestructura compartida.

Comparar las dependencias relevantes contra:

`../_shared/dependency-baseline.json`

### Dependencia incluida en baseline

Registrar cuando corresponda:

- `package`;
- `currentVersion`;
- `targetVersion`;
- `baselineId`;
- `scope`;
- `strategy`;
- `impactAnalysisRequired`;
- `evidenceStatus`;
- `actionStatus`.

Ejemplo:

    {
      "package": "@azure/cosmos",
      "currentVersion": "^3.10.5",
      "targetVersion": "4.10.0",
      "baselineId": "node24-azure-functions-v4",
      "scope": "INFRASTRUCTURE",
      "impactAnalysisRequired": true,
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRED"
    }

La existencia de una versión target en baseline no significa que el cambio sea seguro sin analizar consumidores.

### Dependencia no incluida en baseline

Preservar por defecto.

No seleccionar automáticamente una versión target.

Si existe evidencia de incompatibilidad relevante:

registrar:

- currentVersion;
- targetVersion como `null` mientras no exista decisión aprobada;
- evidenceStatus;
- actionStatus.

Ejemplo:

    {
      "package": "uuid",
      "currentVersion": "^8.3.2",
      "targetVersion": null,
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION"
    }

solo cuando exista motivo real para validar compatibilidad.

No generar upgrade obligatorio únicamente por antigüedad.

## Reglas de baseline

Aplicar las reglas definidas en:

`dependency-baseline.json`

Especialmente:

- `automaticUpgrade = false`;
- `useLatest = false`;
- `preserveUnlistedDependencies = true`;
- `requireAssessmentBeforeUpgrade = true`;
- `requireImpactAnalysisWhenMarked = true`.

No ejecutar consultas de `latest` para sustituir una versión aprobada durante assessment.

## Impact analysis

Cuando una dependencia tenga:

`impactAnalysisRequired = true`

y:

`actionStatus = REQUIRED`

el análisis detallado de consumidores pertenece a:

`analyze-function`

## TypeScript

Determinar:

- versión actual;
- necesidad de cambio;
- riesgos relevantes.

No modificar configuración.

Si no existe versión aprobada en baseline:

no inventar una.

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

La compatibilidad técnica de un recurso debe considerar la dependency baseline cuando utilice un package incluido en
ella.

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

- salto major de SDK;
- dependencia compartida con muchos consumidores;
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
- dependencyAssessment;
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
      "target": {
        "dependencyBaseline": "node24-azure-functions-v4"
      },
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
      },
      "dependencyAssessment": [
        {
          "package": "@azure/functions",
          "currentVersion": "^1.2.3",
          "targetVersion": "4.16.2",
          "baselineId": "node24-azure-functions-v4",
          "scope": "PLATFORM",
          "impactAnalysisRequired": true,
          "evidenceStatus": "CONFIRMED",
          "actionStatus": "REQUIRED"
        }
      ]
    }

## Markdown

`assessment.md` debe responder:

- qué ya cumple;
- qué necesita cambio;
- qué necesita validación;
- qué dependency upgrades fueron identificados;
- qué versión target aprobada corresponde;
- cuáles requieren impact analysis;
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
- dependency baseline fue consumida;
- dimensiones técnicas fueron evaluadas independientemente;
- dependencias relevantes fueron comparadas contra baseline;
- dependencias no listadas fueron preservadas salvo evidencia;
- impact analysis requerido quedó identificado;
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
- instalar dependencias;
- consultar `latest` para sustituir la baseline;
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
