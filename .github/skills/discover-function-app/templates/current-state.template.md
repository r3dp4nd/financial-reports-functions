# Estado actual de la Function App

> Documento BEFORE. No actualizar con estado posterior a la migración.

## Cómo leer este documento

Los estados de evidencia usados en las tablas significan:

- **CONFIRMED** (confirmado): hay evidencia directa y suficiente.
- **INFERRED** (inferido): conclusión razonable a partir de señales parciales, no confirmada al 100%.
- **UNKNOWN** (desconocido): no hay evidencia suficiente todavía.
- **NOT_APPLICABLE** (no aplica): esa dimensión no corresponde a este repositorio.

## Resumen

- Repositorio:
- Function App(s):
- Fecha/evidencia:

## Estructura de directorios

> Generada de forma determinista por `scripts/inventory.js` (campo `directoryTree`), reflejando literalmente los archivos y carpetas observados en la Function App, excluyendo archivos protegidos y directorios ignorados (`node_modules`, `dist`, etc.). No editar a mano ni resumir.

```text
```

## Plataforma actual

| Dimensión | Estado observado | Evidencia |
|---|---|---|
| Node.js | | |
| Azure Functions Runtime | | |
| Programming Model | | |
| Durable Functions | | |
| CI/CD provider(s) | | |

## Functions

| Function | Trigger | Capability | Programming Model | Durable role | Detalle |
|---|---|---|---|---|---|

## Arquitectura observable

- Organización del código:
- Puntos de entrada de Azure (adapters):
- Lógica de negocio (application/domain):
- Conexión a servicios externos (infraestructura):
- Dependencias importantes entre partes (acoplamientos):

### Diagrama de capas (organización interna de una capability representativa)

```mermaid
flowchart TB
```

## Grafo auxiliar

- Graphify/indexer usado:
- Artifact:
- Uso en discovery:

## Relaciones observables

| Origen | Relación | Destino | Estado de evidencia | Evidencia |
|---|---|---|---|---|

## Diagrama observable

```mermaid
flowchart LR
```

## Dependencias relevantes (paquetes de software usados)

| Package | Versión observable | Consumidores | Evidencia |
|---|---|---|---|

## Herramientas de calidad y pruebas (tooling de validación)

| Tooling | Archivo/comando | Estado | Evidencia |
|---|---|---|---|
| TypeScript | `tsconfig*.json` / scripts | | |
| Jest | `jest.config.*` / scripts | | |
| Coverage | `coverage` / `lcov` config | | |
| Sonar | `sonar-project.properties` / CI | | |
| CI validation | pipeline/template | | |

## Recursos compartidos o candidatos

| Recurso | Consumidores | Estado de evidencia | Observación |
|---|---|---|---|

## Configuración requerida

Solo nombres de claves; nunca valores.

| Clave | Consumidor | Evidencia |
|---|---|---|

## Archivos protegidos detectados

| Ruta | Categoría | Provider (si CI_CD) | contentRead |
|---|---|---|---|

## Riesgos e incertidumbres

### Archivos con tamaño elevado

> Generada de forma determinista por `scripts/inventory.js` (campo `largeFiles`), contando líneas de cada archivo de source escaneado. Umbral: archivos con más de 300 líneas se consideran candidatos a revisión (posible god file / falta de separación de responsabilidades). Evidencia siempre `CONFIRMED` (conteo de líneas es un hecho, no una interpretación); no implica automáticamente que el archivo deba refactorizarse — solo señala dónde mirar primero.

| Archivo | Líneas | Umbral |
|---|---|---|

- Riesgos:
- Unknowns:

## Navegación

- Inventory: `.migration/00-before/inventory.json`
- Functions: `.migration/00-before/functions/`
