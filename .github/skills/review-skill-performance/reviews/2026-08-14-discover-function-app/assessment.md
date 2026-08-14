# Assessment — discover-function-app (2026-08-14)

## Scope

Revisión puntual de una ejecución de la skill `discover-function-app` sobre el repositorio `assi-report-disbursement-export` (2026-08-14). Insumo único: lesson `discover-function-app-20260814` (`OBSERVED`).

Esta revisión es **agnóstica al repositorio objetivo**: las propuestas afectan únicamente al toolkit (`discover-function-app` y, potencialmente, policies compartidas), nunca al proyecto donde se ejecutó la skill.

## Evidence refs

- `discover-function-app-20260814.md` / `.json` (lesson, estado `OBSERVED`, generada en el repositorio objetivo, adjuntada como insumo — no se copia contenido del repositorio objetivo a este review).
- `.github/skills/discover-function-app/SKILL.md`
- `.github/skills/discover-function-app/scripts/inventory.js`
- `.github/skills/discover-function-app/references/graphify-usage.md`
- `.github/skills/_shared/evidence-policy.md`
- `.github/skills/_shared/status-policy.md`

## Findings

### F1 — `MISSING_COVERAGE`

**Descripción**: `scripts/inventory.js` no ejecuta ninguna verificación determinista de uso real de las dependencias runtime declaradas en `package.json` (por ejemplo, buscar el nombre del paquete en imports/requires del código fuente no protegido). El evidence status (`CONFIRMED`/`INFERRED`/`UNKNOWN`) de cada dependencia queda hoy a criterio del ejecutor en el momento de redactar `current-state.md`, en lugar de basarse en un hecho determinista producido por el script.

**Evidencia observada**: en la ejecución revisada, 3 dependencias (`exceljs`, `moment-timezone`, `find-remove`) fueron marcadas `INFERRED` en `current-state.md` cuando un `grep` simple sobre `.ts` (sin leer contenido protegido) confirma uso directo.

**Nota de atribución**: parte de esta imprecisión es responsabilidad de disciplina de ejecución del agente (pudo haber corrido la verificación antes de escribir el artifact) y no exclusivamente un gap del skill. Se documenta como finding de skill porque mover la verificación a un paso determinista del script elimina la dependencia de esa disciplina para futuras ejecuciones, independientemente del ejecutor.

**Recurrence**: aislado (una sola ejecución observada).

**Impact**:
- Seguridad: ninguno.
- Corrección: bajo — el error es conservador (subestima certeza, no la sobreestima ni introduce falsedad).
- Completion de migración: bajo-medio — reduce la calidad de insumos para `assess-function-app`.
- Consumo de contexto/tokens: neutro a positivo si se resuelve en script (menos razonamiento del agente).
- Mantenibilidad: positivo si se mueve a script (menos ambigüedad).
- Portabilidad: sin impacto.

### F2 — `MISSING_COVERAGE`

**Descripción**: el vocabulario de evidencia compartido (`_shared/evidence-policy.md`, `_shared/status-policy.md`) no distingue "ausencia de uso confirmada por verificación determinista" de "evidencia insuficiente" (`UNKNOWN` genérico).

**Evidencia observada**: la dependencia `uuid`, declarada en `package.json`, no tiene ningún uso detectable en el código fuente (`grep -r "uuid"` sin resultados fuera de `node_modules`). Quedó marcada `UNKNOWN`, perdiendo la señal de que en realidad hay evidencia positiva de *no uso*, no ausencia de evidencia.

**Recurrence**: aislado.

**Impact**:
- Seguridad: ninguno.
- Corrección: bajo — no es un error, es una pérdida de granularidad útil.
- Completion de migración: bajo-medio — señal de limpieza de dependencias relevante para `assess-function-app`.
- Consumo de contexto/tokens: sin impacto relevante.
- Mantenibilidad: cualquier cambio a `_shared/*` afecta todas las skills — costo de gobernanza más alto que F1.
- Portabilidad: sin impacto.

### F3 — `MONITOR` (referencia, sin propuesta de cambio)

**Descripción**: se observó que un god node del grafo (`ReportDto`, 215 edges) pertenece a un dominio de reporting distinto al slice bajo análisis (Disbursement), y el grafo no distingue automáticamente "nodo relevante al slice objetivo" de "nodo de un slice hermano no relacionado".

**Evaluación**: este caso es evidencia empírica que **refuerza una regla ya existente** en `references/graphify-usage.md` ("no convertir una coincidencia de grafo en un hecho confirmado sin verificación cruzada"). El proceso de discovery se comportó correctamente (se verificó por lectura de source antes de citar la relación). No se identifica gap ni regla faltante.

**Recurrence**: aislado; se registra como caso de referencia para detectar recurrencia en revisiones futuras.

**Impact**: ninguno — no requiere cambio.

## Affected skills

- `discover-function-app` (F1, F2-alternativa-menor-impacto).
- `_shared/evidence-policy.md`, `_shared/status-policy.md` (F2-alternativa-mayor-impacto, solo si se decide en el futuro).

## Baseline candidates

Ninguno.
