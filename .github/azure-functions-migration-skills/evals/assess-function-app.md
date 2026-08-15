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
- `references/architecture/function-architecture.md`
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
- settings/env requeridos, solo por nombre;
- componentes compartidos;
- madurez estructural y de tests;
- alcance, fuera de alcance, riesgos, bloqueos, deuda e incógnitas.

## No debe

- modificar código o configuración;
- leer o copiar secretos;
- inventar comportamiento no sustentado;
- convertir el mapa de migración en workflow obligatorio.
