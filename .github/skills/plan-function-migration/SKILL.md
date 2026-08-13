---
name: plan-function-migration
description: Consolida los recursos compartidos confirmados y construye el plan global y los planes por Function para migrar una Azure Function App, coordinando arquitectura, dependencias, workflows y acciones previamente identificadas sin modificar código.
---

# Plan Function Migration

## Objetivo

Transformar la evidencia acumulada en una vista consolidada de recursos compartidos y en planes ejecutables neutrales
respecto del ejecutor.

Debe producir:

1. catálogo estructurado de shared resources confirmados;
2. plan global;
3. plan por Function;
4. acciones propietarias para recursos compartidos que necesiten cambio;
5. orden y dependencias;
6. criterios de verificación.

No modifica código.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

y los análisis requeridos:

`.migration/functions/<FunctionName>/analysis.json`

Si faltan análisis necesarios:

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
2. resuelve ownership cuando exista suficiente evidencia;
3. planifica cambios;
4. coordina dependencias.

No debe confundir:

`descripción del estado actual`

con:

`acción de migración`.

## Fase 1 — Consolidar shared resources

Antes de construir los planes, consolidar los candidatos provenientes de:

- inventory;
- analyses por Function.

Crear esta consolidación únicamente cuando existan shared resources confirmados o suficientemente identificados para ser
útiles.

## Artefactos de shared resources

Crear cuando aplique:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Estos artefactos describen el estado consolidado observado.

No son parte del migration plan.

## shared-resources.json

Es el owner estructurado de:

- shared resource id;
- name;
- type;
- ownership;
- paths;
- consumers;
- configuration keys;
- status;
- evidence.

No debe contener todavía pasos de ejecución.

Puede contener una evaluación como:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

si ya existe evidencia del assessment, pero no debe contener el procedimiento de migración.

## shared-resources.md

Debe ser una vista humana breve del mismo catálogo consolidado.

Debe explicar:

- qué recursos son compartidos;
- ownership;
- consumidores;
- configuración por nombre de clave;
- riesgos relevantes;
- unknowns.

No duplicar el plan.

## Consolidación

Para cada candidato:

1. reunir evidencia de consumidores;
2. confirmar o descartar reuse real;
3. determinar ownership cuando sea posible;
4. evitar fusiones por tecnología;
5. registrar unknowns cuando persistan.

Ejemplo:

`CustomerRepository` y `ReportRepository`

no se fusionan únicamente porque ambos utilicen Cosmos DB.

## Ownership

Usar:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Si ownership no puede confirmarse:

mantenerlo `UNKNOWN`.

No bloquear toda la planificación si existen acciones independientes.

## Principio de recurso compartido

Un shared resource describe:

`qué existe y quién depende de él`

Una shared resource action describe:

`qué cambio debe ejecutarse sobre él`

Son conceptos diferentes.

## Fase 2 — Shared resource actions

Después de consolidar shared resources, identificar cuáles necesitan modificación.

Cada recurso que requiera cambio debe tener una única acción propietaria.

Ejemplo:

`SR-ACTION-001`

La acción pertenece al plan global.

Debe referenciar:

`resourceId`

Las Functions consumidoras deben referenciar la acción mediante:

`dependsOn`

No duplicar la transformación dentro de planes individuales.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Usar para Markdown:

`../_shared/templates/migration-plan.template.md`

El plan global coordina:

- target;
- global changes;
- architecture;
- shared resource actions;
- Function plans;
- Durable workflows;
- dependencies;
- execution order;
- risks;
- unknowns;
- verification criteria.

No debe volver a describir en detalle los shared resources.

Debe referenciar:

`.migration/resources/shared-resources.json`

## Plan por Function

Crear:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Usar para Markdown:

`../_shared/templates/function-migration-plan.template.md`

Cada plan debe contener:

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

No copiar el análisis completo.

## Shared resources en Function plans

Una Function debe referenciar únicamente los recursos que consume.

Ejemplo:

    sharedResources:
      - SR-COSMOS-REPORTS

Si necesita que el recurso sea modificado antes:

    dependsOn:
      - SR-ACTION-001

No repetir en el plan individual cómo se migra el recurso global.

## Arquitectura

Planificar convergencia hacia:

`../_shared/architecture-policy.md`

Debe quedar claro:

- qué permanece en Azure adapter;
- qué pertenece a capability;
- qué infraestructura debe aislarse;
- qué contracts son necesarios;
- qué shared resources tienen ownership.

No planificar carpetas vacías.

## Cambios globales

Consolidar únicamente cambios transversales respaldados por assessment y analyses.

Ejemplos:

- Node.js;
- Runtime;
- dependencies;
- TypeScript;
- Jest;
- build;
- estructura base;
- `.funcignore`.

## Function ya v4

No incluir migración del Programming Model.

Puede incluir:

- architecture;
- testability;
- Node compatibility;
- dependency changes.

## Function legacy

Cuando corresponda:

incluir `REQUIRED_PLATFORM`.

## Durable

Mantener planes por Function para trazabilidad.

Coordinar la migración de cada workflow como una unidad.

## Orden

Secuencia preferida cuando aplique:

1. global changes;
2. shared resource actions necesarias;
3. preparation/refactor por Function;
4. baseline;
5. migration de adapters legacy;
6. migration Durable;
7. adaptaciones restantes;
8. build global;
9. verification.

No ejecutar etapas `NOT_APPLICABLE`.

## Build

No exigir build global después de cada Function.

El build completo pertenece al gate final.

## Unknowns

Un unknown bloquea únicamente acciones dependientes.

Permitir trabajo independiente seguro.

## Estados

Usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

para plan global y planes individuales cuando corresponda.

## Neutralidad del ejecutor

Las acciones deben describir intención técnica.

Evitar:

`El agente debe...`

Preferir:

`Extraer la lógica funcional del Azure adapter hacia la capability Reports.`

## Salidas

Cuando existan shared resources:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Siempre que la planificación pueda realizarse:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Y por Function incluida:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

## Lecciones

Crear:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory, assessment y analyses fueron consumidos;
- shared resource candidates fueron consolidados o descartados;
- ownership quedó confirmado o explícitamente desconocido;
- shared-resources.json fue creado cuando aplicaba;
- cada shared change tiene una única acción propietaria;
- existe plan global;
- cada Function incluida tiene plan;
- no existen acciones duplicadas;
- arquitectura objetivo está reflejada;
- Durable está coordinado;
- riesgos y unknowns permanecen visibles;
- planes son neutrales respecto del ejecutor;
- se generaron plans y lessons.

## Fuera de alcance

No debe:

- modificar código;
- agregar tests;
- refactorizar;
- actualizar dependencias;
- migrar;
- resolver unknowns mediante suposiciones;
- optimizar.

Siguiente skill sugerido:

`prepare-function-app`
