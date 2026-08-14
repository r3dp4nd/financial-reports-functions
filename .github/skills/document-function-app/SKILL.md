---
name: document-function-app
description: Documenta una Azure Function App completa (legacy o moderna, con buena o mala estructura) como línea base reutilizable ante cualquier cambio futuro. Úsalo cuando se necesite un documento de referencia estándar de arquitectura, Functions, dependencias, configuración y deuda técnica, independiente de si se va a migrar; no planifica ni ejecuta cambios.
---

# Document Function App

## Objetivo

Producir documentación profesional y reutilizable de una Function App completa como *baseline* estable: sirve para
onboarding, auditoría, decisiones de arquitectura futuras o como punto de partida de cualquier iniciativa (migración,
refactor, nueva feature), sin asumir que habrá un cambio inminente.

A diferencia de `discover-function-app` (que produce evidencia BEFORE optimizada para alimentar un flujo de
migración) y `analyze-function` (que produce impacto de migración por Function/slice), este skill produce un
**documento de referencia legible por humanos** que resume arquitectura, complejidad y deuda técnica de toda la
Function App, aplicable igual a código legacy (`function.json`) o moderno (Programming Model v4), y a repositorios
con buena o mala estructura.

## Reuso obligatorio — no reimplementar lo que ya existe

Este skill **no vuelve a escanear el repositorio desde cero** si ya existe evidencia vigente:

1. Si `.migration/00-before/inventory.json` existe y sigue vigente contra el commit/árbol de archivos actual,
   reusarlo como fuente primaria de hechos deterministas (Functions, triggers, dependencias, `largeFiles`,
   `initialSignals`, `configurationKeys`, `ciCdProviders`, `directoryTree`).
2. Si no existe o no está vigente, ejecutar `../discover-function-app/scripts/inventory.js <repository-root>` (el
   mismo script, sin duplicarlo) para generarlo.
3. Si existen `.migration/20-analysis/**/analysis.json|md` para alguna Function/slice, reusar su `criticality`,
   `testability`, `migrationNeeds` de tipo `TECHNICAL_DEBT`/`STRUCTURAL` y `relationships` en vez de re-derivarlos.
4. Si existe `.migration/00-before/graph/project-graph.json|md`, reusarlo para relaciones/slices en vez de indexar
   de nuevo.

## Políticas

Aplicar:

- `../_shared/security-policy.md`
- `../_shared/evidence-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`

Consultar:

- `../_shared/architecture-policy.md` como vocabulario para describir estructura observable;
- `../_shared/references/target-architecture.md` para comparar contra el patrón objetivo;
- `../_shared/references/complexity-debt-rubric.md` para clasificar criticidad, testabilidad, gaps de arquitectura
  y code smells de forma consistente con `analyze-function`;
- `../_shared/references/official-sources.md` para citar requisitos oficiales de plataforma cuando el repo sea
  legacy (v3/runtime v2-v3) y exista un riesgo de soporte que valga la pena documentar;
- `../_shared/references/graphify-usage.md` y `../_shared/context-cache-policy.md` para evitar releer archivos o
  repetir consultas ya resueltas por una ejecución previa de discovery/analyze.

## Entrada

- raíz del repositorio objetivo.
- Opcional: alcance acotado (una Function/slice) si el usuario solo pide documentar una parte; por defecto, la
  Function App completa.

## Workflow

El workflow es deliberadamente **incremental y con escritura temprana a disco**, no "explorar todo y escribir al
final". Una Function App con varias Functions/god files puede requerir muchas lecturas; retener todo el análisis en
memoria hasta el cierre arriesga perder trabajo ya hecho si la ejecución se interrumpe.

1. Aplicar políticas de seguridad antes de inspeccionar el repositorio.
2. Resolver evidencia BEFORE: reusar `inventory.json`/`project-graph` vigentes o generarlos (ver "Reuso obligatorio").
3. Priorizar el orden de documentación por criticidad/complejidad observable (Functions con god files asociados,
   rol central en un workflow Durable, o criticidad `HIGH` primero), no por orden alfabético ni de descubrimiento.
4. **Por cada Function/slice, en el orden priorizado, ejecutar el ciclo completo antes de pasar a la siguiente**:
   a. Determinar si ya existe `analysis.json|md`; si existe, reusar su clasificación de criticidad/testabilidad/gaps;
      si no existe, clasificarla con `../_shared/references/complexity-debt-rubric.md` directamente para este
      documento (sin generar un `analysis.json` de migración — ese artifact pertenece a `analyze-function`).
   b. Documentar su contrato observable, dependencias, configuración y rol en workflows Durable u Outbox, aplicando
      el mismo nivel de detalle a legacy y moderno.
   c. **Escribir inmediatamente `documentation/functions/<FunctionName>.md`** (cuando el detalle lo justifique) antes
      de continuar con la siguiente Function/slice — no acumular varios análisis en memoria antes de la primera
      escritura.
   d. Actualizar `task_progress` marcando esa Function como completada (hito concreto, no solo "documentando…"), de
      forma que una interrupción permita reanudar exactamente desde la Function que falta, sin releer lo ya escrito.
5. Documentar arquitectura observable a nivel repositorio: organización de carpetas, adapters, capas, acoplamientos,
   diagramas (reusar los de `current-state.md` si ya existen y siguen vigentes).
6. Calcular el resumen de complejidad y deuda técnica agregado a nivel repo (ver
   `references/documentation-rules.md`), citando la combinación de señales que lo produjo, apoyándose en los
   `documentation/functions/*.md` ya persistidos en el paso 4 en vez de re-derivar el análisis desde memoria.
7. Escribir `documentation/repository.md` **al final**, como documento consolidado que referencia los archivos
   por-Function ya escritos y resume el resto (Functions sin archivo dedicado) como filas de tabla.
8. Cerrar con el reporte final solo después de que todos los artifacts ya estén persistidos en disco.

Cargar según necesidad:

- `references/documentation-rules.md`
- `references/artifacts.md`

## Salidas

- `documentation/repository.md` — documento de referencia de la Function App completa.
- `documentation/functions/<FunctionName>.md` — uno por Function/slice, cuando el detalle lo justifique.

Estas salidas viven en `documentation/` **en la raíz del repositorio objetivo**, no dentro de `.migration/`. Son dos
naturalezas de evidencia distintas: `.migration/` es evidencia de una ejecución de migración (descartable, ignorada
por git) mientras que `documentation/` es una línea base pensada para commitearse y compartirse con el equipo, igual
que un README profesional. No agregar `documentation/` a `.gitignore`.

## Cierre

Terminar cuando:

- toda Function/slice observable quedó documentada con el mismo nivel de detalle, sea legacy o moderna;
- la arquitectura observable, dependencias y configuración quedaron registradas con evidence status;
- el resumen de complejidad y deuda técnica está trazado a señales concretas, no a una impresión subjetiva;
- riesgos/unknowns quedaron explícitos.

## No hacer

- leer archivos protegidos;
- generar Action IDs ni migration plan;
- modificar código;
- generar tests;
- asumir que este documento sustituye `analyze-function` cuando el objetivo real sea planificar una migración
  (en ese caso, usar el flujo `discover-function-app` → `assess-function-app` → `analyze-function` completo).
