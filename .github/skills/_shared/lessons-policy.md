# Lessons Policy

## Objetivo

Registrar aprendizaje útil de ejecuciones reales para mejorar posteriormente los skills.

Las lecciones no forman parte del comportamiento funcional de la migración.

## Qué registrar

Registrar únicamente observaciones útiles como:

- caso no contemplado;
- falso positivo;
- falso negativo;
- fallo de detección;
- regla demasiado amplia;
- contexto innecesario;
- patrón reusable;
- decisión útil;
- oportunidad de simplificación;
- posible automatización;
- mejora propuesta del skill o de un script.

No convertir un log de ejecución en una lección.

## Estados

Usar cuando corresponda:

- `OBSERVED`
- `PROPOSED`
- `ACCEPTED`
- `REJECTED`

Las ejecuciones normales deberían producir principalmente:

- `OBSERVED`
- `PROPOSED`

## Artefactos

Cada skill debe generar sus artefactos de lessons definidos por su contrato.

JSON:

- estructurado para análisis posterior.

Markdown:

- explicación breve para revisión humana.

Si no existen lecciones relevantes:

`lessons = []`

No inventar una lección para llenar el artefacto.

## Mejora de skills

Una ejecución no puede modificar automáticamente:

- `SKILL.md`;
- scripts;
- evals;
- políticas compartidas.

El flujo es:

observación

→ propuesta

→ revisión humana

→ modificación aprobada

→ ejecución de evals

→ aceptación o rechazo.

## Casos aislados

Una observación producida por un único repositorio no debe convertirse automáticamente en una regla global.

El futuro analista de performance de skills debe considerar:

- recurrencia;
- impacto;
- evidencia;
- costo;
- complejidad añadida.

## Principio

Aprender de ejecuciones reales sin permitir autoevolución no controlada.
