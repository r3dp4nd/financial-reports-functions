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

> Generada de forma determinista por `scripts/inventory.js` (campo `directoryTree`), reflejando literalmente los archivos y carpetas observados en la Function App, excluyendo archivos protegidos y directorios ignorados (`node_modules`, `dist`, `.graphify`, etc.). No editar a mano ni resumir.

```text
```

## Plataforma actual

> La fila "Azure Functions Runtime" y "Programming Model" deben citar el requisito mínimo oficial exacto
> (`v4.25+` para runtime, `@azure/functions v4.0.0+` en `dependencies` para modelo), no solo "v4" genérico.
> Ver `_shared/references/official-sources.md`.

| Dimensión | Estado observado | Requisito mínimo oficial | Evidencia |
|---|---|---|---|
| Node.js | | `v18+` (piso oficial del Programming Model v4) | |
| Azure Functions Runtime | | `v4.25+` | |
| Programming Model | | `@azure/functions v4.0.0+`, en `dependencies` | |
| Durable Functions | | paquete `durable-functions`: `2.x`→PM v3, `3.x`→PM v4 | |
| CI/CD provider(s) | | — | |

- Si Runtime detectado es v2/v3: citar riesgo de EOL (30/sep/2026 para Linux Consumption v3) según `_shared/references/official-sources.md`.
- Si `@azure/functions` está declarado en `devDependencies` en vez de `dependencies`: registrar como hallazgo, no solo como versión.

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

> Cuando Graphify/indexer fue usado, esta sección debe dejar trazabilidad de qué relaciones/slices se aceleraron con
> el grafo, para que `analyze-function` pueda reusarlas sin repetir la consulta (ver
> `_shared/references/graphify-usage.md` y `_shared/context-cache-policy.md`).

- Graphify/indexer usado:
- Artifact: `.migration/00-before/graph/project-graph.json|md`

### Slices/relaciones aceleradas por el grafo

| Slice o relación | Nodos clave | Modo de consulta usado | Verificado contra source | Evidence status |
|---|---|---|---|---|

## Relaciones observables

| Origen | Relación | Destino | Estado de evidencia | Evidencia |
|---|---|---|---|---|

## Diagrama observable

```mermaid
flowchart LR
```

## Dependencias relevantes (paquetes de software usados)

> Columnas `usageDetected`/`usageScopeNote` provienen directamente de `inventory.json` (calculadas de forma
> determinista buscando el nombre del paquete en imports/requires del código fuente) — no descartarlas.

| Package | Versión observable | Consumidores | usageDetected | Evidencia |
|---|---|---|---|---|

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

Solo nombres de claves; nunca valores. La columna `sources` proviene de `inventory.json.configurationKeys[].sources`
(`SOURCE_CODE`/`FUNCTION_JSON_BINDING`/`V4_REGISTRATION_OPTION`) — una clave puede tener múltiples orígenes.

| Clave | Consumidor | Sources | Evidencia |
|---|---|---|---|

## Proveedores CI/CD detectados

> Generado de forma determinista por `scripts/inventory.js` (campo `ciCdProviders`), agregando los providers
> encontrados en `sensitiveFilesDetected`.

| Provider |
|---|

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
