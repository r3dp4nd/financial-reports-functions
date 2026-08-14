# Improvement Plan — discover-function-app (2026-08-14)

> Estado de implementación (actualizado): las Propuestas 1 y 2a fueron **aceptadas e implementadas** tras aprobación humana explícita del usuario ("implementa la mejora que nos ayude"). La Propuesta 2b permanece pospuesta (`NEEDS_MORE_EVIDENCE`) y la Propuesta 3 permanece en `MONITOR`, sin cambio de código.

## Propuesta 1 (finding F1) — `ACCEPTED` / implementada

- **Finding ref**: F1 — `MISSING_COVERAGE`
- **Recommendation**: `RECOMMEND` → `ACCEPTED`
- **Implementación realizada**:
  - `scripts/inventory.js`: se generalizó `sourceReferencesPackage` para calcular, en `scanSources`, un mapa `dependencyUsage` (nombre de paquete declarado → boolean) recorriendo los mismos archivos de source ya escaneados (sin tocar exclusiones de seguridad). `dependencyList` ahora recibe ese mapa y anota `usageDetected: true|false|null` en cada entrada de `dependencies`.
  - `scripts/inventory.test.js`: 2 nuevos tests (`usageDetected` true / false), pasando junto con los 13 preexistentes (15/15 PASS).
  - `references/artifacts.md`: documentado el nuevo campo `usageDetected` en la sección `dependencies` de `inventory.json`.
  - `evals/discover-function-app.eval.md`: nuevo caso #21 ("Dependencia declarada sin uso detectado").
- **Cambio mínimo propuesto**: agregar a `scripts/inventory.js` un paso determinista que, para cada dependencia runtime declarada en `package.json`, verifique si el nombre del paquete aparece en algún `import`/`require` dentro del código fuente no protegido del repositorio, y anote el resultado como campo booleano (`usageDetected`) en la entrada correspondiente de `dependencies` en `inventory.json`. No implica leer contenido protegido ni cambiar el algoritmo de exclusión de seguridad existente.
- **Archivos potencialmente afectados**:
  - `.github/skills/discover-function-app/scripts/inventory.js`
  - `.github/skills/discover-function-app/scripts/inventory.test.js`
  - `.github/skills/discover-function-app/references/artifacts.md` (documentar el nuevo campo)
- **Riesgo de compatibilidad**: bajo. El campo es aditivo; no se elimina ni renombra ningún campo existente de `inventory.json`, por lo que consumidores actuales (`assess-function-app`, `analyze-function`, etc.) no se rompen.
- **Evals requeridos**: nuevo caso en `.github/skills/discover-function-app/evals/discover-function-app.eval.md` cubriendo dependencia usada vs. dependencia declarada sin uso detectado.
- **Aprobación humana requerida**: sí.

## Propuesta 2a (finding F2, alternativa de menor impacto) — `ACCEPTED` / implementada

- **Finding ref**: F2 — `MISSING_COVERAGE`
- **Recommendation**: `RECOMMEND` → `ACCEPTED`
- **Implementación realizada**: cubierta por el mismo cambio de la Propuesta 1 (campo `usageDetected` en `inventory.js`/`inventory.test.js`/`references/artifacts.md`/eval #21). No se tocó `_shared/evidence-policy.md` ni `_shared/status-policy.md`, conforme a lo decidido.
- **Cambio mínimo propuesto**: reutilizar el campo `usageDetected: false` introducido en la Propuesta 1 como señal suficiente para distinguir "declarada sin uso detectado" de "evidencia insuficiente", sin tocar el vocabulario de evidencia compartido (`_shared/evidence-policy.md`, `_shared/status-policy.md`). El evidence status seguiría siendo `CONFIRMED`/`INFERRED`/`UNKNOWN`/`NOT_APPLICABLE`; el campo adicional aporta la granularidad faltante sin ampliar el vocabulario global.
- **Archivos potencialmente afectados**:
  - `.github/skills/discover-function-app/scripts/inventory.js` (mismo cambio que Propuesta 1)
  - `.github/skills/discover-function-app/references/artifacts.md`
- **Riesgo de compatibilidad**: bajo. No afecta a ninguna skill fuera de `discover-function-app`.
- **Evals requeridos**: mismo caso de eval que Propuesta 1.
- **Aprobación humana requerida**: sí.

## Propuesta 2b (finding F2, alternativa de mayor impacto — no recomendada por ahora)

- **Finding ref**: F2 — `MISSING_COVERAGE`
- **Recommendation**: `NEEDS_MORE_EVIDENCE`
- **Cambio propuesto (mayor costo)**: agregar una categoría explícita de evidencia (por ejemplo `NOT_USED_CONFIRMED` o similar) al vocabulario compartido en `_shared/evidence-policy.md` / `_shared/status-policy.md`.
- **Archivos potencialmente afectados**:
  - `.github/skills/_shared/evidence-policy.md`
  - `.github/skills/_shared/status-policy.md`
  - Todas las skills que consumen ese vocabulario (impacto transversal).
- **Riesgo de compatibilidad**: medio-alto. Cambiar un vocabulario compartido por *todas* las skills basado en una sola observación aislada no está justificado todavía.
- **Evals requeridos**: evals de todas las skills que referencien el vocabulario de evidencia, si se decidiera avanzar.
- **Aprobación humana requerida**: sí, y se recomienda posponer hasta observar recurrencia en más de una ejecución/repositorio (ver regla de "menos es más" de `review-model.md`: preferir la Propuesta 2a antes de tocar policy compartida).

## Propuesta 3 (finding F3)

- **Finding ref**: F3 — `REDUNDANCY` (evidencia de refuerzo)
- **Recommendation**: `MONITOR`
- **Cambio propuesto**: ninguno. El comportamiento observado (god node cruzando slices, resuelto con verificación cruzada manual) ya está cubierto por la regla existente en `references/graphify-usage.md`. Se registra como caso de referencia para detectar recurrencia en revisiones futuras; si el patrón se repite en múltiples repositorios, podría justificar una regla adicional (por ejemplo, una nota explícita para desambiguar god nodes multi-dominio), pero una sola observación no lo justifica aún.
- **Archivos potencialmente afectados**: ninguno por ahora.
- **Riesgo de compatibilidad**: no aplica.
- **Evals requeridos**: ninguno por ahora.
- **Aprobación humana requerida**: no aplica (no hay cambio propuesto).

## Resumen de recomendaciones

| Propuesta | Finding | Recommendation | Estado final | Requiere aprobación humana |
|---|---|---|---|---|
| 1 | F1 | RECOMMEND | `ACCEPTED` (implementada) | Sí — otorgada |
| 2a | F2 | RECOMMEND | `ACCEPTED` (implementada) | Sí — otorgada |
| 2b | F2 | NEEDS_MORE_EVIDENCE | Pospuesta | Sí (pendiente) |
| 3 | F3 | MONITOR | Sin cambio | No aplica |

## Cierre

Este plan no modifica automáticamente `SKILL.md`, scripts, policies, templates ni evals. Toda incorporación requiere revisión y aprobación humana explícita, conforme a la regla de cierre de `review-skill-performance` ("nunca se autoaplica") y a la regla de gobernanza de `lessons-policy.md`.
