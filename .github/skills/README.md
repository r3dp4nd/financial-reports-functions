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

Los artefactos describen:

- intención técnica;
- evidencia;
- acciones;
- criterios de resultado.

No deben depender de quién ejecute el cambio.

## Políticas compartidas

Aplicar cuando corresponda:

- `_shared/evidence-policy.md`
- `_shared/security-policy.md`
- `_shared/lessons-policy.md`
- `_shared/architecture-policy.md`
- `_shared/status-policy.md`

Las policies compartidas tienen prioridad sobre instrucciones locales contradictorias.

## Referencias compartidas

La baseline de dependencias vive en:

`_shared/dependency-baseline.json`

No es una policy.

Es una referencia técnica versionada para la campaña de migración.

Contiene:

- target técnico;
- Azure packages aprobados;
- recomendaciones aprendidas;
- reglas de investigación;
- reglas de promoción de conocimiento.

## Responsabilidad de cada policy

### evidence-policy

Define cómo sustentar afirmaciones y tratar contradicciones.

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

# Dependency baseline

Las versiones objetivo aprobadas viven en:

`_shared/dependency-baseline.json`

La baseline responde:

`¿A qué versión queremos llegar en esta campaña?`

No responde:

`¿Puede actualizarse sin impacto?`

Flujo:

`baseline → assess → analyze → plan → prepare/migrate → verify`

## Estructura

La baseline contiene:

- `target`;
- `azurePolicy`;
- `azurePackages`;
- `learnedPackages`;
- `rules`.

## Target

Define el contexto técnico de la campaña.

Ejemplo conceptual:

```json
{
  "node": "24",
  "azureFunctionsRuntime": "v4",
  "programmingModel": "v4"
}
```

## Azure policy

Define cómo tratar Azure packages.

Cualquier package que cumpla un patrón como:

`@azure/*`

se considera Azure package aunque todavía no exista en `azurePackages`.

También pueden existir paquetes adicionales relacionados con Azure, por ejemplo:

`durable-functions`

## Azure packages

`azurePackages` contiene versiones objetivo ya aprobadas para la campaña.

Ejemplos:

- `@azure/functions`;
- `durable-functions`;
- `@azure/cosmos`;
- `@azure/service-bus`.

Una entrada en baseline significa:

`target conocido`

No:

`upgrade automático`

## Azure package no mapeado

Si aparece por ejemplo:

`@azure/keyvault-secrets`

y no existe todavía en `azurePackages`:

1. discovery lo identifica como Azure package;
2. assessment investiga fuentes oficiales;
3. propone un target cuando existe evidencia suficiente;
4. la propuesta permanece pendiente de validación;
5. no se modifica automáticamente la baseline.

## Learned packages

`learnedPackages` contiene conocimiento reutilizable aprobado para dependencias no Azure.

Ejemplo conceptual:

```json
{
  "uuid": {
    "targetVersion": "x.y.z",
    "validatedAgainst": {
      "node": "24"
    },
    "successfulMigrations": 2,
    "recommendationStatus": "APPROVED"
  }
}
```

Una recomendación aprendida:

- reduce investigación repetida;
- aporta evidencia inicial;
- no elimina la validación del repositorio actual.

## Third-party no conocido

Si una dependencia no Azure:

- no existe en `learnedPackages`;
- y presenta evidencia de posible incompatibilidad;

assessment puede investigar:

1. documentación oficial;
2. repositorio oficial;
3. release notes;
4. metadata del package;
5. fuentes secundarias únicamente cuando las anteriores sean insuficientes.

No investigar todo `package.json` indiscriminadamente.

## Recommendation status

El conocimiento de dependencias puede usar:

- `PROPOSED`
- `VALIDATED`
- `REPEATED`
- `APPROVED`

Estos estados pertenecen exclusivamente al dominio de dependency knowledge.

No forman parte de `status-policy.md`.

### PROPOSED

Existe una recomendación investigada.

Todavía no tiene validación completa.

### VALIDATED

La versión fue utilizada en una migración independiente que superó los gates requeridos.

### REPEATED

La misma recomendación fue validada en más de una migración independiente.

Varias Functions dentro de una misma Function App no cuentan como varias migraciones.

### APPROVED

La recomendación fue aprobada explícitamente para reutilización por el toolkit.

## Dependency learning

El toolkit puede aprender de migraciones anteriores.

Flujo:

```text
research
   ↓
proposal
   ↓
migration
   ↓
verification
   ↓
lessons
   ↓
review-skill-performance
   ↓
human approval
   ↓
dependency baseline
```

Nunca:

```text
migration exitosa
→ baseline modificada automáticamente
```

