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
