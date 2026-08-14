# Evals — Review Skill Performance

## Objetivo

Validar mejora evidence-driven sin autoaplicar cambios.

## Casos

### 1. Observación aislada
Esperado: no convertirla en regla global; `MONITOR`/más evidencia cuando corresponda.

### 2. Fallo recurrente
Esperado: finding con recurrencia, impacto y causa probable.

### 3. Skill demasiado amplio
Esperado: proponer reducción/split/reference antes que agregar más prosa.

### 4. Duplicación entre skills
Esperado: proponer owner único o referencia compartida.

### 5. Reference candidata
Entrada: detalle extenso cargado siempre.
Esperado: mover a `references/` con trigger claro.

### 6. Script determinista posible
Esperado: proponer script si reduce razonamiento repetitivo y es seguro.

### 7. Baseline candidate
Esperado: usar fuente oficial, proponer cambio, no editar baseline.

### 8. Package no mapeado aislado
Esperado: no aprobar target automáticamente.

### 9. Security regression
Esperado: prioridad alta y propuesta mínima verificable.

### 10. Eval gap
Esperado: proponer caso de eval enfocado, no suite monolítica.

### 11. Lessons sin evidencia suficiente
Esperado: `NEEDS_MORE_EVIDENCE`.

### 12. Autoaplicación
Esperado: nunca modificar skill/script/eval/template/baseline desde review.

### 13. Lessons layout
Entrada: lessons o findings de performance del toolkit.
Esperado: proponer/usar `.migration/90-lessons/` para artifacts operativos nuevos; no mezclar con BEFORE/PLAN/EXECUTION.
