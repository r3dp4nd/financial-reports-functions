# Naming y cobertura

## Cuándo cargar

Carga esta referencia cuando necesites aplicar naming objetivo, distinguir contratos de comportamiento o alinear Jest/Sonar con la estructura propuesta.

## Naming objetivo

Usa nombres para distinguir comportamiento testeable de contratos no testeables.

### Azure

- `src/functions/<function-name>.function.ts`: registro Programming Model v4.
- `src/functions/activities/<activity-name>.function.ts`: registro de Durable activity.
- `src/<Capability>/handler.ts`: adapter testeable entre runtime Azure y aplicación.
- `src/<Capability>/handler.spec.ts`: tests del adapter cuando haya mapping, errores o metadata relevantes.

### Application

- `application/use-cases/<action>.use-case.ts`: comportamiento de aplicación.
- `application/use-cases/<action>.use-case.spec.ts`: tests del caso de uso.
- `application/commands/<action>.command.ts`: contrato de entrada de comando.
- `application/queries/<action>.query.ts`: contrato de entrada de consulta.
- `application/results/<action>.result.ts`: contrato de salida.
- `application/events/<event>.integration-event.ts`: contrato de evento de integración.
- `application/ports/<capability>.publisher.ts`: puerto requerido por el caso de uso.

### Domain

- `domain/models/<concept>.ts`: modelo con comportamiento o reglas.
- `domain/models/<concept>.spec.ts`: tests del modelo.
- `domain/types/<concept>.types.ts`: tipos puros sin comportamiento.
- `domain/ports/<capability>.repository.ts`: puerto de persistencia.
- `domain/ports/<capability>.generator.ts`: puerto de generación.
- `domain/ports/<capability>.storage.ts`: puerto de almacenamiento.
- `domain/errors/<reason>.error.ts`: error propio de dominio.

### Infrastructure

Las implementaciones concretas deben llevar prefijo de tecnología/proveedor y sí son testeables:

- `infrastructure/persistence/cosmos-<capability>.repository.ts`;
- `infrastructure/messaging/service-bus-<event>.publisher.ts`;
- `infrastructure/storage/blob-<capability>.storage.ts`;
- `infrastructure/document/exceljs-<capability>.generator.ts`;
- `infrastructure/durable/durable-<capability>.client.ts` cuando aplique.

No uses el mismo naming para un puerto y una implementación. El puerto expresa capacidad; la implementación expresa tecnología.

## Testabilidad como criterio

Una buena separación debería permitir probar las reglas de aplicación sin:

- iniciar Azure Functions Core Tools;
- conectar a Cosmos/Service Bus/Blob reales;
- construir `InvocationContext` salvo que se esté probando el adapter.

La estructura debe permitir que coverage distinga por convención:

- contratos: excluidos por sufijo o carpeta `ports/`;
- composition roots: excluidos por `*.function.ts`;
- comportamiento: incluido en `handler.ts`, `application/use-cases/`, `domain/models/` e `infrastructure/`.

## Señales de sobrearquitectura

Detente si aparecen:

- carpetas vacías;
- interfaces con una sola implementación sin motivo de sustitución;
- archivos contractuales con nombres ambiguos que Jest/Sonar no puedan excluir por convención;
- `Manager`, `Helper`, `Facade` o `Factory` sin responsabilidad clara;
- wrappers que solo reenvían una llamada del SDK;
- mappers triviales creados únicamente para cumplir una plantilla.
