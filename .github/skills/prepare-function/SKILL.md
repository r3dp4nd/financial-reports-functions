---
name: prepare-function
description: Prepara una Function para su migración técnica ejecutando únicamente acciones locales aprobadas de estructura, testabilidad y adaptación previa, preservando su comportamiento observable y sin migrar todavía el Programming Model ni workflows Durable.
---

# Prepare Function

## Objetivo

Ejecutar la preparación local aprobada para una Function antes de su migración técnica.

Debe cuando corresponda:

- preservar comportamiento observable;
- ejecutar acciones `FN-*` asignadas a preparation;
- aplicar cambios estructurales mínimos requeridos;
- habilitar testabilidad;
- ejecutar adaptaciones locales de dependencias ya aprobadas;
- respetar recursos compartidos y sus acciones propietarias;
- dejar visibles las necesidades de testing pendientes.

No migra Programming Model.

No migra workflows Durable.

No genera nuevas pruebas de comportamiento.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir:

- analysis de la Function;
- migration plan de la Function;
- plan global;
- preparación global aplicable.

Cuando corresponda:

`.migration/resources/shared-resources.json`

Las acciones globales o shared requeridas por las `FN-*` de esta etapa deben encontrarse en un estado que permita
continuar.

## Entradas

Consumir primero:

- analysis;
- Function migration plan;
- global plan;
- global preparation;
- shared resources cuando existan.

No reconstruir analysis.

No reinterpretar planning.

## Principio

Ejecutar únicamente acciones aprobadas asignadas a esta etapa.

Antes de modificar:

1. confirmar Action ID;
2. comprobar `requiredForMigration`;
3. verificar `dependsOn`;
4. comprobar el estado actual;
5. preservar lo válido;
6. aplicar el menor cambio necesario;
7. validar el resultado;
8. registrar `executionStatus`;
9. registrar desviaciones.

No generar trabajo adicional por conveniencia o preferencia arquitectónica.

## Acciones

Ejecutar únicamente acciones `FN-*` cuyo owner o fase corresponda a preparation.

Ejemplos:

- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`;
- `REQUIRED_DEPENDENCY` cuando represente adaptación local previa;
- otras acciones locales explícitamente asignadas a esta etapa.

No ejecutar automáticamente:

- `TECHNICAL_DEBT`;
- `OPTIMIZATION`;
- acciones con `requiredForMigration = false`.

No ejecutar acciones de Programming Model o Durable desde esta etapa.

## IDs

Preservar exactamente los Action IDs definidos por planning.

Ejemplo:

`FN-REQUESTREPORT-001`

Este skill no genera nuevos Action IDs.

Si descubre una necesidad no representada por el plan:

- no ejecutarla;
- registrar la desviación;
- utilizar `BLOCKED` o `REQUIRES_REVIEW` cuando afecte trabajo requerido;
- volver a planning cuando sea necesaria una nueva acción.

## Execution status

Cada acción procesada utiliza:

- `COMPLETED`;
- `FAILED`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Aplicar:

`../_shared/status-policy.md`

No utilizar `PASS` o `FAIL` como estado de ejecución de una acción.

## Dependency adaptations

No decidir versiones de packages.

Los targets provienen del plan aprobado y de su baseline referenciada.

Este skill ejecuta únicamente adaptaciones locales `FN-*` asignadas a preparation.

Ejemplo conceptual:

```text
package target global
        ↓
GLOBAL-*
        ↓
shared implementation cuando aplica
        ↓
SR-ACTION-*
        ↓
consumer-specific preparation
        ↓
