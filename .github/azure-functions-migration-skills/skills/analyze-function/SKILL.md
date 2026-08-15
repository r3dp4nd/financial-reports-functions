---
name: analyze-function
description: Analiza en profundidad una Azure Function concreta para reconstruir su comportamiento, dependencias, side effects, reglas observables y responsabilidades, y proponer una separación conceptual testeable. Usar antes de migrar o refactorizar una Function cuyo comportamiento todavía no esté suficientemente comprendido.
---

# Analyze Function

## Propósito

Comprender una Function antes de modificarla y producir una propuesta conceptual de desacoplamiento sustentada en el código existente.

Actúa como analista de comportamiento, dependencias y límites testeables.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

Si la Function tiene muchos imports o componentes relacionados, aplica `../../references/context/context-engineering.md` para leer por shortlist antes de profundizar.

## Entradas

- Function objetivo;
- assessment global disponible;
- módulos directamente relacionados;
- componentes compartidos consumidos por la Function;
- contratos y documentación relevantes.

## Trabajo

1. Identifica trigger, bindings, entrada, salida y configuración utilizada.
2. Reconstruye el flujo funcional observable.
3. Identifica reglas de negocio, side effects y manejo de errores.
4. Mapea dependencias internas y externas.
5. Inventaría variables de entorno y settings usados por la Function, solo por nombre.
6. Detecta responsabilidades mezcladas y acoplamiento al runtime/SDK.
7. Identifica componentes compartidos y sus consumidores conocidos.
8. Si la Function lee Cosmos/Mongo, identifica smells de query, filtros, paginación/cursor, mapeo y contrato de salida.
9. Si la Function genera documentos Excel/CSV, identifica smells de template, filtros, origen, destino y volumen esperado.
10. Si encuentra servicios monolíticos o god files, produce un mapa de slicing por capability antes de proponer movimientos.
11. Propone una separación conceptual mínima:
   - adapter/composition root Azure;
   - lógica de aplicación;
   - dominio cuando exista;
   - límites de infraestructura necesarios.
12. Define escenarios de comportamiento que deberían preservarse durante la transformación.
13. Declara incertidumbres que requieran evidencia adicional.

## No hacer

- No mover archivos.
- No crear capas.
- No migrar Programming Model.
- No refactorizar.
- No crear tests todavía salvo que el desarrollador lo solicite explícitamente como parte del análisis.

## Evidencia esperada

La salida debe permitir entender:

- qué hace la Function;
- qué depende de ella y de qué depende;
- qué comportamiento debe conservarse;
- qué settings y bindings debe preservar;
- qué parte es Azure, negocio e infraestructura;
- qué responsabilidades podrían separarse por capability;
- qué smells de persistencia/query bloquean testabilidad cuando existan;
- qué smells de generación de documentos bloquean testabilidad cuando existan;
- qué separación arquitectónica mínima tendría sentido.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y reutiliza el assessment global vigente como inventario inicial. Carga `../../references/evidence/artifact-contracts.md` solo si necesitas el contrato detallado de `analysis.md`.

## Finalización

Termina cuando el comportamiento y los límites conceptuales están suficientemente claros para ejecutar una transformación sin depender de suposiciones relevantes.

## Referencias

Carga según lo observado:

- `../../references/context/context-engineering.md`: cuando necesites controlar lectura incremental de handler, imports, tests y componentes compartidos.
- `../../references/azure-functions/bindings-v4.md`: para inventariar con precisión trigger/bindings que luego deberán preservarse.
- `../../references/configuration/environment-and-bindings.md`: settings usados por bindings, código y configuración.
- `../../references/architecture/function-architecture.md`: para proponer separación conceptual mínima.
- `../../references/architecture/naming-and-coverage.md`: solo si propones nombres, exclusiones o puntos de testabilidad por convención.
- `../../references/architecture/di-and-composition.md`: solo si propones puertos, factories o composición.
- `../../references/architecture/capability-slicing.md`: solo si detecta servicios monolíticos, god files o responsabilidades mezcladas entre capabilities.
- `../../references/infrastructure/exceljs-document-generation.md`: solo si detecta ExcelJS, streams o templates de reporte.
- `../../references/infrastructure/cosmos-mongo-persistence.md`: solo si detecta Cosmos DB, MongoDB, query iterators, cursors o mapeo de documentos.
- `../../references/azure-functions/durable-v4.md`: únicamente si se detecta Durable Functions.
- `../../references/evidence/migration-artifacts.md`: reglas ligeras de evidencia reutilizable bajo `.migration/`.
- `../../references/evidence/artifact-contracts.md`: solo cuando necesites detalle completo del artefacto.
