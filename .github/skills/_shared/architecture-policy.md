# Architecture Policy

## Objetivo

Definir los principios arquitectónicos que deben respetar los cambios estructurales realizados durante la migración.

Cuando una separación estructural sea necesaria, debe procurar que futuras migraciones de runtime, SDK o Programming
Model afecten principalmente adapters y configuración, preservando la mayor parte del comportamiento funcional.

## Migración y modernización

La migración técnica no exige transformar toda la Function App hacia una arquitectura ideal.

Aplicar cambios estructurales únicamente cuando sean necesarios para:

- compatibilidad técnica;
- preservación de comportamiento;
- testabilidad requerida;
- aislamiento de una dependencia que debe adaptarse;
- cumplimiento de una acción aprobada.

Las mejoras arquitectónicas no requeridas para completar la migración deben permanecer fuera del alcance y registrarse,
cuando aporten valor, como deuda técnica u oportunidad posterior.

## Organización

Organizar el ownership del comportamiento por capability cuando corresponda.

Cuando el repositorio ya utilice una estructura coherente, preservarla salvo que una acción aprobada justifique el
cambio.

Para código nuevo o separaciones requeridas durante la migración, puede utilizarse como referencia:

`src/functions/`

para adapters o composition roots específicos de Azure Functions, y una ubicación propiedad de la capability para la
implementación funcional.

Una capability representa ownership funcional y no obliga por sí sola a mover archivos.

## Dirección de dependencias

La lógica funcional debe evitar dependencia directa del runtime Azure Functions cuando aislarla aporte compatibilidad,
testabilidad o claridad de responsabilidad.

Dirección conceptual:

`Azure Runtime`

→ `Azure adapter / composition root`

→ `capability/application behavior`

→ `domain/contracts`

Las implementaciones de infraestructura satisfacen los contratos requeridos por la capability cuando dichos contratos
aporten un boundary real.

## Adapters Azure

Los adapters específicos de Azure Functions deben limitarse, cuando corresponda, a responsabilidades de integración
como:

- registro de triggers;
- adaptación de request o message;
- acceso al contexto del runtime;
- construcción/composición de dependencias;
- transformación de response.

No introducir nueva lógica funcional en el adapter.

La lógica existente se extrae únicamente cuando el plan la identifique como necesaria para migración o testabilidad.

## Capabilities

Organizar comportamiento por capacidad funcional observable cuando esa separación aporte ownership claro.

Ejemplos:

- `RequestReport`
- `GenerateReport`
- `CompleteReport`
- `Outbox`

No crear una capability únicamente por nombre de Function si varias Functions pertenecen al mismo proceso funcional.

Una capability no implica automáticamente una carpeta o estructura física nueva.

## Materialización incremental

Cuando una acción aprobada requiera cambios estructurales, aplicar estos principios de forma incremental sobre la
estructura existente.

Esto no implica crear todas las capas posibles.

Crear únicamente carpetas y abstracciones que tengan responsabilidad real.

Ejemplo simple ilustrativo:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── request-report.service.ts
        └── tests/

Ejemplo con dominio e infraestructura:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── application/
        ├── domain/
        ├── infrastructure/
        └── tests/

Los ejemplos no definen una estructura obligatoria.

No crear carpetas vacías.

No reorganizar código únicamente para hacer coincidir el repositorio con los ejemplos.

## Contratos

Crear contratos internos cuando permitan aislar infraestructura o dependencias externas y exista un boundary real.

Usar nombres naturales del dominio o responsabilidad.

Ejemplos:

- `ReportRepository`
- `ReportGenerator`
- `MessagePublisher`
- `ReportStorage`

No exigir sufijos como `*.port.ts`.

No introducir contratos únicamente para satisfacer una estructura arquitectónica.

## Infraestructura

Dependencias externas como:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs;

deben aislarse de la lógica funcional cuando sea necesario para compatibilidad, testabilidad, ownership o una acción
estructural aprobada.

