# Eval: migrate-shared-component

## Escenario

Repositorio con varios consumidores de un cliente, repositorio, mapper, servicio, configuración o wrapper de SDK compartido.

## Prompt

```text
Usa migrate-shared-component para migrar este componente compartido identificando consumidores, contrato, settings y verificaciones.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/context/context-engineering.md` si necesita descubrir consumidores o contrato publico
- `references/dependencies/dependency-strategy.md` cuando cambie SDK/dependencia
- `references/dependencies/azure-sdk-js.md` cuando cambie un SDK Azure detectado
- `references/dependencies/runtime-baseline.md` si sugiere versiones runtime concretas
- `references/architecture/function-architecture.md`
- `references/architecture/naming-and-coverage.md` si aplica naming o estructura testeable
- `references/architecture/di-and-composition.md` si crea puertos, factories o composición compartida
- `references/architecture/capability-slicing.md` si el componente mezcla varias capabilities
- `references/infrastructure/exceljs-document-generation.md` si el componente genera Excel/CSV
- `references/infrastructure/cosmos-mongo-persistence.md` si el componente accede a Cosmos/Mongo
- `references/configuration/environment-and-bindings.md`
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`
- `references/evidence/artifact-contracts.md` solo si necesita detalle completo del componente

## Debe producir

`.migration/shared-components/<component-name>.md` o salida equivalente con:

- consumidores;
- contrato preservado;
- mapa de responsabilidades por capability cuando aplique;
- contrato de template/documento si genera Excel/CSV;
- contrato de query/cursor si accede a Cosmos/Mongo;
- settings compartidos, solo por nombre;
- versión objetivo de SDK Azure, fuente oficial y breaking changes si aplica;
- impacto por consumidor;
- validaciones realizadas;
- deuda o riesgos que no deban resolverse dentro del cambio compartido.

## No debe

- cambiar contrato público sin evidencia y aprobación;
- migrar consumidores no relacionados;
- leer secretos;
- abrir todos los consumidores completos antes de identificar contrato e impacto;
- crear una abstracción compartida nueva si no existe uso productivo inmediato;
- ocultar impacto transversal dentro de una Function individual.
