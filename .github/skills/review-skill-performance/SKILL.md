---
name: review-skill-performance
description: Revisa el desempeño real del toolkit usando lessons, execution artifacts, fallos y evals. Úsalo fuera del flujo operativo para detectar recurrencia, responsibility leakage, reglas excesivas, gaps y oportunidades de simplificación, proponiendo mejoras sin modificar automáticamente skills ni baseline.
---

# Review Skill Performance

## Objetivo

Convertir evidencia de ejecuciones reales en propuestas de mejora pequeñas, justificadas y revisables.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/status-policy.md`

Consultar baseline/architecture solo cuando el finding lo requiera.

## Entradas

Consumir primero:

- lessons relevantes;
- blockers/review requirements;
- verification;
- artifacts de ejecuciones afectadas;
- evals relacionados.

Leer `SKILL.md`, scripts, references, templates o baseline únicamente para explicar un finding concreto.

## Workflow

1. Elegir una unidad de revisión pequeña.
2. Identificar findings con evidencia.
3. Evaluar recurrencia, impacto y costo del cambio.
4. Distinguir bug, gap, regla excesiva, duplicación o simplificación.
5. Proponer el cambio mínimo suficiente.
6. Para baseline, separar investigación de aprobación.
7. Emitir assessment e improvement plan.

Cargar:

- `references/review-model.md`
- `references/baseline-review.md` solo para findings de dependencias;
- `references/artifacts.md`.

## Salidas

Artifacts de review definidos en `references/artifacts.md`.

## Cierre

Una propuesta termina en recomendación, monitoreo, rechazo o necesidad de más evidencia. Nunca se autoaplica.

## No hacer

- modificar skills/scripts/evals/templates;
- cambiar dependency baseline;
- convertir una observación aislada en política;
- ampliar el scope del review sin evidencia.