## Invalidación del conocimiento

Una recomendación existente puede necesitar revisión cuando:

- cambia Node target;
- cambia Azure Functions target;
- cambia Programming Model;
- aparece incompatibilidad;
- deja de existir soporte;
- nueva evidencia contradice experiencias anteriores.

El conocimiento aprendido no es permanente.

# Memoria de migración

Los artefactos se almacenan bajo:

`.migration/`

Cada capability debe consumir artefactos existentes antes de volver a inspeccionar source.

No reconstruir información cuyo owner ya exista.

# Modelo documental

La migración conserva cuatro perspectivas:

`BEFORE → PLAN → EXECUTION → AFTER`

## BEFORE

Describe el sistema original.

## PLAN

Describe qué debe cambiar.

## EXECUTION

Registra qué se hizo.

## AFTER

Verifica qué quedó realmente.

# Catálogo BEFORE

Documento principal:

`.migration/catalog/current-state.md`

Detalle por Function:

`.migration/catalog/functions/<FunctionName>.md`

El catálogo representa exclusivamente el estado anterior a la migración.

No debe convertirse en documentación del target.

# Arquitectura objetivo

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

# Future-proofing

Una refactorización correcta debe reducir el impacto de futuras migraciones.

Idealmente cambios futuros de runtime o Programming Model deberían concentrarse en:

- `src/functions/**`;
- composition;
- dependencies;
- configuration.

Esto reduce acoplamiento.

No garantiza compatibilidad futura automática.

# Recursos compartidos

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

Discovery no necesita reconocer determinísticamente todos estos tipos.

Dependencias desconocidas permanecen inventariadas y pueden ser interpretadas posteriormente por analysis.

No fusionar recursos únicamente porque utilicen la misma tecnología.

# Ownership de recursos

Scopes:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Cada recurso compartido debe tener ownership explícito cuando pueda confirmarse.

Un recurso que requiera cambio debe tener una única acción propietaria.

# Shared resource catalog

Cuando existan recursos compartidos confirmados:

`.migration/resources/shared-resources.json`

`.migration/resources/shared-resources.md`

Son artefactos descriptivos.

Responden:

`¿Qué recurso existe, quién lo posee y quién lo consume?`

No son migration plans.

`plan-function-migration` los consolida antes de construir las acciones del plan.

# Shared resource action

Una acción:

`SR-ACTION-*`

responde:

`¿Qué cambio debe ejecutarse sobre un shared resource?`

Ejemplo:

```text
SR-COSMOS-REPORTS
```

es el recurso.

```text
SR-ACTION-001
```

es una acción sobre ese recurso.

No son el mismo concepto.

# Flujo operativo

## 1. discover-function-app

Pregunta:

`¿Qué existe actualmente?`

Produce:

`.migration/repository/inventory.json`

y:

`.migration/catalog/current-state.md`

No genera:

`.migration/repository/inventory.md`

### Responsabilidades

- detectar Function Apps;
- inventariar Functions;
- detectar triggers/bindings;
- registrar dependencias;
- detectar Node declarado;
- detectar Programming Model;
- detectar Durable;
- registrar configuration key names;
- detectar archivos protegidos sin leerlos;
- generar shared resource candidates únicamente cuando exista señal determinista suficiente.

### Dependencias

Discovery registra todas las dependencias.

No elimina packages desconocidos.

Marca como Azure package:

- `@azure/*`;
- packages Azure adicionales configurados.

Solo algunos Azure resource SDKs conocidos generan shared-resource hints.

### Seguridad

Debe detectar sin leer:

- `.env*`;
- `local.settings.json`;
- certificados;
- claves;
- CI/CD protegido.

Ejemplo:

```text
.github/workflows/deploy.yml
→ detected
→ contentRead = false
```

No modifica código.

## 2. assess-function-app

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

### Dependencias

Clasifica dependencias relevantes como:

- `AZURE_BASELINED`;
- `AZURE_UNMAPPED`;
- `LEARNED`;
- `UNMAPPED`.

Assessment puede investigar targets.

No modifica baseline.

Produce:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

## 3. analyze-function

Pregunta:

`¿Cómo funciona esta Function y qué necesita?`

Analiza:

- comportamiento;
- arquitectura actual;
- arquitectura target;
- testabilidad;
- dependencias;
- dependency impact;
- shared resources;
- Node compatibility;
- Programming Model;
- Durable role.

Genera acciones:

- `REQUIRED_PLATFORM`;
- `REQUIRED_NODE`;
- `REQUIRED_DEPENDENCY`;
- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`;
- `TECHNICAL_DEBT`;
- `OPTIMIZATION`.

Produce:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

y ficha BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

## 4. plan-function-migration

Pregunta:

`¿Cómo coordinamos la migración?`

Primero consolida shared resources.

Después genera:

### Plan global

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

El plan conserva:

- dependency baseline;
- dependency target;
- recommendation provenance;
- global actions;
- shared actions;
- execution order.

### Plan por Function

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/migration-plan.md`

Planning no:

- investiga nuevas versiones;
- redefine targets;
- promueve dependency knowledge.

## 5. prepare-function-app

Pregunta:

`¿Qué base global debe quedar preparada?`

Puede modificar:

- Node.js;
- dependencias aprobadas;
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

No decide dependency versions.

## 6. prepare-function

Pregunta:

`¿Cómo dejamos esta Function preparada y protegida?`

Puede:

- refactorizar;
- separar Azure adapter;
- organizar capability;
- aislar infraestructura;
- adaptar consumidores a dependency upgrades planificados;
- preparar shared dependencies;
- agregar tests;
- obtener baseline.

Produce:

`.migration/functions/<FunctionName>/preparation.json`

`.migration/functions/<FunctionName>/preparation.md`

No selecciona dependency versions.

## 7. migrate-programming-model-v4

Pregunta:

`¿Cómo migramos este Azure adapter legacy a v4?`

La versión de:

`@azure/functions`

ya debe estar determinada por baseline/assessment/plan.

Produce:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

Si ya está v4:

`NOT_APPLICABLE`

## 8. migrate-durable-functions-v4

Pregunta:

`¿Cómo migramos este workflow Durable como una unidad?`

La versión de:

`durable-functions`

debe provenir de baseline/assessment/plan.

Produce:

`.migration/workflows/<WorkflowName>/durable-migration.json`

`.migration/workflows/<WorkflowName>/durable-migration.md`

El workflow no se representa como una Function ficticia.

## 9. verify-function-app

Pregunta:

`¿La migración realmente terminó correctamente?`

Compara:

`BEFORE → PLAN → AFTER`

Verifica:

- Node;
- dependency targets;
- install;
- typecheck;
- build global;
- tests;
- coverage cuando aplica;
- Functions;
- Programming Model;
- Durable;
- arquitectura;
- shared resources;
- legacy;
- packaging.

Puede registrar:

`dependencyLearningCandidates`

cuando una recomendación nueva fue utilizada y verificada.

No modifica baseline.

Produce:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

# Mejora del toolkit

`review-skill-performance`

está fuera del flujo operativo.

Consume:

- lessons;
- findings;
- failures;
- verification;
- dependency learning candidates;
- evals.

Puede proponer:

- cambios de skill;
- cambios de script;
- nuevos evals;
- simplificaciones;
- promoción de dependency knowledge;
- invalidación de dependency knowledge.

Nunca modifica automáticamente el toolkit.

