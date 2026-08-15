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

Ejemplo:

```text
src/
├── functions/
│   └── generate-report.function.ts
└── generate-report/
    ├── application/
    │   └── generate-report.use-case.ts
    ├── domain/
    │   └── report.ts
    └── infrastructure/
        ├── report.repository.ts
        └── excel-report.generator.ts
```

Si `domain/` no aporta una abstracción real, no lo crees.

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

## Servicios monolíticos

No dividas por número de métodos. Divide cuando existan responsabilidades con diferentes razones de cambio.

Ejemplo de mezcla problemática:

```text
ReportService
├── consulta Cosmos
├── calcula reglas
├── genera Excel
├── sube Blob
└── publica Service Bus
```

Separación posible, solo si el código lo justifica:

```text
GenerateReportUseCase
├── ReportRepository
├── ReportGenerator
└── ReportStorage
```

## Recursos compartidos

Antes de mover o renombrar un componente, identifica consumidores.

Un repositorio, cliente o servicio utilizado por varias Functions no pertenece automáticamente a la capability que se está refactorizando. Trátalo mediante `migrate-shared-component` cuando el cambio sea transversal.

## Clientes Azure

Evita crear nuevos clientes de servicios en cada invocación cuando puedan reutilizarse de forma segura. Azure Functions recomienda reutilizar estado/clientes a nivel de módulo cuando sea apropiado, sin depender de que ese estado permanezca para siempre porque el worker puede reciclarse.

La composición debe mantener claro dónde se construyen estos clientes y cómo se inyectan hacia la aplicación.

## Testabilidad como criterio

Una buena separación debería permitir probar las reglas de aplicación sin:

- iniciar Azure Functions Core Tools;
- conectar a Cosmos/Service Bus/Blob reales;
- construir `InvocationContext` salvo que se esté probando el adapter.

## Señales de sobrearquitectura

Detente si aparecen:

- carpetas vacías;
- interfaces con una sola implementación sin motivo de sustitución;
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
