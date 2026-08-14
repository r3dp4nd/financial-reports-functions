# Reglas de planning

## Scope

`requestedScope` representa lo solicitado inicialmente.

`effectiveScope` incluye todo lo que debe migrarse coordinadamente para completar el target de forma coherente, por ejemplo participantes de un workflow Durable o consumidores afectados por un shared resource modificado.

Registrar Functions afectadas fuera del requested scope.

## Rol del plan

El plan es un contrato de ejecución y evaluación. Debe servir para:

- orientar a un dev humano;
- orientar a un agente de IA;
- permitir verification sin reinterpretar intención;
- comparar ejecución real contra resultado esperado.

No es documentación narrativa. Cada acción debe tener resultado verificable.

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
3. crear una única acción propietaria;
4. hacer depender adaptaciones consumidoras de esa acción cuando corresponda.

## Orden conceptual

```text
shared/global prerequisites
→ preparation global
→ preparation local
→ Programming Model migration cuando aplique
→ Durable migration cuando aplique
→ refactor/testability lane cuando esté aprobado
→ verification global
```

El plan puede ajustar el orden por dependencias reales.

## Arquitectura

Para todo slice que vaya a refactorizarse, planificar la convergencia mínima a la arquitectura objetivo. No crear carpetas/layers que no tengan uso real.

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
- comando/check de validación aplicable;
- evidencia BEFORE que justifica la acción;
- qué sería fallo para verification.

Si una acción no puede tener criterio verificable, no está lista para planning.
