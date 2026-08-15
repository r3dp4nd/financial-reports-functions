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

## Naming, cobertura y DI

Carga `naming-and-coverage.md` cuando necesites aplicar sufijos, carpetas y criterios de coverage.

Carga `di-and-composition.md` cuando necesites crear puertos, factories, composition roots o inyección explícita.

## Servicios monolíticos

No dividas por número de métodos. Divide cuando existan responsabilidades con diferentes razones de cambio.

Cuando el servicio o god file mezcle varias capabilities o tenga consumidores múltiples, carga `capability-slicing.md` antes de proponer movimientos.

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

## Criterio de finalización

El refactor termina cuando:

- Azure queda en el borde razonable;
- las reglas de negocio están separadas del runtime;
- infraestructura tiene límites claros donde aportan valor;
- el código es testeable;
- no se introdujeron abstracciones sin necesidad.

## Fuente complementaria

- Azure Functions Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
