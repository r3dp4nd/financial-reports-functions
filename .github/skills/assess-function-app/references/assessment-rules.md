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

## Modelo por dimensión

Separar cuando corresponda:

- `current`;
- `target`;
- `evidenceStatus`;
- `actionStatus`;
- rationale/evidence.

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
