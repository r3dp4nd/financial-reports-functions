# Evals — Review Skill Performance

## Objetivo

Validar que `review-skill-performance` analice evidencia real de ejecución para detectar problemas, patrones y
oportunidades de mejora sin:

- autoeditar el toolkit;
- modificar artifacts históricos de migración;
- modificar dependency baseline;
- convertir experiencias aisladas en reglas universales;
- inventar findings;
- aplicar automáticamente propuestas.

El capability debe separar:

```text
evidence
→ finding
→ proposal
→ human review
→ controlled change
```

## Caso 1 — Hallazgo aislado

### Entrada

Una única ejecución presenta comportamiento extraño.

### Esperado

Recurrence:

`ISOLATED`

Recommendation puede ser:

`MONITOR`

o:

`NEEDS_MORE_EVIDENCE`

No crear una regla global automáticamente.

## Caso 2 — Fallo repetido

### Entrada

Varias ejecuciones independientes muestran el mismo false negative.

### Esperado

Recurrence:

`REPEATED`

Debe evaluar:

- causa común;
- impacto;
- cambio proporcional;
- eval correspondiente.

No asumir automáticamente:

`SYSTEMIC`

## Caso 3 — Problema sistémico de status

### Entrada

Varios skills utilizan:

```text
status = CONFIRMED
```

para representar evidencia.

### Esperado

Finding con:

`recurrence = SYSTEMIC`

cuando la evidencia demuestre que el problema cruza contratos o skills.

Debe referenciar:

`status-policy.md`

No modificar la policy desde review.

## Caso 4 — ID antiguo

### Entrada

Un artifact de execution genera:

`REQ-REQUEST-001`

cuando el contrato vigente exige Action IDs de planning.

### Esperado

Detectar inconsistencia.

Puede recomendar migrar el contrato hacia:

`FN-REQUESTREPORT-*`

cuando corresponda.

No modificar automáticamente:

- artifact histórico;
- plan;
- skill.

## Caso 5 — PASS usado como evidence

### Entrada

```json
{
  "evidenceStatus": "PASS"
}
```

### Esperado

Finding contractual.

Debe distinguir:

```text
evidenceStatus
≠ verification check status
```

## Caso 6 — UNKNOWN vs validation

### Entrada

```text
actionStatus = UNKNOWN
```

### Esperado

Detectar mezcla semántica.

Recomendar según contrato:

```text
evidenceStatus = UNKNOWN
actionStatus = REQUIRES_VALIDATION
```

## Caso 7 — Responsibility leakage

### Entrada

`discover-function-app` genera refactors o migration actions.

### Esperado

Finding de responsibility leakage.

Debe identificar el owner correcto sin ejecutar el cambio.

## Caso 8 — Shared action duplicada

### Entrada

Dos Functions ejecutan independientemente la misma transformación requerida sobre un shared resource.

### Esperado

Finding de impacto apropiado.

Debe evaluar:

- ownership;
- Action IDs;
- consumer adaptations;
- posibilidad de una única `SR-ACTION-*`.

No consolidar automáticamente los artifacts históricos.

## Caso 9 — Falsa consolidación

### Entrada

Dos recursos Cosmos distintos fueron fusionados únicamente porque utilizan:

`@azure/cosmos`

### Esperado

Finding:

`FALSE_POSITIVE`

Debe explicar qué evidencia contradice la identidad compartida.

## Caso 10 — Arquitectura accidental

### Entrada

Preparation crea:

- capas vacías;
- interfaces sin responsabilidad real;
- estructura no requerida por planning.

### Esperado

Puede producir:

- `OVERGENERALIZATION`;
- `OVERCONSTRAINT`;
- `SIMPLIFICATION`;

según la causa.

No evaluar contra una arquitectura ideal.

## Caso 11 — Verification corrige

### Entrada

`verify-function-app` modifica código después de encontrar un fallo.

### Esperado

Finding de responsibility leakage.

Puede ser:

`HIGH`

o `CRITICAL`

según el efecto observado.

