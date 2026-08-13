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

El plan global debe conservar:

- baselineId;
- path;
- targets utilizados;
- provenance de recomendaciones.

## Recommendation provenance

Toda acción de dependencia debe preservar de dónde provino su target cuando corresponda.

Valores esperados:

- `BASELINE`
- `OFFICIAL_RESEARCH`
- `LEARNED_BASELINE`
- `EXTERNAL_RESEARCH`

Ejemplo:

    {
      "id": "GLOBAL-003",
      "type": "REQUIRED_DEPENDENCY",
      "package": "uuid",
      "from": "^8.3.2",
      "to": "x.y.z",
      "recommendationSource": "LEARNED_BASELINE"
    }

Planning no modifica:

`recommendationStatus`

ni promueve conocimiento.

## Dependency actions

Una dependencia puede requerir trabajo en distintos scopes.

### Global

Cuando el package pertenece a toda la Function App.

### Shared resource

Cuando el cambio pertenece a infraestructura compartida.

### Function

Cuando un consumidor necesita adaptación local.

Usar las acciones `FN-*` provenientes de analysis.

No duplicar trabajo cuando una única acción propietaria es suficiente.

## Fase 1 — Shared resources

Consolidar candidatos provenientes de:

- inventory;
- analyses.

Crear cuando aplique:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Estos artefactos describen estado consolidado observado.

No son migration plans.

## Shared resource IDs

Usar:

`SR-<TYPE>-<NAME>`

Ejemplos:

- `SR-COSMOS-REPORTS`
- `SR-SERVICEBUS-OUTBOX`
- `SR-SQL-CUSTOMERS`

## shared-resources.json

Cada recurso debe separar:

- `evidenceStatus`;
- `actionStatus`.

No utilizar:

`status: CONFIRMED`

para evidencia.

## Ownership

Scopes:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Si no puede confirmarse:

mantenerlo desconocido.

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

## Global actions

Usar:

- `GLOBAL-001`
- `GLOBAL-002`

## Function actions

Los planes individuales referencian:

`FN-*`

No renombrarlas.

## Categorías

Usar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_DEPENDENCY`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

## Orden de dependencias

Cuando corresponda:

    global dependency preparation
        ↓
    shared resource adaptation
        ↓
    Function consumer adaptation
        ↓
    baseline
        ↓
    platform migration

Representar dependencias mediante IDs.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Usar:

`../_shared/templates/migration-plan.template.md`

## Estado del plan

Usar únicamente:

- `READY`
- `PARTIAL`
- `BLOCKED`

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

## Function ya v4

Si Programming Model ya es v4:

no crear migration step de Programming Model.

## Durable

Mantener planes por Function para detalle.

Coordinar el workflow como unidad cuando aplique.

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

## Build

El build global completo pertenece a verification.

## Unknowns

Un unknown bloquea únicamente acciones dependientes.

## Revisión humana

Si una dependencia tiene:

`recommendationStatus = PROPOSED`

y requiere decisión antes de ejecución:

registrar `REQUIRES_REVIEW` sobre el elemento afectado.

No convertir la recomendación en `APPROVED`.

## Neutralidad del ejecutor

Describir resultados técnicos.

No depender del agente que ejecuta.

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
- baseline fue preservada;
- provenance de recomendaciones fue preservada;
- versiones target no fueron redefinidas;
- shared resources fueron consolidados;
- cada shared change tiene una acción propietaria;
- acciones usan IDs correctos;
- existe plan global;
- cada Function incluida tiene plan;
- Durable está coordinado;
- riesgos y unknowns permanecen visibles;
- no se modificó dependency knowledge.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- investigar nuevas versiones;
- actualizar baseline;
- promover learned packages;
- agregar tests;
- refactorizar;
- migrar;
- optimizar.

Siguiente skill sugerido:

`prepare-function-app`
