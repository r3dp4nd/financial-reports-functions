# Reglas de assessment

## Target

Consumir el target desde `_shared/dependency-baseline.json` y decisiones aprobadas del toolkit.

Evaluar como mínimo:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions cuando exista;
- dependencias;
- TypeScript/tooling cuando afecte compatibilidad;
- capacidad global de validación;
- condiciones estructurales transversales;
- shared resources.

## Rol en el flujo

Assessment debe funcionar como gate entre discovery y analysis/planning.

Debe responder:

- si se puede avanzar a `analyze-function`;
- qué no bloquea analysis pero debe validarse antes de verification;
- qué requiere revisión humana antes de planning o ejecución;
- qué dependencias o recursos necesitan análisis coordinado.

No repetir el inventario salvo como evidencia resumida.

## Modelo por dimensión

Separar cuando corresponda:

- `current`;
- `target`;
- `evidenceStatus`;
- `actionStatus`;
- rationale/evidence.

## Decision y gates

Incluir una decisión compacta:

- `proceedToAnalysis`: boolean;
- `proceedToPlanning`: boolean o `requiresAnalysisFirst`;
- `blockingIssues`: problemas que impiden continuar;
- `reviewBeforePlanning`: decisiones humanas necesarias antes de planificar;
- `reviewBeforeExecution`: decisiones humanas necesarias antes de ejecutar cambios;
- `validationBeforeVerification`: confirmaciones requeridas antes de cierre final.

Un runtime `INFERRED` por extension bundle normalmente no bloquea analysis, pero sí debe aparecer en `validationBeforeVerification`.

Un package Azure relevante sin target aprobado normalmente no bloquea analysis, pero debe aparecer en `reviewBeforePlanning` o `reviewBeforeExecution` según el flujo local.

## Programming Model

- V4 confirmado y compatible → no planificar migración de modelo;
- V3 confirmado → requiere análisis/migración cuando el target sea v4;
- MIXED/UNKNOWN → requiere validación o análisis antes de ejecutar cambios.

## Azure Functions Runtime

- `FUNCTIONS_EXTENSION_VERSION` o metadata equivalente de entorno seguro puede confirmar runtime;
- `host.json` `extensionBundle.version` `[4.*, 5.0.0)` permite inferir runtime v4, pero no confirmarlo;
- runtime inferido por extension bundle debe quedar `INFERRED` y `REQUIRES_VALIDATION`.

## Durable

Durable presente puede ampliar el effective scope porque starter, orchestrator, activities, entities y sub-orchestrators pueden formar una unidad coherente.

Assessment no define todavía esa topología final.

## Validación global

Registrar qué evidencia será viable sin crear tests nuevos:

- install;
- typecheck;
- build;
- start del host local cuando sea seguro;
- validaciones estructurales/configuration;
- tests existentes solo si ya están disponibles y son relevantes.

La ausencia de tests no bloquea por sí sola.

## Shared resources

Identificar recursos que requieren análisis coordinado. No crear acciones todavía.

## Functions que requieren analysis

No listar todas con la misma urgencia si no agrega señal.

Agrupar por prioridad:

- `HIGH`: workflow Durable, shared resources transversales, triggers con efectos externos o coordinación;
- `NORMAL`: entrypoints o activities con dependencia directa pero scope local;
- `LOW`: Functions ya claras cuya revisión puede ser ligera;
- `NOT_REQUIRED`: solo si no necesitan análisis posterior para el objetivo.

Si todas requieren analysis por política del flujo, explicitar el motivo global y aun así priorizar.

## Dependency attention

Agrupar dependencias por atención:

- `REVIEW_OR_BLOCKING`: faltan targets aprobados, contradicciones o decisiones humanas;
- `IMPACT_ANALYSIS`: baseline aprobado pero uso transversal o API relevante;
- `VALIDATION_TOOLING`: herramientas necesarias para comprobar build/typecheck/tests;
- `INFORMATIONAL`: dependencias presentes sin impacto migratorio esperado.

El markdown debe mostrar principalmente los grupos con atención real; el JSON puede conservar detalle completo si es útil.
