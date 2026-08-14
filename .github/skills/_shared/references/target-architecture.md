# Arquitectura objetivo

Esta referencia describe la forma mínima esperada para código migrado/refactorizado.

## Variante simple

```text
src/
├── functions/
│   └── request-report.function.ts
└── RequestReport/
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

## Azure adapters

`src/functions/` debe concentrar, según aplique:

- registro del trigger;
- adaptación de request/message;
- acceso al contexto Azure;
- composition root;
- traducción de response.

No introducir nueva lógica funcional allí.

## Capabilities

Agrupar por responsabilidad funcional observable, no por categorías técnicas globales.

Evitar estructuras como:

```text
src/services/
src/repositories/
src/utils/
```

cuando mezclen capacidades sin ownership claro.

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
