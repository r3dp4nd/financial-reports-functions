# Artifacts de planning

## Plan global

Owner de:

- target referenciado;
- requested/effective scope;
- reestructuración de carpetas/tooling de toda la Function App (Node.js, Azure Functions Runtime, Programming Model,
  dependencias base) con comandos exactos de instalación/desinstalación;
- workstreams/lanes;
- acciones globales (`GLOBAL-*`);
- shared resource actions (`SR-ACTION-*`);
- suggested executors;
- orden/dependencies globales;
- evaluation contract para ejecución humana o IA;
- risks/unknowns que afectan ejecución;
- estado del plan.

El plan global es la única fuente de verdad para instalación/actualización de herramientas y para ownership de
recursos compartidos. No repetir esos comandos ni esa decisión dentro de cada plan por Function; referenciar el
Action ID correspondiente.

Usar `../templates/migration-plan.template.md` para Markdown.

Ruta nueva: `.migration/30-plan/migration-plan.json|md`.

## Plan por Function

Uno por cada Function individual, sin agrupar varias Functions en un plan colectivo tipo slice. Cuando varias
Functions formen parte de un mismo workflow Durable u otro flujo coordinado, cada una recibe su propio plan `FN-*`
con `dependsOn` explícito hacia las Functions relacionadas para preservar el orden observado.

Owner de:

- acciones `FN-*` de esa Function;
- dependencias hacia el plan global y hacia shared resource actions;
- dependencias hacia otras Functions (`dependsOn`) cuando el orden de un workflow deba preservarse;
- aplicabilidad de Programming Model/Durable para esa Function específica;
- lane y executor sugerido por acción;
- criterios verificables locales;
- `executionGuide` completo por cada acción: código real antes/después, árbol de carpetas antes/después, comandos
  exactos, pasos numerados, y comando de verificación con resultado esperado literal.

Cada plan por Function debe leerse como un manual: un dev o QA debe poder ejecutarlo paso a paso sin releer el
código fuente por su cuenta ni inferir cómo aplicar el cambio.

Usar `../templates/function-migration-plan.template.md`.

Ruta nueva: `.migration/30-plan/functions/<FunctionName>/migration-plan.json|md`.

## Shared resources

Usar `../templates/shared-resources.template.md` cuando aplique.

No duplicar la acción propietaria dentro de cada Function; referenciarla.

Ruta nueva: `.migration/30-plan/resources/shared-resources.json|md`.

## Evaluation contract

El plan debe ser suficiente para verificar ejecución posterior:

- cada acción tiene expected result;
- cada acción tiene verification/failure criteria con comando y resultado esperado cuando sea posible;
- cada acción tiene `executionGuide` cuando toca código, configuración o dependencias;
- cada acción conserva evidence refs;
- execution artifacts deben reportar esos Action IDs sin reinterpretarlos.
