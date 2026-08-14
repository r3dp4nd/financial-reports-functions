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

### Checklist de gap contra arquitectura objetivo (deuda técnica)

Evaluar el slice punto por punto contra `../_shared/references/target-architecture.md` y registrar cada gap detectado como necesidad de migración (ver `migration-needs.md`), clasificando `TECHNICAL_DEBT` cuando no bloquea el target aprobado o `STRUCTURAL` cuando sí es requerido por el scope de migración:

| Criterio (target-architecture.md) | Pregunta observable | Gap si... |
|---|---|---|
| Adapters/composition roots delgados | ¿El adapter en `src/functions/*.function.ts` solo registra trigger + composition root? | contiene lógica de negocio, validación profunda o transformación de datos |
| Handlers testeables | ¿El handler traduce runtime/contrato sin acoplarse al SDK directamente? | el SDK de Azure se instancia o se llama directo dentro del handler sin boundary |
| Organización por capability | ¿La lógica está agrupada por responsabilidad funcional observable? | existen carpetas genéricas tipo `services/`, `repositories/`, `utils/` sin ownership claro |
| Application/domain con responsabilidad real | ¿Existen `application/`/`domain/` porque coordinan reglas o representan invariantes? | son capas vacías, decorativas, o solo contienen tipos pasivos sin comportamiento |
| Infraestructura aislada con boundary real | ¿El acceso a Cosmos/Service Bus/Blob/etc. está detrás de un repository/publisher/storage adapter? | el SDK se usa directo dentro de application/domain sin adaptación |
| Shared resources con ownership único | ¿El recurso compartido tiene un owner y consumidores explícitos? | el candidato no tiene ownership definido (`ownership: null` en discovery) |

Cada fila con gap detectado se registra con `rationale`, `evidence` (ruta + fragmento observable) y `affected scope`, siguiendo el mismo formato que las demás `migrationNeeds`. No inventar gaps sin evidencia directa; si la evaluación es ambigua, marcarla `UNKNOWN` en vez de forzar una clasificación.

### Señales de deuda técnica de código (code smells)

Documentar exhaustivamente cualquier señal observable de código difícil de mantener o migrar con seguridad, incluso si no bloquea la migración técnica inmediata. Ocultar estas señales reduce el valor del analysis para planning.

| Señal | Cómo detectarla (evidencia observable) |
|---|---|
| Archivo/módulo grande | El archivo mezcla múltiples responsabilidades no relacionadas, o supera un tamaño que dificulta su lectura/mantenimiento; combinar con evidencia de mezcla de responsabilidades, no usar el tamaño como único criterio |
| Servicio/handler monolítico | Un `handler.ts`/`use-case.ts` que orquesta múltiples pasos no relacionados o conoce detalles de infraestructura, validación, lógica de negocio y formateo de respuesta a la vez |
| God function/method | Una función con múltiples responsabilidades, múltiples niveles de anidamiento, o múltiples motivos de cambio observables |
| Dependencias externas sin boundary | SDK de Azure u otra dependencia externa instanciada o invocada directo dentro de lógica de negocio, sin adapter/repository que la aísle |
| Duplicación de lógica | Mismo patrón/validación/mapeo repetido en varias Functions/slices de forma directamente observable, sin abstracción compartida |
| Acoplamiento a detalles de runtime | Lógica de negocio que depende de `context` de Azure Functions, tipos del SDK, o del request/response crudo más allá de lo necesario para el adapter |

Cada señal detectada se registra como `migrationNeeds` con `classification: TECHNICAL_DEBT` (o `STRUCTURAL` si bloquea el scope aprobado), `rationale`, `evidence` y `affected scope`. Esta sección existe para revelar exhaustivamente lo que anda mal en el código, ya que un plan de migración construido sobre evidencia incompleta no puede tomar decisiones informadas.

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
