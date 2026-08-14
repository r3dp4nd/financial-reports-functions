---
name: review-skill-performance
description: Revisa el desempeño real de uno o más skills a partir de lessons, artefactos, fallos y evals para identificar problemas y proponer evoluciones justificadas sin modificar automáticamente el toolkit.
---

# Review Skill Performance

## Objetivo

Analizar evidencia real de ejecución para identificar:

- problemas de comportamiento;
- responsibility leakage;
- reglas ambiguas o excesivas;
- trabajo redundante;
- oportunidades de simplificación;
- gaps de scripts o evals;
- posibles cambios controlados del dependency baseline.

Esta capability está fuera del flujo operativo de migración.

No modifica automáticamente:

- skills;
- scripts;
- evals;
- policies;
- templates;
- dependency baseline.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/status-policy.md`

Consultar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/dependency-baseline.json`

## Entradas

Consumir primero:

- lessons relevantes;
- estados de ejecución;
- blockers;
- review requirements;
- verification;
- artifacts de las ejecuciones revisadas;
- evals relacionados.

Leer:

- `SKILL.md`;
- scripts;
- policies;
- templates;
- baseline;

únicamente cuando sea necesario para explicar o verificar un finding.

No cargar todo el toolkit por defecto.

## Unidad de revisión

La unidad principal es un skill.

También puede revisarse:

- una ejecución;
- varias ejecuciones del mismo skill;
- varios skills relacionados por un mismo problema;
- evidencia acumulada relacionada con una dependencia;
- un contrato transversal cuando exista evidencia de drift.

## Principio

No convertir una observación aislada en una regla global.

Flujo:

```text
observación
→ evidencia
→ finding
→ recurrencia e impacto
→ propuesta
→ revisión humana
```

Una ejecución exitosa tampoco demuestra por sí sola que una decisión deba convertirse en estándar permanente.

## Semántica

Aplicar:

`../_shared/status-policy.md`

Distinguir:

- `evidenceStatus`;
- `actionStatus`;
- `executionStatus`;
- artifact `status`;
- verification check `status`;
- `classification`.

Esta capability puede utilizar clasificaciones propias de review.

No crear otro sistema de estados para representar conceptos ya cubiertos por `status-policy.md`.

## Convención de IDs

Validar cuando corresponda:

- `GLOBAL-*`;
- `FN-<FUNCTION>-NNN`;
- `SR-<TYPE>-<NAME>`;
- `SR-ACTION-*`.

Detectar referencias deprecadas como:

`REQ-*`

cuando el contrato actual exija Action IDs vigentes.

No corregirlos automáticamente.

## Tipos de findings

Usar cuando corresponda:

- `FALSE_POSITIVE`;
- `FALSE_NEGATIVE`;
- `UNHANDLED_CASE`;
- `AMBIGUOUS_RULE`;
- `OVERGENERALIZATION`;
- `OVERCONSTRAINT`;
- `REDUNDANT_WORK`;
- `EXCESS_CONTEXT`;
- `MISSING_EVAL`;
- `SCRIPT_GAP`;
- `SKILL_GAP`;
- `SIMPLIFICATION`;
- `AUTOMATION_CANDIDATE`.

No crear un tipo nuevo cuando uno existente represente suficientemente el problema.

## Recurrencia

Clasificar:

- `ISOLATED`;
- `REPEATED`;
- `SYSTEMIC`;
- `UNKNOWN`.

La recurrencia debe basarse en ejecuciones o evidencia identificable.

Varias observaciones originadas por una misma causa dentro de una sola ejecución no deben contarse artificialmente como
casos independientes.

## Impacto

Usar:

- `LOW`;
- `MEDIUM`;
- `HIGH`;
- `CRITICAL`.

Evaluar impacto sobre aspectos como:

- seguridad;
- comportamiento;
- corrección de la migración;
- trazabilidad;
- costo de ejecución;
- consumo de contexto;
- mantenibilidad del toolkit.

