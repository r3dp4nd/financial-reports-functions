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

Los artefactos de análisis y planificación describen intención técnica y criterios de resultado.

No deben depender de quién ejecute el cambio.

La misma acción debe poder ser realizada:

- por IA;
- mediante skill;
- manualmente.

## Políticas compartidas

Aplicar cuando corresponda:

- `_shared/evidence-policy.md`
- `_shared/security-policy.md`
- `_shared/lessons-policy.md`
- `_shared/architecture-policy.md`

Las políticas compartidas tienen prioridad sobre instrucciones locales contradictorias.

## Templates compartidos

Los documentos Markdown generados deben utilizar cuando corresponda:

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

Los JSON siguen siendo los contratos estructurados entre skills.

## Memoria de migración

Los artefactos de ejecución se almacenan bajo:

`.migration/`

Los siguientes skills deben consumir artefactos existentes antes de volver a inspeccionar el repositorio.

No reconstruir información que ya tenga un owner claro.

## Modelo documental

La migración conserva cuatro perspectivas:

`BEFORE → PLAN → EXECUTION → AFTER`

### BEFORE

Describe cómo estaba el sistema antes de modificarlo.

### PLAN

Describe qué debe cambiar y en qué orden.

### EXECUTION

Registra qué cambios se realizaron realmente.

### AFTER

Verifica el estado final real.

## Catálogo BEFORE

El catálogo es documentación humana del sistema original.

Documento principal:

`.migration/catalog/current-state.md`

Detalle por Function:

`.migration/catalog/functions/<FunctionName>.md`

Debe registrar cuando corresponda:

- plataforma actual;
- Function Apps;
- Functions;
- triggers y bindings;
- capabilities;
- arquitectura observable;
- patrones;
- dependencias;
- recursos compartidos;
- configuración por nombre de clave;
- relaciones;
- testing;
- riesgos;
- unknowns.

El catálogo no debe reescribirse después para aparentar el estado target.

## Arquitectura objetivo

Toda refactorización debe seguir:

`_shared/architecture-policy.md`

Principios principales:

- Azure adapters bajo `src/functions/`;
- lógica funcional organizada por capability;
- infraestructura aislada cuando corresponda;
- configuración desacoplada de lógica cuando sea necesario;
- contratos internos solo cuando aporten límites reales;
- shared resources con ownership explícito;
- ninguna capa o carpeta vacía por convención.

La arquitectura es obligatoria.

La materialización de sus piezas es incremental.

## Future-proofing

El objetivo arquitectónico es reducir el impacto de futuras migraciones.

Idealmente, cambios futuros de runtime o Programming Model deberían concentrarse principalmente en:

- `src/functions/**`;
- composición;
- dependencias;
- configuración.

La lógica funcional y sus tests deberían permanecer estables cuando el comportamiento no cambie.

Esto reduce acoplamiento.

No garantiza compatibilidad futura automática.

## Recursos compartidos

Un recurso compartido puede ser utilizado por múltiples:

- Functions;
- capabilities;
- workflows.

Ejemplos:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositories;
- services;
- configuración común.

No considerar dos recursos iguales únicamente porque utilicen la misma tecnología.

## Ownership de recursos

Scopes iniciales:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Cada recurso compartido debe tener ownership explícito cuando pueda confirmarse.

Un recurso que necesite cambio debe tener una única acción propietaria.

Las Functions consumidoras declaran dependencia hacia esa acción.

## Artefactos de recursos compartidos

Cuando existan shared resources confirmados, crear:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Estos artefactos son consolidados por:

`plan-function-migration`

a partir de discovery y analyses.

No crear la carpeta `resources/` cuando no existan recursos compartidos reales.

## Flujo operativo

### 1. discover-function-app

Pregunta:

`¿Qué existe actualmente?`

Produce:

- inventario estructurado;
- catálogo BEFORE inicial;
- arquitectura observable;
- patrones;
- shared resource candidates.

Salida principal:

`.migration/repository/inventory.json`

Catálogo:

`.migration/catalog/current-state.md`

No modifica código.

### 2. assess-function-app

Pregunta:

`¿Qué tan lejos está globalmente del target?`

Evalúa independientemente:

- Node.js;
- Runtime;
- Programming Model;
- Durable;
- dependencias;
- TypeScript;
- testing;
- arquitectura;
- shared resources.

Salida:

`.migration/repository/assessment.json`

No modifica código.

### 3. analyze-function

Pregunta:

`¿Cómo funciona esta Function y qué necesita?`

Ejecutar por Function o unidad funcional coherente.

Produce:

- comportamiento;
- dependencias;
- recursos compartidos;
- arquitectura actual;
- arquitectura objetivo;
- architecture gap;
- testabilidad;
- tests;
- compatibilidad;
- requiredActions;
- deuda;
- riesgos;
- unknowns.

Salida:

`.migration/functions/<FunctionName>/analysis.json`

Ficha humana BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

No modifica código.

### 4. plan-function-migration

Pregunta:

`¿Cómo coordinamos y ejecutamos la migración?`

Produce dos niveles de planificación.

#### Plan global

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Coordina:

- target;
- cambios globales;
- arquitectura;
- recursos compartidos;
- Function plans;
- Durable workflows;
- dependencias;
- orden;
- riesgos;
- verification criteria.

#### Plan por Function

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Describe:

- comportamiento a preservar;
- acciones;
- arquitectura objetivo;
- dependencias;
- recursos compartidos;
- preparación;
- migración;
- tests;
- verificación.

No debe duplicar todo el análisis.

### 5. prepare-function-app

Pregunta:

`¿Qué base global debe estar lista antes de preparar las Functions?`

Puede aplicar cambios planificados sobre:

- Node.js;
- dependencias;
- TypeScript;
- Jest;
- build;
- scripts;
- estructura base;
- `host.json`;
- `.funcignore`;
- shared resources globales.

Salida:

`.migration/repository/preparation.json`

`.migration/repository/preparation.md`

No modifica comportamiento funcional de una Function.

### 6. prepare-function

Pregunta:

`¿Cómo dejamos esta Function arquitectónicamente preparada y protegida?`

Puede:

- refactorizar hacia arquitectura objetivo;
- separar Azure adapter;
- organizar capability;
- aislar infraestructura;
- respetar shared resources;
- aislar configuración;
- agregar characterization tests;
- agregar unit tests;
- obtener baseline.

Salida:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

Estado esperado cuando requiere migración:

`READY_FOR_MIGRATION`

### 7. migrate-programming-model-v4

Pregunta:

`¿Cómo migramos el adapter Azure legacy sin cambiar comportamiento?`

Aplica únicamente cuando la Function necesita migración de Programming Model.

Una Function ya v4:

`NOT_APPLICABLE`

Salida:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

No debe volver a refactorizar la capability.

### 8. migrate-durable-functions-v4

Pregunta:

`¿Cómo migramos este workflow Durable preservando su semántica?`

La unidad de migración es el workflow.

Puede incluir:

- client;
- starter;
- orchestrator;
- activities;
- sub-orchestrators;
- entities.

Salida:

`.migration/functions/<WorkflowName>/durable-migration.json`

`.migration/functions/<WorkflowName>/durable-migration.md`

No migrar Activities de forma independiente cuando dependan del workflow.

### 9. verify-function-app

Pregunta:

`¿La migración realmente terminó correctamente?`

Compara:

`BEFORE → PLAN → AFTER`

Verifica:

- Node.js;
- installation;
- typecheck;
- build global;
- tests;
- coverage;
- Azure Functions Host cuando sea posible;
- Functions esperadas;
- Programming Model;
- Durable;
- arquitectura;
- recursos compartidos;
- legacy residual;
- packaging;
- deuda;
- unknowns.

Salida:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

No corrige código.

## Flujo de mejora del toolkit

`review-skill-performance` está separado del flujo operativo.

Consume:

- lessons;
- resultados reales;
- blockers;
- reviews;
- evals;
- skills.

Produce propuestas bajo:

`.skill-improvement/`

Nunca modifica automáticamente los skills.

Flujo:

`evidencia → propuesta → revisión humana → cambio → evals`

## Estructura esperada de `.migration`

La estructura se crea incrementalmente.

