# Lessons Policy

## Objetivo

Registrar aprendizaje útil de ejecuciones reales para mejorar posteriormente los skills, scripts y contratos del
toolkit.

Las lecciones no forman parte del comportamiento funcional de la migración.

Una lección no modifica automáticamente el comportamiento del toolkit.

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

No registrar una observación únicamente porque ocurrió durante la ejecución.

Debe existir potencial de aprendizaje, corrección o simplificación.

## Estados

Usar cuando corresponda:

- `OBSERVED`
- `PROPOSED`
- `ACCEPTED`
- `REJECTED`

### OBSERVED

Existe una observación respaldada por evidencia de una ejecución real.

No implica que sea generalizable.

### PROPOSED

Existe una mejora candidata derivada de una o más observaciones.

No implica aprobación para modificar el toolkit.

### ACCEPTED

La propuesta fue revisada y aprobada humanamente para ser incorporada.

La aceptación no sustituye la modificación controlada ni la ejecución posterior de evals.

### REJECTED

La propuesta fue revisada y no será incorporada en su forma actual.

Las ejecuciones normales deberían producir principalmente:

- `OBSERVED`;
- `PROPOSED`.

`ACCEPTED` y `REJECTED` requieren revisión humana.

## Evidencia y proveniencia

Toda lección debe permitir identificar de forma mínima:

- skill o script relacionado;
- scope de la ejecución;
- observación;
- evidencia o artifact que la sustenta.

No almacenar logs completos cuando una referencia breve sea suficiente.

Las inferencias deben conservar su estado de evidencia conforme a:

`.github/skills/_shared/evidence-policy.md`

## Alcance

Una observación puede ser válida únicamente para:

- una ejecución;
- un repositorio;
- un skill;
- un patrón potencialmente reutilizable.

No convertir una observación local en una regla global sin evidencia suficiente.

La generalización debe considerar al menos:

- recurrencia;
- impacto;
- evidencia;
- costo;
- complejidad añadida.

## Artefactos

Registrar lessons únicamente cuando el contrato del skill lo requiera o exista aprendizaje relevante que deba
persistirse.

Preferir incorporar `lessons = []` en el artifact estructurado correspondiente cuando no existan observaciones
relevantes, en lugar de generar archivos adicionales vacíos.

Cuando se genere una vista Markdown:

- debe ser breve;
- debe facilitar revisión humana;
- no debe duplicar el JSON completo.

No inventar una lección para llenar un artifact.

## Mejora de skills

Una ejecución no puede modificar automáticamente:

- `SKILL.md`;
- scripts;
- evals;
- políticas compartidas;
- templates;
- `dependency-baseline.json`;
- contratos del toolkit.

El flujo es:

observación

→ propuesta

→ revisión humana

→ aceptación o rechazo

→ modificación aprobada

→ ejecución de evals

→ incorporación únicamente si el cambio mantiene el comportamiento esperado.

Una propuesta aceptada no se convierte en regla activa únicamente por haber sido aprobada.

## Baselines y targets

Una ejecución exitosa con una versión, SDK o configuración determinada no convierte automáticamente ese valor en target
global.

Las actualizaciones de `dependency-baseline.json` requieren evidencia suficiente, revisión humana y el proceso de cambio
correspondiente.

## Casos aislados

Una observación producida por un único repositorio no debe convertirse automáticamente en una regla global.

Un caso aislado puede conservarse como evidencia útil sin generar una modificación del toolkit.

No crear una nueva policy, skill, script o regla permanente únicamente para resolver un caso aislado si una evolución
mínima de un artefacto existente puede cubrirlo.

## Seguridad

Las lessons deben cumplir:

`.github/skills/_shared/security-policy.md`

No registrar valores sensibles, contenido protegido ni fragmentos obtenidos de archivos excluidos.

## Principio

Aprender de ejecuciones reales.

Generalizar únicamente con evidencia.

Evolucionar mediante revisión humana.

No permitir autoevolución no controlada.
