# Reglas de Programming Model v4

## Registration

Transformar el entrypoint v3 hacia registration v4 equivalente, preservando:

- trigger;
- route/methods;
- auth level;
- queue/topic/subscription names;
- timer schedule;
- binding names relevantes;
- comportamiento observable.

Usar documentación oficial cuando una API concreta no esté materializada en el plan.

## Dependencia `@azure/functions`

No instalar `latest`. Consumir la versión target aprobada.

## function.json

Eliminar `function.json` legacy únicamente cuando:

- la registration v4 equivalente existe;
- el plan lo exige;
- no se pierde un binding/setting observable.

## Bindings

No simplificar ni renombrar bindings por estilo durante la migración.

## Durable

Si la Function participa en Durable, respetar ownership del skill Durable. El adapter/starter puede requerir coordinación, pero topology/orchestrator semantics no se reescriben aquí salvo acción explícitamente propiedad de esta etapa.

## Validación

Comprobar como mínimo:

- registration v4 observable;
- no coexistencia legacy no aprobada;
- imports/dependencies coherentes;
- typecheck local/selectivo cuando sea viable;
- comportamiento estructural preservado según BEFORE/PLAN.
