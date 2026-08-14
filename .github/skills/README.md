# Azure Functions Migration Skills

Toolkit de skills para migrar Azure Function Apps Node.js hacia el target técnico aprobado con cambios controlados, evidencia reproducible y ejecución manual desde GitHub Copilot Chat.

## Principios

- menos es más;
- progressive disclosure;
- no leer secretos ni CI/CD sin sanitización;
- preservar lógica de negocio;
- no generar tests en el repositorio objetivo;
- migrar solo lo necesario, pero completar el target aprobado;
- arquitectura objetivo incremental para el código refactorizado;
- una sola fuente de verdad por dato;
- artifacts Markdown para humanos y JSON para agentes;
- lessons no modifican automáticamente el toolkit.

## Target actual

El baseline aprobado contempla como objetivo de plataforma:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4 cuando aplique;
- dependencias según `_shared/dependency-baseline.json`.

No usar `latest` como sustituto del baseline.

## Flujo

```text
discover-function-app
→ assess-function-app
→ analyze-function                  (por Function)
→ plan-function-migration
→ prepare-function-app
→ prepare-function                  (por Function cuando aplique)
→ migrate-programming-model-v4      (solo si aplica)
→ migrate-durable-functions-v4      (solo si aplica)
→ verify-function-app
```

`review-skill-performance` es una capability de mejora del toolkit y no forma parte del camino obligatorio de migración.

## Skills

| Skill | Responsabilidad |
|---|---|
| `discover-function-app` | Fotografiar el estado actual de forma segura y determinista. |
| `assess-function-app` | Medir el gap global frente al target aprobado. |
| `analyze-function` | Entender impacto y comportamiento de una Function concreta. |
| `plan-function-migration` | Convertir necesidades en acciones globales, shared y por Function. |
| `prepare-function-app` | Ejecutar preparación global aprobada. |
| `prepare-function` | Preparar el slice local y la arquitectura necesaria antes de migrar. |
| `migrate-programming-model-v4` | Migrar una Function al Programming Model v4. |
| `migrate-durable-functions-v4` | Migrar un workflow Durable como unidad coherente. |
| `verify-function-app` | Ejecutar gates finales y cerrar la migración. |
| `review-skill-performance` | Analizar lessons/evals y proponer mejoras sin autoaplicarlas. |

## Progressive disclosure

Cada `SKILL.md` contiene únicamente:

- objetivo;
- precondiciones;
- entradas;
- workflow;
- salidas;
- criterios de cierre;
- referencias que deben cargarse solo cuando correspondan.

Los detalles viven en `references/` de cada skill o en `_shared/` cuando son políticas transversales.

## Políticas compartidas

- `_shared/security-policy.md`
- `_shared/evidence-policy.md`
- `_shared/status-policy.md`
- `_shared/architecture-policy.md`
- `_shared/lessons-policy.md`
- `_shared/dependency-baseline.json`
- `_shared/references/official-sources.md`

## Seguridad

La política de seguridad se aplica antes de cualquier lectura. `.env*`, `local.settings.json`, certificados, archivos de secretos y CI/CD no se leen directamente.

## Evidencia

Separar siempre:

```text
BEFORE → PLAN → EXECUTION → AFTER
```

Los artifacts de `.migration/` son contratos entre etapas; una etapa posterior consume el artifact del owner en lugar de reconstruirlo.

## Validación

No se agregan tests al código objetivo. La verificación usa evidencia determinista disponible, principalmente:

- inventario pre/post;
- instalación de dependencias;
- typecheck cuando aplique;
- build global al finalizar la Function App;
- validaciones estructurales y de configuración;
- Azure Functions Host local cuando sea seguro y viable;
- comparación contra acciones y target aprobados.

Si el repositorio ya trae tests relevantes, pueden ejecutarse como evidencia adicional, pero no son requisito ni se generan nuevos.

## Arquitectura

El código refactorizado durante la migración debe converger incrementalmente hacia la arquitectura aprobada basada en `financial-reports-functions`:

- adapters/composition roots Azure en `src/functions/`;
- lógica por capability;
- infraestructura aislada solo cuando existe un boundary real;
- shared resources con owner único;
- sin carpetas vacías ni abstracciones decorativas.

## Artifacts principales

```text
.migration/
├── repository/
│   ├── inventory.json
│   ├── assessment.json
│   └── assessment.md
├── catalog/
│   ├── current-state.md
│   └── functions/<FunctionName>.md
├── functions/<FunctionName>/
│   ├── analysis.json
│   ├── analysis.md
│   ├── migration-plan.json
│   ├── migration-plan.md
│   ├── preparation.json
│   ├── preparation.md
│   └── migration*.json|md
├── plans/
│   ├── migration-plan.json
│   └── migration-plan.md
├── resources/
│   └── shared-resources.json|md
├── verification/
│   └── verification.json|md
└── lessons/
```

Crear solo artifacts aplicables. No generar archivos vacíos para satisfacer una forma ideal.

## Regla de trabajo

Una etapa puede detenerse con `BLOCKED` o `REQUIRES_REVIEW`. Nunca ocultar incertidumbre para forzar continuidad.
