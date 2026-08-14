# Test Generation Rules

## Clasificación

### TESTABLE_NOW

Módulo puro o con dependencias inyectables:

- domain behavior;
- use case con repository/publisher mocked;
- handler factory con use case mocked;
- mapper/serializer/presenter.

### TESTABLE_WITH_MOCKS

Módulo con SDK/config/context aislable mediante mocks existentes o constructor injection.

### NOT_TESTABLE_RUNTIME

Composition root Azure, `app.http`, `app.timer`, `df.app.activity`, `df.app.orchestration` o módulo que ejecuta side effects al importar.

### PASSIVE_CONTRACT

Tipos, commands, queries, results, interfaces puras, declarations de repository/publisher/storage sin comportamiento.

### REQUIRES_REFACTOR

Lógica mezclada con runtime, SDK real, tiempo/random/global config o I/O directo sin boundary.

## Qué generar

Priorizar:

1. handler behavior: input válido, input inválido, error conocido, error inesperado;
2. use case behavior: happy path, validaciones, llamadas a boundary, errores de dominio;
3. domain invariants;
4. infrastructure adapters solo con clients mocked y patrón existente.

## Qué no generar

- tests para `src/functions/*.function.ts` salvo Action ID específico;
- tests para archivos `.types.ts`, `.command.ts`, `.query.ts`, `.result.ts`;
- tests que dependan de secretos;
- tests que cambien comportamiento para facilitar assertions;
- snapshots como sustituto de assertions de contrato.

## Ubicación

Seguir patrón local:

- mismo folder: `<module>.spec.ts`;
- folder `tests/` solo si ya existe en la capability.

No mover tests existentes.

## Validación

Usar scripts existentes:

- test focal con Jest si es viable;
- `npm test -- --runInBand <path>` cuando compatible;
- typecheck si test focal no es práctico.

Reportar comandos no ejecutados y motivo.
