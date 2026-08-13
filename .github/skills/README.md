# Azure Functions Migration Skills

## Objetivo

Toolkit de skills para comprender, planificar, preparar, migrar y verificar Azure Function Apps Node.js hacia un target
técnico y arquitectónico definido.

Target actual:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- comportamiento protegido por tests;
- arquitectura alineada con `financial-reports-functions`;
- menor acoplamiento futuro al runtime y SDKs.

Los skills son capacidades independientes.

La ejecución puede realizarse:

- mediante GitHub Copilot Chat;
- mediante otro agente compatible;
- manualmente por un developer.

No existe orquestación autónoma obligatoria.

## Principio

Trabajar desde evidencia hacia cambios.

Flujo conceptual:

`discover → assess → analyze → plan → prepare → migrate → verify`

No todos los skills deben ejecutarse en todos los repositorios.

Una dimensión que ya cumple el target debe preservarse.

## Independencia del ejecutor

Los artefactos describen intención técnica, evidencia y criterios de resultado.

No deben depender de quién ejecute el cambio.

## Políticas compartidas

Aplicar cuando corresponda:

- `_shared/evidence-policy.md`
- `_shared/security-policy.md`
- `_shared/lessons-policy.md`
- `_shared/architecture-policy.md`
- `_shared/status-policy.md`

Las policies compartidas tienen prioridad sobre instrucciones locales contradictorias.

## Responsabilidad de cada policy

### evidence-policy

Define cómo sustentar afirmaciones y cómo tratar contradicciones.

### security-policy

Define qué contenido puede o no puede leerse.

### architecture-policy

Define hacia qué arquitectura converge el código refactorizado.

### status-policy

Define la semántica de:

- evidencia;
- necesidad de cambio;
- ejecución;
- checks;
- resultado final.

### lessons-policy

Define cómo registrar observaciones y mejorar el toolkit mediante revisión humana.

## Templates compartidos

Usar cuando corresponda:

- `_shared/templates/current-state.template.md`
- `_shared/templates/function-current-state.template.md`
- `_shared/templates/migration-plan.template.md`
- `_shared/templates/function-migration-plan.template.md`
- `_shared/templates/repository-preparation.template.md`
- `_shared/templates/function-preparation.template.md`
- `_shared/templates/function-migration.template.md`
- `_shared/templates/durable-migration.template.md`
- `_shared/templates/verification.template.md`

Los templates definen presentación humana.

Los JSON son los contratos estructurados entre capabilities.

## Memoria de migración

Los artefactos se almacenan bajo:

`.migration/`

Cada capability debe consumir artefactos existentes antes de volver a inspeccionar source.

No reconstruir información cuyo owner ya exista.

## Modelo documental

La migración conserva cuatro perspectivas:

`BEFORE → PLAN → EXECUTION → AFTER`

### BEFORE

Describe el sistema original.

### PLAN

Describe qué debe cambiar.

### EXECUTION

Registra qué se hizo.

### AFTER

Verifica qué quedó realmente.

## Catálogo BEFORE

Documento principal:

`.migration/catalog/current-state.md`

Detalle:

`.migration/catalog/functions/<FunctionName>.md`

El catálogo representa exclusivamente el estado anterior a la migración.

No debe convertirse en documentación del target.

## Arquitectura objetivo

Toda refactorización debe seguir:

`_shared/architecture-policy.md`

Principios:

- Azure adapters bajo `src/functions/`;
- lógica por capability;
- infraestructura aislada cuando corresponda;
- configuración desacoplada cuando sea necesario;
- contracts solo cuando aporten un límite real;
- shared resources con ownership explícito;
- sin capas o carpetas vacías por convención.

La arquitectura es obligatoria.

Su materialización es incremental.

## Future-proofing

Una refactorización correcta debe reducir el impacto de futuras migraciones.

Idealmente cambios futuros de runtime o Programming Model deberían concentrarse en:

- `src/functions/**`;
- composition;
- dependencies;
- configuration.

Esto reduce acoplamiento.

No garantiza compatibilidad futura automática.

## Recursos compartidos

Pueden incluir:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositories;
- services;
- configuración común.

No fusionar recursos únicamente porque utilicen la misma tecnología.

