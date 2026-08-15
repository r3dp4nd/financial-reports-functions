---
name: assess-function-app
description: Analiza una Azure Function App legacy para comprender qué hace, inventariar Functions, triggers, bindings, runtimes, dependencias, componentes compartidos y brechas hacia el objetivo de migración. Usar antes de realizar cambios globales o cuando se necesite actualizar la fotografía técnica de la aplicación.
---

# Assess Function App

## Propósito

Construir una fotografía técnica y funcional del estado actual de la Function App sin modificar el repositorio.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Entradas

Usa únicamente evidencia necesaria del repositorio:

- `package.json`;
- lockfile npm cuando exista;
- `host.json`;
- configuración de TypeScript y testing no sensible;
- configuración de Jest, coverage, Sonar y scripts;
- configuración local o plantillas sanitizadas cuando existan;
- código fuente de Functions;
- definición de triggers y bindings;
- dependencias importadas;
- componentes compartidos;
- documentación técnica existente cuando sea relevante.

Respeta las exclusiones de archivos sensibles definidas por el entorno o proyecto.

## Trabajo

1. Identifica el propósito observable de la Function App.
2. Registra qué archivos globales no sensibles fueron revisados y qué evidencia aportan.
3. Detecta Functions y sus relaciones.
4. Registra triggers, bindings y recursos externos.
5. Reconstruye el orden de ejecución observable entre triggers, handlers, orchestrators, activities, outputs y eventos.
6. Produce un mapa textual o diagrama simple de Functions y dependencias principales.
7. Determina versiones observables de Node.js, Azure Functions Runtime, Programming Model, TypeScript y paquetes relevantes.
8. Clasifica dependencias según impacto esperado: mantener, actualizar, reemplazar, eliminar o investigar.
9. Si detecta SDKs Azure, sugiere versión objetivo solo con fuente oficial vigente y razón.
10. Inventaría variables de entorno y settings usados por código, bindings y configuración, solo por nombre.
11. Identifica servicios, clientes, repositorios y configuración compartidos.
12. Detecta servicios monolíticos, god files o módulos compartidos que requieran slicing por capability.
13. Evalúa madurez observable de estructura, separación de responsabilidades, dependency injection, testing y calidad.
14. Define qué entra en el alcance de migración y qué debe quedar fuera.
15. Describe la arquitectura observable sin imponer todavía la arquitectura objetivo.
16. Identifica brechas, riesgos, deuda relevante y desconocidos.
17. Propone un mapa de migración de alto nivel sin convertirlo en un workflow obligatorio.

## No hacer

- No modificar código ni configuración.
- No refactorizar.
- No actualizar dependencias.
- No inventar comportamiento que no pueda sustentarse.
- No leer secretos ni archivos excluidos por la política del proyecto.

## Evidencia esperada

Produce una visión que permita responder:

- qué hace la aplicación;
- qué archivos globales sustentan el diagnóstico;
- qué contiene;
- qué comparte;
- cómo se relacionan y ejecutan sus Functions;
- qué debe cambiar;
- qué entra y qué queda fuera del alcance de migración;
- qué variables/settings requiere;
- qué requiere investigación;
- qué riesgos condicionan la migración.

Cuando exista una convención de evidencia, conserva el resultado bajo `.migration/` sin convertir esa carpeta en un motor de estado. Usa `../../references/evidence/migration-artifacts.md`; carga `../../references/evidence/artifact-contracts.md` solo si necesitas el contrato detallado de `app-assessment.md`.

## Finalización

Termina cuando existe información suficiente para que el desarrollador pueda decidir qué preparar, qué Function analizar en profundidad y qué componentes compartidos requieren atención.

## Referencias

Carga solo las necesarias para el caso:

- `../../references/azure-functions/platform-target.md`: compatibilidad Runtime v4, Node.js 24 y hosting.
- `../../references/azure-functions/programming-model-v4.md`: identificación y brechas del modelo.
- `../../references/azure-functions/bindings-v4.md`: inventario de triggers, bindings y equivalencia futura.
- `../../references/dependencies/dependency-strategy.md`: clasificación de dependencias.
- `../../references/dependencies/azure-sdk-js.md`: solo si detecta paquetes Azure SDK o SDKs Azure legacy.
- `../../references/dependencies/runtime-baseline.md`: solo si vas a sugerir versiones concretas para `package.json`.
- `../../references/architecture/function-architecture.md`: madurez estructural y separación observable.
- `../../references/architecture/naming-and-coverage.md`: solo si evalúas naming, cobertura o exclusiones por convención.
- `../../references/architecture/di-and-composition.md`: solo si evalúas DI, composition roots o creación/reuso de clientes.
- `../../references/architecture/capability-slicing.md`: solo si detecta servicios monolíticos, god files o responsabilidades mezcladas entre capabilities.
- `../../references/infrastructure/exceljs-document-generation.md`: solo si detecta ExcelJS, generación de documentos, streams o templates de reporte.
- `../../references/infrastructure/cosmos-mongo-persistence.md`: solo si detecta Cosmos DB, MongoDB, queries, cursors o persistencia compartida.
- `../../references/configuration/environment-and-bindings.md`: inventario de settings, bindings y configuración.
- `../../references/planning/migration-scope-and-debt.md`: alcance, fuera de alcance y deuda futura.
- `../../references/evidence/migration-artifacts.md`: reglas ligeras de evidencia reutilizable bajo `.migration/`.
- `../../references/evidence/artifact-contracts.md`: solo cuando necesites detalle completo del artefacto.