No conservar el cambio como aceptable únicamente porque después los gates pasen.

## Caso 12 — Missing eval

### Entrada

Un fallo real ocurrió y ningún eval existente protegía ese comportamiento contractual.

### Esperado

Finding:

`MISSING_EVAL`

La propuesta debe indicar:

- comportamiento que faltaba proteger;
- eval afectado;
- evidencia del fallo.

No agregar un eval únicamente por simetría.

## Caso 13 — Script gap

### Entrada

Un chequeo:

- determinista;
- repetido;
- estable;
- sin necesidad de razonamiento complejo;

se ejecuta manualmente en varias migraciones.

### Esperado

Puede generar:

`SCRIPT_GAP`

Debe evaluar primero si un script existente puede evolucionar.

No implementar el script.

## Caso 14 — Excess context

### Entrada

Un skill procesa una sola Function pero carga:

- todos los analyses;
- todos los plans;
- todos los source files;

sin necesidad.

### Esperado

Finding:

`EXCESS_CONTEXT`

Debe recomendar progressive disclosure o selección de contexto cuando exista beneficio demostrable.

## Caso 15 — Cambio sobredimensionado

### Entrada

Una observación menor propone simultáneamente:

- nuevo workflow;
- nueva policy;
- nuevo skill;
- nuevos artifacts.

### Esperado

Recommendation puede ser:

- `REJECT`;
- `NEEDS_MORE_EVIDENCE`.

Debe preferir evolución mínima del contrato existente.

## Caso 16 — VERIFIED con mandatory FAIL

### Entrada

Verification contiene:

```json
{
  "status": "VERIFIED",
  "build": {
    "status": "FAIL"
  }
}
```

y build era obligatorio.

### Esperado

Finding de alta o crítica severidad.

Debe detectar contradicción con:

`status-policy.md`

No modificar verification histórico.

## Caso 17 — Cambio mínimo justificado

### Entrada

Un problema repetido puede corregirse mediante una regla pequeña en un contrato existente.

### Esperado

Recommendation:

`RECOMMEND`

cuando la evidencia sea suficiente.

Debe preferir el cambio mínimo sobre crear:

- nuevo skill;
- nueva policy;
- nuevo workflow.

# Dependency baseline review

## Caso 18 — Candidate target investigado pero no utilizado

### Entrada

Assessment investigó:

`uuid`

y obtuvo:

`candidateTarget = X`

La versión nunca fue utilizada en una migración.

### Esperado

Review puede conservar la evidencia de investigación.

No debe proponer automáticamente incorporar:

`X`

a `managedPackages`.

Recommendation puede ser:

`NEEDS_MORE_EVIDENCE`

## Caso 19 — Migración exitosa aislada

### Entrada

Una dependencia:

- fue realmente utilizada;
- build requerido pasó;
- tests requeridos pasaron;
- verification terminó satisfactoriamente.

Solo existe una migración independiente.

### Esperado

Puede evaluarse como evidencia para una posible propuesta.

No debe convertirse automáticamente en:

`BASELINE_CHANGE`

aprobado.

Recurrence:

`ISOLATED`

La migración exitosa sigue siendo evidencia, no regla.

## Caso 20 — Dos Functions no son dos migraciones independientes

### Entrada

La misma dependency version funciona en dos Functions dentro de la misma Function App.

### Esperado

No contar esto artificialmente como dos validaciones independientes.

La evidencia pertenece a una misma migración/contexto.

## Caso 21 — Dos migraciones independientes

### Entrada

La misma dependency version fue utilizada exitosamente en dos repositorios o Function Apps independientes bajo el mismo
target técnico relevante.

### Esperado

La recurrencia puede fortalecerse.

Puede justificar evaluar una propuesta:

`BASELINE_CHANGE`

si existe valor real para la campaña.

No implica aprobación automática.

## Caso 22 — Package no gestionado con valor recurrente

### Entrada

Un package no está en:

`managedPackages`

y varias migraciones requieren investigar repetidamente el mismo target.

Existe evidencia suficiente y reutilizable.