## Costo del cambio

Usar:

- `LOW`;
- `MEDIUM`;
- `HIGH`.

Considerar:

- archivos afectados;
- contratos modificados;
- evals requeridos;
- compatibilidad con artifacts existentes;
- complejidad añadida.

Una mejora de bajo valor y alto costo puede recomendarse como `MONITOR`.

## Responsabilidad de los skills

Detectar responsibility leakage.

Ejemplos:

```text
discover-function-app
→ assessment o planning

assess-function-app
→ análisis profundo por Function

analyze-function
→ creación de FN-*

plan-function-migration
→ modificación de código

prepare-function-app
→ adaptación funcional específica

prepare-function
→ generación completa de behavioral tests

generate-function-tests
→ modificación de producción

migrate-programming-model-v4
→ refactorización adicional

migrate-durable-functions-v4
→ rediseño del workflow

verify-function-app
→ corrección automática de fallos
```

No proponer un skill nuevo únicamente para resolver una pequeña fuga de responsabilidad si el skill existente puede
corregirse.

## Revisión estructural

Consultar:

`../_shared/architecture-policy.md`

únicamente cuando el finding involucre decisiones estructurales.

Detectar por ejemplo:

- estructura obligatoria no requerida por la policy;
- creación de capas vacías;
- boundaries sin responsabilidad real;
- `shared` utilizado como contenedor genérico;
- ownership duplicado;
- infraestructura aislada sin necesidad;
- modernización ejecutada como si fuera requisito de migración;
- cambios `requiredForMigration = false` tratados como obligatorios.

No evaluar el código contra una arquitectura ideal.

## Revisión de shared resources

Detectar cuando corresponda:

- mismo recurso con varios owners;
- varias acciones propietarias para el mismo recurso;
- consolidación basada únicamente en tecnología;
- consumidores omitidos;
- ownership contradictorio;
- adaptación local que duplica una `SR-ACTION-*`.

No modificar:

`.migration/resources/shared-resources.json`

desde esta capability.

## Revisión de artifacts

Buscar inconsistencias entre owners.

Ejemplos:

```text
inventory
↔ assessment

assessment
↔ analysis

analysis.migrationNeeds
↔ plan actions

plan actions
↔ execution actionResults

testing requirements
↔ testing.json

plan
↔ migration

migration
↔ verification
```

Verificar que una capability no haya sobrescrito información cuyo owner pertenece a otra etapa.

## Revisión de status

Detectar usos incorrectos como:

```text
status: CONFIRMED
```

cuando corresponde:

```text
evidenceStatus: CONFIRMED
```

o:

```text
PASS
```

utilizado como `executionStatus`.

También detectar agregaciones incorrectas, por ejemplo:

```text
mandatory NOT_EXECUTED
→ VERIFIED
```

## Scripts

Cuando un problema sea:

- repetido;
- determinista;
- estable;
- detectable sin razonamiento complejo;

evaluar:

`SCRIPT_GAP`

o:

`AUTOMATION_CANDIDATE`

según corresponda.

Antes de proponer un script nuevo, comprobar si uno existente puede evolucionar.

No implementar automáticamente.

Los scripts propuestos deben respetar las restricciones de runtime del toolkit.

## Evals

Cuando un comportamiento incorrecto o límite importante no esté protegido:

crear finding:

`MISSING_EVAL`

Una propuesta que cambie comportamiento contractual debe indicar qué eval existente necesita actualizarse o qué caso
nuevo debe cubrirse.

No agregar evals únicamente para aumentar su cantidad.

Priorizar:

- activación;
- límites;
- seguridad;
- inputs;
- outputs;
- estados;
- ownership;
- failure modes;
- casos reales observados.

## Simplificación

Preferir:

- reglas claras;
- owner único;
- menos duplicación;
- menos artifacts;
- menos contexto;
- evolución de contratos existentes;

sobre:

- nuevas capas de reglas;
- excepciones acumulativas;
- nuevos skills por simetría;
- documentos monolíticos.

Antes de proponer un artifact nuevo:

verificar si uno existente puede evolucionar de forma segura.

# Dependency baseline review

## Objetivo

Evaluar si evidencia real de migración justifica proponer un cambio controlado en:

`../_shared/dependency-baseline.json`

Esta capability:

```text
propone
≠
aprueba
≠
aplica
```

## Baseline actual

El baseline contiene cuando corresponda:

- target técnico;
- `baselineId`;
- `baselineRevision`;
- `managedPackages`;
- reglas de gobierno.

No utilizar:

- `learnedPackages`;
- `recommendationStatus`;
- lifecycle `PROPOSED / VALIDATED / REPEATED / APPROVED`.

Las propuestas permanecen fuera del baseline hasta ser revisadas y aplicadas mediante un cambio controlado.

## Fuentes

Consumir únicamente cuando corresponda:

- assessment;
- migration plan;
- preparation;
- testing;
- migration;
- verification;
- lessons;
- baseline vigente;
- evidencia oficial previamente utilizada.

No volver a investigar una dependencia sin necesidad.

## Candidato a cambio de baseline

Puede evaluarse una propuesta cuando exista evidencia como:

- package actualmente no gestionado;
- `candidateTarget` investigado;
- target utilizado durante una migración aprobada;
- verification satisfactoria;
- incompatibilidad detectada en un target actual;
- nueva evidencia oficial que contradiga el baseline;
- necesidad recurrente de evitar investigación repetida.

Una migración exitosa aislada no convierte automáticamente un package o versión en target reutilizable.

## Package no gestionado

Cuando exista evidencia suficiente, puede proponerse incorporar un package a:

`managedPackages`

La propuesta debe indicar:

- package;
- proposed target;
- category;
- target environment;
- evidence;
- migrations reviewed cuando existan;
- known limitations;
- impact;
- risk;
- rationale.

No asumir que todo third-party package utilizado debe gestionarse en baseline.

Gestionarlo únicamente cuando exista valor real para la campaña.

## Managed package existente

También puede proponerse:

- cambiar target;
- cambiar metadata;
- retirar un package gestionado;
- marcar necesidad de investigación adicional.

Ejemplos de evidencia:

- incompatibilidad verificada;
- cambio de target Node.js;
- cambio de Azure Functions target;
- nueva documentación oficial;
- repeated migration failure;
- package sin soporte relevante.

No modificar el baseline desde review.

## Baseline revision

Una propuesta aprobada que finalmente modifique el baseline debe producir posteriormente:

```text
baselineRevision + 1
```

Ese incremento ocurre durante la aplicación controlada del cambio.

`review-skill-performance` no modifica `baselineRevision`.

## Propuesta de baseline

Puede utilizar un tipo como:

`BASELINE_CHANGE`

Ejemplo conceptual:

```json
{
  "type": "BASELINE_CHANGE",
  "package": "@azure/example",
  "proposedTarget": "x.y.z",
  "evidence": [],
  "risk": "MEDIUM",
  "recommendation": "NEEDS_MORE_EVIDENCE"
}
```

No utilizar `targetVersion` dentro del baseline hasta que el cambio sea aprobado y aplicado.

# Propuestas generales

Cada propuesta debe registrar cuando corresponda:

- skill;
- problem;
- evidence;
- findingType;
- recurrence;
- impact;
- proposedChange;
- affectedFiles;
- requiredEval;
- changeCost;
- risk;
- priority;
- recommendation.

No todos los campos son obligatorios cuando no apliquen.

Las propuestas deben ser proporcionales al finding.

## Prioridad

Usar:

- `P0`;
- `P1`;
- `P2`;
- `P3`.

La prioridad debe considerar conjuntamente:

- impacto;
- recurrencia;
- riesgo;
- costo de no corregir.

