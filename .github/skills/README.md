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
discover-function-app              (Graphify/indexer opcional dentro de discovery)
→ assess-function-app
→ analyze-function                  (por Function o slice cuando aplique)
→ plan-function-migration
→ prepare-function-app
→ prepare-function                  (por Function cuando aplique)
→ migrate-programming-model-v4      (solo si aplica)
→ migrate-durable-functions-v4      (solo si aplica)
→ verify-function-app
```

`review-skill-performance` mejora el toolkit y no forma parte del flujo obligatorio de migración.

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
| `discover-function-app`        | Inicio de la migración o nueva fotografía BEFORE.         | Repositorio; Graphify opcional. | `inventory.json` + `current-state.md`         |
| `assess-function-app`          | Después del discovery para medir gaps contra el target.   | Inventory + current state.     | `assessment.json\|md`                         |
| `analyze-function`             | Cuando una Function o slice necesita análisis específico. | Inventory + assessment.        | `functions/<name>/analysis.*` o `slices/<name>/analysis.*` |
| `plan-function-migration`      | Cuando assessment y análisis necesarios están completos.  | Evidencia BEFORE + analyses.   | Contrato/eval de ejecución por lanes, owner y Action IDs. |
| `prepare-function-app`         | Cuando existen acciones globales aprobadas.               | Plan global.                   | `repository/preparation.json\|md`             |
| `prepare-function`             | Cuando una Function necesita preparación local.           | Plan de la Function.           | `functions/<name>/preparation.json\|md`       |
| `migrate-programming-model-v4` | Function v3 con acción aprobada hacia v4.                 | Plan + preparation aplicable.  | `migration-programming-model.json\|md`        |
| `migrate-durable-functions-v4` | Workflow Durable con migración aprobada.                  | Planes de sus participantes.   | Evidencia de migración Durable.               |
| `verify-function-app`          | Cuando todas las acciones aplicables terminaron.          | Plan + artifacts de ejecución. | `verification.json\|md`                       |
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
Ejecuta verify-function-app contra el plan aprobado.
Ejecuta review-skill-performance sobre las lessons de esta migración.
```

### Reglas de ejecución

* `analyze-function` se ejecuta por Function o slice natural; `prepare-function` se ejecuta por Function solo cuando corresponda.
* `migrate-programming-model-v4` debe devolver `NOT_APPLICABLE` si la Function ya está en v4.
* `migrate-durable-functions-v4` trata el workflow como una unidad coherente.
* `prepare-function-app` ejecuta cambios globales una sola vez.
* `verify-function-app` ejecuta el build global después de completar todas las Functions aplicables.
* ningún skill debe ampliar el scope más allá del plan aprobado.
* `plan-function-migration` separa migración técnica de refactor/testabilidad y puede sugerir executor `HUMAN`, `AI_AGENT` o `EITHER`.

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
├── lessons-policy.md
├── dependency-baseline.json
└── references/
    └── official-sources.md
```

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

## Validación

No se agregan tests al código objetivo. La verificación utiliza evidencia determinista disponible:

* inventario pre/post;
* instalación de dependencias;
* typecheck cuando aplique;
* build global al finalizar la Function App;
* validaciones estructurales y de configuración;
* Azure Functions Host local cuando sea seguro y viable;
* comparación contra plan y target aprobados.

Tests existentes pueden ejecutarse como evidencia adicional, pero no se generan nuevos.

## Arquitectura

El código refactorizado debe converger incrementalmente hacia la arquitectura aprobada basada en
`financial-reports-functions`:

* adapters/composition roots Azure en `src/functions/`;
* lógica organizada por capability;
* infraestructura aislada cuando exista un boundary real;
* shared resources con owner único;
* sin carpetas vacías ni abstracciones decorativas.

## Artifacts principales

```text
.migration/
├── graph/
│   └── project-graph.json|md       (opcional si se usó Graphify/indexer)
├── repository/
│   ├── inventory.json
│   ├── assessment.json
│   └── preparation.json
├── catalog/
│   ├── current-state.md
│   └── functions/<FunctionName>.md
├── functions/<FunctionName>/
│   ├── analysis.json|md
│   ├── migration-plan.json|md
│   ├── preparation.json|md
│   └── migration*.json|md
├── slices/<SliceName>/
│   ├── analysis.json|md
│   └── migration-plan.json|md
├── plans/
│   └── migration-plan.json|md
├── resources/
│   └── shared-resources.json|md
├── verification/
│   └── verification.json|md
└── lessons/
```

Crear solo artifacts aplicables. No generar archivos vacíos para satisfacer una estructura ideal.

## Regla de trabajo

Una etapa puede detenerse con `BLOCKED` o `REQUIRES_REVIEW`. Nunca ocultar incertidumbre para forzar continuidad.
