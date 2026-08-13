---
name: plan-function-migration
description: Construye el plan global y los planes por Function para migrar una Azure Function App, coordinando arquitectura, recursos compartidos, dependencias, workflows y acciones previamente identificadas sin modificar código.
---

# Plan Function Migration

## Objetivo

Transformar la evidencia acumulada en planes ejecutables y neutrales respecto del ejecutor.

Debe producir:

- plan global;
- plan por Function;
- coordinación de shared resources;
- orden de ejecución;
- dependencias;
- criterios de verificación.

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

Si faltan análisis:

- no inventar acciones;
- identificar impacto;
- usar `PARTIAL` o `BLOCKED`.

## Entradas

Consumir:

- inventory;
- assessment;
- analyses;
- shared resource information;
- catálogo cuando ayude a navegación.

No volver a analizar código por defecto.

## Principio

El análisis determina qué necesita una Function.

El plan determina:

- qué se ejecuta;
- en qué orden;
- qué depende de qué;
- qué se realiza una sola vez;
- cómo se verifica.

Las acciones deben poder ser ejecutadas por IA o manualmente.

## Recursos compartidos consolidados

Consolidar:

`.migration/resources/shared-resources.json`

cuando existan shared resources confirmados.

Usar:

`.migration/resources/shared-resources.md`

como vista humana.

Crear esta carpeta únicamente cuando existan recursos compartidos reales.

Cada recurso debe tener:

- id;
- type;
- ownership;
- consumers;
- paths;
- configuration keys;
- status;
- evidence.

## Shared resource action

Cada recurso que necesite cambio debe tener una única acción propietaria.

Ejemplo:

`SR-ACTION-001`

Las Functions consumidoras deben referenciarla mediante:

`dependsOn`

No duplicar la misma transformación en varios planes.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Usar para el Markdown:

`../_shared/templates/migration-plan.template.md`

El plan global coordina:

- target;
- cambios globales;
- arquitectura;
- shared resources;
- Function plans;
- Durable workflows;
- dependencies;
- order;
- risks;
- unknowns;
- verification criteria.

## Plan por Function

Crear:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Usar para el Markdown:

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

## Arquitectura

Planificar convergencia hacia:

`../_shared/architecture-policy.md`

Debe quedar claro:

- dónde termina el adapter Azure;
- dónde vive la capability;
- qué infraestructura se aísla;
- qué contracts son realmente necesarios;
- qué ownership tienen shared resources.

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
- dependency work.

## Function legacy

Cuando corresponda:

incluir `REQUIRED_PLATFORM`.

## Durable

Mantener planes por Function para trazabilidad.

Coordinar la migración del workflow como unidad.

## Orden

Secuencia preferida cuando aplique:

1. cambios globales;
2. recursos compartidos;
3. preparación/refactor por Function;
4. baseline;
5. migración de adapters;
6. migración Durable;
7. adaptaciones restantes;
8. build global;
9. verification.

No ejecutar pasos `NOT_APPLICABLE`.

## Build

No exigir build global por Function.

El build completo es gate final.

## Unknowns

Bloquear únicamente acciones realmente dependientes del unknown.

Permitir trabajo independiente seguro.

## Estados

Usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

tanto para plan global como para planes individuales cuando corresponda.

## Neutralidad del ejecutor

Evitar instrucciones como:

`El agente debe...`

Preferir:

`Extraer la lógica funcional del Azure adapter hacia la capability Reports.`

El plan describe intención técnica y resultado.

## Lecciones

Crear:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory, assessment y analyses fueron consumidos;
- shared resources fueron consolidados;
- cada shared change tiene ownership único;
- existe plan global;
- cada Function incluida tiene plan;
- no existen acciones duplicadas;
- arquitectura objetivo está reflejada;
- Durable está coordinado;
- riesgos y unknowns permanecen visibles;
- los planes son neutrales respecto del ejecutor;
- se generaron planes y lessons.

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
