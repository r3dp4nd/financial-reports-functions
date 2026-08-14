# Lessons Policy

## Objetivo

Registrar aprendizajes útiles de cada ejecución sin convertir observaciones puntuales en reglas permanentes.

## Qué registrar

Solo cuando aporte valor:

- qué funcionó;
- qué falló;
- caso no previsto;
- decisión útil;
- posible simplificación o mejora del skill.

No duplicar logs ni repetir artifacts de ejecución.

## Artifacts

Guardar en `.migration/lessons/`:

- Markdown breve para revisión humana;
- JSON equivalente para consumo agéntico.

## Estados

- `OBSERVED`
- `PROPOSED`
- `ACCEPTED`
- `REJECTED`

Una lesson nace como `OBSERVED` o `PROPOSED` según el contrato de la ejecución.

## Regla de gobernanza

Una lesson no modifica automáticamente:

- `SKILL.md`;
- policies;
- scripts;
- evals;
- templates;
- dependency baseline.

La incorporación requiere revisión/aprobación humana.

## Revisión

`review-skill-performance` puede agrupar lessons, detectar recurrencia y proponer cambios. Debe favorecer simplificación y evidencia recurrente sobre reglas más amplias.
