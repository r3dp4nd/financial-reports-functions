# Azure Functions Migration Skills

Toolkit de skills para migrar Azure Function Apps Node.js hacia el target técnico aprobado con cambios controlados,
evidencia reproducible y ejecución manual desde GitHub Copilot Chat.

## Principios

* menos es más;
* progressive disclosure;
* no leer secretos ni CI/CD sin sanitización;
* preservar lógica de negocio;
* no generar tests en el repositorio objetivo;
* migrar solo lo necesario, pero completar el target aprobado;
* arquitectura objetivo incremental;
* una sola fuente de verdad por dato;
* artifacts Markdown para humanos y JSON para agentes;
* lessons no modifican automáticamente el toolkit.

## Target actual

* Node.js 24;
* Azure Functions Runtime v4;
* Programming Model v4 cuando aplique;
* dependencias según `_shared/dependency-baseline.json`.

No usar `latest` como sustituto del baseline aprobado.

## Flujo

```text
00 BEFORE
  discover-function-app             (Graphify/indexer opcional dentro de discovery)

10 TRIAGE
  assess-function-app               (gate compacto; prioriza analysis)

20 ANALYSIS
  analyze-function                   (solo Functions/slices priorizados)

30 PLAN
  plan-function-migration            (plan global de tooling/ownership + plan ejecutable por cada Function)

40 EXECUTION
  prepare-function-app               (solo GLOBAL/SR-ACTION aprobadas)
  prepare-function                   (solo FN/SLICE estructural aprobado)
  migrate-programming-model-v4       (solo si el plan lo exige)
  migrate-durable-functions-v4       (solo si Durable aplica)

50 VERIFY
  verify-function-app

SUPPORT
  explain-migration-action          (explica Action ID sin modificar)
  generate-dev-task-pack            (paquete de trabajo para dev)
  suggest-code-change               (diff sugerido sin aplicar)
  run-migration-checks              (checks aprobados/safe)
  review-manual-migration           (review contra plan)
  scaffold-function-capability       (scaffold nuevo o Action ID aprobado)
  generate-tests-for-function-slice  (solo solicitud explícita o Action ID aprobado)
```

`review-skill-performance` mejora el toolkit y no forma parte del flujo obligatorio de migración.

Los skills en `support/` ayudan al dev a acelerar creación/refactor/testabilidad. No reemplazan `plan-function-migration` ni ejecutan migración completa.

El plan decide qué skills de ejecución aplican. No ejecutar la cadena completa por costumbre.

## Prompts maestros

| Prompt | Uso |
|--------|-----|
| [`prompts/master-before-to-plan.md`](prompts/master-before-to-plan.md) | Orquestar discovery, assessment, analysis por cada Function y planning, con metricas de consumo/modelo. |

## Cómo usar los skills

Los skills se ejecutan manualmente desde GitHub Copilot Chat. Cada etapa consume la evidencia producida por las
anteriores en `.migration/`.

```text
Ejecutar skill
→ revisar artifacts
→ resolver BLOCKED / REQUIRES_REVIEW
→ continuar con el siguiente skill aplicable
```

No cargar todas las referencias manualmente. Cada `SKILL.md` indica qué archivos de `references/` necesita según el
caso.

| Skill                          | Cuándo usarlo                                             | Entrada principal              | Resultado principal                           |
|--------------------------------|-----------------------------------------------------------|--------------------------------|-----------------------------------------------|
| `discover-function-app`        | Inicio de la migración o nueva fotografía BEFORE.         | Repositorio; Graphify opcional. | `00-before/inventory.json` + `current-state.md` (incluye `directoryTree`, `largeFiles`, `initialSignals` y `usageDetected`/`sources` deterministas por dependencia/configuration key — todo trazable a `inventory.json`, sin narrativa interpretativa) |
| `assess-function-app`          | Después del discovery para triage global contra target.   | BEFORE.                       | `10-assessment/assessment.json\|md`           |
| `analyze-function`             | Cuando una Function o slice necesita análisis específico. | BEFORE + assessment.          | `20-analysis/functions|slices/.../analysis.*` (incluye narrativa funcional/técnica trazable a la evidencia ya documentada en el propio analysis) |
| `plan-function-migration`      | Cuando assessment y análisis necesarios están completos.  | Evidencia BEFORE + analyses.  | `30-plan/migration-plan.*` (global) + `30-plan/functions/<FunctionName>/migration-plan.*` (uno por Function) + Action IDs |
| `prepare-function-app`         | Cuando existen acciones globales aprobadas.               | Plan global.                  | `40-execution/app/preparation.json\|md`       |
| `prepare-function`             | Cuando una Function necesita preparación local.           | Plan de la Function.          | `40-execution/functions/<name>/preparation.*` |
| `migrate-programming-model-v4` | Function v3 con acción aprobada hacia v4.                 | Plan + preparation aplicable. | `40-execution/functions/<name>/programming-model-v4.*` |
| `migrate-durable-functions-v4` | Workflow Durable con migración aprobada.                  | Planes de sus participantes.  | `40-execution/workflows/<name>/durable-v4.*`  |
| `verify-function-app`          | Cuando todas las acciones aplicables terminaron.          | Plan + artifacts de ejecución. | `50-verification/verification.json\|md`      |
| `support/explain-migration-action` | Explicar un Action ID para dev humano.              | Action ID + plan.             | Respuesta explicativa.                        |
| `support/generate-dev-task-pack` | Crear paquete de trabajo manual.                       | Action ID(s) + plan.          | `40-execution/dev-tasks/*.md`                 |
| `support/suggest-code-change`  | Sugerir diff sin aplicarlo.                              | Action ID + archivos.         | Respuesta o `40-execution/suggestions/*.md`   |
| `support/run-migration-checks` | Ejecutar checks aprobados/safe.                          | Plan/scope + tooling.         | `40-execution/checks/*`                       |
| `support/review-manual-migration` | Revisar cambios humanos contra plan.                  | Diff + Action IDs.            | `40-execution/reviews/*`                      |
| `support/scaffold-function-capability` | Crear scaffold de capability + Function.           | Solicitud explícita o Action ID. | Código scaffold + `scaffold.*` opcional     |
| `support/generate-tests-for-function-slice` | Generar/proponer tests para ruta/slice.       | Ruta + solicitud explícita o Action ID. | Specs + `test-generation.*` opcional |
| `review-skill-performance`     | Para revisar lessons, blockers y efectividad del toolkit. | Lessons + evals + evidencia.   | Findings y propuestas de mejora.              |

