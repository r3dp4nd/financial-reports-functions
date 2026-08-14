# Rubric de complejidad y deuda técnica

Referencia transversal: criterios verificables para clasificar criticidad, testabilidad, gaps de arquitectura y
code smells. La usan `analyze-function` (impacto de migración) y `document-function-app` (línea base de
documentación), evitando duplicar el mismo checklist en dos lugares.

## Criticidad

Clasificar como `HIGH`, `MEDIUM` o `LOW` usando evidencia observable, nunca por nombre o tamaño del archivo.

Señales de criticidad:

- trigger externo o event-driven con impacto downstream;
- persistencia o mutación de estado;
- publicación de mensajes/eventos;
- fan-out/fan-in, retries, compensación o failure path;
- recurso compartido usado por varios consumidores;
- dependencia de storage/reportes/outputs consumidos fuera del proceso.

Registrar siempre `rationale` y evidencia.

## Testabilidad

Clasificar como `GOOD`, `PARTIAL` o `POOR`.

Señales de baja testabilidad:

- lógica funcional mezclada con adapter/runtime Azure;
- SDK, config global, tiempo, random o I/O instanciado dentro de lógica;
- falta de boundary para repositorio/publisher/storage cuando el SDK domina el comportamiento;
- side effects difíciles de aislar;
- ausencia de tests relevantes solo como señal adicional, nunca como fallo automático por sí sola.

Registrar `testabilityBlockers` y `testabilityEnablers`.

## Checklist de gap contra arquitectura objetivo

Evaluar punto por punto contra [target-architecture.md](target-architecture.md) y clasificar cada gap detectado:

- `TECHNICAL_DEBT` cuando no bloquea el target aprobado;
- `STRUCTURAL` cuando sí es requerido por el scope de migración (solo aplica en contexto de `analyze-function`;
  `document-function-app` no asigna esta clasificación porque no planifica migración, solo documenta el gap).

| Criterio | Pregunta observable | Gap si... |
|---|---|---|
| Adapters/composition roots delgados | ¿El adapter en `src/functions/*.function.ts` (o el archivo equivalente en legacy `function.json`) solo registra trigger + composition root? | contiene lógica de negocio, validación profunda o transformación de datos |
| Handlers testeables | ¿El handler traduce runtime/contrato sin acoplarse al SDK directamente? | el SDK de Azure se instancia o se llama directo dentro del handler sin boundary |
| Organización por capability | ¿La lógica está agrupada por responsabilidad funcional observable? | existen carpetas genéricas tipo `services/`, `repositories/`, `utils/` sin ownership claro |
| Application/domain con responsabilidad real | ¿Existen `application/`/`domain/` porque coordinan reglas o representan invariantes? | son capas vacías, decorativas, o solo contienen tipos pasivos sin comportamiento |
| Infraestructura aislada con boundary real | ¿El acceso a Cosmos/Service Bus/Blob/etc. está detrás de un repository/publisher/storage adapter? | el SDK se usa directo dentro de application/domain sin adaptación |
| Shared resources con ownership único | ¿El recurso compartido tiene un owner y consumidores explícitos? | el candidato no tiene ownership definido (`ownership: null` en discovery) |

Cada fila con gap detectado se registra con `rationale`, `evidence` (ruta + fragmento observable) y `affected scope`.
No inventar gaps sin evidencia directa; si la evaluación es ambigua, marcarla `UNKNOWN`.

## Code smells (deuda técnica de código)

Documentar exhaustivamente cualquier señal observable, incluso si no bloquea nada inmediato. Ocultar estas señales
reduce el valor del documento (analysis o baseline de documentación) para quien decide después.

| Señal | Cómo detectarla (evidencia observable) |
|---|---|
| Archivo/módulo grande | El archivo mezcla múltiples responsabilidades no relacionadas, o supera un tamaño que dificulta su lectura/mantenimiento; combinar con evidencia de mezcla de responsabilidades, no usar el tamaño como único criterio |
| Servicio/handler monolítico | Un `handler.ts`/`use-case.ts`/`index.ts` legacy que orquesta múltiples pasos no relacionados o conoce detalles de infraestructura, validación, lógica de negocio y formateo de respuesta a la vez |
| God function/method | Una función con múltiples responsabilidades, múltiples niveles de anidamiento, o múltiples motivos de cambio observables |
| Dependencias externas sin boundary | SDK de Azure u otra dependencia externa instanciada o invocada directo dentro de lógica de negocio, sin adapter/repository que la aísle |
| Duplicación de lógica | Mismo patrón/validación/mapeo repetido en varias Functions/slices de forma directamente observable, sin abstracción compartida |
| Acoplamiento a detalles de runtime | Lógica de negocio que depende de `context` de Azure Functions, tipos del SDK, o del request/response crudo más allá de lo necesario para el adapter |

## Puntaje agregado de complejidad (para resúmenes ejecutivos)

Cuando se necesite un resumen compacto de "complejidad" a nivel Function o repo (por ejemplo en
`document-function-app`), derivar la etiqueta únicamente de señales ya registradas en esta rubric — nunca inventar
un número/score sin trazabilidad:

- **BAJA**: criticidad `LOW`/`MEDIUM`, testabilidad `GOOD`, sin code smells detectados, sin gaps `STRUCTURAL`.
- **MEDIA**: algunos code smells o gaps de arquitectura detectados, pero sin criticidad `HIGH` combinada con
  testabilidad `POOR` simultáneamente.
- **ALTA**: criticidad `HIGH` **y** testabilidad `POOR` combinadas, o 3+ code smells detectados en la misma
  Function/slice, o un god file (`largeFiles` de `inventory.json`) que además mezcla responsabilidades confirmadas.

Registrar siempre la combinación de señales que produjo la etiqueta, no solo la etiqueta final.