No utilizar prioridad alta únicamente porque el cambio sea fácil.

## Recommendation

Usar:

- `RECOMMEND`;
- `MONITOR`;
- `REJECT`;
- `NEEDS_MORE_EVIDENCE`.

Este campo representa la disposición propuesta por esta review.

No es un estado de `status-policy.md`.

### RECOMMEND

Existe evidencia suficiente para recomendar revisión humana y posible implementación.

### MONITOR

El problema existe, pero todavía no justifica un cambio.

### REJECT

La propuesta evaluada no aporta valor suficiente o introduce peor tradeoff.

### NEEDS_MORE_EVIDENCE

La evidencia disponible no permite recomendar el cambio todavía.

## Flujo de cambio

Una propuesta aceptada debe seguir un proceso controlado:

```text
evidence
→ finding
→ proposal
→ human review
→ approved change
→ update affected contract
→ update/add evals when behavior changed
→ validate
```

La aprobación humana de una propuesta no significa que el cambio ya esté implementado.

No registrar una regla como incorporada hasta que el artifact correspondiente haya sido actualizado y validado.

## Salidas

Crear:

```text
.skill-improvement/assessment.json
.skill-improvement/assessment.md
.skill-improvement/improvement-plan.json
.skill-improvement/improvement-plan.md
```

Estos artifacts están fuera de:

`.migration/`

porque describen evolución del toolkit y no el estado de una migración.

No modificar artifacts históricos de la migración para reflejar findings del toolkit.

## assessment.json

Debe contener cuando corresponda:

- scope;
- executionsReviewed;
- findings;
- patterns;
- statusInconsistencies;
- idInconsistencies;
- responsibilityFindings;
- structuralFindings;
- sharedResourceFindings;
- baselineChangeCandidates;
- unknowns;
- evidence.

No debe contener cambios aplicados.

## improvement-plan.json

Debe contener propuestas priorizadas.

Puede incluir:

- evolución de skill;
- corrección de script;
- nuevo eval;
- simplificación;
- modificación de policy;
- modificación de template;
- `BASELINE_CHANGE`.

No modifica los archivos objetivo.

## Markdown

`assessment.md` resume:

- findings principales;
- evidencia;
- patrones observados;
- incertidumbres.

`improvement-plan.md` resume:

- propuestas;
- prioridad;
- costo;
- riesgo;
- recomendación.

Los JSON siguen siendo los owners estructurados.

No duplicar evidencia completa en Markdown.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

No crear una segunda lesson únicamente para repetir un finding ya registrado en:

`.skill-improvement/assessment.json`

Registrar lessons adicionales solo cuando exista una observación reutilizable que no esté ya representada adecuadamente.

## Criterio de cierre

La capability termina cuando:

- se revisó la evidencia definida por el scope;
- cada finding tiene soporte localizable;
- facts e inferencias están diferenciados;
- recurrencia fue evaluada sin inflar casos;
- impacto fue evaluado;
- costo de cambio fue considerado;
- responsibility leakage fue revisado cuando correspondía;
- gaps de evals o scripts quedaron identificados cuando existían;
- propuestas son proporcionales al problema;
- candidatos de cambio de baseline fueron evaluados cuando correspondía;
- ninguna observación aislada fue convertida automáticamente en regla global;
- no se modificó el toolkit;
- no se modificó dependency baseline.

La ausencia de propuestas es un resultado válido cuando la evidencia no justifica cambios.

## Fuera de alcance

No debe:

- aplicar propuestas;
- editar skills;
- editar scripts;
- editar evals;
- cambiar policies;
- cambiar templates;
- modificar dependency baseline;
- incrementar `baselineRevision`;
- aprobar candidate targets;
- inventar findings;
- generalizar sin evidencia;
- convertir una migración exitosa aislada en verdad universal;
- modificar artifacts de migración para que coincidan con la review.

El siguiente paso después de una propuesta es:

`revisión humana`
