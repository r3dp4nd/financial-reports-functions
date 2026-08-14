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

## Slice

Identificar entrypoint y únicamente dependencias transitivas necesarias para explicar comportamiento o impacto técnico.

Si discovery/Graphify muestra un slice natural que cruza Functions, analizar ese slice completo cuando separarlo oculte riesgo, por ejemplo:

- workflow Durable;
- Outbox;
- shared resource con varios consumidores;
- capability con entrypoint y activities inseparables.

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
