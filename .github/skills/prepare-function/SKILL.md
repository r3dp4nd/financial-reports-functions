---
name: prepare-function
description: Prepara una Function para migración refactorizándola hacia la arquitectura objetivo, aislando infraestructura y recursos compartidos cuando corresponda, y agregando tests que protejan su comportamiento actual.
---

# Prepare Function

## Objetivo

Preparar una Function para que pueda migrarse de forma segura.

Debe:

- preservar comportamiento;
- converger hacia la arquitectura objetivo;
- reducir acoplamiento al runtime y SDKs;
- respetar ownership de recursos compartidos;
- lograr testabilidad;
- agregar tests de protección;
- obtener una baseline reproducible.

Este skill puede modificar código funcional únicamente mediante refactor sin cambio intencional de comportamiento.

No migra todavía Programming Model ni Durable.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/migration-plan.json`

Debe existir también el plan global:

`.migration/plans/migration-plan.json`

La preparación global requerida debe haberse ejecutado o encontrarse en un estado que permita trabajar de forma segura
sobre esta Function.

## Entrada

Recibir una Function objetivo.

Consumir primero:

- inventory;
- assessment;
- analysis;
- plan global;
- plan específico de la Function;
- preparation global;
- shared resource actions relacionadas.

No volver a analizar toda la Function App.

## Neutralidad del ejecutor

El plan puede haberse preparado para ejecución:

- mediante IA;
- mediante skill;
- manualmente.

Este skill debe seguir exactamente la misma intención técnica y criterios de resultado.

## Comportamiento a preservar

Usar como fuentes:

- `analysis.json`;
- `migration-plan.json`;
- ficha del catálogo.

Identificar:

- inputs;
- validaciones;
- decisiones;
- efectos secundarios;
- interacciones externas;
- outputs;
- errores;
- contratos observables.

No cambiar intencionalmente estos comportamientos.

## Arquitectura objetivo

Todo código refactorizado debe converger hacia:

`../_shared/architecture-policy.md`

La arquitectura objetivo es obligatoria.

Esto no significa crear todas las capas posibles.

La materialización debe ser incremental.

## Estructura

Los adapters Azure deben quedar o converger hacia:

`src/functions/`

La lógica funcional debe quedar organizada bajo:

`src/<Capability>/`

Ejemplo simple:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── request-report.service.ts
        └── tests/

Ejemplo con infraestructura:

    src/
    ├── functions/
    │   └── request-report.function.ts
    └── RequestReport/
        ├── application/
        ├── domain/
        ├── infrastructure/
        └── tests/

Crear únicamente carpetas que vayan a contener una responsabilidad real.

## Adapter Azure

Reducir el entrypoint Azure a responsabilidades como:

- registro;
- mapping;
- extracción de inputs;
- composición;
- llamada a comportamiento funcional;
- mapping de output.

No dejar lógica de negocio relevante dentro del adapter cuando el código sea refactorizado.

## Capability

La lógica debe organizarse según la capability identificada.

No crear automáticamente una capability diferente por cada Function si varias pertenecen al mismo proceso funcional.

## requiredActions

Ejecutar las acciones aprobadas del plan específico.

Principalmente:

- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`.

No ejecutar:

- `OPTIMIZATION`;
- deuda técnica no necesaria;
- acciones globales ya tratadas.

## Architecture gap

Usar:

`analysis.architectureGap`

para determinar qué cambios estructurales son necesarios.

Ejemplos:

- extraer lógica del Azure adapter;
- separar persistencia;
- aislar messaging;
- encapsular configuración;
- introducir contrato de repositorio;
- mover implementación a infraestructura;
- adaptar ownership de shared resource.

No inventar cambios arquitectónicos no respaldados por analysis/plan.

## Contratos internos

Crear un contrato cuando exista una dependencia externa que deba aislarse y ello aporte:

- testabilidad;
- desacoplamiento;
- ownership claro;
- facilidad de futura migración.

Usar nombres naturales.

Ejemplos:

