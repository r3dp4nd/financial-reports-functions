# Azure Functions Migration Skills

## Objetivo

Conjunto de skills progresivos para analizar, preparar, migrar y verificar Azure Function Apps Node.js hacia el target
técnico definido para el proyecto.

Target actual:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- tests que protejan el comportamiento actual;
- estructura mantenible sin sobrearquitectura.

Los skills son capacidades independientes ejecutadas manualmente desde GitHub Copilot Chat.

No existe orquestación autónoma.

El developer decide cuándo continuar.

## Principio

Trabajar desde evidencia hacia cambios.

Flujo conceptual:

`discover → assess → analyze → plan → prepare → migrate → verify`

No todos los skills aplican a todos los repositorios.

Si una dimensión ya cumple el target, debe preservarse.

## Memoria de migración

Los skills utilizan:

`.migration/`

como memoria persistente de la migración.

Los siguientes skills deben consumir primero los artefactos existentes antes de volver a inspeccionar el repositorio.

JSON contiene información estructurada para agentes.

Markdown contiene explicación para developers.

## Políticas compartidas

Todos los skills deben respetar cuando corresponda:

- `_shared/evidence-policy.md`
- `_shared/security-policy.md`
- `_shared/lessons-policy.md`

Las políticas compartidas tienen prioridad sobre instrucciones locales contradictorias.

## Flujo principal

### 1. discover-function-app

Usar al comenzar una migración o cuando el inventario haya quedado desactualizado.

Produce:

- inventario de Function Apps;
- Functions;
- triggers y bindings;
- Programming Model observable;
- dependencias;
- configuración requerida;
- Durable Functions;
- relaciones iniciales.

Salida principal:

`.migration/repository/inventory.json`

No modifica código.

### 2. assess-function-app

Usar después de revisar el inventario.

Determina qué dimensiones realmente requieren cambios frente al target.

Evalúa independientemente:

- Node.js;
- Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- tooling global.

Salida principal:

`.migration/repository/assessment.json`

No modifica código.

### 3. analyze-function

Ejecutar una vez por Function o unidad funcional que necesite análisis.

Comprende:

- comportamiento actual;
- dependencias;
- relaciones;
- testabilidad;
- tests necesarios;
- compatibilidad Node.js 24;
- refactor mínimo;
- deuda técnica;
- acciones requeridas.

Salida principal:

`.migration/functions/<FunctionName>/analysis.json`

Cada análisis debe contener:

`requiredActions`

No modifica código.

### 4. plan-function-migration

Ejecutar cuando exista suficiente análisis Function por Function.

Construye un único plan global.

Coordina:

- cambios globales;
- Functions;
- workflows Durable;
- dependencias entre acciones;
- orden recomendado;
- riesgos;
- unknowns.

Salida:

`.migration/plans/migration-plan.json`

No genera planes individuales por Function.

No modifica código.

### 5. prepare-function-app

Usar cuando el plan permita iniciar preparación global.

Puede modificar:

- `package.json`;
- dependencias;
- TypeScript;
- Jest;
- build;
- estructura;
- `host.json`;
- `.funcignore`;
- otros archivos globales planificados.

Debe preservar configuración existente válida.

No modifica comportamiento de negocio.

### 6. prepare-function

Ejecutar para cada Function que necesite protección antes de migrar.

Puede:

- aplicar refactor mínimo;
- aislar dependencias;
- agregar characterization tests;
- agregar unit tests;
- obtener baseline verde.

Resultado esperado:

`READY_FOR_MIGRATION`

No migra todavía Programming Model.

### 7. migrate-programming-model-v4

Ejecutar únicamente sobre Functions legacy no Durable que realmente necesiten migración.

Transforma principalmente:

`adapter Azure legacy → adapter Programming Model v4`

Si la Function ya está en v4:

`NOT_APPLICABLE`

Debe preservar la baseline funcional.

### 8. migrate-durable-functions-v4

Ejecutar únicamente cuando exista un workflow Durable que necesite migración.

La unidad de migración es el workflow.

Puede incluir:

- starter;
- client;
- orchestrator;
- activities;
- sub-orchestrators;
- entities.

No migrar Activities aisladamente cuando dependan del workflow.

### 9. verify-function-app

Ejecutar cuando las adaptaciones planificadas estén completas.

Es el gate técnico final.

Verifica:

- instalación;
- Node.js utilizado;
- typecheck;
- build global;
- tests;
- coverage;
- Azure Functions Host cuando sea posible;
- Functions esperadas;
- Durable workflows;
- legacy residual;
- packaging;
- blockers;
- deuda técnica;
- unknowns.

No corrige código.

## Selección condicional

El flujo no debe ejecutarse mecánicamente de principio a fin.

Ejemplos:

### Repositorio legacy completo

`discover`
→ `assess`
→ `analyze × N`
→ `plan`
→ `prepare-function-app`
→ `prepare-function × N`
→ `migrate-programming-model-v4`
→ `migrate-durable-functions-v4` cuando aplique → `verify`