## Ownership de recursos

Scopes:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Cada recurso compartido debe tener ownership explícito cuando pueda confirmarse.

Un recurso que requiera cambio debe tener una única acción propietaria.

## Shared resource catalog

Cuando existan recursos compartidos confirmados:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Son artefactos descriptivos.

Responden:

`¿Qué recurso existe, quién lo posee y quién lo consume?`

No son migration plans.

`plan-function-migration` los consolida antes de construir las acciones del plan.

## Shared resource action

Una acción:

`SR-ACTION-*`

responde:

`¿Qué cambio debe ejecutarse sobre un shared resource?`

Ejemplo:

`SR-COSMOS-REPORTS`

es el recurso.

`SR-ACTION-001`

es una acción sobre ese recurso.

No son el mismo concepto.

## Flujo operativo

### 1. discover-function-app

Pregunta:

`¿Qué existe actualmente?`

Produce:

`.migration/repository/inventory.json`

y:

`.migration/catalog/current-state.md`

No genera `inventory.md`.

También registra candidatos a shared resources.

No modifica código.

### 2. assess-function-app

Pregunta:

`¿Qué tan lejos está globalmente del target?`

Evalúa:

- Node.js;
- Runtime;
- Programming Model;
- Durable;
- dependencias;
- TypeScript;
- testing;
- arquitectura;
- shared resources.

Produce:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

### 3. analyze-function

Pregunta:

`¿Cómo funciona esta Function y qué necesita?`

Produce:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

y la ficha BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

### 4. plan-function-migration

Pregunta:

`¿Cómo coordinamos la migración?`

Primero consolida shared resources.

Después genera:

#### Plan global

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

#### Plan por Function

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

### 5. prepare-function-app

Pregunta:

`¿Qué base global debe quedar preparada?`

Puede modificar:

- Node.js;
- dependencias;
- TypeScript;
- Jest;
- build;
- scripts;
- estructura base;
- configuración;
- shared resources de alcance global.

Produce:

`.migration/repository/preparation.json`

`.migration/repository/preparation.md`

### 6. prepare-function

Pregunta:

`¿Cómo dejamos esta Function preparada y protegida?`

Puede:

- refactorizar;
- separar Azure adapter;
- organizar capability;
- aislar infraestructura;
- preparar shared dependencies;
- agregar tests;
- obtener baseline.

Produce:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

### 7. migrate-programming-model-v4

Pregunta:

`¿Cómo migramos este adapter Azure legacy a v4?`

Produce:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

Si ya está v4:

`NOT_APPLICABLE`

### 8. migrate-durable-functions-v4

Pregunta:

`¿Cómo migramos este workflow Durable como una unidad?`

Produce:

`.migration/functions/<WorkflowName>/durable-migration.json`

`.migration/functions/<WorkflowName>/durable-migration.md`

### 9. verify-function-app

Pregunta:

`¿La migración realmente terminó correctamente?`

Compara:

`BEFORE → PLAN → AFTER`

Produce:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

No corrige fallos.

## Mejora del toolkit

`review-skill-performance`

está fuera del flujo operativo.

Consume evidencia real y propone mejoras bajo:

`.skill-improvement/`

Nunca modifica automáticamente el toolkit.

## Estructura de `.migration`

Crear incrementalmente.

```text
.migration/
├── catalog/
│   ├── current-state.md
│   └── functions/
│       └── <FunctionName>.md
├── repository/
│   ├── inventory.json
│   ├── assessment.json
│   ├── assessment.md
│   ├── preparation.json
│   └── preparation.md
├── resources/
│   ├── shared-resources.json
│   └── shared-resources.md
├── functions/
│   └── <FunctionName>/
│       ├── analysis.json
│       ├── analysis.md
│       ├── migration-plan.json
│       ├── migration-plan.md
│       ├── preparation.json
│       ├── preparation.md
│       ├── migration.json
│       └── migration.md
├── plans/
│   ├── migration-plan.json
│   └── migration-plan.md
├── verification/
│   ├── verification.json
│   └── verification.md
└── lessons/
```

`resources/` solo existe cuando aplique.

No crear carpetas vacías.

## Ownership de información