FN-*
```

No modificar `package.json` nuevamente si la acción propietaria global ya fue ejecutada.

No seleccionar una versión alternativa.

Una adaptación específica del Programming Model pertenece a:

`migrate-programming-model-v4`

## Cambios estructurales

Aplicar:

`../_shared/architecture-policy.md`

únicamente para acciones estructurales aprobadas.

Preservar las convenciones existentes cuando sean coherentes.

No imponer rutas como:

`src/functions/`

o:

`src/<Capability>/`

cuando el repositorio ya posea una estructura válida y el plan no requiera moverla.

Crear únicamente piezas con responsabilidad real.

No crear capas vacías.

No reorganizar código para hacerlo coincidir con ejemplos arquitectónicos.

## Azure adapter

Cuando exista una acción aprobada de separación, limitar el adapter cuando corresponda a responsabilidades como:

- registro;
- adaptación de entrada;
- composición de dependencias;
- invocación;
- adaptación de salida.

Extraer únicamente la lógica funcional identificada por el plan.

No utilizar esta etapa para limpiar completamente un handler legacy.

## Contracts

Crear únicamente cuando una acción aprobada requiera un boundary real.

Usar nombres naturales.

Ejemplos:

- `ReportRepository`;
- `MessagePublisher`;
- `ReportGenerator`.

No imponer:

`*.port.ts`

No introducir un contract únicamente para satisfacer una estructura arquitectónica.

## Infraestructura

Aislar únicamente cuando exista una acción aprobada relacionada con:

- compatibilidad;
- testabilidad;
- ownership;
- adaptación de dependencia;
- preservación de comportamiento.

Puede incluir cuando corresponda:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs.

La existencia de una integración externa no obliga por sí sola a introducir un nuevo boundary.

## Recursos compartidos

Consumir:

- Resource IDs;
- acciones shared;
- `dependsOn`;

definidos por planning.

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS"
    }

No crear una implementación local alternativa para reemplazar un recurso compartido pendiente.

Si una acción local requerida depende de:

`SR-ACTION-*`

y esa dependencia no se encuentra completada:

no ejecutar la acción dependiente.

Si esto impide completar la preparación requerida:

`status = BLOCKED`

## Configuración

Modificar únicamente configuración permitida por:

`security-policy.md`

Aislar referencias como:

`process.env.KEY`

solo cuando una acción aprobada lo requiera para:

- testabilidad;
- compatibilidad;
- separación estructural necesaria.

Registrar únicamente nombres de claves.

Nunca valores.

No leer ni modificar archivos protegidos originales.

## Preparación para pruebas

Ejecutar únicamente cambios necesarios para habilitar la protección del comportamiento.

Puede incluir cuando esté planificado:

- introducir un seam mínimo;
- permitir sustitución de una dependencia externa;
- separar construcción rígida de un cliente;
- aislar acceso a configuración;
- separar lógica funcional necesaria para poder probarla.

No generar nuevas pruebas desde este skill.

No diseñar una suite adicional fuera de los `testingRequirements` del plan.

La generación de pruebas pertenece a la capability de testing correspondiente.

## Baseline de pruebas existente

Cuando existan pruebas relevantes, pueden ejecutarse selectivamente para comprobar que la preparación no introdujo una
regresión observable.

Registrar:

- command;
- runtime;
- suites;
- tests;
- failures;
- coverage cuando aplique;
- status;
- evidence.

Estados:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

No afirmar `PASS` sin ejecutar la validación.

La ausencia de una baseline existente no autoriza generar pruebas desde este skill.

Los `testingRequirements` pendientes deben permanecer visibles para la siguiente etapa.

## Programming Model

Preservar temporalmente el Programming Model actual.

No modificar registro, trigger o bindings como parte de este skill salvo que una acción no relacionada con la migración
del Programming Model requiera preservar su forma actual.

La migración pertenece a:

`migrate-programming-model-v4`

## Durable

Puede ejecutar cambios estructurales locales aprobados dentro de una Activity cuando sean necesarios para preparation.

No modificar:

- workflow graph;
- orchestration semantics;
- retries;
- timers;
- external events;
- sub-orchestration behavior.

La migración Durable pertenece a:

`migrate-durable-functions-v4`

## Catálogo BEFORE

No modificar:

`.migration/catalog/functions/<FunctionName>.md`

La ficha representa el estado histórico BEFORE.

## Validaciones

Ejecutar únicamente validaciones relevantes a las acciones realizadas.

Cada validación utiliza:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

Registrar evidencia.

No utilizar el build global final como gate de este skill.

## Desviaciones del plan

Registrar cualquier diferencia entre lo planificado y lo ejecutado.

Una desviación no autoriza trabajo nuevo.

Cuando se descubra una nueva necesidad requerida:

- no ejecutarla;
- registrar evidencia;
- volver a planning cuando corresponda.

## Salida estructurada

Crear:

`.migration/functions/<FunctionName>/preparation.json`

Debe contener cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `planRef`;
- `behaviorPreserved`;
- `actionResults`;
- `structuralChanges`;
- `resultingStructure`;
- `sharedResources`;
- `sharedActionDependencies`;
- `filesModified`;
- `contractsIntroduced`;
- `infrastructureIsolated`;
- `testabilityPreparation`;
- `existingTestBaseline`;
- `testingRequirementsPending`;
- `validations`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `technicalDebtRemaining`;
- `evidence`.

## actionResults

Cada acción procesada debe registrar como mínimo:

- `actionId`;
- `executionStatus`.

Registrar además cuando corresponda:

- reason;
- filesModified;
- evidence.

No crear una acción nueva desde execution.

## Estado principal

Usar únicamente:

- `READY_FOR_MIGRATION`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### READY_FOR_MIGRATION

Todas las acciones requeridas de preparation para esta Function están:

- `COMPLETED`;
- o justificadamente `NOT_APPLICABLE`.

No existen blockers locales para continuar con las siguientes etapas del plan.

`READY_FOR_MIGRATION` no significa que puedan omitirse `testingRequirements` pendientes.

### NOT_APPLICABLE

La Function no requiere preparación local antes de su siguiente etapa.

### BLOCKED

Un impedimento técnico conocido impide completar una acción de preparation requerida.

### REQUIRES_REVIEW

Completar la preparación requiere una decisión humana.

No utilizar evidencia como estado principal.

## Evidencia interna

Cuando un hallazgo necesite expresar certeza:

usar:

`evidenceStatus`

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "evidenceStatus": "CONFIRMED"
    }

## Salida humana

Crear:

`.migration/functions/<FunctionName>/preparation.md`

Usar:

`../_shared/templates/function-preparation.template.md`

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

`READY_FOR_MIGRATION` requiere:

- todas las `FN-*` de preparation con `requiredForMigration = true` fueron procesadas;
- las acciones requeridas terminaron `COMPLETED` o justificadamente `NOT_APPLICABLE`;
- adaptaciones locales de dependencias asignadas a preparation fueron completadas;
- shared dependencies requeridas están disponibles;
- cambios estructurales ejecutados estaban aprobados por el plan;
- testabilidad requerida por preparation fue habilitada;
- `testingRequirements` pendientes permanecen explícitos;
- Programming Model fue preservado;
- semántica Durable no fue modificada;
- archivos y validaciones quedaron registrados;
- desviaciones permanecen visibles;
- no existe blocker local;
- no se generaron nuevos Action IDs;
- no se modificó el catálogo BEFORE.

La ausencia de lessons no impide cerrar preparation.

## Fuera de alcance

No debe:

- generar nuevas pruebas de comportamiento;
- migrar Programming Model;
- migrar Runtime;
- migrar workflow Durable;
- ejecutar global actions;
- ejecutar `SR-ACTION-*` como adaptación local;
- generar nuevos Action IDs;
- seleccionar dependency versions;
- modificar packages ya propiedad de una acción global salvo instrucción explícita del plan;
- duplicar shared resources;
- modificar intencionalmente comportamiento observable;
- ejecutar acciones con `requiredForMigration = false` como trabajo obligatorio;
- resolver deuda no requerida;
- modernizar;
- optimizar;
- desplegar;
- ejecutar el build global final.

Siguiente etapa:

`generate-function-tests`

cuando existan `testingRequirements` pendientes.

Después:

- `migrate-programming-model-v4`;
- o `migrate-durable-functions-v4`;

según el plan.
