---
name: plan-function-migration
description: Construye el plan global y por Function/slice a partir de inventory, assessment y analyses. Úsalo para convertir necesidades aprobadas en acciones globales, shared y locales con ownership, dependencias, orden, executor sugerido y criterios verificables que sirvan como contrato/eval para humanos o IA, sin ejecutar cambios.
---

# Plan Function Migration

## Objetivo

Crear un único plan global (herramientas, dependencias, runtime y ownership de recursos compartidos) y un plan
ejecutable por cada Function individual, evitando trabajo duplicado sobre recursos compartidos.

El plan es también el contrato de evaluación de la ejecución: debe permitir que un humano o una IA implemente y que
verification compruebe resultados sin reinterpretar intención. Cada plan por Function debe funcionar como un manual
operativo: cualquier dev o QA debe poder ejecutarlo paso a paso sin tener que leer el código fuente por su cuenta ni
inferir el "cómo".

## Identidad y audiencia

Al redactar el plan, actuar como un **arquitecto de software senior que redacta el manual operativo de la
migración**: cada acción, sea técnica (v3→v4) o de reestructuración (mejores prácticas de testabilidad), debe
diseñarse con el mismo nivel de detalle — código antes/después real, estructura propuesta concreta, comandos, orden
— nunca reducida a una línea de rationale que delega el diseño a quien la ejecute. La audiencia es un dev o QA que
no debería tener que inventar el "cómo": si `analyze-function` ya propuso una interfaz o separación concreta, el
plan la lleva a su forma final ejecutable.

Separar siempre, dentro del plan de cada Function, dos secciones con propósito distinto:

- **Migración técnica**: acciones mecánicas v3→v4, generalmente de bajo riesgo de diseño (transcripción según
  reglas oficiales).
- **Reestructuración**: tareas de mejores prácticas/testabilidad, numeradas y ordenadas por dependencia, cada una
  con su propuesta de estructura concreta y una marca explícita de si cambia o no comportamiento observable —
  para que quien solo quiera implementar la primera tarea autocontenida sepa exactamente por dónde empezar.

Cada sección mayor del documento debe abrir con 1-3 frases que expliquen qué es y por qué importa antes de la
tabla o el código, para que cualquiera sin contexto previo pueda seguir el plan de principio a fin.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/references/artifact-layout.md`
- `../_shared/references/validation-tooling.md`
- `../_shared/references/graphify-usage.md` solo si el `dependsOn` entre Functions no puede confirmarse con evidencia ya persistida en analyses
- `../_shared/dependency-baseline.json`

## Precondiciones

Deben existir inventory, assessment y los analyses requeridos para el effective scope.

El `executionGuide.beforeAfter.code.before` de cada acción debe citarse desde el catálogo BEFORE de la Function
(`.migration/00-before/functions/<FunctionName>.md`, sección "Fragmento de código relevante") cuando ese catálogo
exista, en vez de releer el source crudo sin declarar la fuente. Si el catálogo no cubre el fragmento necesario,
leer el archivo real y registrarlo como tal.

## Workflow

1. Resolver `requestedScope` y `effectiveScope`.
2. Consolidar shared resources y sus consumidores.
3. Separar carriles: migración técnica (`TECHNICAL_MIGRATION`) y refactor/testabilidad (`REFACTOR_TESTABILITY`) cuando ambos existan.
4. Convertir `migrationNeeds` y `refactor/testabilityNeeds` en acciones verificables.
5. Asignar ownership: `GLOBAL` (herramientas/dependencias/runtime/ownership de shared resources) o `FN-*` por cada
   Function individual. No agrupar Functions en un plan colectivo tipo slice: si varias Functions forman parte de un
   mismo workflow Durable, cada una recibe su propio plan `FN-*` con `dependsOn` explícito hacia las demás cuando el
   orden deba preservarse. Antes de fijar `dependsOn`, verificar la relación en el campo `relationships` de los
   `analysis.json` de las Functions involucradas; consultar Graphify (`explain`/`path`) solo si esa evidencia no
   está disponible o es insuficiente.
6. Marcar `requiredForMigration` y si aplica `requiredForRefactor`.
7. Sugerir executor: `HUMAN`, `AI_AGENT` o `EITHER`, con rationale.
8. Definir comportamiento preservado por acción y qué cambios funcionales están prohibidos.
9. Definir `dependsOn`, orden lógico y criterios de evaluación.
10. Para cada acción `FN-*`/`GLOBAL-*`/`SR-ACTION-*`, generar su `executionGuide`: código real "antes" (leído del
    BEFORE), código destino "después", árbol de carpetas antes/después cuando aplique, comandos exactos de
    instalación/desinstalación, pasos numerados y comando de verificación con resultado esperado literal.
11. Crear el plan global y un plan por cada Function.
12. Detenerse si una decisión necesaria carece de target/evidencia aprobada.

Cargar según necesidad:

- `references/planning-rules.md`
- `references/action-model.md`
- `references/artifacts.md`

## Salidas

- `.migration/30-plan/migration-plan.json`
- `.migration/30-plan/migration-plan.md`
- `.migration/30-plan/functions/<FunctionName>/migration-plan.json` (uno por cada Function, sin agrupar en slice)
- `.migration/30-plan/functions/<FunctionName>/migration-plan.md`
- `.migration/30-plan/resources/shared-resources.json|md` cuando existan shared resources confirmados.

## Cierre

Terminar cuando todas las necesidades requeridas tienen owner, lane, executor sugerido, resultado esperado, criterios de evaluación y dependencias suficientes para ejecución segura, o el plan queda explícitamente `PARTIAL`/`BLOCKED`.

## No hacer

- modificar source;
- usar `latest`;
- crear acciones duplicadas para el mismo shared resource;
- generar tests;
- convertir deuda opcional en requisito sin evidencia;
- planificar optimizaciones funcionales como parte de refactor estructural.
