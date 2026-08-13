---
name: prepare-function
description: Prepara una Function para migración refactorizándola hacia la arquitectura objetivo, aislando infraestructura y recursos compartidos cuando corresponda, y agregando tests que protejan su comportamiento actual.
---

# Prepare Function

## Objetivo

Preparar una Function para migración segura.

Debe:

- preservar comportamiento;
- converger hacia arquitectura objetivo;
- reducir acoplamiento a runtime y SDKs;
- respetar shared resources;
- lograr testabilidad;
- agregar tests;
- obtener baseline reproducible.

No migra Programming Model ni Durable.

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

`.migration/plans/migration-plan.json`

La preparación global necesaria debe estar ejecutada o no bloquear esta Function.

## Entradas

Consumir primero:

- inventory;
- assessment;
- analysis;
- plan global;
- plan específico;
- preparation global;
- shared resources relacionados.

No volver a analizar toda la App.

## Comportamiento

Usar como fuente principal:

`analysis.json`

y el plan específico.

Preservar:

- inputs;
- validaciones;
- decisiones;
- side effects;
- interacciones externas;
- outputs;
- errores.

No cambiar intencionalmente comportamiento.

## Arquitectura

Aplicar:

`../_shared/architecture-policy.md`

La arquitectura es obligatoria para código refactorizado.

La materialización es incremental.

## Estructura

Azure adapters:

`src/functions/`

Lógica funcional:

`src/<Capability>/`

Crear únicamente componentes con responsabilidad real.

No crear capas vacías.

## Adapter Azure

Debe quedar limitado principalmente a:

- registro;
- input mapping;
- composition;
- invocation;
- output mapping.

No mantener lógica funcional significativa dentro del adapter cuando el plan exige extraerla.

## Capability

Organizar lógica según la capability identificada.

No crear una capability artificial por cada Function cuando varias pertenecen al mismo proceso.

## Acciones

Ejecutar únicamente acciones aprobadas del plan.

Principalmente:

- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`.

No ejecutar:

- optimizaciones;
- deuda no bloqueante;
- acciones globales ya completadas.

## Contracts

Crear un contrato cuando aporte un límite real para:

- testabilidad;
- infraestructura;
- ownership;
- futuras migraciones.

Usar nombres naturales.

No imponer `*.port.ts`.

## Infraestructura

Aislar cuando corresponda:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP;
- otros SDKs.

No crear interfaces sin responsabilidad real.

## Shared resources

Consumir:

- resource IDs;
- shared actions;
- `dependsOn`.

Una Function consumidora no debe duplicar infraestructura compartida.

Si una acción compartida obligatoria sigue pendiente:

`BLOCKED`

No crear una solución local equivalente.

## Ownership

Respetar:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

No mover automáticamente recursos de una capability a `shared`.

## Configuración

Aislar acceso a `process.env` cuando sea requerido por arquitectura/testabilidad.

No leer valores sensibles.

## SDK construction

Mover construcción de clientes fuera de lógica funcional cuando corresponda.

Preferir composition root o factory existente.

No introducir framework DI.

## Refactor scope

Usar:

- `NONE`
- `MINIMAL`
- `SIGNIFICANT`

`SIGNIFICANT` puede ejecutarse solo si el plan define el alcance suficiente.

En caso contrario:

`REQUIRES_REVIEW`

## Tests

Agregar únicamente los tests requeridos por analysis/plan.

Priorizar:

1. comportamiento principal;
2. reglas;
3. validaciones;
4. errores;
5. límites externos;
6. mappings relevantes.

No agregar integration tests.

## Characterization

Usar cuando sea necesario fijar comportamiento legacy antes de separar responsabilidades.

## Unit tests

Preferir tests sobre lógica funcional aislada.

Mockear límites externos, no detalles internos arbitrarios.

## Baseline

Registrar:

- comando;
- runtime;
- suites;
- tests;
- resultado;
- coverage cuando aplique.

Para `READY_FOR_MIGRATION`, la baseline requerida debe estar verde.

## Programming Model

No migrar.

Preservar temporalmente:

- adapter legacy;
- o registro v4 existente.

## Durable

Puede preparar internamente Activities o componentes cuando sea seguro.

No cambiar semántica del workflow.

## Catálogo

No reescribir:

`.migration/catalog/functions/<FunctionName>.md`

Ese documento representa BEFORE.

## Salidas estructuradas

Crear:

`.migration/functions/<FunctionName>/preparation.json`

Debe registrar:

- status;
- behavior preserved;
- architecture before;
- architecture changes;
- resulting structure;
- actions executed;
- shared resources;
- shared dependencies;
- files modified;
- contracts introduced;
- infrastructure isolated;
- tests;
- baseline;
- validations;
- risks;
- unknowns;
- debt remaining.

## Salida humana

Crear:

`.migration/functions/<FunctionName>/preparation.md`

Usar:

`../_shared/templates/function-preparation.template.md`

## Lecciones

Crear:

`.migration/lessons/prepare-function/<FunctionName>.json`

`.migration/lessons/prepare-function/<FunctionName>.md`

## Estados

Usar:

- `READY_FOR_MIGRATION`
- `BLOCKED`
- `REQUIRES_REVIEW`
- `NOT_APPLICABLE`

## Criterio de cierre

`READY_FOR_MIGRATION` requiere:

- comportamiento preservado;
- arquitectura objetivo aplicable alcanzada;
- shared dependencies listas;
- tests requeridos verdes;
- ausencia de blocker local.

## Fuera de alcance

No debe:

- migrar Programming Model;
- migrar Runtime;
- migrar Durable;
- actualizar dependencias globales no planificadas;
- modificar comportamiento de negocio;
- optimizar;
- resolver deuda no necesaria;
- duplicar shared resources;
- desplegar.

Siguiente skill:

- `migrate-programming-model-v4`
- `migrate-durable-functions-v4`