### Ejemplos en Copilot Chat

```text
Ejecuta discover-function-app sobre este repositorio.
Ejecuta assess-function-app usando el inventario actual.
Ejecuta analyze-function para ProcessOrders.
Ejecuta plan-function-migration con la evidencia disponible.
Ejecuta prepare-function-app siguiendo únicamente el plan aprobado.
Ejecuta prepare-function para ProcessOrders.
Ejecuta migrate-programming-model-v4 para ProcessOrders.
Ejecuta migrate-durable-functions-v4 para el workflow GenerateFinancialReport.
Ejecuta support/explain-migration-action para FN-003.
Ejecuta support/generate-dev-task-pack para FN-003 y FN-004.
Ejecuta support/suggest-code-change para FN-003 sin aplicar cambios.
Ejecuta support/run-migration-checks para FN-003.
Ejecuta support/review-manual-migration para FN-003 usando el diff actual.
Ejecuta support/scaffold-function-capability para crear capability RequestReport con Function HTTP RequestReport.
Ejecuta support/generate-tests-for-function-slice para src/RequestReport/handler.ts.
Ejecuta verify-function-app contra el plan aprobado.
Ejecuta review-skill-performance sobre las lessons de esta migración.
```

### Reglas de ejecución

* `analyze-function` se ejecuta por Function o slice natural; `prepare-function` se ejecuta por Function solo cuando corresponda.
* `assess-function-app` debe funcionar como triage compacto: prioriza, bloquea o habilita; no repite discovery.
* `plan-function-migration` es el router: determina qué skills de ejecución aplican por Action ID.
* `migrate-programming-model-v4` debe devolver `NOT_APPLICABLE` si la Function ya está en v4.
* `migrate-durable-functions-v4` trata el workflow como una unidad coherente.
* `prepare-function-app` ejecuta cambios globales una sola vez.
* `verify-function-app` ejecuta el build global después de completar todas las Functions aplicables.
* ningún skill debe ampliar el scope más allá del plan aprobado.
* `plan-function-migration` separa migración técnica de refactor/testabilidad y puede sugerir executor `HUMAN`, `AI_AGENT` o `EITHER`.
* `plan-function-migration` genera siempre un plan global (tooling/dependencias/runtime/ownership) y un plan por cada Function individual; no agrupa Functions en un plan colectivo tipo slice, incluso cuando pertenezcan al mismo workflow Durable.
* support skills pueden modificar código solo cuando su descripción lo permite y existe solicitud explícita o Action ID aprobado.
* generar tests está prohibido en migración por defecto, pero permitido en `support/generate-tests-for-function-slice` cuando el usuario lo pide explícitamente o el plan lo aprueba.
* `support/suggest-code-change` y `support/review-manual-migration` nunca aplican correcciones; solo proponen o revisan.

## Estados

| Estado            | Significado                                                 |
|-------------------|-------------------------------------------------------------|
| `COMPLETED`       | Etapa terminada correctamente.                              |
| `NOT_APPLICABLE`  | No existe trabajo necesario para esa etapa.                 |
| `REQUIRES_REVIEW` | Se necesita una decisión humana.                            |
| `BLOCKED`         | Falta una precondición o existe un impedimento verificable. |

`NOT_APPLICABLE` es un resultado válido y evita transformaciones innecesarias.

## Progressive disclosure

Cada `SKILL.md` contiene solo:

* objetivo;
* precondiciones y entradas;
* workflow;
* salidas;
* criterios de cierre;
* referencias que debe cargar cuando correspondan.

