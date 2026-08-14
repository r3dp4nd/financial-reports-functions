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
- `dependsOn`;
- verification criteria;
- failure criteria;
- evidence refs;
- review requirement cuando aplique.

## requiredForMigration

`true` solo cuando la acción sea necesaria para completar o verificar el target aprobado.

`false` para deuda u optimización que puede posponerse.

## Categorías

Reutilizar las clasificaciones de analysis cuando sean útiles, pero la acción debe describir un cambio ejecutable y verificable, no repetir una necesidad abstracta.

## Plan como eval

Cada acción debe poder evaluarse después de ejecutarse por IA o humano:

- `expectedResult` describe el estado observable deseado;
- `verificationCriteria` describe cómo comprobarlo;
- `failureCriteria` describe señales de incumplimiento;
- `evidenceRefs` conectan la acción con discovery/assessment/analysis;
- `suggestedExecutor` orienta asignación, no sustituye revisión.
