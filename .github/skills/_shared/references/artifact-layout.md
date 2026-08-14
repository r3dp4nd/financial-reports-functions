# Migration Artifact Layout

Usar `.migration/` como contrato entre fases, no como espejo de nombres de skills.

Las nuevas ejecuciones deben escribir en el layout semántico. Las skills pueden leer paths legacy cuando existan para continuidad, pero no deben crear nuevos artifacts legacy.

## Layout semántico

```text
.migration/
├── 00-before/
│   ├── inventory.json
│   ├── current-state.md
│   ├── graph/
│   │   └── project-graph.json|md
│   └── functions/<FunctionName>.md
├── 10-assessment/
│   └── assessment.json|md
├── 20-analysis/
│   ├── functions/<FunctionName>/analysis.json|md
│   └── slices/<SliceName>/analysis.json|md
├── 30-plan/
│   ├── migration-plan.json|md
│   ├── functions/<FunctionName>/migration-plan.json|md
│   ├── slices/<SliceName>/migration-plan.json|md
│   └── resources/shared-resources.json|md
├── 40-execution/
│   ├── app/preparation.json|md
│   ├── functions/<FunctionName>/preparation.json|md
│   ├── functions/<FunctionName>/programming-model-v4.json|md
│   └── workflows/<WorkflowName>/durable-v4.json|md
├── 50-verification/
│   └── verification.json|md
└── 90-lessons/
```

## Fases

- `00-before`: hechos BEFORE y fotografía actual. No contiene decisiones de target ni acciones.
- `10-assessment`: triage global contra target aprobado. No contiene Action IDs.
- `20-analysis`: análisis profundo solo de Functions/slices priorizados.
- `30-plan`: contrato/eval de ejecución. Es la fuente de Action IDs.
- `40-execution`: resultados de ejecutar Action IDs aprobados.
- `50-verification`: cierre AFTER contra BEFORE/PLAN/EXECUTION.
- `90-lessons`: aprendizaje del toolkit, separado de artifacts operativos.

## Legacy read compatibility

Cuando existan artifacts previos, aceptar como entrada:

```text
.migration/repository/inventory.json        -> .migration/00-before/inventory.json
.migration/catalog/current-state.md         -> .migration/00-before/current-state.md
.migration/catalog/functions/<Function>.md  -> .migration/00-before/functions/<Function>.md
.migration/repository/assessment.json       -> .migration/10-assessment/assessment.json
.migration/functions/<Function>/*           -> .migration/20-analysis o .migration/40-execution según artifact
.migration/slices/<Slice>/*                 -> .migration/20-analysis o .migration/30-plan según artifact
.migration/plans/*                          -> .migration/30-plan/*
.migration/resources/*                      -> .migration/30-plan/resources/*
.migration/verification/*                   -> .migration/50-verification/*
.migration/lessons/*                        -> .migration/90-lessons/*
```

No copiar automáticamente legacy a nuevo layout salvo que una etapa vaya a reemitir el artifact como owner.

## Naming

Nombrar artifacts por su significado:

- `inventory`: hechos estructurados BEFORE;
- `current-state`: vista humana BEFORE;
- `assessment`: triage/gates globales;
- `analysis`: interpretación profunda de Function/slice;
- `migration-plan`: contrato/eval;
- `preparation`, `programming-model-v4`, `durable-v4`: resultado de ejecución por lane/stage;
- `verification`: cierre final.

No crear archivos vacíos para satisfacer la estructura.
