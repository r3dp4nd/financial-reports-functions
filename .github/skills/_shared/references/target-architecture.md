# Target Architecture

Esta referencia describe patrones transferibles para código migrado/refactorizado.

No copiar una estructura por imitación. Aplicar solo el patrón que preserve comportamiento y mejore testabilidad real del slice.

## Variante simple

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── handler.ts
    └── request-report.service.ts
```

## Variante con límites adicionales

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
    ├── application/
    ├── domain/
    └── infrastructure/
```

No crear directorios vacíos ni replicar esta forma si no aporta responsabilidad real.

## Azure adapters / composition roots

`src/functions/` debe concentrar, según aplique:

- registro del trigger;
- acceso al contexto Azure;
- composition root;
- construcción de dependencias concretas;
- llamada al handler/capability.

No introducir nueva lógica funcional allí.

## Handlers

Usar handlers testeables cuando el trigger requiera traducir runtime, contrato, errores o response.

El handler puede:

- leer request/message ya permitido por el runtime;
- validar forma básica del contrato;
- convertir a command/query/input interno;
- mapear resultados o errores conocidos a respuesta observable;
- registrar errores inesperados con el contexto disponible.

El handler no debe contener reglas de negocio profundas ni acceso directo a SDKs si existe un boundary mejor.

## Capabilities

Agrupar por responsabilidad funcional observable, no por categorías técnicas globales.

Evitar estructuras como:

```text
src/services/
src/repositories/
src/utils/
```

cuando mezclen capacidades sin ownership claro.

## Application / domain

Usar application/use cases para coordinar reglas, repositorios, publishers, storage o varias operaciones.

Usar domain cuando existan invariantes, estados, cálculos o errores con semántica propia.

No crear domain solo para alojar tipos pasivos.

## Contratos

Crear contratos solo ante boundaries reales, por ejemplo:

- persistencia;
- mensajería;
- storage;
- HTTP externo;
- SDK cuya adaptación debe aislarse.

No crear interfaces por consistencia estética.

## Shared resources

Un recurso usado por varias Functions puede permanecer dentro de una capability propietaria si ese ownership es claro. `src/shared/` es el último recurso, no el destino por defecto.

## Prohibido durante refactor estructural

- cambiar contratos observables sin acción aprobada;
- optimizar reglas funcionales descubiertas;
- fusionar/simplificar pasos de workflow para "mejorar" el diseño;
- cambiar retry/failure/idempotency/concurrency semantics sin aprobación;
- agregar capas, factories o interfaces que no reduzcan acoplamiento real.
