---
name: migrate-shared-component
description: Migra o refactoriza un componente compartido por varias Azure Functions, coordinando consumidores, contrato, dependencias y compatibilidad. Usar cuando un cliente, repositorio, servicio, configuración o módulo transversal no puede tratarse como propiedad exclusiva de una Function.
---

# Migrate Shared Component

## Propósito

Transformar componentes compartidos sin introducir cambios contradictorios, duplicados o parciales entre Functions consumidoras.

Actúa como coordinador de contratos compartidos, consumidores e impacto transversal.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

Si los consumidores no estan claros, aplica `../../references/context/context-engineering.md` antes de abrir implementaciones completas.

## Entradas

- componente compartido objetivo;
- consumidores conocidos;
- assessment global;
- análisis de Functions afectadas cuando exista;
- contrato observable del componente.

## Trabajo

1. Identifica todos los consumidores razonablemente detectables.
2. Determina qué contrato debe preservarse.
3. Si el componente es monolítico o mezcla capabilities, produce un mapa de slicing antes de separar.
4. Clasifica responsabilidades del componente:
   - aplicación/negocio;
   - infraestructura;
   - configuración;
   - mapping;
   - utilidades.
5. Identifica settings compartidos, solo por nombre, y su contrato de uso.
6. Separa migración técnica de refactor arquitectónico cuando sea viable.
7. Actualiza SDKs o APIs únicamente cuando la migración del componente lo requiera.
8. Diseña el cambio para que los consumidores converjan sobre una sola decisión coherente.
9. Evita duplicar adapters, clientes o repositorios equivalentes por Function sin necesidad.
10. Comprueba consumidores afectados de forma proporcional al cambio.

## No hacer

- No asumir que el primer consumidor encontrado es el único.
- No cambiar el contrato compartido sin analizar impacto.
- No duplicar implementación para evitar comprender dependencias.
- No introducir un módulo `shared` genérico como destino automático de cualquier código reutilizado.

## Evidencia esperada

Registra:

- consumidores;
- contrato preservado o cambio explícito;
- settings compartidos preservados, solo por nombre;
- dependencias actualizadas;
- responsabilidades separadas;
- impacto y verificaciones por consumidor.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y reutiliza análisis de Functions consumidoras cuando estén vigentes. Carga `../../references/evidence/artifact-contracts.md` solo si necesitas el contrato detallado de `shared-components/<name>.md`.

## Finalización

Termina cuando el componente compartido tiene un estado coherente para todos sus consumidores conocidos y el cambio no depende de refactors duplicados por Function.

## Referencias

- `../../references/context/context-engineering.md`: cuando necesites descubrir consumidores, contrato publico y contexto minimo del componente.
- `../../references/dependencies/dependency-strategy.md`: cuando el componente encapsula un SDK o dependencia que debe actualizarse.
- `../../references/dependencies/azure-sdk-js.md`: cuando el componente encapsula un SDK Azure o SDK Azure legacy.
- `../../references/dependencies/runtime-baseline.md`: solo si vas a sugerir versiones runtime concretas.
- `../../references/architecture/function-architecture.md`: para preservar límites coherentes entre consumidores e infraestructura.
- `../../references/architecture/naming-and-coverage.md`: cuando apliques naming o estructura testeable.
- `../../references/architecture/di-and-composition.md`: cuando crees puertos, factories o composición compartida.
- `../../references/architecture/capability-slicing.md`: cuando el componente sea monolítico o mezcle responsabilidades de varias capabilities.
- `../../references/infrastructure/exceljs-document-generation.md`: cuando el componente compartido genere Excel/CSV o use templates de documento.
- `../../references/infrastructure/cosmos-mongo-persistence.md`: cuando el componente compartido acceda a Cosmos/Mongo o encapsule queries/cursors.
- `../../references/configuration/environment-and-bindings.md`: configuración compartida y settings transversales.
- `../../references/planning/migration-scope-and-debt.md`: límites de cambio y deuda futura.
- `../../references/evidence/migration-artifacts.md`: reglas ligeras de evidencia reutilizable bajo `.migration/`.
- `../../references/evidence/artifact-contracts.md`: solo cuando necesites detalle completo del artefacto.
