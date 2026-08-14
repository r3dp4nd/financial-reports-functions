# Architecture Policy

## Objetivo

Definir los principios arquitectónicos que deben respetar los cambios estructurales realizados durante la migración.

Cuando una separación estructural sea necesaria, debe procurar que futuras migraciones de runtime, SDK o Programming
Model afecten principalmente adapters y configuración, preservando la mayor parte del comportamiento funcional.

Esta policy orienta decisiones estructurales.

No constituye por sí sola autorización para modificar código.

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

```text
migration
≠ modernization
```

## Organización

Organizar el ownership del comportamiento por capability cuando corresponda.

Cuando el repositorio ya utilice una estructura coherente, preservarla salvo que una acción aprobada justifique el
cambio.

Para código nuevo o separaciones requeridas durante la migración, puede utilizarse como referencia:

`src/functions/`

para adapters o composition roots específicos de Azure Functions, y una ubicación propiedad de la capability para la
implementación funcional.

Esta referencia no define un path obligatorio.

Una capability representa ownership funcional y no obliga por sí sola a mover archivos.

## Dirección de dependencias

La lógica funcional debe evitar dependencia directa del runtime Azure Functions cuando aislarla aporte:

- compatibilidad;
- testabilidad;
- claridad de responsabilidad;
- cumplimiento de una acción aprobada.

Dirección conceptual cuando sea aplicable:

```text
Azure Runtime
→ Azure adapter / composition root
→ capability/application behavior
→ domain/contracts cuando existan y aporten un límite real
```

No todas las Functions requieren todas estas capas.

Las implementaciones de infraestructura satisfacen contratos internos únicamente cuando dichos contratos aporten un
boundary real.

## Adapters Azure

Los adapters específicos de Azure Functions deben limitarse, cuando corresponda, a responsabilidades de integración
como:

- registro de triggers;
- adaptación de request o message;
- acceso al contexto del runtime;
- construcción/composición de dependencias;
- transformación de response.

No introducir nueva lógica funcional en el adapter.

La lógica funcional existente puede permanecer cuando extraerla no sea necesario para la migración.

Extraerla únicamente cuando el plan identifique la separación como necesaria para:

- compatibilidad;
- preservación de comportamiento;
- testabilidad;
- aislamiento requerido.

## Capabilities

Organizar comportamiento por capacidad funcional observable cuando esa separación aporte ownership claro.

Ejemplos:

- `RequestReport`
- `GenerateReport`
- `CompleteReport`
- `Outbox`

No crear una capability únicamente por nombre de Function si varias Functions pertenecen al mismo proceso funcional.

Una capability no implica automáticamente:

- una carpeta;
- una layer;
- un módulo;
- una interface.

El ownership lógico puede existir sin reorganización física.

## Materialización incremental

Cuando una acción aprobada requiera cambios estructurales, aplicar estos principios de forma incremental sobre la
estructura existente.

Esto no implica crear todas las capas posibles.

Crear únicamente carpetas y abstracciones que tengan responsabilidad real.

Ejemplo simple ilustrativo:

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── request-report.service.ts
    └── tests/
```

Ejemplo con dominio e infraestructura:

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── tests/
```

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

No exigir sufijos como:

`*.port.ts`

No introducir contratos únicamente para satisfacer una estructura arquitectónica.

Una función pura o dependencia interna simple no necesita una interface únicamente por consistencia.

## Infraestructura

Dependencias externas como:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs;

pueden aislarse de la lógica funcional cuando sea necesario para:

- compatibilidad;
- testabilidad;
- ownership;
- adaptación de API;
- una acción estructural aprobada.

La implementación concreta puede permanecer bajo la capability propietaria o en un recurso compartido cuando exista
reuse real.

La existencia de una dependencia externa no obliga por sí sola a crear:

- repository;
- gateway;
- provider;
- interface.

## Recursos compartidos

Un recurso compartido es un recurso, implementación o boundary concreto utilizado por múltiples Functions, capabilities
o workflows y cuya modificación puede afectar a más de un consumidor.

Ejemplos:

- repositorio Cosmos compartido;
- cliente MongoDB compartido;
- acceso SQL compartido;
- Service Bus client compartido;
- storage client compartido;
- configuración común realmente reutilizada;
- HTTP client compartido;
- mapper o servicio realmente compartido.

El uso del mismo SDK o tecnología no demuestra por sí solo que dos consumidores compartan el mismo recurso.

```text
same SDK
≠ same resource
```

No mover algo a `shared` únicamente porque aparezca dos veces.

Primero identificar:

- identidad del recurso;
- ownership funcional;
- consumidores;
- evidencia de reuse real.

## Ownership

Cada recurso compartido confirmado debe tener un ownership explícito cuando sea necesario para su modificación.

Scopes permitidos inicialmente:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

La planificación debe definir una única acción propietaria para modificar el recurso.

Las Functions consumidoras deben declarar dependencia hacia esa acción cuando corresponda.

