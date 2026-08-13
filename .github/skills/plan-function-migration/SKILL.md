---
name: plan-function-migration
description: Construye el plan global y los planes por Function para migrar una Azure Function App, coordinando cambios globales, arquitectura objetivo, recursos compartidos, dependencias, workflows y acciones previamente identificadas sin modificar código.
---

# Plan Function Migration

## Objetivo

Transformar la evidencia acumulada en un plan ejecutable y neutral respecto del ejecutor.

Debe generar:

- un plan global del repositorio o Function App;
- un plan específico por Function;
- acciones coordinadas para recursos compartidos;
- orden de ejecución;
- dependencias;
- criterios de verificación.

Este skill no modifica código.

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

Si faltan análisis críticos:

- registrar el gap;
- no inventar acciones;
- usar `PARTIAL` o `BLOCKED`.

## Entradas

Consumir:

- inventory;
- assessment;
- analyses;
- catálogo actual cuando sea útil.

No volver a analizar código por defecto.

## Principio

El análisis dice qué necesita cada Function.

La planificación decide:

- qué se hará;
- en qué orden;
- qué depende de qué;
- qué se hace una sola vez;
- cómo se verificará.

Los planes deben poder ser ejecutados tanto por IA como manualmente.

## Plan global

Crear:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

El plan global debe coordinar:

- target;
- cambios globales;
- arquitectura objetivo;
- recursos compartidos;
- Function plans;
- workflows Durable;
- dependencias;
- orden;
- riesgos;
- unknowns;
- criterios finales de verificación.

## Plan por Function

Crear para cada Function analizada:

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

El plan por Function debe incluir:

- comportamiento a preservar;
- arquitectura objetivo aplicable;
- requiredActions seleccionadas;
- recursos compartidos utilizados;
- dependencias globales;
- dependencias hacia shared resource actions;
- preparación;
- migración;
- tests;
- criterios de verificación;
- deuda fuera de alcance;
- risks;
- unknowns.

No duplicar todo `analysis.json`.

## Recursos compartidos

Consolidar candidatos provenientes del inventory y analyses.

Confirmar para cada recurso:

- id;
- type;
- ownership;
- consumers;
- paths;
- configuration keys;
- required changes;
- evidence.

## Acción propietaria

Cada recurso compartido que necesite modificación debe tener una única acción propietaria.

Ejemplo:

`SR-ACTION-001`

Las Functions consumidoras deben depender de esa acción.

No crear una acción equivalente dentro de cada Function plan.

## Ejemplo conceptual

Recurso:

`SR-COSMOS-REPORTS`

Consumidores:

- RequestReport
- GenerateReport

Acción global:

`SR-ACTION-001 — adaptar ReportRepository/Cosmos implementation`

Los planes individuales declaran:

`dependsOn: SR-ACTION-001`

## Recursos sin cambio

Si un recurso compartido ya es compatible y arquitectónicamente correcto:

`NOT_REQUIRED`

No planificar trabajo por uniformidad.

## Arquitectura

El plan debe incluir la convergencia hacia la arquitectura definida en `architecture-policy.md`.

Debe indicar:

- qué adapters quedan bajo `src/functions`;
- qué capability recibe la lógica;
- qué infraestructura debe aislarse;
- qué contratos son necesarios;
- qué recursos compartidos requieren ownership.

No crear capas vacías como parte del plan.

## Cambios globales

Consolidar únicamente cambios transversales respaldados por evidencia.

Ejemplos:

- Node.js;
- Runtime;
- dependencies;
- TypeScript;
- Jest;
- build;
- `src/functions`;
- `.funcignore`;
- configuración global.

## Function ya v4

Si una Function ya usa Programming Model v4:

no incluir migración de modelo.

Puede incluir:

- arquitectura;
- tests;
- Node compatibility;
- dependency changes.

## Function legacy

Si requiere Programming Model v4:

incluir acción `REQUIRED_PLATFORM`.

## Durable

Agrupar starter, orchestrator y Activities como workflow cuando corresponda.

Generar planes por Function si ayudan a ejecución y trazabilidad, pero coordinar la migración Durable como una unidad.

## Orden

Secuencia preferida cuando aplique:

1. preparar base global;
2. preparar recursos compartidos necesarios;
3. preparar/refactorizar Functions;
4. obtener baseline de tests;
5. migrar adapters legacy no Durable;
6. migrar workflows Durable;
7. completar adaptaciones;
8. build global;
9. verify.

No ejecutar etapas `NOT_APPLICABLE`.

## Tests

Los planes por Function deben especificar qué comportamiento debe quedar protegido antes de migrar.

No duplicar implementación detallada del test.

## Build

No exigir build global por Function.

El build completo se reserva para el gate final.

## Unknowns

Un unknown bloquea únicamente las acciones dependientes.

No bloquear trabajo independiente seguro.

## Estados

Plan global:

- `READY`
- `PARTIAL`
- `BLOCKED`

Planes individuales pueden usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

## migration-plan.json global

Debe contener como mínimo:

- metadata;
- target;
- status;
- architectureTarget;
- globalChanges;
- sharedResources;
- sharedResourceActions;
- functionPlans;
- durableWorkflows;
- dependencies;
- executionOrder;
- risks;
- unknowns;
- verificationCriteria;
- evidence.

## migration-plan.json por Function

Debe contener como mínimo:

- metadata;
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

## Markdown global

`migration-plan.md` debe explicar:

- punto de partida;
- target;
- estrategia;
- arquitectura;
- cambios globales;
- shared resources;
- Function plans;
- workflows;
- orden;
- riesgos;
- unknowns;
- criterios de cierre.

## Markdown por Function

Debe explicar:

- qué se preserva;
- qué cambia;
- arquitectura objetivo;
- dependencias;
- recursos compartidos;
- orden;
- tests;
- criterios de verificación.

Debe ser ejecutable tanto manualmente como mediante IA.

## Lecciones

Crear:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory, assessment y analyses fueron consumidos;
- se identificaron recursos compartidos;
- cada recurso que requiere cambio tiene ownership;
- existe un plan global;
- cada Function incluida tiene plan;
- acciones duplicadas fueron evitadas;
- arquitectura objetivo está reflejada;
- Durable está coordinado;
- riesgos y unknowns permanecen visibles;
- los planes son neutrales respecto del ejecutor;
- se generaron planes y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- agregar tests;
- ejecutar refactors;
- actualizar dependencias;
- migrar;
- resolver unknowns mediante suposiciones;
- ejecutar optimizaciones.

El siguiente skill sugerido es:

`prepare-function-app`
