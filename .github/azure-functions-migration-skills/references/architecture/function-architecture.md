# Arquitectura objetivo de una Function

## Propósito

Definir el criterio arquitectónico mínimo del toolkit para desacoplar Azure Functions sin imponer capas ceremoniales.

Esta referencia es una **decisión del toolkit**, no un requisito de Azure Functions.

## Principio

La integración con Azure debe quedar en el borde. La lógica de negocio no debería depender innecesariamente de `InvocationContext`, bindings ni clientes concretos de Azure SDK.

Objetivo conceptual:

```text
Azure Function adapter / composition root
                │
                ▼
          aplicación / caso de uso
                │
        ┌───────┴────────┐
        ▼                ▼
     dominio        puertos necesarios
                         │
                         ▼
                  infraestructura
```

No todas las Functions necesitan todos los elementos.

## Organización por capability

Prefiere mantener juntos los elementos que cambian por la misma razón de negocio.

Estructura base:

```text
src/
├── functions/
│   └── <function-name>.function.ts
└── <CapabilityName>/
    ├── handler.ts
    ├── handler.spec.ts
    ├── application/
    │   ├── use-cases/
    │   ├── commands/
    │   ├── queries/
    │   ├── results/
    │   ├── events/
    │   └── ports/
    ├── domain/
    │   ├── models/
    │   ├── types/
    │   ├── ports/
    │   └── errors/
    └── infrastructure/
        ├── persistence/
        ├── messaging/
        ├── storage/
        └── document/
```

No crees subcarpetas vacías. Si una capa tiene pocos archivos y una sola responsabilidad, puede permanecer plana durante una migración intermedia. Cuando la capa mezcle responsabilidades, organiza antes de seguir creciendo.

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

## Responsabilidad del adapter Azure

Idealmente se limita a:

1. recibir trigger/input;
2. mapear al contrato de aplicación;
3. invocar el caso de uso;
4. mapear resultado/error al contrato Azure.

Un handler no necesita ser artificialmente pequeño si el código adicional sigue siendo estrictamente de adaptación.

## Cuándo crear un puerto

Crea un puerto/interfaz cuando:

- la aplicación depende de infraestructura que debe sustituirse en tests;
- existe más de una implementación real o previsible por requisito;
- el contrato expresa una capacidad del negocio mejor que el SDK concreto.

No crees una interfaz únicamente porque existe una clase.

Ubicación recomendada:

- `domain/ports/` si el contrato representa una capacidad del dominio o una dependencia necesaria para reglas de dominio.
- `application/ports/` si el contrato pertenece a la orquestación del caso de uso, por ejemplo publicar un evento de integración.

## Servicios monolíticos

No dividas por número de métodos. Divide cuando existan responsabilidades con diferentes razones de cambio.

Ejemplo de mezcla problemática:

```text
CapabilityService
├── consulta Cosmos
├── calcula reglas
├── genera Excel
├── sube Blob
└── publica Service Bus
```

Separación posible, solo si el código lo justifica:

```text
ExecuteCapabilityUseCase
├── CapabilityRepository
├── DocumentGenerator
└── ObjectStorage
```

## Recursos compartidos

Antes de mover o renombrar un componente, identifica consumidores.

Un repositorio, cliente o servicio utilizado por varias Functions no pertenece automáticamente a la capability que se está refactorizando. Trátalo mediante `migrate-shared-component` cuando el cambio sea transversal.

## Clientes Azure

Evita crear nuevos clientes de servicios en cada invocación cuando puedan reutilizarse de forma segura. Azure Functions recomienda reutilizar estado/clientes a nivel de módulo cuando sea apropiado, sin depender de que ese estado permanezca para siempre porque el worker puede reciclarse.

La composición debe mantener claro dónde se construyen estos clientes y cómo se inyectan hacia la aplicación.

## Dependency Injection

La dependency injection debe reducir acoplamiento real y mejorar testabilidad. No requiere introducir un contenedor si la composición manual es suficiente.

Patrón recomendado:

```text
*.function.ts
  └── construye clients/adapters/use cases una vez a nivel módulo
      └── crea handler con dependencias explícitas
          └── handler invoca caso de uso
              └── caso de uso depende de puertos
                  └── infraestructura implementa puertos
```

Reglas:

- usa `*.function.ts` como composition root del runtime Azure;
- inyecta dependencias en handlers mediante factory explícita cuando aporte testabilidad;
- inyecta puertos/adapters en casos de uso mediante constructor o factory simple;
- reutiliza clientes Azure a nivel módulo cuando sea seguro;
- evita service locators globales;
- evita contenedores DI si no existe complejidad real que los justifique;
- no crees interfaces únicamente para satisfacer un patrón de inyección.

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

## Criterio de finalización

El refactor termina cuando:

- Azure queda en el borde razonable;
- las reglas de negocio están separadas del runtime;
- infraestructura tiene límites claros donde aportan valor;
- el código es testeable;
- no se introdujeron abstracciones sin necesidad.

## Fuente complementaria

- Azure Functions Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