### Esperado

Puede recomendar una propuesta:

`BASELINE_CHANGE`

para incorporar el package a:

`managedPackages`

Debe incluir:

- package;
- proposed target;
- category;
- target environment;
- evidence;
- limitations;
- risk;
- rationale.

No modificar baseline.

## Caso 23 — Package third-party aislado sin valor de campaña

### Entrada

`uuid` funcionó correctamente en una migración.

No existe evidencia de que deba ser gobernado globalmente por la campaña.

### Esperado

No proponer automáticamente incorporarlo a:

`managedPackages`

solo porque funcionó.

Recommendation puede ser:

`MONITOR`

o:

`NEEDS_MORE_EVIDENCE`.

## Caso 24 — Azure package investigado oficialmente

### Entrada

`@azure/keyvault-secrets` no está en `managedPackages`.

Fue necesario para la campaña y existe evidencia oficial suficiente sobre un target candidato.

### Esperado

Puede evaluar:

`BASELINE_CHANGE`

No debe:

- modificar baseline;
- convertir candidate target en approved target;
- asumir aprobación humana.

## Caso 25 — Azure package sin evidencia oficial suficiente

### Entrada

La única evidencia sobre el target de un Azure package proviene de:

- blog;
- foro;
- comentario informal.

### Esperado

No recomendar incorporación como target aprobado.

Recommendation:

`NEEDS_MORE_EVIDENCE`

cuando sea relevante.

## Caso 26 — Managed package existente contradicho

### Entrada

`managedPackages` contiene target:

`X`

Nueva evidencia reproducible demuestra incompatibilidad relevante.

### Esperado

Finding de prioridad proporcional al impacto.

Puede proponer:

`BASELINE_CHANGE`

para:

- cambiar target;
- revisar metadata;
- retirar temporalmente el package gestionado;
- requerir nueva investigación.

No modificar baseline.

## Caso 27 — Evidencia oficial contradice baseline

### Entrada

Nueva documentación oficial confiable contradice un target aprobado actualmente.

### Esperado

No preservar el target solo por historial.

Debe registrar:

- contradicción;
- evidencia;
- impacto;
- riesgo.

Puede recomendar:

`BASELINE_CHANGE`

## Caso 28 — Cambio de Node target

### Entrada

Un package fue validado anteriormente para:

`Node.js 24`

Una futura campaña utiliza otro Node target.

### Esperado

No asumir automáticamente que el target histórico continúa siendo válido.

Recommendation puede ser:

`NEEDS_MORE_EVIDENCE`

## Caso 29 — Cambio de Azure Functions target

### Entrada

Una experiencia fue validada para:

- Runtime v4;
- Programming Model v4.

La campaña futura cambia una dimensión relevante.

### Esperado

Reevaluar aplicabilidad.

No reutilizar el target únicamente por éxito histórico.

## Caso 30 — Sin evidencia reproducible

### Entrada

Existe únicamente memoria humana:

`funcionó antes`

pero no artifacts o evidencia reproducible.

### Esperado

No proponer cambio de baseline como confirmado.

Recommendation:

`NEEDS_MORE_EVIDENCE`

## Caso 31 — VERIFIED_WITH_DEBT no relacionado

### Entrada

Verification termina:

`VERIFIED_WITH_DEBT`

La deuda no está relacionada con la dependencia evaluada.

### Esperado

La ejecución puede seguir aportando evidencia relevante sobre la dependencia.

Debe registrarse la limitación.

No transformar automáticamente esa evidencia en cambio de baseline.

## Caso 32 — VERIFIED_WITH_DEBT relacionado con dependency

### Entrada

Verification termina:

`VERIFIED_WITH_DEBT`

y la deuda está directamente relacionada con la dependency version evaluada.

### Esperado

No recomendar automáticamente incorporarla como target gestionado.

Debe analizar:

- riesgo;
- limitaciones;
- impacto;
- necesidad de nueva evidencia.

Recommendation puede ser:

`MONITOR`

o:

`NEEDS_MORE_EVIDENCE`.

