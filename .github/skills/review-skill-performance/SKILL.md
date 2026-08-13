---
name: review-skill-performance
description: Revisa el desempeño real de uno o más skills a partir de lessons, artefactos, fallos y evals para proponer mejoras justificadas sin modificar automáticamente el toolkit.
---

# Review Skill Performance

## Objetivo

Analizar evidencia real de ejecución para identificar:

- problemas;
- simplificaciones;
- mejoras posibles;
- conocimiento reutilizable sobre dependencias.

Este capability está fuera del flujo operativo de migración.

No modifica automáticamente:

- skills;
- scripts;
- evals;
- policies;
- templates;
- dependency baseline.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/status-policy.md`

Consultar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/dependency-baseline.json`

## Entradas

Consumir primero:

- lessons;
- estados de ejecución;
- blockers;
- reviews;
- verification;
- artefactos relevantes;
- evals relacionados.

Leer SKILL, scripts, policies o baseline únicamente cuando sea necesario para explicar un finding.

No cargar todo el toolkit por defecto.

## Unidad de revisión

La unidad principal es un skill.

También puede revisarse:

- una ejecución;
- varias ejecuciones;
- varios casos relacionados;
- evidencia acumulada de una dependencia.

## Principio

No convertir una observación aislada en una regla global.

Flujo:

`observación → evidencia → recurrencia → propuesta → revisión humana`

## Semántica de estados

Aplicar:

`../_shared/status-policy.md`

Distinguir:

- `evidenceStatus`;
- `actionStatus`;
- `status`;
- check `status`;
- `classification`;
- `recommendationStatus`.

`recommendationStatus` pertenece exclusivamente al conocimiento de dependencias.

## Convención de IDs

Validar cuando corresponda:

- `GLOBAL-*`;
- `FN-<FUNCTION>-NNN`;
- `SR-*`;
- `SR-ACTION-*`.

Detectar referencias antiguas:

`REQ-*`

cuando el contrato actual exige `FN-*`.

## Tipos de findings

Usar:

- `FALSE_POSITIVE`
- `FALSE_NEGATIVE`
- `UNHANDLED_CASE`
- `AMBIGUOUS_RULE`
- `OVERGENERALIZATION`
- `OVERCONSTRAINT`
- `REDUNDANT_WORK`
- `EXCESS_CONTEXT`
- `MISSING_EVAL`
- `SCRIPT_GAP`
- `SKILL_GAP`
- `SIMPLIFICATION`
- `AUTOMATION_CANDIDATE`

## Recurrencia

Clasificar:

- `ISOLATED`
- `REPEATED`
- `SYSTEMIC`
- `UNKNOWN`

## Impacto

Usar:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

## Costo del cambio

Usar:

- `LOW`
- `MEDIUM`
- `HIGH`

## Revisión de arquitectura

Cuando corresponda, contrastar con:

`../_shared/architecture-policy.md`

Detectar por ejemplo:

- lógica funcional en adapters;
- capas vacías;
- shared genérico;
- ownership duplicado;
- infraestructura innecesariamente acoplada.

## Revisión de shared resources

Detectar:

- mismo recurso con varios owners;
- acciones duplicadas;
- consolidación incorrecta;
- consumidores ausentes;
- ownership contradictorio.

## Revisión de artefactos

Buscar inconsistencias entre owners.

Ejemplos:

- inventory vs plan;
- analysis vs plan;
- shared resources vs preparation;
- verification vs gates.

## Responsabilidad

Detectar responsibility leakage.

Ejemplos:

- discovery proponiendo refactors;
- assessment modificando código;
- analysis ejecutando cambios;
- planning reanalizando todo;
- preparation migrando Programming Model;
- migration rediseñando arquitectura;
- verification corrigiendo fallos.

## Scripts

Cuando un problema sea:

- repetido;
- determinista;
- detectable sin razonamiento complejo;

evaluar:

`SCRIPT_GAP`

No implementar automáticamente.

## Evals

Cuando un fallo real no esté protegido:

crear finding:

`MISSING_EVAL`

## Simplificación

Preferir:

- reglas claras;
- menos instrucciones;
- owner único;
- menos artefactos;
- menos contexto;

sobre agregar excepciones acumulativas.

# Dependency learning

## Objetivo