```text
.migration/
├── catalog/
│   ├── current-state.md
│   └── functions/
│       └── <FunctionName>.md
├── repository/
│   ├── inventory.json
│   ├── inventory.md
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

No crear carpetas vacías.

`resources/` solo existe cuando aplique.

## Ownership de información

Cada dato debe tener un owner principal.

| Información                       | Owner                          |
|-----------------------------------|--------------------------------|
| Functions existentes              | `inventory.json`               |
| Arquitectura observable BEFORE    | `inventory.json`               |
| Catálogo humano BEFORE            | `catalog/**`                   |
| Gap técnico global                | `assessment.json`              |
| Gap arquitectónico global         | `assessment.json`              |
| Shared resources consolidados     | `shared-resources.json`        |
| Comportamiento por Function       | `analysis.json`                |
| Architecture gap por Function     | `analysis.json`                |
| requiredActions                   | `analysis.json`                |
| Coordinación global               | global `migration-plan.json`   |
| Pasos por Function                | Function `migration-plan.json` |
| Cambios globales ejecutados       | `repository/preparation.json`  |
| Refactor ejecutado                | Function `preparation.json`    |
| Migración de plataforma ejecutada | `migration.json`               |
| Resultado final                   | `verification.json`            |

Referenciar al owner.

No copiar información completa entre artefactos sin necesidad.

## Identificadores

Usar identificadores humanos simples.

Ejemplos:

- `GLOBAL-001`
- `REQ-REQUEST-001`
- `SR-COSMOS-REPORTS`
- `SR-ACTION-001`
- `RISK-001`

No usar UUIDs ni hashes en el MVP.

## Estados de evidencia

Usar:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

No convertir inferencias en hechos.

## Estados de acción

Usar:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Estados de plan

Usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

## Estados de preparación

Usar según el skill:

- `COMPLETED`
- `PARTIAL`
- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Estados de migración

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Estados de verificación

Checks:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Estado final:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Invalidation

Mantener invalidación simple.

### Repetir discovery cuando

- cambia significativamente la estructura;
- aparecen/eliminan Functions;
- cambian registrations relevantes.

### Repetir assessment cuando

- cambian versiones;
- cambian dependencias relevantes;
- cambia significativamente la arquitectura global.

### Repetir analysis cuando

- cambia el slice de la Function;
- cambia un shared resource relevante;
- aparece nueva evidencia que invalida conclusiones.

### Regenerar planes cuando

- cambian requiredActions;
- cambia ownership de shared resources;
- cambian dependencias entre Functions;
- cambia el assessment relevante.

### Repetir verification cuando

- se modifica código después del gate final;
- cambia configuración necesaria para runtime;
- se resuelve un blocker anterior.

No usar hashes ni state machines complejas en el MVP.

## Build

No exigir build global después de cada Function.

Durante migración pueden existir estados intermedios temporalmente incompatibles.

Permitir:

- tests selectivos;
- typecheck selectivo;
- validaciones estáticas.

El build global completo es gate de:

`verify-function-app`

## Tests

Secuencia preferida:

`comportamiento actual`

→ `refactor arquitectónico`

→ `tests`

→ `baseline verde`

→ `migración de plataforma`

→ `mismos tests verdes`

No agregar integration tests en el alcance actual.

## Deuda técnica

Separar:

- cambios obligatorios;
- technical debt;
- optimizations.

Una migración puede finalizar:

`VERIFIED_WITH_DEBT`

La deuda no bloqueante no invalida una migración correcta.

## Seguridad

La exclusión de contenido sensible ocurre antes de lectura.

No leer automáticamente:

- `.env*`;
- `local.settings.json`;
- secretos;
- certificados;
- claves privadas;
- CI/CD protegido.

Puede registrarse existencia o nombre de clave cuando sea necesario.

Nunca valores.

## Scripts internos

Los scripts incluidos en los skills deben funcionar con Node.js 14 o superior.

No depender del runtime target de la Function App.

Si un script sirve únicamente a un skill:

mantenerlo dentro de ese skill.

Promoverlo a shared solo cuando múltiples skills necesiten exactamente la misma capacidad.

## Regla final

El objetivo del toolkit no es generar la mayor cantidad posible de cambios.

El objetivo es alcanzar el target con:

- evidencia;
- documentación comprensible;
- comportamiento protegido;
- arquitectura consistente;
- recursos compartidos coordinados;
- mínima duplicación;
- menor costo de futuras migraciones.