### Repositorio ya en Programming Model v4

`discover`
→ `assess`
→ `analyze × N`
→ `plan`
→ preparación necesaria → refactor/tests cuando corresponda → `verify`

No ejecutar `migrate-programming-model-v4` si no aplica.

### Function ya testeable

`analyze-function`
→ `prepare-function`

`prepare-function` puede agregar tests sin realizar refactor.

### Function con cambio significativo

Si `prepare-function` determina:

`REQUIRES_REVIEW`

el developer debe revisar antes de continuar.

## Estados

Los skills pueden utilizar estados específicos de su dominio, pero deben respetar esta semántica común.

### COMPLETED

La responsabilidad del skill terminó correctamente.

### NOT_APPLICABLE

El skill no necesita realizar cambios para el caso actual.

No es un error.

### BLOCKED

Existe una condición conocida que impide continuar de forma segura.

Debe identificarse el bloqueo.

### REQUIRES_REVIEW

La evidencia disponible no permite continuar automáticamente.

Requiere decisión humana.

## Estados de planificación

`plan-function-migration` puede producir:

- `READY`
- `PARTIAL`
- `BLOCKED`

### READY

Existe evidencia suficiente para comenzar el plan.

### PARTIAL

Existe trabajo seguro que puede avanzar, pero quedan decisiones pendientes.

### BLOCKED

No existe evidencia suficiente para iniciar las acciones necesarias.

## Estados finales

`verify-function-app` puede producir:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

`VERIFIED_WITH_DEBT` es un resultado válido.

La deuda técnica no bloqueante no convierte una migración correcta en una migración fallida.

## Manejo de BLOCKED

Cuando un skill devuelve `BLOCKED`, identificar la causa y volver únicamente al capability responsable.

Ejemplos:

`verify → tests FAIL`
→ revisar `prepare-function` o migración correspondiente.

`plan → analysis missing`
→ ejecutar `analyze-function` para la Function faltante.

`migrate → Programming Model UNKNOWN`
→ revisar discovery o assessment.

No reiniciar todo el flujo automáticamente.

## Manejo de REQUIRES_REVIEW

Cuando un skill devuelve `REQUIRES_REVIEW`:

1. explicar la incertidumbre;
2. indicar la evidencia disponible;
3. indicar qué decisión o evidencia falta;
4. esperar decisión del developer antes de ejecutar cambios afectados.

No transformar incertidumbre en una suposición.

## Manejo de PARTIAL

`PARTIAL` permite continuar únicamente con acciones independientes cuya evidencia sea suficiente.

Ejemplo:

una Function tiene una dependencia sin compatibilidad confirmada, pero otras Functions independientes pueden prepararse.

No bloquear trabajo seguro sin necesidad.

## Invalidation

No usar hashes ni mecanismos complejos en el MVP.

Reglas simples:

- cambios estructurales importantes → repetir discovery;
- cambios de versiones o dependencias → repetir assessment;
- cambios en el slice de una Function → repetir su analysis;
- cambios relevantes en analyses → regenerar plan;
- cambios después de verification → volver a verificar.

Reejecutar únicamente lo necesario.

## Build

No exigir build global después de cada Function.

Durante una migración parcial pueden existir estados temporalmente incompatibles.

Permitir:

- tests selectivos;
- typecheck selectivo;
- validaciones estáticas.

El build global completo es gate de `verify-function-app`.

## Tests

Los tests deben proteger comportamiento existente antes de migraciones que puedan alterarlo cuando sea posible.

Secuencia preferida:

`comportamiento actual`
→ `refactor mínimo si hace falta`
→ `tests`
→ `baseline verde`
→ `migración`
→ `mismos tests verdes`

No agregar integración tests en el alcance actual.

## Deuda técnica

Separar siempre:

- cambio obligatorio;
- deuda técnica;
- optimización.

La migración puede cerrar con deuda técnica documentada.

Las optimizaciones no forman parte del alcance.

## Lecciones aprendidas

Cada skill genera lessons según:

`_shared/lessons-policy.md`

Las lessons sirven para mejorar posteriormente el toolkit.

No modifican automáticamente los skills.

## Mejora de skills

Las ejecuciones reales alimentarán posteriormente:

`review-skill-performance`

Este capability analizará:

- resultados;
- lessons;
- fallos recurrentes;
- falsos positivos;
- falsos negativos;
- consumo innecesario de contexto;
- reglas demasiado amplias;
- oportunidades de simplificación.

El resultado será un plan de mejora.

Nunca debe modificar automáticamente los skills.

Toda mejora requiere:

`evidencia`
→ `propuesta`
→ `revisión humana`
→ `cambio`
→ `evals`

## Regla final

El objetivo del toolkit no es producir la mayor cantidad de cambios.

El objetivo es realizar únicamente los cambios necesarios para alcanzar el target con evidencia suficiente y
comportamiento protegido.
