---
name: plan-function-migration
description: Consolida los recursos compartidos confirmados y construye el plan global y los planes por Function para migrar una Azure Function App, coordinando arquitectura, dependencias, workflows y acciones previamente identificadas sin modificar código.
---

# Plan Function Migration

## Objetivo

Transformar la evidencia acumulada en:

1. catálogo consolidado de shared resources;
2. plan global;
3. planes por Function;
4. acciones propietarias para shared resources;
5. orden y dependencias;
6. criterios de verificación.

No modifica código.

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

`.migration/repository/assessment.json`

y los analyses requeridos:

`.migration/functions/<FunctionName>/analysis.json`

Si faltan análisis:

- no inventar acciones;
- identificar impacto;
- usar `PARTIAL` o `BLOCKED`.

## Entradas

Consumir:

- inventory;
- assessment;
- analyses;
- catálogo BEFORE cuando ayude a navegación;
- shared resource candidates.

No volver a analizar source por defecto.

## Principio

El análisis determina qué necesita cada Function.

Este skill:

1. consolida hechos transversales;
2. resuelve ownership cuando existe evidencia;
3. genera acciones globales o compartidas;
4. construye planes ejecutables;
5. coordina dependencias.

No confundir:

`estado actual`

con:

`acción futura`.

## Dependency baseline

Consumir la baseline utilizada por:

`.migration/repository/assessment.json`

No volver a consultar `latest`.

No modificar una versión target aprobada durante planning.

El plan global debe conservar una referencia explícita a la baseline utilizada.

Ejemplo:

    {
      "dependencyBaseline": {
        "id": "node24-azure-functions-v4",
        "path": ".github/skills/_shared/dependency-baseline.json"
      }
    }

## Dependency actions

Una dependencia puede requerir trabajo en distintos scopes.

### Global

Cuando el package pertenece a toda la Function App.

Ejemplo:

    {
      "id": "GLOBAL-002",
      "type": "DEPENDENCY",
      "package": "@azure/functions",
      "from": "^1.2.3",
      "to": "4.16.2"
    }

### Shared resource

Cuando el cambio pertenece a una infraestructura compartida.

Ejemplo:

    {
      "id": "SR-ACTION-001",
      "resourceId": "SR-COSMOS-REPORTS",
      "package": "@azure/cosmos",
      "from": "^3.10.5",
      "to": "4.10.0"
    }

### Function

Cuando un consumidor necesita adaptación local.

Usar la acción `FN-*` proveniente de analysis.

No duplicar los tres niveles cuando no sean necesarios.

## Fase 1 — Shared resources

Consolidar candidatos provenientes de:

- inventory;
- analyses.

Crear cuando aplique:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Estos artefactos describen el estado consolidado observado.

No son migration plans.

## Shared resource IDs

Usar:

`SR-<TYPE>-<NAME>`

Ejemplos:

- `SR-COSMOS-REPORTS`
- `SR-SERVICEBUS-OUTBOX`
- `SR-SQL-CUSTOMERS`

Los IDs representan recursos persistentes.

No representan acciones.

## shared-resources.json

Cada recurso debe separar:

- `evidenceStatus`;
- `actionStatus`.

Ejemplo:

    {
      "id": "SR-COSMOS-REPORTS",
      "name": "ReportRepository",
      "type": "COSMOS_DB",
      "ownership": {
        "scope": "CAPABILITY",
        "owner": "Reports"
      },
      "consumers": [
        "RequestReport",
        "GenerateReport"
      ],
      "configurationKeys": [
        "COSMOS_DATABASE"
      ],
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION",
      "evidence": []
    }

No usar:

`status: CONFIRMED`

para representar evidencia.

## Ownership

Scopes:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Si no puede confirmarse ownership:

mantenerlo desconocido.

No inventar un owner para completar el artefacto.

## Consolidación

Para cada candidato:

1. reunir consumidores;
2. confirmar o descartar reuse;
3. determinar ownership;
4. evitar fusiones por tecnología;
5. evaluar necesidad de cambio;
6. registrar evidencia y unknowns.

## Fase 2 — Acciones compartidas

Un recurso que necesite cambio debe tener una única acción propietaria.

IDs:

- `SR-ACTION-001`
- `SR-ACTION-002`

Ejemplo:

    {
      "id": "SR-ACTION-001",
      "resourceId": "SR-COSMOS-REPORTS",
      "type": "STRUCTURAL",
      "action": "Adaptar la infraestructura compartida de ReportRepository.",
      "dependsOn": []
    }

La acción pertenece al plan.

El recurso pertenece al catálogo.

## Global actions

Usar:

- `GLOBAL-001`
- `GLOBAL-002`

Ejemplo:

    {
      "id": "GLOBAL-001",
      "type": "REQUIRED_NODE",
      "action": "Actualizar target Node.js a 24."
    }

## Function actions

Los planes individuales referencian las acciones:

`FN-*`

producidas por `analyze-function`.

No renombrarlas durante planning.

## Orden de dependencias

Cuando un SDK compartido requiera adaptación, representar cuando corresponda:

    global dependency preparation
        ↓
    shared resource adaptation
        ↓
    Function consumer adaptation
        ↓
    baseline
        ↓
    platform migration

Utilizar IDs reales mediante `dependsOn`.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Usar:

`../_shared/templates/migration-plan.template.md`

## Estado del plan

El campo principal:

`status`

usa únicamente:

- `READY`
- `PARTIAL`
- `BLOCKED`

Ejemplo:

    {
      "status": "READY"
    }

No utilizar:

`status: CONFIRMED`

en el plan.

## migration-plan.json global

Debe contener:

- schemaVersion;
- status;
- target;
- dependencyBaseline;
- architectureTarget;
- globalChanges;
- sharedResourceActions;
- functionPlans;
- durableWorkflows;
- dependencies;
- executionOrder;
- risks;
- unknowns;
- verificationCriteria;
- evidence.

Debe referenciar:

`.migration/resources/shared-resources.json`

cuando exista.

No copiar el catálogo completo de recursos.

## Plan por Function

Crear:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Usar:

`../_shared/templates/function-migration-plan.template.md`

## migration-plan.json por Function

Debe contener:

- schemaVersion;
- function;
- status;
- behaviorToPreserve;
- architectureTarget;
- requiredActions;
- dependsOn;
- sharedResources;
- preparationSteps;
- migrationSteps;
- tests;
- verificationCriteria;
- technicalDebtOutOfScope;
- risks;
- unknowns.

`requiredActions` debe referenciar IDs:

`FN-*`

No copiar nuevamente las acciones completas salvo que sea indispensable para ejecución humana.

## Dependencias

Usar IDs existentes.

Ejemplo:

    {
      "dependsOn": [
        "GLOBAL-001",
        "SR-ACTION-001"
      ]
    }

No generar dependencias implícitas únicamente por orden textual.

## Function ya v4

Si Programming Model ya es v4:

no crear migration step de Programming Model.

Puede existir preparación arquitectónica o de testabilidad.

## Durable

Mantener planes por Function para detalle.

Coordinar el cambio de plataforma como workflow cuando aplique.

## Orden

Secuencia preferida:

1. global actions;
2. shared resource actions;
3. Function preparation;
4. baseline;
5. non-Durable platform migration;
6. Durable workflow migration;
7. remaining adaptations;
8. global build;
9. verification.

Omitir acciones no necesarias.

## Build

El build global completo pertenece a verification.

No convertirlo en gate por Function.

## Unknowns

Un unknown bloquea únicamente acciones dependientes.

Usar `PARTIAL` cuando trabajo independiente pueda continuar.

## Revisión humana

Si una acción requiere decisión humana:

registrar explícitamente:

`REQUIRES_REVIEW`

sobre el elemento afectado o riesgo.

El plan global se mantiene:

- `PARTIAL`;
- o `BLOCKED`;

según impacto.

## Neutralidad del ejecutor

Las acciones deben describir resultados técnicos.

Evitar:

`El agente debe...`

Preferir:

`Extraer la lógica funcional del Azure adapter hacia la capability Reports.`

## Salidas

Cuando existan shared resources:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Plan global:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Por Function:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

## Lecciones

Crear:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory, assessment y analyses fueron consumidos;
- dependency baseline del assessment fue preservada;
- versiones target no fueron redefinidas;
- shared resources fueron consolidados;
- `evidenceStatus` y `actionStatus` se usan correctamente;
- cada shared change tiene una acción propietaria;
- global actions usan `GLOBAL-*`;
- shared actions usan `SR-ACTION-*`;
- Function actions conservan `FN-*`;
- existe plan global;
- cada Function incluida tiene plan;
- no existen acciones duplicadas;
- arquitectura está reflejada;
- Durable está coordinado;
- riesgos y unknowns permanecen visibles;
- planes son neutrales respecto del ejecutor;
- se generaron plans y lessons.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- consultar `latest`;
- cambiar versiones target aprobadas;
- agregar tests;
- refactorizar;
- actualizar dependencias;
- migrar;
- resolver unknowns mediante suposiciones;
- optimizar.

Siguiente skill sugerido:

`prepare-function-app`