El detalle técnico vive en `references/` del skill o en `_shared/` cuando es transversal.

## Políticas compartidas

```text
_shared/
├── security-policy.md
├── evidence-policy.md
├── status-policy.md
├── architecture-policy.md
├── language-policy.md
├── lessons-policy.md
├── dependency-baseline.json
├── templates/
│   └── function-current-state.template.md
└── references/
    ├── architecture-examples.md
    ├── artifact-layout.md
    ├── evidence-model.md
    ├── official-sources.md
    ├── security-patterns.md
    ├── target-architecture.md
    └── validation-tooling.md
```

`_shared/` solo contiene lo transversal a más de un skill. `function-current-state.template.md` es el único template
que permanece aquí porque lo consumen tanto `discover-function-app` como `analyze-function`. Cualquier otro template
usado por un solo skill vive en `<skill>/templates/` (por ejemplo `assess-function-app/templates/assessment.template.md`
o `support/run-migration-checks/templates/check-run.template.md`), no en `_shared/`.

La política de seguridad aplica antes de cualquier lectura. `.env*`, `local.settings.json`, certificados, secretos y
CI/CD no se leen directamente.

## Evidencia

```text
BEFORE → PLAN → EXECUTION → AFTER
```

Los artifacts de `.migration/` son contratos entre etapas. Una etapa posterior consume el artifact de su owner en lugar
de reconstruir la información.

El plan es además un contrato de evaluación: cada acción debe tener resultado esperado, criterios de verificación,
criterios de fallo y evidencia BEFORE para que pueda ejecutarla un humano o una IA y verificarse sin reinterpretación.

**Fotografía factual vs. interpretación**: `00-before/` debe ser un espejo determinista del código — cero narrativa, cero interpretación de propósito de negocio. Cualquier síntesis en prosa (narrativa funcional/técnica de una Function o slice) es responsabilidad exclusiva de `analyze-function`, y debe derivarse únicamente de evidencia ya documentada en el propio `analysis.md`/BEFORE referenciado, nunca introducir un hecho no respaldado. Esta separación es lo que permite que `00-before/inventory.json` sea reproducible byte a byte entre ejecuciones, independientemente del ejecutor o del proyecto.

## Validación

No se agregan tests al código objetivo. La verificación utiliza evidencia determinista disponible:

* inventario pre/post;
* instalación de dependencias;
* typecheck cuando aplique;
* build global al finalizar la Function App;
* validaciones estructurales y de configuración;
* Azure Functions Host local cuando sea seguro y viable;
* comparación contra plan y target aprobados.

Consultar `_shared/references/validation-tooling.md` para patrones transferibles de `package.json`, `tsconfig`, Jest y Sonar. No agregar tooling ni tests por plantilla.

Tests existentes pueden ejecutarse como evidencia adicional, pero no se generan nuevos.

## Arquitectura

El código refactorizado debe converger incrementalmente hacia la arquitectura aprobada como policy transferible:

* adapters/composition roots Azure delgados;
* handlers testeables para traducir runtime/contrato;
* lógica organizada por capability, workflow o flujo observable;
* application/domain/infrastructure solo cuando tengan responsabilidad real;
* infraestructura aislada cuando exista un boundary real;
* shared resources con owner único;
* sin optimizar comportamiento descubierto;
* sin carpetas vacías ni abstracciones decorativas.

## Artifacts principales

```text
.migration/
├── 00-before/
│   ├── inventory.json
│   ├── current-state.md
│   ├── graph/project-graph.json|md
│   └── functions/<FunctionName>.md
├── 10-assessment/
│   └── assessment.json|md
├── 20-analysis/
│   ├── functions/<FunctionName>/analysis.json|md
│   └── slices/<SliceName>/analysis.json|md
├── 30-plan/
│   ├── migration-plan.json|md
│   ├── functions/<FunctionName>/migration-plan.json|md
│   └── resources/shared-resources.json|md
├── 40-execution/
│   ├── app/preparation.json|md
│   ├── dev-tasks/<ActionId>.md
│   ├── suggestions/<ActionId>.md
│   ├── checks/<Scope>.json|md
│   ├── reviews/<Scope>.json|md
│   ├── functions/<FunctionName>/preparation.json|md
│   ├── functions/<FunctionName>/programming-model-v4.json|md
│   ├── functions/<FunctionName>/scaffold.json|md
│   ├── functions/<FunctionName>/test-generation.json|md
│   ├── slices/<SliceName>/test-generation.json|md
│   └── workflows/<WorkflowName>/durable-v4.json|md
├── 50-verification/
│   └── verification.json|md
└── 90-lessons/
```

Crear solo artifacts aplicables. No generar archivos vacíos para satisfacer una estructura ideal.

Consultar `_shared/references/artifact-layout.md` para compatibilidad de lectura con paths legacy.

## Regla de trabajo

Una etapa puede detenerse con `BLOCKED` o `REQUIRES_REVIEW`. Nunca ocultar incertidumbre para forzar continuidad.
