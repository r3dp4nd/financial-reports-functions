---
name: review-skill-performance
description: Revisa el desempeño real de uno o más skills a partir de lessons, artefactos, fallos y evals para proponer mejoras justificadas sin modificar automáticamente el toolkit.
---

# Review Skill Performance

## Objetivo

Analizar evidencia real de ejecución para identificar problemas, simplificaciones y mejoras posibles en los skills.

Este capability está fuera del flujo operativo de migración.

No modifica automáticamente:

- skills;
- scripts;
- evals;
- policies;
- templates.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/status-policy.md`

Consultar cuando el hallazgo corresponda:

- `../_shared/architecture-policy.md`

## Entradas

Consumir primero:

- lessons;
- estados de ejecución;
- blockers;
- reviews;
- artefactos producidos;
- evals relacionados.

Leer el `SKILL.md`, scripts o policies únicamente cuando sea necesario para explicar un hallazgo.

No cargar todo el toolkit por defecto.

## Unidad de revisión

La unidad principal es un skill.

Puede analizarse:

- una ejecución;
- varias ejecuciones;
- varios casos relacionados;

cuando exista evidencia suficiente.

## Principio

No convertir una observación aislada en una regla global.

Flujo:

`observación → evidencia → recurrencia → propuesta → revisión humana`

## Semántica de estados

Aplicar:

`../_shared/status-policy.md`

Al revisar artefactos, distinguir correctamente:

- `evidenceStatus`;
- `actionStatus`;
- `status`;
- check `status`;
- `classification`.

Un uso incorrecto de estos campos puede generar un finding.

Ejemplos:

- usar `status: CONFIRMED` para evidencia;
- usar `PASS` como evidencia;
- usar `NOT_APPLICABLE` donde corresponde `NOT_REQUIRED`;
- usar `REQUIRES_REVIEW` como sinónimo de `UNKNOWN`.

## Convención de IDs

Validar cuando corresponda:

- `GLOBAL-*` para acciones globales;
- `FN-<FUNCTION>-NNN` para acciones por Function;
- `SR-*` para recursos compartidos;
- `SR-ACTION-*` para acciones sobre recursos compartidos.

Detectar referencias antiguas como:

`REQ-*`

cuando el contrato actual exige `FN-*`.

No cambiar IDs históricos de artefactos ya cerrados solo por estética.

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

## FALSE_POSITIVE

El skill identificó un problema o acción que no correspondía.

## FALSE_NEGATIVE

El skill no identificó un problema real que debía detectar.

## UNHANDLED_CASE

Existe un escenario real no cubierto por el contrato actual.

## AMBIGUOUS_RULE

Una instrucción admite interpretaciones inconsistentes.

## OVERGENERALIZATION

Una observación local se convirtió en una regla demasiado amplia.

## OVERCONSTRAINT

Una regla restringe casos válidos sin necesidad.

## REDUNDANT_WORK

El skill repite trabajo ya resuelto por otro artefacto o capability.

## EXCESS_CONTEXT

El skill carga más contexto del necesario.

## MISSING_EVAL

Un comportamiento relevante no está protegido por eval.

## SCRIPT_GAP

Una tarea determinista repetida debería mejorar o incorporarse a un script.

## SKILL_GAP

La responsabilidad actual del skill no cubre correctamente una necesidad real.

## SIMPLIFICATION

Existe una forma más pequeña y clara de mantener el mismo contrato.

## AUTOMATION_CANDIDATE

Existe trabajo repetitivo y determinista que podría automatizarse.

No implica que deba automatizarse inmediatamente.

## Recurrencia

Clasificar:

- `ISOLATED`
- `REPEATED`
- `SYSTEMIC`
- `UNKNOWN`

### ISOLATED

Una única ejecución conocida.

### REPEATED

Aparece en varias ejecuciones o casos.

### SYSTEMIC

La causa pertenece al contrato, arquitectura o herramienta y puede afectar ampliamente.

### UNKNOWN

No existe evidencia suficiente para clasificar recurrencia.

## Impacto

Usar:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

`CRITICAL` debe reservarse para problemas como:

- seguridad;
- pérdida de comportamiento;
- corrupción de artefactos;
- migración incorrecta;
- incumplimiento sistemático de gates esenciales.

## Costo del cambio

Usar:

- `LOW`
- `MEDIUM`
- `HIGH`

Evaluar cualitativamente:

- archivos afectados;
- riesgo;
- complejidad;
- evals necesarias;
- scripts involucrados.

## Revisión de arquitectura

Cuando el finding esté relacionado con refactor o estructura, contrastar con:

`../_shared/architecture-policy.md`

Detectar por ejemplo:

- lógica funcional introducida nuevamente en Azure adapters;
- capas vacías creadas por convención;
- shared convertido en carpeta genérica;
- ownership duplicado;
- infraestructura acoplada innecesariamente.

## Revisión de shared resources

Detectar:

- mismo recurso modificado por varios owners;
- acciones `SR-ACTION-*` duplicadas;
- recursos fusionados únicamente por tecnología;
- consumidores no registrados;
- ownership contradictorio.

## Revisión de artefactos

Buscar inconsistencias entre owners.

Ejemplos:

`inventory.json`

dice que una Function existe pero el plan no la considera.

`analysis.json`

contiene una acción `FN-*` que el plan ignora sin justificación.

`shared-resources.json`

declara un owner distinto al utilizado durante preparation.

`verification.json`

declara `VERIFIED` con un gate obligatorio en `FAIL`.

## Responsabilidad

Detectar responsibility leakage.

Ejemplos:

- discovery proponiendo refactors;
- assessment generando pasos concretos;
- analyze modificando código;
- planning reanalizando toda la App;
- preparation migrando Programming Model;
- migration rediseñando arquitectura;
- verification corrigiendo fallos.

## Scripts

Cuando un problema:

- sea repetido;
- sea determinista;
- pueda detectarse sin razonamiento complejo;

evaluar si corresponde un `SCRIPT_GAP`.

No mover automáticamente lógica hacia scripts.

## Evals

Cuando un fallo real no esté protegido:

crear finding:

`MISSING_EVAL`

La propuesta debe indicar el escenario mínimo que debería agregarse.

## Simplificación

Preferir:

- regla más clara;
- menos instrucciones;
- owner único;
- menos artefactos;
- menos contexto;

sobre agregar excepciones acumulativas.

## Propuestas

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

### P0

Seguridad o fallo crítico.

### P1

Problema importante y reproducible que afecta corrección.

### P2

Robustez, mantenibilidad o eficiencia.

### P3

Mejora menor.

## Recommendation

Usar:

- `RECOMMEND`
- `MONITOR`
- `REJECT`
- `NEEDS_MORE_EVIDENCE`

### RECOMMEND

Existe evidencia suficiente y la mejora está justificada.

### MONITOR

El problema existe pero todavía no justifica cambio.

### REJECT

La propuesta añadiría complejidad o no resuelve un problema real.

### NEEDS_MORE_EVIDENCE

La evidencia actual no permite decidir.

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
- unknowns.

## improvement-plan.json

Debe contener propuestas priorizadas.

No debe modificar los archivos objetivo.

## Criterio de cierre

El capability termina cuando:

- se revisó evidencia real;
- cada finding tiene soporte;
- recurrencia e impacto fueron evaluados;
- inconsistencias semánticas fueron identificadas;
- propuestas son proporcionales al problema;
- evals faltantes fueron señaladas;
- no se modificó automáticamente el toolkit.

## Fuera de alcance

No debe:

- aplicar las propuestas;
- editar skills;
- editar scripts;
- editar evals;
- cambiar policies;
- cambiar templates;
- inventar problemas para justificar mejoras.

El siguiente paso después de una propuesta es revisión humana.