```text
shared resource
→ one owner action
→ N consumers
```

Las adaptaciones locales de consumidores pueden utilizar acciones `FN-*` separadas cuando sean realmente necesarias.

## Shared

Crear:

`src/shared/`

únicamente cuando exista un recurso transversal real sin ownership más natural dentro de una capability o workflow.

Evitar convertir `shared` en una carpeta genérica para código sin ubicación clara.

No crear:

`src/shared/`

únicamente porque la policy lo mencione.

## Testabilidad

El comportamiento funcional debe poder probarse sin requerir Azure Functions Host ni conexiones externas reales cuando
corresponda a pruebas unitarias.

Aislar únicamente cuando sea necesario:

- SDK clients;
- configuración;
- persistencia;
- mensajería;
- almacenamiento;
- llamadas externas.

Aplicar únicamente los seams necesarios para proteger el comportamiento comprometido por la migración.

```text
testability
≠ maximum abstraction
```

Mejorar testabilidad no implica generar pruebas desde cualquier etapa.

La preparación estructural pertenece a:

`prepare-function`

La generación de protección mediante pruebas pertenece a:

`generate-function-tests`

La ejecución final de gates pertenece también a las etapas definidas por el flujo.

## Necesidad estructural

Durante analysis puede identificarse:

- `structuralNeeds`;
- `migrationNeeds`;
- testability needs.

Analysis no decide por sí solo qué cambio estructural será obligatorio.

Planning convierte las necesidades aprobadas en acciones y determina:

```text
requiredForMigration = true
```

o:

```text
requiredForMigration = false
```

### requiredForMigration = true

Indica que la acción estructural es necesaria para completar o verificar de forma segura la migración técnica.

Puede estar motivada por:

- compatibilidad;
- preservación de comportamiento;
- testabilidad requerida;
- dependency adaptation;
- coherencia técnica del scope.

### requiredForMigration = false

Identifica una mejora no necesaria para cerrar la migración.

Puede corresponder a:

- technical debt;
- modernización;
- optimización.

No forma parte del camino obligatorio de execution.

```text
analysis
→ structural need

planning
→ structural action
→ requiredForMigration
```

## Código legacy

No refactorizar un servicio o módulo completo únicamente porque el slice seleccionado dependa de él.

Analizar primero:

- responsabilidad realmente utilizada;
- consumers;
- dependency surface;
- impacto sobre migration.

El tamaño del archivo o servicio es una señal.

No constituye por sí solo evidencia suficiente para clasificarlo como monolito.

Cuando desacoplar completamente una implementación legacy exceda el effectiveScope, puede utilizarse un boundary
temporal como:

- `Provider`;
- `Adapter`;
- `Facade`;

cuando:

- exista una acción aprobada que lo requiera;
- permita aislar el slice necesario;
- preserve comportamiento observable;
- habilite testabilidad o compatibilidad requerida;
- evite expandir innecesariamente el scope.

Ejemplo conceptual:

```text
RequestReportUseCase
→ LegacyReportProvider
→ MegaService
```

El boundary temporal no convierte automáticamente al componente legacy en deuda bloqueante.

La modernización completa puede permanecer como trabajo posterior.

## Future-proofing

Cuando se realice una separación estructural necesaria, procurar reducir el impacto de futuras migraciones.

Idealmente, un cambio futuro de Programming Model, runtime o SDK debería concentrarse principalmente en:

- adapters Azure Functions;
- dependency integration;
- configuración;
- composition roots.

La lógica funcional y sus pruebas deberían permanecer estables salvo cambios reales de comportamiento.

Este principio orienta decisiones estructurales.

No constituye:

- requisito adicional de migración;
- architecture score;
- verification gate;
- autorización para modernizar.

## Verification

`verify-function-app` utiliza esta policy únicamente para evaluar cambios estructurales definidos por planning como:

```text
requiredForMigration = true
```

Verification comprueba:

- que la acción fue ejecutada;
- que el resultado requerido existe;
- que el cambio no fue revertido posteriormente.

No verifica:

- arquitectura ideal;
- clean architecture;
- número de carpetas;
- cantidad de interfaces;
- future-proofing general;
- conformidad con los ejemplos de esta policy.

```text
structuralCompliance
≠ architecture quality score
```

## Cambios manuales o mediante IA

Los principios arquitectónicos son independientes del ejecutor.

Una acción de migración debe poder realizarse:

- mediante un skill;
- mediante otro agente;
- manualmente por un desarrollador.

Los planes deben describir:

- intención técnica;
- scope;
- resultado esperado;
- criterios verificables.

No deben depender de razonamiento privado de quien ejecuta el cambio.

## Principios

Preservar lo que funciona.

Separar solo lo necesario.

No introducir complejidad accidental.

Crear únicamente lo necesario para mantener:

- límites claros;
- testabilidad requerida;
- compatibilidad;
- facilidad razonable de evolución.

```text
migration
→ minimal necessary structural change
```

No:

```text
migration
→ architecture rewrite
```
