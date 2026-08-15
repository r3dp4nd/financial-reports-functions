# Estado actual de la Function App

> Documento BEFORE. No actualizar con estado posterior a la migración.

## Cómo leer este documento

Este documento es una fotografía factual del repositorio en un momento dado: cada dato viene de evidencia directa
(código, configuración, resultado determinista de `scripts/inventory.js`), nunca de una suposición. Los estados de
evidencia que verás en las tablas significan:

- **CONFIRMED** (confirmado): hay evidencia directa y suficiente.
- **INFERRED** (inferido): conclusión razonable a partir de señales parciales, no confirmada al 100%.
- **UNKNOWN** (desconocido): no hay evidencia suficiente todavía.
- **NOT_APPLICABLE** (no aplica): esa dimensión no corresponde a este repositorio.

El documento avanza de lo general a lo específico: primero la plataforma y el inventario de Functions, luego cómo
se relacionan entre sí (arquitectura y grafo), después las dependencias y configuración que sostienen ese
comportamiento, y cierra con los riesgos e incertidumbres que cualquier etapa posterior debe conocer antes de
avanzar.

## Resumen

- Repositorio:
- Function App(s):
- Fecha/evidencia:

## Estructura de directorios

La estructura de carpetas es el primer indicio de cómo está organizado el código — si hay una separación real por
capability, o si todo vive en carpetas planas sin distinción de responsabilidad. Generada de forma determinista por
`scripts/inventory.js` (campo `directoryTree`), reflejando literalmente los archivos y carpetas observados en la
Function App, excluyendo archivos protegidos y directorios ignorados (`node_modules`, `dist`, `.graphify`, etc.). No
editar a mano ni resumir.

```text
```

## Plataforma actual

Antes de mirar el código, conviene saber sobre qué versión de Node.js, Runtime y Programming Model está construido
el repositorio — esto determina qué reglas de migración aplican y qué riesgos de soporte existen. La fila "Azure
Functions Runtime" y "Programming Model" citan el requisito mínimo oficial exacto (`v4.25+` para runtime,
`@azure/functions v4.0.0+` en `dependencies` para modelo), no solo "v4" genérico — ver
`_shared/references/official-sources.md`.

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

Con la plataforma ya establecida, este inventario responde "¿qué hace este repositorio, concretamente?" — cada
Function con su disparador, su responsabilidad funcional y su papel dentro de un workflow Durable si aplica.

| Function | Trigger | Capability | Programming Model | Durable role | Detalle |
|---|---|---|---|---|---|

## Arquitectura observable

El inventario de Functions dice *qué* existe; esta sección explica *cómo* está organizado internamente — dónde
vive la lógica de negocio, qué tan separada está del runtime de Azure, y qué archivos concentran el mayor
acoplamiento.

- Organización del código:
- Puntos de entrada de Azure (adapters):
- Lógica de negocio (application/domain):
- Conexión a servicios externos (infraestructura):
- Dependencias importantes entre partes (acoplamientos):

### Diagrama de capas (organización interna de una capability representativa)

El diagrama siguiente traduce visualmente los puntos anteriores para una capability representativa — útil para
confirmar de un vistazo si existe separación real de capas o si todo vive mezclado en el mismo archivo.

```mermaid
flowchart TB
```

## Grafo auxiliar

Cuando Graphify/indexer estuvo disponible, esta sección deja trazabilidad de qué relaciones o slices se aceleraron
con el grafo — para que `analyze-function` pueda reusarlas sin repetir la consulta (ver
`_shared/references/graphify-usage.md` y `_shared/context-cache-policy.md`), y para que el lector sepa qué parte de
la arquitectura de arriba está respaldada también por análisis de conectividad, no solo por lectura manual.

- Graphify/indexer usado:
- Artifact: `.migration/00-before/graph/project-graph.json|md`

### Slices/relaciones aceleradas por el grafo

| Slice o relación | Nodos clave | Modo de consulta usado | Verificado contra source | Evidence status |
|---|---|---|---|---|

## Relaciones observables

