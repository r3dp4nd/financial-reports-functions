# Lessons Policy

## Objetivo

Registrar aprendizaje útil derivado de ejecuciones reales para mejorar posteriormente:

- skills;
- scripts;
- evals;
- policies;
- templates;
- contratos;
- dependency baseline.

Las lessons no forman parte del comportamiento funcional de la migración.

Una lesson:

```text
registra aprendizaje
≠ modifica comportamiento
```

Una lesson no modifica automáticamente el toolkit.

## Qué registrar

Registrar únicamente observaciones con valor potencial para:

- corregir comportamiento;
- reducir falsos positivos o negativos;
- simplificar reglas;
- reducir contexto;
- mejorar determinismo;
- mejorar seguridad;
- mejorar trazabilidad;
- cubrir casos no contemplados;
- automatizar trabajo repetitivo;
- evolucionar un contrato existente.

Ejemplos:

- caso no contemplado;
- falso positivo;
- falso negativo;
- fallo de detección;
- regla demasiado amplia;
- regla demasiado restrictiva;
- contexto innecesario;
- patrón potencialmente reutilizable;
- oportunidad de simplificación;
- posible automatización;
- gap de eval;
- gap de script.

No convertir un log de ejecución en una lesson.

No registrar una observación únicamente porque ocurrió durante la ejecución.

Debe existir potencial real de:

- aprendizaje;
- corrección;
- simplificación;
- reutilización.

## Estados

Usar cuando corresponda:

- `OBSERVED`
- `PROPOSED`
- `ACCEPTED`
- `REJECTED`

### OBSERVED

Existe una observación respaldada por evidencia de una ejecución real.

No implica:

- generalización;
- cambio necesario;
- aprobación.

### PROPOSED

Existe una mejora candidata derivada de una o más observaciones.

No implica aprobación para modificar el toolkit.

Una propuesta debe indicar cuando corresponda:

- problema;
- evidencia;
- cambio sugerido;
- alcance;
- riesgo.

### ACCEPTED

La propuesta fue revisada y aprobada humanamente para ser incorporada.

No significa:

- cambio aplicado;
- regla activa;
- baseline modificado;
- eval actualizado;
- implementación validada.

Semántica:

```text
ACCEPTED
≠ IMPLEMENTED
≠ ACTIVE
```

La incorporación requiere todavía el proceso de cambio correspondiente.

### REJECTED

La propuesta fue revisada y no será incorporada en su forma actual.

La evidencia histórica puede conservarse.

Las ejecuciones operativas deberían producir principalmente:

- `OBSERVED`;
- excepcionalmente `PROPOSED` cuando exista una propuesta suficientemente sustentada.

`ACCEPTED` y `REJECTED` requieren revisión humana.

## Evidencia y provenance

Toda lesson debe permitir identificar de forma mínima:

- skill o script relacionado;
- scope de ejecución;
- observación;
- evidencia o artifact que la sustenta.

Cuando corresponda también puede registrar:

- Function;
- Function App;
- workflow;
- Action ID;
- resourceId;
- dependency;
- baselineRef.

No almacenar logs completos cuando una referencia breve y reproducible sea suficiente.

Las inferencias deben preservar su estado mediante:

`evidenceStatus`

conforme a:

`evidence-policy.md`

No convertir inferencias en observaciones confirmadas.

## Alcance

Una observación puede ser válida únicamente para:

- una ejecución;
- un repositorio;
- una Function App;
- una Function;
- un workflow;
- un skill;
- un patrón potencialmente reutilizable.

No convertir una observación local en una regla global sin evidencia suficiente.

La generalización debe considerar cuando corresponda:

- recurrencia;
- impacto;
- evidencia;
- riesgo;
- costo;
- complejidad añadida.

Una única ejecución puede ser suficiente para corregir un bug determinista demostrado.

No es suficiente por sí sola para convertir una decisión contextual en una regla universal.

## Lessons opcionales

La existencia de lessons no es un requisito general de cierre.

Cuando no exista aprendizaje relevante:

```text
lessons = []
```

es un resultado válido cuando el artifact estructurado owner ya dispone de ese campo.

También es válido no crear artifacts separados de lessons cuando el contrato del skill no los requiere.

No generar:

- `lessons.json`;
- `lessons.md`;
- carpetas vacías;

únicamente para demostrar que la etapa fue ejecutada.

## Artifacts

Crear artifacts de lessons separados únicamente cuando:

- exista aprendizaje relevante que deba persistirse;
- el owner estructurado de la etapa no sea suficiente;
- el contrato específico lo requiera.

Cuando exista una representación estructurada adecuada dentro del artifact owner:

preferir referenciarla o utilizarla antes que crear duplicación.

Cuando se genere una vista Markdown:

- debe ser breve;
- debe facilitar revisión humana;
- no debe duplicar el JSON completo.

No inventar una lesson para llenar un artifact.

## No duplicar findings

Cuando `review-skill-performance` ya haya registrado completamente un problema en:

`.skill-improvement/assessment.json`

no crear una segunda lesson únicamente para representar el mismo finding.

Crear una lesson adicional solo cuando exista conocimiento reutilizable diferente que justifique persistencia separada.

```text
finding
≠ lesson obligatoria
```

## Mejora del toolkit

Una ejecución no puede modificar automáticamente:

- `SKILL.md`;
- scripts;
- evals;
- policies;
- templates;
- dependency baseline;
- contratos del toolkit.

El flujo normal es:

```text
observación
→ propuesta
→ revisión humana
→ ACCEPTED o REJECTED
```

Una propuesta `ACCEPTED` requiere posteriormente:

```text
controlled change
→ update del artifact owner
→ update/add evals cuando cambie comportamiento
→ validation
→ incorporación efectiva
```

Una propuesta aceptada no se convierte en regla activa únicamente por haber sido aprobada.

## Review Skill Performance

Cuando una observación pueda requerir evolución del toolkit, la evaluación transversal pertenece a:

`review-skill-performance`

Ese capability puede considerar:

- recurrencia;
- impacto;
- change cost;
- priority;
- recommendation;
- affected files;
- required evals.

Las lessons aportan evidencia.

No sustituyen la review.

## Dependency baseline

Una ejecución exitosa con una versión, SDK o configuración determinada no convierte automáticamente ese valor en target
global.

No utilizar lessons para crear un lifecycle paralelo como:

- `VALIDATED`;
- `REPEATED`;
- `APPROVED`;

para dependencias.

Cuando la evidencia pueda justificar modificar:

`dependency-baseline.json`

el flujo es:

```text
execution evidence
→ lesson/finding cuando corresponda
→ review-skill-performance
→ BASELINE_CHANGE proposal
→ human review
→ controlled application
→ baselineRevision + 1
→ validation
```

La lesson puede registrar evidencia relevante como:

- package;
- versión utilizada;
- target environment;
- outcome;
- limitaciones;
- contradicciones.

No debe modificar:

- `managedPackages`;
- `targetVersion`;
- `baselineRevision`.

## Candidate targets

Un:

`candidateTarget`

puede formar parte de una observación o propuesta.

No significa:

`approved target`

Una lesson no puede convertirlo en target ejecutable.

```text
candidateTarget
≠ approved target
```

## Contradicciones

Las lessons también pueden registrar evidencia que contradiga conocimiento previo.

Ejemplos:

- una versión previamente exitosa falla en otro contexto;
- una regla produce false positive;
- un detector deja de funcionar;
- nueva evidencia contradice un supuesto anterior.

No eliminar ni ocultar evidencia contradictoria.

La contradicción debe llegar a review cuando afecte un contrato o baseline vigente.

## Casos aislados

Una observación producida por un único repositorio no debe convertirse automáticamente en una regla global.

Un caso aislado puede:

- conservarse como evidencia;
- producir un fix local cuando demuestra un bug;
- permanecer en `MONITOR`;
- requerir más evidencia.

No crear automáticamente:

- nueva policy;
- nuevo skill;
- nuevo workflow;
- nuevo script;
- nueva regla permanente;

si una evolución mínima de un artifact existente puede resolver adecuadamente el problema.

## Simplificación

Las lessons deben favorecer mejoras que reduzcan complejidad cuando la evidencia lo justifique.

Preferir:

- corregir una regla existente;
- eliminar duplicación;
- reducir contexto;
- fortalecer un eval;
- evolucionar un script existente;

antes que crear nuevos componentes.

```text
existing artifact
→ concrete gap
→ minimal evolution
```

## Seguridad

Las lessons deben cumplir:

`security-policy.md`

No registrar:

- valores sensibles;
- secrets;
- tokens;
- connection strings;
- certificados;
- contenido protegido;
- fragmentos obtenidos de archivos excluidos.

Cuando una observación se derive de la existencia de un archivo protegido, registrar únicamente metadata permitida.

## Executor neutrality

Una lesson debe ser comprensible y revisable sin depender del razonamiento privado del agente que la creó.

Debe quedar suficientemente claro:

```text
qué ocurrió
→ qué evidencia existe
→ por qué puede ser relevante
```

La decisión de generalizar pertenece a review humana.

## Principios

Aprender de ejecuciones reales.

Generalizar únicamente con evidencia.

No crear lessons vacías por contrato.

No duplicar findings ya representados adecuadamente.

Una propuesta aceptada todavía debe implementarse.

Una migración exitosa no modifica automáticamente el baseline.

Evolucionar mediante revisión humana.

No permitir autoevolución no controlada.
