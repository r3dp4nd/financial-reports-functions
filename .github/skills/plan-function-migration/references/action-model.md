# Modelo de acciones

## IDs

- `GLOBAL-*`: cambios de Function App/repository con alcance global;
- `SR-ACTION-*`: cambio propietario de un shared resource;
- `FN-*`: cambio local de una Function.

Preservar IDs durante execution y verification.

## Campos mínimos

Cada acción debe expresar:

- `id`;
- classification/type;
- owner;
- scope;
- `requiredForMigration`;
- rationale;
- expected result;
- `dependsOn`;
- verification criteria;
- evidence refs;
- review requirement cuando aplique.

## requiredForMigration

`true` solo cuando la acción sea necesaria para completar o verificar el target aprobado.

`false` para deuda u optimización que puede posponerse.

## Categorías

Reutilizar las clasificaciones de analysis cuando sean útiles, pero la acción debe describir un cambio ejecutable y verificable, no repetir una necesidad abstracta.
