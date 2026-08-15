# Eval: assess-function-app

## Escenario

Repositorio Azure Functions Node.js/TypeScript legacy o parcialmente migrado. Puede contener `package.json`, `host.json`, `tsconfig*`, `jest.config.*`, `sonar-project.properties`, `function.json`, registros v4, handlers, Durable Functions, SDK clients y plantillas sanitizadas de configuración.

## Prompt

```text
Usa assess-function-app para analizar esta Function App y generar un assessment inicial bajo .migration/.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/azure-functions/platform-target.md`
- `references/azure-functions/programming-model-v4.md`
- `references/azure-functions/bindings-v4.md`
- `references/dependencies/dependency-strategy.md`
- `references/dependencies/azure-sdk-js.md` si detecta SDKs Azure o SDKs Azure legacy
- `references/architecture/function-architecture.md`
- `references/architecture/capability-slicing.md` si detecta servicios monolíticos, god files o responsabilidades mezcladas
- `references/infrastructure/exceljs-document-generation.md` si detecta ExcelJS, streams o templates de reporte
- `references/infrastructure/cosmos-mongo-persistence.md` si detecta Cosmos DB, MongoDB, queries o cursors
- `references/configuration/environment-and-bindings.md`
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`
- `references/azure-functions/durable-v4.md` solo si detecta Durable Functions

## Debe producir

`.migration/app-assessment.md` o salida equivalente con:

- propósito observable del repo;
- archivos globales revisados y evidencia aportada;
- runtime, Node.js, Programming Model, TypeScript y tooling;
- inventario de Functions, triggers y bindings;
- mapa textual o diagrama simple de ejecución;
- orden observable entre triggers, handlers, orchestrators, activities, outputs y eventos;
- inventario de dependencias con uso, consumidores y acción sugerida;
- sugerencia de versión para SDKs Azure y runtime dependencies detectadas, con fuente oficial y razón;
- servicios monolíticos o god files con capabilities candidatas cuando existan;
- generación de documentos Excel/CSV y templates cuando existan;
- persistencia Cosmos/Mongo, queries, paginación y riesgos cuando existan;
- settings/env requeridos, solo por nombre;
- componentes compartidos;
- madurez estructural y de tests;
- alcance, fuera de alcance, riesgos, bloqueos, deuda e incógnitas.

## No debe

- modificar código o configuración;
- leer o copiar secretos;
- inventar comportamiento no sustentado;
- convertir el mapa de migración en workflow obligatorio.
