# Reglas de planning

## Scope

`requestedScope` representa lo solicitado inicialmente.

`effectiveScope` incluye todo lo que debe migrarse coordinadamente para completar el target de forma coherente, por ejemplo participantes de un workflow Durable o consumidores afectados por un shared resource modificado.

Registrar Functions afectadas fuera del requested scope.

## Rol del plan

El plan es un contrato de ejecución y evaluación. Debe servir para:

- orientar a un dev humano como manual paso a paso, sin que tenga que releer el código fuente por su cuenta;
- orientar a un agente de IA;
- permitir verification sin reinterpretar intención;
- comparar ejecución real contra resultado esperado.

No es documentación narrativa. Cada acción debe tener resultado verificable y, cuando toque código, configuración o
dependencias, un `executionGuide` con código real antes/después, comandos exactos y pasos numerados (ver
`action-model.md`).

## Estructura del plan: global + por Function

El plan siempre se organiza en dos niveles, sin un nivel intermedio de slice:

- **Plan global**: única fuente de verdad para instalación/actualización de herramientas (Node.js, Azure Functions
  Runtime, Programming Model, dependencias base) y para ownership de shared resources (`GLOBAL-*`, `SR-ACTION-*`).
- **Plan por Function**: uno por cada Function individual (`FN-*`), incluso cuando varias Functions formen parte de
  un mismo workflow Durable, Outbox u otro flujo coordinado. En ese caso, cada Function recibe su propio plan y
  declara `dependsOn` explícito hacia las Functions relacionadas para preservar el orden de ejecución observado
  (por ejemplo, el orchestrator depende de que sus activities ya tengan su acción de migración definida, o viceversa
  según el orden real de implementación).

No crear un plan agrupado tipo slice. Esta estructura es más escalable: agregar o quitar Functions no obliga a
reestructurar planes colectivos, y cada plan por Function es autocontenible para que un dev lo tome y ejecute de
forma independiente.

## Carriles de trabajo

Separar acciones por lane:

- `TECHNICAL_MIGRATION`: Node 24, Runtime v4, Programming Model v4, Durable API, package targets y compatibilidad mínima;
- `REFACTOR_TESTABILITY`: reestructuración, separación runtime/lógica, reducción de acoplamiento, boundaries reales y testabilidad;
- `VALIDATION`: checks necesarios para probar la ejecución;
- `DEBT_OPTIONAL`: deuda no requerida para completar el objetivo.

No mezclar refactor amplio con migración técnica si puede ejecutarse después. Si una refactorización es precondición para migrar con seguridad, marcarla en `TECHNICAL_MIGRATION` con rationale.

## Executor sugerido

Cada acción debe indicar `suggestedExecutor`:

- `AI_AGENT`: cambio mecánico, acotado, con criterios claros y tests/checks disponibles;
- `HUMAN`: requiere decisión de negocio, trade-off arquitectónico, secretos/configuración protegida o alto riesgo operacional;
- `EITHER`: cambio claro pero merece revisión humana normal.

El executor sugerido no cambia ownership ni elimina review requirements.

## Shared resources primero

Para cada recurso confirmado:

1. identificar owner;
2. identificar consumidores;
3. crear una única acción propietaria (`SR-ACTION-*`) dentro del plan global;
4. hacer depender las acciones `FN-*` de las Functions consumidoras de esa acción propietaria cuando corresponda.

## Orden conceptual

```text
shared/global prerequisites (plan global: herramientas + ownership)
→ preparation global
→ preparation local por Function
→ Programming Model migration cuando aplique (por Function, respetando dependsOn entre Functions relacionadas)
→ Durable migration cuando aplique (por Function, respetando dependsOn entre Functions relacionadas)
→ refactor/testability lane cuando esté aprobado
→ verification global
```

El plan puede ajustar el orden por dependencias reales.

## Arquitectura

Para toda Function que vaya a refactorizarse, planificar la convergencia mínima a la arquitectura objetivo. No crear carpetas/layers que no tengan uso real.

## Preservación funcional

La arquitectura objetivo no autoriza optimizar comportamiento.

Para cada acción que toque código o configuración:

- declarar comportamiento a preservar;
- declarar cambios prohibidos;
- requerir revisión humana si el BEFORE no permite saber qué preservar;
- bloquear acciones que mezclen refactor estructural con cambio funcional no aprobado.

## V4 existente

Si una Function ya está en Programming Model v4, no crear acción de migración de modelo. Planificar solo las dimensiones faltantes.

## Unknowns

Una incertidumbre que impide definir resultado verificable debe bloquear o requerir revisión; no fabricar una acción vaga para ocultarla.

## Criterios de evaluación

Cada acción debe incluir:

- expected result observable;
- preserve behavior;
- prohibited changes;
- archivos o patrones esperados cuando sea seguro;
- comando/check de validación aplicable, con el resultado esperado literal;
- evidencia BEFORE que justifica la acción;
- `executionGuide` cuando la acción toca código, configuración o dependencias;
- qué sería fallo para verification.

Si una acción no puede tener criterio verificable, no está lista para planning.
