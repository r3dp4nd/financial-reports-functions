# Reglas de análisis por Function

## Comportamiento observable

Documentar solo lo relevante para preservar durante la migración:

- trigger/input;
- validaciones y decisiones;
- persistencia;
- mensajería/storage;
- llamadas externas;
- side effects;
- output/error observable.

No reescribir la lógica como pseudocódigo exhaustivo.

### Contrato como evidencia comparable pre/post migración

El contrato observable (entrada, comportamiento, salida, efectos y errores) debe redactarse como un snapshot verificable, no como prosa libre, porque `verify-function-app` lo usa directamente para comparar AFTER contra BEFORE/PLAN sin reinterpretación.

Para cada Function/slice, registrar de forma explícita y verificable:

- **Entrada exacta**: forma del trigger (ej. shape del payload HTTP/mensaje/evento), parámetros, headers/campos relevantes, tipos esperados.
- **Salida exacta**: status codes, forma de la respuesta, mensajes publicados (topic/queue + shape), documentos persistidos (container + shape).
- **Efectos secundarios exactos**: qué se escribe, publica o muta, y bajo qué condición.
- **Errores observables**: qué errores/status/mensajes se producen ante qué condición, y si son recuperables.
- **Invariantes de comportamiento a preservar**: idempotencia, retries, ordering, concurrencia, fan-out/fan-in, compensación.

Si algún elemento del contrato no puede confirmarse con evidencia directa, registrarlo como `UNKNOWN` en vez de asumirlo; un contrato con gaps explícitos es más útil para verification que uno completo pero especulativo.

## Slice

Identificar entrypoint y únicamente dependencias transitivas necesarias para explicar comportamiento o impacto técnico.

Si discovery/Graphify muestra un slice natural que cruza Functions, analizar ese slice completo cuando separarlo oculte riesgo, por ejemplo:

- workflow Durable;
- Outbox;
- shared resource con varios consumidores;
- capability con entrypoint y activities inseparables.

### Resolver relaciones del slice: Graphify antes de leer código a ciegas

Antes de leer archivos adicionales para entender el slice transitivo, seguir este orden (ver
`../_shared/references/graphify-usage.md` para el detalle de modos y reglas de verificación cruzada):

1. Revisar si la relación ya está persistida y verificada en `.migration/00-before/graph/project-graph.json|md` o en
   el catálogo BEFORE de la Function (`.migration/00-before/functions/<FunctionName>.md`). Si ya existe con evidence
   status confiable, reusarla directamente en vez de repetir la consulta.
2. Si no existe o es insuficiente y hay grafo disponible, usar `explain` sobre el entrypoint y sus módulos internos
   conocidos (nombres ya presentes en `inventory.json`/BEFORE) para confirmar quién los consume y qué importan,
   antes de decidir qué archivos leer.
3. Usar `path` solo cuando se necesite confirmar la relación exacta entre dos nodos conocidos del slice (por ejemplo,
   starter → orchestrator → activity de un mismo workflow), verificando que todos los edges del camino sean de
   código y no de historial git.
4. Leer directamente el source de los archivos que la consulta señaló como relevantes, en vez de explorar el
   repositorio completo sin guía.

Toda relación citada de Graphify en `analysis.json`/`analysis.md` sigue la misma regla de verificación cruzada:
`INFERRED` por defecto, `CONFIRMED` solo tras leer el source real. Persistir las relaciones verificadas en el campo
`relationships` de `analysis.json` para que `plan-function-migration` y `migrate-durable-functions-v4` puedan
reusarlas sin volver a consultar Graphify.

## Configuración

Registrar nombres de claves y dónde se consumen. Nunca valores.

## Dependencias

Separar:

- package change requerido;
- adaptación de API/código;
- impacto compartido;
- compatibilidad incierta.

No escoger nuevas versiones fuera del baseline.

## Arquitectura

Para código que será refactorizado durante la migración, evaluar qué separación mínima permite converger a la arquitectura objetivo:

- adapter Azure en `src/functions/`;
- comportamiento por capability;
- boundary de infraestructura cuando sea real;
- ownership de shared resources.

No crear una necesidad estructural por estética.

### Checklist de gap contra arquitectura objetivo y code smells

Usar el checklist y las tablas de `../_shared/references/complexity-debt-rubric.md` (compartido con
`document-function-app` para no duplicar criterios). Registrar cada gap/code smell detectado como necesidad de
migración (ver `migration-needs.md`), clasificando `TECHNICAL_DEBT` cuando no bloquea el target aprobado o
`STRUCTURAL` cuando sí es requerido por el scope de migración, con `rationale`, `evidence` y `affected scope`. No
inventar gaps sin evidencia directa; si la evaluación es ambigua, marcarla `UNKNOWN` en vez de forzar una
clasificación.

Esta sección existe para revelar exhaustivamente lo que anda mal en el código, ya que un plan de migración
construido sobre evidencia incompleta no puede tomar decisiones informadas.

## Criticidad

Clasificar criticidad como `HIGH`, `MEDIUM` o `LOW` usando evidencia observable.

Señales de criticidad:

- trigger externo o event-driven con impacto downstream;
- persistencia o mutación de estado;
- publicación de mensajes/eventos;
- fan-out/fan-in, retries, compensación o failure path;
- recurso compartido usado por varios consumidores;
- dependencia de storage/reportes/outputs consumidos fuera del proceso.

Registrar rationale y evidencia. No clasificar como `HIGH` solo por nombre o tamaño.

## Testability

Clasificar testabilidad como `GOOD`, `PARTIAL` o `POOR`.

Señales de baja testabilidad:

- lógica funcional mezclada con adapter/runtime Azure;
- SDK, config global, tiempo, random o I/O instanciado dentro de lógica;
- falta de boundary para repositorio/publisher/storage cuando el SDK domina el comportamiento;
- side effects difíciles de aislar;
- ausencia de tests relevantes solo como señal, no como fallo automático.

Registrar `testabilityBlockers` y `testabilityEnablers`.

## Lane recomendado

Analysis puede recomendar lane para planning, sin crear acciones:

- `TECHNICAL_MIGRATION`: requerido para Node/runtime/model/dependency target;
- `REFACTOR_TESTABILITY`: mejora estructura/testabilidad sin bloquear target técnico inmediato;
- `BOTH`: el slice necesita migración técnica y refactor/testability coordinados;
- `NO_CHANGE`: no se identifican necesidades para el objetivo actual.

Planning decide acciones y orden.

## Node.js 24

Buscar incompatibilidades concretas del slice:

- APIs/runtime obsoletos;
- package incompatibility;
- TypeScript/tooling que impida build;
- comportamiento dependiente de versión.

## Programming Model

Determinar estado local real: V3, V4, MIXED o UNKNOWN.

Una Function ya V4 no necesita migración de modelo; sí puede requerir otros cambios del target.

## Durable

Registrar rol y relaciones con starter/orchestrator/activity/entity/sub-orchestrator. Si el workflow cruza el scope solicitado, registrar `affectedFunctionsOutsideScope`.

## Legacy

Describir el acoplamiento que afecta al slice. No usar tamaño del archivo como única evidencia de problema.