- `ReportRepository`;
- `MessagePublisher`;
- `ReportStorage`;
- `CustomerRepository`.

No exigir nombres como:

- `RepositoryPort`;
- `ServicePort`;
- `AdapterPort`;

por convención.

## Infraestructura

SDKs externos no deben quedar acoplados a la lógica funcional cuando la Function sea refactorizada.

Ejemplos:

### Cosmos DB

Evitar:

`application/service → CosmosClient`

Preferir:

`application/service → ReportRepository ← CosmosReportRepository`

cuando exista comportamiento que justifique ese límite.

### MongoDB

Aislar cliente/collection access cuando sea infraestructura de la capability.

### SQL

Aislar acceso SQL o datasource detrás del contrato funcional apropiado.

### Service Bus

Separar publishing/consumption runtime-specific cuando sea necesario.

### Blob

Aislar almacenamiento cuando forme parte de infraestructura.

No crear una interfaz para cada llamada externa si no aporta un límite real.

## Recursos compartidos

Consumir las referencias del plan:

`sharedResources`

y:

`dependsOn`

Una Function consumidora no debe volver a implementar una acción compartida ya asignada globalmente.

Ejemplo:

    RequestReport
      dependsOn:
        SR-ACTION-001

Si `SR-ACTION-001` ya adaptó `ReportRepository`, este skill debe usar el resultado.

No volver a crear otro repositorio Cosmos específico para la misma responsabilidad salvo que el plan indique un
ownership distinto.

## Acción compartida pendiente

Si una Function depende de una shared resource action no ejecutada y dicha acción es necesaria para continuar:

`BLOCKED`

No duplicar localmente la solución para evitar el bloqueo.

## Ownership

Respetar:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

No mover automáticamente infraestructura de una capability hacia `shared`.

## process.env

El comportamiento funcional no debería depender directamente de `process.env` cuando el código deba ser testeable.

Puede:

- extraer configuración en composition root;
- pasar valores necesarios;
- introducir configuración mínima tipada cuando aporte valor.

Nunca leer ni registrar valores secretos durante análisis o documentación.

## SDK construction

Mover creación de clientes externos fuera de lógica funcional cuando sea necesario.

Preferir composition roots o factories existentes.

No introducir un dependency injection framework.

## Refactor scope

Clasificar el esfuerzo según el analysis:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

### NONE

La Function ya respeta arquitectura y testabilidad necesarias.

No refactorizar por uniformidad.

### MINIMAL

Aplicar únicamente los cambios necesarios para alcanzar arquitectura objetivo y testabilidad.

### SIGNIFICANT

Si el plan aprobó explícitamente el alcance:

puede ejecutarse.

Si no está suficientemente definido:

`REQUIRES_REVIEW`

No expandir automáticamente el refactor.

## Tests

Agregar los tests definidos en analysis y plan.

Priorizar:

1. comportamiento principal;
2. reglas;
3. validaciones;
4. errores;
5. interacciones con límites externos;
6. mapping cuando sea relevante.

No agregar integration tests.

## Characterization tests

Utilizar cuando el código legacy necesite fijar comportamiento antes o durante la extracción.

Estos tests son especialmente útiles cuando el refactor arquitectónico implica separar código previamente mezclado.

## Unit tests

Después de aislar comportamiento, preferir unit tests sobre la lógica funcional.

Mockear límites externos.

No mockear detalles internos arbitrarios.

## Ubicación de tests

Seguir la organización acordada por capability.

No crear una estructura de tests que obligue a duplicar jerarquías innecesariamente.

## Baseline

Debe existir una baseline verde antes de realizar una migración de plataforma que pueda alterar comportamiento, cuando
los tests requeridos sean técnicamente posibles.

Registrar:

- comando;
- suites;
- pass/fail;
- coverage cuando aplique;
- runtime usado.

## Tests que fallan

Si un test basado en comportamiento documentado falla contra el código actual:

- no cambiar arbitrariamente la expectativa;
- revisar evidencia;
- registrar contradicción;
- utilizar `REQUIRES_REVIEW` cuando sea necesario.

## Programming Model

