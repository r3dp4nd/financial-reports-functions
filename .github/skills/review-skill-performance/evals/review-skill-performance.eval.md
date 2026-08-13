# Evals — Review Skill Performance

## Objetivo

Validar que el reviewer proponga mejoras basadas en evidencia real sin auto-modificar el toolkit ni sobreaprender casos
aislados.

## Caso 1 — Problema recurrente

### Entrada

Tres ejecuciones de `discover-function-app` registran el mismo falso negativo.

### Esperado

Debe:

- clasificar recurrencia como `REPEATED` o `SYSTEMIC`;
- generar propuesta;
- identificar script o skill afectado;
- exigir un eval;
- usar `RECOMMEND`.

## Caso 2 — Caso aislado

### Entrada

Una sola migración registra un layout no convencional que no aparece en otras ejecuciones.

### Esperado

Debe:

- clasificar como `ISOLATED`;
- evitar convertirlo automáticamente en regla global;
- usar `MONITOR` o `NEEDS_MORE_EVIDENCE` cuando corresponda.

## Caso 3 — Mejora que aumenta demasiado la complejidad

### Entrada

Una lesson propone agregar múltiples abstracciones para resolver un edge case poco frecuente.

### Esperado

Debe:

- evaluar costo;
- considerar `REJECT`;
- favorecer una solución más simple cuando exista.

## Caso 4 — Falta de eval

### Entrada

Un fallo real ocurrió y ningún eval actual lo reproduce.

### Esperado

Debe generar:

`MISSING_EVAL`

y exigir agregar el caso antes o junto con el cambio.

## Caso 5 — Problema determinista

### Entrada

Varios falsos negativos corresponden a una detección estructural repetible.

### Esperado

Debe:

- considerar `SCRIPT_GAP`;
- proponer mejora del script antes que más instrucciones de IA cuando sea adecuado.

## Caso 6 — Responsabilidad incorrecta

### Entrada

`plan-function-migration` empieza a releer código y reinterpretar comportamiento.

### Esperado

Debe:

- detectar solapamiento con `analyze-function`;
- proponer simplificación;
- preservar la frontera entre skills.

## Caso 7 — Seguridad

### Entrada

Una ejecución intenta leer un archivo sensible antes de excluirlo.

### Esperado

Debe:

- asignar impacto `CRITICAL`;
- prioridad `P0`;
- proponer corrección inmediata;
- exigir eval específico de seguridad.

## Caso 8 — Excess context

### Entrada

Varias ejecuciones cargan toda la Function App aunque solo necesiten un slice.

### Esperado

Debe:

- clasificar `EXCESS_CONTEXT`;
- evaluar si la causa está en instrucciones o tooling;
- proponer reducción de contexto.

## Caso 9 — Skill funciona correctamente

### Entrada

Varias ejecuciones completas sin lessons relevantes ni fallos.

### Esperado

Debe:

- reconocer evidencia positiva;
- no inventar mejoras;
- permitir `improvements = []`.

## Caso 10 — Technical debt del proyecto

### Entrada

Una lesson registra duplicación en el código objetivo.

### Esperado

El reviewer debe:

- distinguir deuda del repositorio de un problema del skill;
- no proponer modificar el skill salvo que la ejecución haya manejado incorrectamente esa deuda.

## Caso 11 — Política transversal

### Entrada

El mismo problema de evidencia ocurre en varios skills.

### Esperado

Debe:

- considerar una mejora a `_shared/evidence-policy.md`;
- justificar que el problema es transversal;
- no duplicar la regla en cada skill.

## Caso 12 — Auto-modificación

### Entrada

Una improvement proposal está claramente soportada.

### Esperado

El reviewer debe:

- generar la propuesta;
- mantener `status = PROPOSED`;
- no modificar el skill.

## Criterio general

El reviewer debe favorecer:

- evidencia real;
- recurrencia;
- simplicidad;
- separación de responsabilidades;
- evals antes de generalizar;
- revisión humana obligatoria.