# Estructura de `.migration`

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
├── workflows/
│   └── <WorkflowName>/
│       ├── durable-migration.json
│       └── durable-migration.md
├── plans/
│   ├── migration-plan.json
│   └── migration-plan.md
├── verification/
│   ├── verification.json
│   └── verification.md
└── lessons/
```

`resources/` solo existe cuando aplica.

`workflows/` solo existe cuando existen workflows Durable.

No crear carpetas vacías.

# Ownership de información

| Información                         | Owner                                 |
|-------------------------------------|---------------------------------------|
| Functions existentes                | `inventory.json`                      |
| Dependencias existentes             | `inventory.json`                      |
| Azure package detection             | `inventory.json`                      |
| Arquitectura observable BEFORE      | `inventory.json`                      |
| Catálogo humano BEFORE              | `catalog/**`                          |
| Gap global                          | `assessment.json`                     |
| Dependency classification           | `assessment.json`                     |
| Dependency recommendation           | `assessment.json`                     |
| Dependency target aprobado          | `_shared/dependency-baseline.json`    |
| Dependency recommendation aprendida | `_shared/dependency-baseline.json`    |
| Shared resources consolidados       | `shared-resources.json`               |
| Comportamiento Function             | `analysis.json`                       |
| Architecture gap Function           | `analysis.json`                       |
| Dependency impact por Function      | `analysis.json`                       |
| Acciones Function                   | `analysis.json`                       |
| Coordinación global                 | global `migration-plan.json`          |
| Pasos Function                      | Function `migration-plan.json`        |
| Cambios globales ejecutados         | `repository/preparation.json`         |
| Refactor Function ejecutado         | `preparation.json`                    |
| Migración plataforma ejecutada      | `migration.json`                      |
| Migración Durable ejecutada         | `workflows/**/durable-migration.json` |
| Resultado final                     | `verification.json`                   |
| Dependency learning candidate       | `verification.json`                   |
| Propuesta de aprendizaje            | `.skill-improvement/**`               |

Referenciar al owner.

No duplicar información completa sin necesidad.

# Semántica de estados

Aplicar:

`_shared/status-policy.md`

## Evidence

Campo:

`evidenceStatus`

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## Action

Campo:

`actionStatus`

Valores:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Assessment

Campo principal:

`status`

Valores:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Planning

- `READY`
- `PARTIAL`
- `BLOCKED`

## Global preparation

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Function preparation

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Migration

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Verification checks

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

## Final verification

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Dependency recommendation

No pertenece a `status-policy.md`.

Usar:

- `PROPOSED`
- `VALIDATED`
- `REPEATED`
- `APPROVED`

# IDs

Usar identificadores simples y humanos.

## Global actions

`GLOBAL-NNN`

Ejemplos:

- `GLOBAL-001`
- `GLOBAL-002`

## Function actions

`FN-<FUNCTION>-NNN`

Ejemplos:

- `FN-REQUESTREPORT-001`
- `FN-COMPLETEREPORT-001`

No usar:

`REQ-*`

para nuevas acciones.

## Shared resources

`SR-<TYPE>-<NAME>`

Ejemplos:

- `SR-COSMOS-REPORTS`
- `SR-SERVICEBUS-OUTBOX`

## Shared resource actions

`SR-ACTION-NNN`

Ejemplos:

- `SR-ACTION-001`
- `SR-ACTION-002`

# Riesgos y unknowns

No requieren ID por defecto.

Agregar ID únicamente cuando deban referenciarse desde varios artefactos.

No introducir UUIDs ni hashes en el MVP.

# Invalidation

Mantenerla simple.

## Rediscover

Cuando:

- cambia significativamente estructura;
- aparecen o desaparecen Functions;
- cambian registrations relevantes;
- cambia `package.json` de forma significativa.

## Reassess

Cuando:

- cambia dependency baseline;
- cambia un dependency target;
- cambia Node target;
- cambia Runtime target;
- cambia Programming Model target;
- cambia arquitectura global;
- aparece nueva evidencia externa relevante.

## Reanalyze

Cuando:

- cambia el slice;
- cambia dependency assessment relevante;
- cambia un shared resource;
- nueva evidencia invalida conclusiones.

## Replan

Cuando:

- cambian `FN-*`;
- cambia ownership;
- cambian shared actions;
- cambian dependency targets;
- cambia assessment relevante.

## Reverify

Cuando el sistema se modifica después del gate final.

No usar checksums ni state machines complejas en el MVP.

# Build

No ejecutar build global como gate después de cada Function.

Durante preparación/migración se permiten:

- tests selectivos;
- typecheck selectivo;
- static checks.

El build global final pertenece a:

`verify-function-app`

# Tests

Secuencia:

```text
comportamiento actual
→ refactor
→ tests
→ baseline verde
→ migración
→ mismos tests verdes
```

No agregar integration tests en el alcance actual.

Los tests de aplicación usan Jest.

Los tests internos de scripts del toolkit pueden utilizar APIs core compatibles con Node.js 14 cuando sea necesario para
no depender de las dependencias del repo objetivo.

# Seguridad

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

La existencia de un archivo protegido puede detectarse.

Su contenido no debe abrirse.

# Scripts internos

Los scripts deben funcionar con Node.js 14 o superior.

Su runtime es independiente del target de la Function App.

Mantener un script dentro de un skill cuando solo ese skill lo necesita.

Promoverlo a shared únicamente cuando exista reuse real.

# Economía de contexto

Preferir:

- artifacts ya existentes;
- referencias por ID;
- análisis por Function;
- source slices;
- scripts deterministas;
- dependency knowledge acumulado.

Evitar:

- releer todo el repo;
- investigar dependencias irrelevantes;
- cargar todos los analyses para una sola Function;
- repetir investigaciones ya aprobadas sin motivo.

# Regla final

El toolkit debe buscar el menor cambio suficiente para alcanzar el target con:

- evidencia;
- seguridad;
- trazabilidad;
- comportamiento protegido;
- dependency targets reproducibles;
- conocimiento reutilizable gobernado;
- arquitectura consistente;
- ownership claro;
- recursos compartidos coordinados;
- verificación reproducible;
- mínima complejidad accidental.

La IA puede:

- descubrir;
- analizar;
- investigar;
- sugerir;
- ejecutar cambios aprobados;
- registrar evidencia;
- proponer aprendizaje.

La IA no puede convertir por sí sola una recomendación nueva en estándar permanente del toolkit.