Aquí se detalla, paso a paso, cada relación entre Functions y módulos que ya se insinuó en el diagrama de capas y en
el grafo auxiliar — la tabla es la versión verificable y exhaustiva de lo que el diagrama solo esbozó visualmente.

| Origen | Relación | Destino | Estado de evidencia | Evidencia |
|---|---|---|---|---|

## Diagrama observable

Este segundo diagrama resume la misma información de la tabla anterior, pero como flujo de extremo a extremo
(entrada externa → procesamiento → salida externa) — útil para ver el recorrido completo de un mensaje o request
sin tener que recorrer la tabla fila por fila.

```mermaid
flowchart LR
```

## Dependencias relevantes (paquetes de software usados)

Con la arquitectura interna ya clara, esta tabla responde qué paquetes externos sostienen ese comportamiento y
cuáles realmente se usan en el código — las columnas `usageDetected`/`usageScopeNote` provienen directamente de
`inventory.json` (calculadas de forma determinista buscando el nombre del paquete en imports/requires del código
fuente), no se descartan aunque parezcan redundantes con `package.json`.

| Package | Versión observable | Consumidores | usageDetected | Evidencia |
|---|---|---|---|---|

## Herramientas de calidad y pruebas (tooling de validación)

Antes de migrar cualquier cosa, conviene saber con qué red de seguridad se cuenta hoy — qué tan lista está la
Function App para validar que un cambio no rompió nada.

| Tooling | Archivo/comando | Estado | Evidencia |
|---|---|---|---|
| TypeScript | `tsconfig*.json` / scripts | | |
| Jest | `jest.config.*` / scripts | | |
| Coverage | `coverage` / `lcov` config | | |
| Sonar | `sonar-project.properties` / CI | | |
| CI validation | pipeline/template | | |

## Recursos compartidos o candidatos

Un recurso usado por más de una Function (mismo Cosmos DB, mismo Service Bus) es un punto de coordinación crítico
al migrar — cambiarlo sin avisar a todos sus consumidores puede romper algo que parecía no estar relacionado.

| Recurso | Consumidores | Estado de evidencia | Observación |
|---|---|---|---|

## Configuración requerida

Solo nombres de claves; nunca valores. La columna `sources` proviene de `inventory.json.configurationKeys[].sources`
(`SOURCE_CODE`/`FUNCTION_JSON_BINDING`/`V4_REGISTRATION_OPTION`) — una clave puede tener múltiples orígenes, lo cual
en sí mismo puede ser una señal de acoplamiento a revisar.

| Clave | Consumidor | Sources | Evidencia |
|---|---|---|---|

## Proveedores CI/CD detectados

Generado de forma determinista por `scripts/inventory.js` (campo `ciCdProviders`), agregando los providers
encontrados en `sensitiveFilesDetected` — su contenido nunca se lee (política de seguridad), solo se confirma su
existencia y proveedor.

| Provider |
|---|

## Archivos protegidos detectados

| Ruta | Categoría | Provider (si CI_CD) | contentRead |
|---|---|---|---|

## Riesgos e incertidumbres

Todo lo anterior fue inventario neutral; esta sección cierra señalando qué de todo eso merece atención antes de
avanzar — archivos difíciles de mantener, bugs ya confirmados, y preguntas que ninguna etapa posterior debería
asumir resueltas.

### Archivos con tamaño elevado

Generada de forma determinista por `scripts/inventory.js` (campo `largeFiles`), contando líneas de cada archivo de
source escaneado. Umbral: archivos con más de 300 líneas se consideran candidatos a revisión (posible god file /
falta de separación de responsabilidades). Evidencia siempre `CONFIRMED` (conteo de líneas es un hecho, no una
interpretación); no implica automáticamente que el archivo deba refactorizarse — solo señala dónde mirar primero.

| Archivo | Líneas | Umbral |
|---|---|---|

- Riesgos:
- Unknowns:

## Navegación

- Inventory: `.migration/00-before/inventory.json`
- Functions: `.migration/00-before/functions/`