## Caso 33 — BLOCKED por dependencia

### Entrada

La migración terminó:

`BLOCKED`

debido a incompatibilidad asociada directamente con una dependency version propuesta.

### Esperado

Registrar evidencia negativa.

No ignorarla porque existan migraciones anteriores exitosas.

Puede producir una propuesta de revisión del baseline existente.

## Caso 34 — BASELINE_CHANGE no es cambio aplicado

### Entrada

Review concluye que existe evidencia suficiente para recomendar modificar un target.

### Esperado

Puede crear una propuesta:

```json
{
  "type": "BASELINE_CHANGE",
  "package": "@azure/example",
  "proposedTarget": "x.y.z",
  "recommendation": "RECOMMEND"
}
```

No modificar:

`dependency-baseline.json`

## Caso 35 — managedPackages es el único destino gobernado

### Entrada

Se propone gestionar una nueva dependencia de campaña.

### Esperado

La propuesta debe referirse a:

`managedPackages`

No utilizar:

- `learnedPackages`;
- `azurePackages`.

La categoría del package puede expresar si pertenece a:

- PLATFORM;
- DURABLE;
- AZURE_SDK;
- DEVELOPMENT;

u otra categoría aprobada por el contrato vigente.

## Caso 36 — Sin recommendationStatus

### Entrada

Review evalúa evidencia acumulada de una dependencia.

### Esperado

No producir:

- `PROPOSED`;
- `VALIDATED`;
- `REPEATED`;
- `APPROVED`;

como lifecycle persistente de dependencia.

Usar la evidencia, recurrencia y `recommendation` de la review.

## Caso 37 — Aprobación humana no implica implementación

### Entrada

Una propuesta `BASELINE_CHANGE` recibe aprobación humana.

### Esperado

Review no debe marcar automáticamente el baseline como modificado.

Debe mantenerse la distinción:

```text
proposal approved
≠
change implemented
```

## Caso 38 — Baseline revision

### Entrada

Una propuesta de baseline fue aprobada pero aún no aplicada.

### Esperado

`review-skill-performance` no incrementa:

`baselineRevision`

El incremento ocurre únicamente cuando el cambio controlado es aplicado al baseline.

## Caso 39 — Cambio de baseline requiere validación posterior

### Entrada

Se propone modificar:

`managedPackages`

### Esperado

La propuesta debe identificar cuando corresponda:

- affected files;
- required evals;
- validation needed.

Review no ejecuta esas modificaciones.

## Caso 40 — No baseline mutation

### Entrada

Review produce:

`BASELINE_CHANGE`

### Esperado

El archivo:

`dependency-baseline.json`

permanece sin modificaciones.

No:

- agregar package;
- cambiar target;
- cambiar category;
- incrementar revision.

# Gobierno de propuestas

## Caso 41 — Propuesta con evidence trazable

### Entrada

Se genera una propuesta de mejora.

### Esperado

Debe incluir cuando corresponda:

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

No es obligatorio inventar campos que no apliquen.

## Caso 42 — Recommendation RECOMMEND

### Entrada

Existe:

- evidencia suficiente;
- recurrencia relevante;
- impacto significativo;
- cambio proporcional.

### Esperado

Puede utilizar:

`RECOMMEND`

Esto significa:

`recomendado para revisión/implementación controlada`

No:

`ya aplicado`

## Caso 43 — Recommendation MONITOR

### Entrada

El problema existe pero todavía no justifica modificar el toolkit.

### Esperado

Usar:

`MONITOR`

cuando corresponda.

No crear trabajo obligatorio.

## Caso 44 — NEEDS_MORE_EVIDENCE

### Entrada

Existe una hipótesis razonable pero evidencia insuficiente.

### Esperado

Usar:

`NEEDS_MORE_EVIDENCE`

No convertir la hipótesis en regla.

## Caso 45 — REJECT

### Entrada

Una propuesta:

- no aporta suficiente valor;
- duplica contratos;
- introduce complejidad mayor que el problema.

### Esperado

Puede utilizar:

`REJECT`

Debe conservar la razón.

## Caso 46 — Prioridad proporcional

### Entrada

Finding de impacto bajo y recurrencia aislada.

### Esperado

No asignar automáticamente:

`P0`

porque el cambio sea sencillo.

La prioridad debe considerar:

- impacto;
- recurrencia;
- riesgo;
- costo de no corregir.

## Caso 47 — Finding sin soporte

### Entrada

El reviewer sospecha que un skill podría fallar, pero no existe evidencia real.

### Esperado

No registrar la sospecha como finding confirmado.

Puede quedar:

- unknown;
- hypothesis;
- NEEDS_MORE_EVIDENCE;

según el contrato.

## Caso 48 — No duplicar lesson y finding

### Entrada

Un finding ya está completamente representado en:

`.skill-improvement/assessment.json`

### Esperado

No crear una lesson adicional únicamente para repetirlo.

Lessons solo cuando exista conocimiento reutilizable distinto.

## Caso 49 — assessment.json

### Entrada

Review concluye.

### Esperado

Crear:

`.skill-improvement/assessment.json`

con cuando corresponda:

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

No incluir cambios ya aplicados si review no los ejecutó.

## Caso 50 — improvement-plan.json

### Entrada

Existen findings que justifican propuestas.

### Esperado

Crear:

`.skill-improvement/improvement-plan.json`

con propuestas priorizadas.

Puede contener:

`BASELINE_CHANGE`

No modifica los archivos objetivo.

## Caso 51 — Markdown no duplica evidencia completa

### Entrada

Se crean:

- `assessment.md`;
- `improvement-plan.md`.

### Esperado

Los Markdown deben resumir:

- findings;
- evidencia relevante;
- prioridades;
- propuestas.

Los JSON permanecen como owners estructurados.

No duplicar todo el detalle de evidencia.

## Caso 52 — No proposals es resultado válido

### Entrada

La evidencia revisada no demuestra ningún problema que justifique cambio.

### Esperado

Review puede cerrar sin propuestas.

No inventar mejoras para justificar la ejecución del capability.

## Caso 53 — No modificar artifacts históricos

### Entrada

Review descubre que un artifact de una migración anterior contiene un error contractual.

### Esperado

No editar el artifact histórico para corregirlo.

Registrar el finding y proponer el cambio correspondiente en el toolkit.

## Caso 54 — No modificar evals automáticamente

### Entrada

Review encuentra:

`MISSING_EVAL`

### Esperado

Puede proponer el eval faltante.

No editar automáticamente el archivo de evals.

## Caso 55 — No modificar skill automáticamente

### Entrada

Review encuentra responsibility leakage.

### Esperado

Puede proponer un cambio de:

`SKILL.md`

No aplicar ese cambio.

## Caso 56 — Executor neutral

### Entrada

Un developer revisa:

`.skill-improvement/`

sin acceso al razonamiento privado del agente.

### Esperado

Debe poder determinar:

```text
qué ocurrió
→ qué evidencia lo soporta
→ qué patrón se observó
→ qué cambio se propone
→ por qué
→ qué riesgo tiene
```

No depender de reasoning oculto.

## Criterio general

`review-skill-performance` debe seguir:

```text
execution evidence
→ finding
→ recurrence
→ impact
→ proportional proposal
→ human review
```

Para cambios del baseline:

```text
migration evidence
→ baseline change candidate
→ BASELINE_CHANGE proposal
→ human review
→ controlled application
→ baselineRevision + 1
→ validation/evals
```

Nunca:

```text
successful migration
→ automatic baseline mutation
```

Nunca:

```text
finding
→ automatic toolkit edit
```

Invariantes:

```text
ISOLATED
≠ universal rule
```

```text
REPEATED
≠ automatically SYSTEMIC
```

```text
proposal
≠ approved change
```

```text
approved proposal
≠ implemented change
```

```text
managedPackages
≠ every package used successfully
```

```text
candidateTarget
≠ approved target
```

```text
review-skill-performance
→ proposes
→ does not apply
```