La implementación concreta puede permanecer bajo la capability propietaria o en un recurso compartido cuando exista
reuse real.

## Recursos compartidos

Un recurso compartido es un recurso, implementación o boundary concreto utilizado por múltiples Functions, capabilities
o workflows y cuya modificación puede afectar a más de un consumidor.

Ejemplos:

- repositorio Cosmos compartido;
- cliente MongoDB;
- acceso SQL;
- Service Bus client;
- storage client;
- configuración común;
- HTTP client;
- mapper o servicio realmente compartido.

El uso del mismo SDK o tecnología no demuestra por sí solo que dos consumidores compartan el mismo recurso.

No mover algo a `shared` únicamente porque aparezca dos veces.

Primero identificar ownership funcional y evidencia de reuse real.

## Ownership

Cada recurso compartido confirmado debe tener un ownership explícito.

Scopes permitidos inicialmente:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

La planificación debe definir una única acción propietaria para modificar el recurso.

Las Functions consumidoras deben declarar dependencia hacia esa acción cuando corresponda.

## Shared

Crear `src/shared/` únicamente cuando exista un recurso transversal real sin ownership más natural dentro de una
capability.

Evitar convertir `shared` en una carpeta genérica para código sin ubicación clara.

No crear `src/shared/` únicamente porque la policy lo mencione.

## Testabilidad

El comportamiento funcional debe poder probarse sin requerir el Azure Functions Host ni conexiones reales cuando
corresponda a pruebas unitarias.

Aislar cuando sea necesario:

- SDK clients;
- configuración;
- persistencia;
- mensajería;
- almacenamiento;
- llamadas externas.

Aplicar únicamente los seams necesarios para proteger el comportamiento comprometido por la migración.

Mejorar testabilidad no implica generar pruebas desde cualquier etapa; la generación y ejecución de pruebas pertenece a
la responsabilidad definida por el flujo.

## Necesidad estructural

Todo cambio estructural propuesto durante la migración debe distinguir entre:

- `requiredForMigration: true`;
- `requiredForMigration: false`.

`requiredForMigration: true` indica que el cambio es necesario para completar o verificar de forma segura la migración
técnica.

`requiredForMigration: false` identifica modernización, deuda u optimización posterior y no forma parte de la ejecución
obligatoria de la migración.

## Código legacy

No refactorizar un servicio o módulo completo únicamente porque el slice seleccionado dependa de él.

Analizar primero la responsabilidad realmente utilizada y sus consumidores.

El tamaño del archivo o servicio es una señal, no evidencia suficiente para clasificarlo como monolito.

Cuando desacoplar completamente una implementación legacy exceda el scope efectivo, puede introducirse un boundary
temporal como `Provider` o `Adapter` si:

- permite aislar el slice necesario;
- preserva el comportamiento observable;
- mejora la testabilidad o compatibilidad requerida;
- evita expandir innecesariamente el scope.

La modernización completa del componente legacy puede quedar como trabajo posterior.

## Future-proofing

Cuando se realice una separación estructural, procurar reducir el impacto de futuras migraciones.

Idealmente, un cambio futuro de Programming Model o runtime debería concentrarse principalmente en:

- adapters de Azure Functions;
- dependencias;
- configuración;
- composition roots.

La lógica funcional y sus pruebas deberían permanecer estables salvo cambios reales de comportamiento.

Este principio orienta las decisiones estructurales; no exige modernización adicional para cerrar una migración técnica.

## Cambios manuales o mediante IA

Los principios arquitectónicos son independientes del ejecutor.

Una acción de migración debe poder realizarse:

- mediante un skill;
- mediante otro agente;
- manualmente por un desarrollador.

Los planes deben describir intención técnica y criterios de resultado, no depender de quién ejecuta el cambio.

## Principio

Preservar lo que funciona.

Separar solo lo necesario.

Complejidad accidental prohibida.

Crear únicamente lo necesario para mantener límites claros, testabilidad y facilidad de evolución.
