# Modelo de acciones

## IDs

- `GLOBAL-*`: cambios de Function App/repository con alcance global (herramientas, dependencias, runtime, Programming Model);
- `SR-ACTION-*`: cambio propietario de un shared resource;
- `FN-*`: cambio local de una Function individual.

No crear un ID agrupado tipo slice. Cuando varias Functions formen parte de un mismo workflow Durable u otro flujo
coordinado, cada una recibe su propio `FN-*`, con `dependsOn` explícito hacia las Functions relacionadas cuando el
orden de ejecución deba preservarse.

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
- review requirement cuando aplique;
- `executionGuide` (obligatorio para toda acción que toque código o configuración).

## executionGuide

Cada acción que implique un cambio de código, configuración o dependencias debe incluir una guía de ejecución
suficiente para que un dev humano o un agente de IA la siga literalmente sin releer el repositorio completo ni
inferir el "cómo". Debe contener:

- comandos exactos de instalación/desinstalación de dependencias (con versiones), cuando la acción toque `package.json`;
- árbol de carpetas "antes → después" cuando la acción mueva, cree o elimine archivos/carpetas;
- fragmento de código real "antes", extraído del BEFORE (no descrito de forma abstracta);
- fragmento de código real "después", con el patrón destino aplicado al caso específico de esa acción;
- pasos numerados (1, 2, 3...) en orden de ejecución, no solo un grafo de dependencias entre IDs;
- comando(s) de verificación concreto(s) con el resultado esperado literal (no una descripción genérica como
  "build exitoso" sin más detalle).

Si el BEFORE no contiene suficiente evidencia para construir un `executionGuide` real, la acción requiere review en
vez de fabricar un ejemplo genérico.

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
- `verificationCriteria` describe cómo comprobarlo, con comando y resultado esperado cuando sea posible;
- `failureCriteria` describe señales de incumplimiento;
- `evidenceRefs` conectan la acción con discovery/assessment/analysis;
- `executionGuide` conecta la acción con el código y los comandos reales necesarios para implementarla;
- `suggestedExecutor` orienta asignación, no sustituye revisión.
