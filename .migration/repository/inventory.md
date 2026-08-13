# Inventario de Azure Functions

## Resumen

Se detectó 1 Function App.

| Dimensión         | Detectado | Estado    |
|-------------------|----------:|-----------|
| Node.js           |        14 | CONFIRMED |
| Functions Runtime |        v3 | CONFIRMED |
| Programming Model |        v3 | CONFIRMED |
| TypeScript        |       4.0 | CONFIRMED |
| Durable Functions |        Sí | CONFIRMED |

## Functions

| Function           | Trigger       | Durable Role |
|--------------------|---------------|--------------|
| RequestReport      | HTTP          | -            |
| ReportOrchestrator | Orchestration | Orchestrator |

## Configuración requerida

Se detectaron las siguientes claves:

- `COSMOS_DATABASE`
- `SERVICE_BUS_CONNECTION`

No se inspeccionaron valores.

Para futuras validaciones locales será necesario proporcionar una configuración sanitizada o aprobada.

## Relaciones detectadas

- `RequestReport` parece iniciar `ReportOrchestrator` — **INFERRED**
- Se detectó un workflow Durable — **INFERRED**

## Desconocidos

Ninguno por el momento.

## Siguiente acción sugerida

Revisar el inventario y ejecutar `assess-function-app`.