| Información                    | Owner                          |
|--------------------------------|--------------------------------|
| Functions existentes           | `inventory.json`               |
| Arquitectura observable BEFORE | `inventory.json`               |
| Catálogo humano BEFORE         | `catalog/**`                   |
| Gap global                     | `assessment.json`              |
| Shared resources consolidados  | `shared-resources.json`        |
| Comportamiento Function        | `analysis.json`                |
| Architecture gap Function      | `analysis.json`                |
| Acciones Function              | `analysis.json`                |
| Coordinación global            | global `migration-plan.json`   |
| Pasos Function                 | Function `migration-plan.json` |
| Cambios globales ejecutados    | `repository/preparation.json`  |
| Refactor Function ejecutado    | `preparation.json`             |
| Migración plataforma ejecutada | `migration.json`               |
| Resultado final                | `verification.json`            |

Referenciar al owner.

No duplicar información completa sin necesidad.

## Semántica de estados

Aplicar:

`_shared/status-policy.md`

### Evidence

Campo:

`evidenceStatus`

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

### Action

Campo:

`actionStatus`

Valores:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

### Assessment

Campo principal:

`status`

Valores:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Planning

- `READY`
- `PARTIAL`
- `BLOCKED`

### Global preparation

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Function preparation

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Migration

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### Verification checks

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

### Final verification

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## IDs

Usar identificadores simples y humanos.

### Global actions

`GLOBAL-NNN`

Ejemplos:

- `GLOBAL-001`
- `GLOBAL-002`

### Function actions

`FN-<FUNCTION>-NNN`

Ejemplos:

- `FN-REQUESTREPORT-001`
- `FN-COMPLETEREPORT-001`

No usar `REQ-*` para nuevas acciones.

### Shared resources

`SR-<TYPE>-<NAME>`

Ejemplos:

- `SR-COSMOS-REPORTS`
- `SR-SERVICEBUS-OUTBOX`

### Shared resource actions

`SR-ACTION-NNN`

Ejemplos:

- `SR-ACTION-001`
- `SR-ACTION-002`

## Riesgos y unknowns

No requieren ID por defecto.

Agregar ID únicamente cuando deban referenciarse desde varios artefactos.

No introducir UUIDs ni hashes en el MVP.

## Invalidation

Mantenerla simple.

### Rediscover

Cuando:

- cambia significativamente estructura;
- aparecen o desaparecen Functions;
- cambian registrations relevantes.

### Reassess

Cuando:

- cambian versiones;
- cambian dependencias relevantes;
- cambia arquitectura global.

### Reanalyze

Cuando:

- cambia el slice;
- cambia un recurso compartido relevante;
- nueva evidencia invalida conclusiones.

### Replan

Cuando:

- cambian `FN-*`;
- cambia ownership;
- cambian shared actions;
- cambian dependencias;
- cambia assessment relevante.

### Reverify

Cuando se modifica el sistema después del gate final.

No usar checksums ni state machines complejas en el MVP.

## Build

No ejecutar build global como gate después de cada Function.

Durante preparación/migración se permiten:

- tests selectivos;
- typecheck selectivo;
- static checks.

El build global final pertenece a:

`verify-function-app`

## Tests

Secuencia:

`comportamiento actual`

→ `refactor`

→ `tests`

→ `baseline verde`

→ `migración`

→ `mismos tests verdes`

No agregar integration tests en el alcance actual.

## Seguridad

Excluir contenido sensible antes de lectura.

No leer automáticamente:

- `.env*`;
- `local.settings.json`;
- certificados;
- claves privadas;
- secretos;
- CI/CD protegido.

Puede registrarse:

- existencia;
- path;
- nombre de clave.

Nunca valores.

## Scripts internos

Los scripts deben funcionar con Node.js 14 o superior.

Su runtime es independiente del target de la Function App.

Mantener un script dentro de un skill cuando solo ese skill lo necesita.

Promoverlo a shared únicamente cuando exista reuse real.

## Regla final

El toolkit debe buscar el menor cambio suficiente para alcanzar el target con:

- evidencia;
- seguridad;
- trazabilidad;
- comportamiento protegido;
- arquitectura consistente;
- ownership claro;
- recursos compartidos coordinados;
- verificación reproducible;
- mínima complejidad accidental.