Revisar experiencia real de migración para determinar si una recomendación de dependencia puede reutilizarse en
repositorios futuros.

No modifica automáticamente:

`../_shared/dependency-baseline.json`

## Fuentes

Consumir únicamente cuando corresponda:

- dependency assessment;
- migration plan;
- preparation;
- verification;
- lessons;
- dependency baseline actual.

## Candidato de aprendizaje

Una dependencia puede considerarse candidata cuando:

1. existió una recomendación explícita;
2. la versión fue realmente utilizada;
3. los gates aplicables terminaron correctamente;
4. no existe evidencia de regresión asociada;
5. la experiencia puede ser reutilizable.

## Azure package

Un Azure package investigado mediante fuentes oficiales puede proponerse para:

`azurePackages`

cuando:

- no existía previamente;
- su target fue revisado;
- fue utilizado;
- verification fue satisfactoria;
- sigue siendo compatible con el target de campaña.

## Third-party package

Un package no Azure puede proponerse para:

`learnedPackages`

cuando exista evidencia de uso real.

Ejemplo:

    {
      "package": "uuid",
      "targetVersion": "x.y.z",
      "validatedAgainst": {
        "node": "24",
        "azureFunctionsRuntime": "v4"
      },
      "successfulMigrations": 1,
      "recommendationStatus": "VALIDATED"
    }

## Recommendation status

Usar:

- `PROPOSED`
- `VALIDATED`
- `REPEATED`
- `APPROVED`

### PROPOSED

Existe investigación pero aún no validación completa.

### VALIDATED

Existe al menos una migración independiente verificada.

### REPEATED

La recomendación fue validada en más de una migración independiente.

Múltiples Functions dentro de la misma Function App no cuentan como múltiples migraciones.

### APPROVED

Existe aprobación humana explícita para reutilizarla como conocimiento del toolkit.

## Promoción

Puede generar una propuesta:

    {
      "type": "DEPENDENCY_KNOWLEDGE_PROMOTION",
      "package": "uuid",
      "targetSection": "learnedPackages",
      "proposedRecommendationStatus": "APPROVED"
    }

La propuesta debe incluir:

- package;
- version;
- target environment;
- migrations reviewed;
- evidence;
- known limitations;
- risk;
- recommendation.

## Aprobación

Modificar la baseline requiere revisión humana.

Este capability:

- propone;
- no aplica.

## Invalidación del conocimiento

También puede proponer degradar o retirar una recomendación cuando:

- aparece incompatibilidad nueva;
- deja de existir soporte;
- cambia Node target;
- cambia Azure Functions target;
- nuevas migraciones contradicen la experiencia anterior.

El conocimiento aprendido no es permanente.

## Propuestas generales

Cada propuesta debe registrar:

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

## Prioridad

Usar:

- `P0`
- `P1`
- `P2`
- `P3`

## Recommendation

Usar:

- `RECOMMEND`
- `MONITOR`
- `REJECT`
- `NEEDS_MORE_EVIDENCE`

## Salidas

Crear:

`.skill-improvement/assessment.json`

`.skill-improvement/assessment.md`

`.skill-improvement/improvement-plan.json`

`.skill-improvement/improvement-plan.md`

Y sus lessons según:

`../_shared/lessons-policy.md`

## assessment.json

Debe contener:

- scope;
- executionsReviewed;
- findings;
- patterns;
- status inconsistencies;
- ID inconsistencies;
- architecture findings;
- shared resource findings;
- dependency learning candidates;
- unknowns.

## improvement-plan.json

Debe contener propuestas priorizadas.

Puede incluir:

`DEPENDENCY_KNOWLEDGE_PROMOTION`

No modifica los archivos objetivo.

## Criterio de cierre

El capability termina cuando:

- se revisó evidencia real;
- cada finding tiene soporte;
- recurrencia e impacto fueron evaluados;
- propuestas son proporcionales;
- dependency learning candidates fueron evaluados;
- no se promovió conocimiento automáticamente;
- no se modificó toolkit ni baseline.

## Fuera de alcance

No debe:

- aplicar propuestas;
- editar skills;
- editar scripts;
- editar evals;
- cambiar policies;
- cambiar templates;
- modificar dependency baseline;
- inventar problemas;
- convertir una migración exitosa aislada en verdad universal.

El siguiente paso después de una propuesta es revisión humana.