No migrar Programming Model.

### Legacy

Preservar temporalmente el adapter legacy necesario para ejecutar o representar la Function.

La arquitectura interna puede ser refactorizada antes de cambiar el registro Azure.

### v4

Preservar el registro v4.

No reconstruirlo innecesariamente.

## Durable

Respetar el rol Durable.

Para:

- orchestrator;
- activity;
- starter;
- client;
- entity;

la arquitectura interna puede prepararse cuando sea seguro.

No cambiar semántica del workflow.

La migración coordinada pertenece a:

`migrate-durable-functions-v4`

## Catálogo

No reemplazar:

`.migration/catalog/functions/<FunctionName>.md`

con documentación del estado refactorizado.

Ese documento conserva la foto BEFORE.

Los cambios realizados se documentan en:

`.migration/functions/<FunctionName>/preparation.md`

## Salidas

Crear:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

Y:

`.migration/lessons/prepare-function/<FunctionName>.json`

`.migration/lessons/prepare-function/<FunctionName>.md`

## preparation.json

Debe contener como mínimo:

- metadata;
- function;
- capability;
- status;
- behavior preserved;
- architecture before;
- architecture changes;
- resulting structure;
- requiredActions executed;
- sharedResources consumed;
- sharedActions dependencies;
- files modified;
- contracts introduced;
- infrastructure isolated;
- tests added;
- baseline;
- validations;
- risks;
- unknowns;
- technical debt remaining.

## preparation.md

Debe explicar:

- cómo estaba estructurada la Function;
- qué arquitectura se aplicó;
- qué carpetas realmente fueron necesarias;
- qué comportamiento fue extraído;
- qué infraestructura quedó aislada;
- qué recursos compartidos consume;
- qué tests protegen comportamiento;
- resultado de baseline;
- qué quedó pendiente.

## Estados

Usar:

- `READY_FOR_MIGRATION`
- `BLOCKED`
- `REQUIRES_REVIEW`
- `NOT_APPLICABLE`

## READY_FOR_MIGRATION

Usar cuando:

- acciones obligatorias fueron completadas;
- arquitectura objetivo aplicable fue alcanzada;
- shared dependencies requeridas están disponibles;
- tests requeridos están verdes;
- no existe blocker conocido para la siguiente migración.

## NOT_APPLICABLE

Puede usarse cuando la Function no requiere preparación adicional.

Por ejemplo:

- arquitectura ya correcta;
- tests suficientes;
- sin acciones estructurales o de testabilidad.

No modificar código para evitar `NOT_APPLICABLE`.

## BLOCKED

Usar cuando existe una dependencia necesaria no resuelta.

Ejemplos:

- shared resource action pendiente;
- baseline no reproducible;
- cambio global requerido no completado.

## REQUIRES_REVIEW

Usar cuando:

- el refactor excede alcance aprobado;
- comportamiento no puede confirmarse;
- architecture gap es ambiguo;
- existen contradicciones relevantes.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- analysis y plan específico fueron consumidos;
- comportamiento fue preservado;
- arquitectura objetivo aplicable fue alcanzada;
- solo se crearon carpetas con responsabilidad real;
- Azure runtime quedó desacoplado de lógica funcional cuando correspondía;
- infraestructura externa quedó aislada cuando era necesario;
- shared resources respetaron ownership;
- no se duplicaron acciones compartidas;
- tests necesarios fueron agregados;
- baseline fue obtenida cuando correspondía;
- no se migró Programming Model;
- deuda y optimizaciones permanecen fuera de alcance;
- se generaron preparation y lessons.

## Fuera de alcance

Este skill no debe:

- migrar Programming Model;
- migrar Runtime;
- migrar Durable workflow;
- actualizar dependencias globales no planificadas;
- rediseñar comportamiento de negocio;
- optimizar;
- resolver deuda no necesaria;
- duplicar recursos compartidos;
- desplegar.

El siguiente skill depende del caso:

- `migrate-programming-model-v4`
- `migrate-durable-functions-v4`
- `verify-function-app`
