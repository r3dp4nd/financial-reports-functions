# Modelo de acciones

## IDs

- `GLOBAL-*`: cambios de Function App/repository con alcance global;
- `SR-ACTION-*`: cambio propietario de un shared resource;
- `FN-*`: cambio local de una Function;
- `SLICE-*`: cambio propietario de un workflow/capability/slice que agrupa varias Functions.

Preservar IDs durante execution y verification.

## Campos mínimos

Cada acción debe expresar:

- `id`;
- classification/type;
- lane: `TECHNICAL_MIGRATION`, `REFACTOR_TESTABILITY`, `VALIDATION` o `DEBT_OPTIONAL`;
- owner;
- scope;
- suggestedExecutor: `AI_AGENT`, `HUMAN` o `EITHER`;
- `requiredForMigration`;
- `requiredForRefactor` cuando aplique;
- rationale;
- expected result;
- preserve behavior;
- prohibited changes;
- `dependsOn`;
- verification criteria;
- failure criteria;
- evidence refs;
- review requirement cuando aplique.

## requiredForMigration

`true` solo cuando la acción sea necesaria para completar o verificar el target aprobado.

`false` para deuda u optimización que puede posponerse.

## Preserve behavior

Cada acción que toque código o configuración debe declarar qué comportamiento descubierto debe permanecer estable, por ejemplo:

- trigger/binding/ruta/schedule;
- payload, response, status/error code;
- estado de dominio;
- retry/idempotencia/concurrencia;
- mensaje publicado, documento persistido, blob generado o side effect externo.

Si el comportamiento no está suficientemente conocido, la acción requiere review o analysis adicional.

## Prohibited changes

Listar cambios que verification debe tratar como fallo salvo Action ID explícito:

- optimizar reglas funcionales;
- cambiar topology Durable/outbox;
- renombrar recursos observables;
- simplificar failure handling/retries;
- alterar contratos externos.

## Categorías

Reutilizar las clasificaciones de analysis cuando sean útiles, pero la acción debe describir un cambio ejecutable y verificable, no repetir una necesidad abstracta.

## Plan como eval

Cada acción debe poder evaluarse después de ejecutarse por IA o humano:

- `expectedResult` describe el estado observable deseado;
- `preserveBehavior` describe qué no debe cambiar;
- `prohibitedChanges` describe desviaciones que fallan verification;
- `verificationCriteria` describe cómo comprobarlo;
- `failureCriteria` describe señales de incumplimiento;
- `evidenceRefs` conectan la acción con discovery/assessment/analysis;
- `suggestedExecutor` orienta asignación, no sustituye revisión.
