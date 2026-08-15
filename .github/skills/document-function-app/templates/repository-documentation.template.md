# <Nombre de la Function App> — Documentación de referencia

> Documento de línea base, regenerable. No es evidencia de una migración en curso; es un documento de referencia
> reutilizable ante cualquier cambio futuro (onboarding, auditoría, migración, refactor, nueva feature).

## Cómo leer este documento

- **CONFIRMED** (confirmado): hay evidencia directa y suficiente.
- **INFERRED** (inferido): conclusión razonable a partir de señales parciales, no confirmada al 100%.
- **UNKNOWN** (desconocido): no hay evidencia suficiente todavía.
- **NOT_APPLICABLE** (no aplica): esa dimensión no corresponde a este repositorio.

El documento avanza de lo general a lo específico: primero qué es este repositorio y sobre qué plataforma corre,
luego cómo está organizado internamente y qué Functions contiene, después las dependencias y configuración que lo
sostienen, y cierra con la sección más importante — complejidad y deuda técnica — antes de indicar cómo ejecutarlo.

## 1. Visión general

- Repositorio:
- Function App(s):
- Qué hace (2-4 frases, sin jerga técnica, derivado solo de evidencia observable):
- Fecha/evidencia base:

## 2. Plataforma

Antes de entrar en el código, conviene saber sobre qué versión de Node.js, Runtime y Programming Model está
construido — esto determina qué reglas de migración aplicarían si algún día se decide actuar sobre este repositorio.

| Dimensión | Estado observado | Requisito mínimo oficial | Evidencia |
|---|---|---|---|
| Node.js | | `v18+` | |
| Azure Functions Runtime | | `v4.25+` | |
| Programming Model | | `@azure/functions v4.0.0+` en `dependencies` | |
| Durable Functions | | paquete `durable-functions`: `2.x`→PM v3, `3.x`→PM v4 | |
| CI/CD provider(s) | | — | |

- Si Runtime detectado es v2/v3: citar riesgo de EOL (`_shared/references/official-sources.md`).

## 3. Arquitectura observable

Con la plataforma ya establecida, esta sección explica cómo está organizado el código internamente — dónde vive la
lógica de negocio y qué tan separada está del runtime de Azure.

- Organización del código:
- Puntos de entrada de Azure (adapters):
- Lógica de negocio (application/domain):
- Conexión a servicios externos (infraestructura):
- Dependencias importantes entre partes (acoplamientos):

### Diagrama de arquitectura

El diagrama siguiente traduce visualmente los puntos anteriores.

```mermaid
flowchart TB
```

### Estructura de directorios

```text
```

## 4. Inventario de Functions

Con la arquitectura ya clara, este inventario detalla cada Function concreta — mismo nivel de detalle para
Functions legacy (`function.json`) y modernas (`app.X(...)`).

| Function | Trigger | Capability | Programming Model | Durable role | Complejidad | Detalle |
|---|---|---|---|---|---|---|

## 5. Dependencias

Las Functions de arriba se sostienen sobre paquetes externos concretos — esta tabla confirma cuáles realmente se
usan en el código (`usageDetected`), no solo cuáles están declaradas en `package.json`.

| Package | Versión | Consumidores | usageDetected | Evidencia |
|---|---|---|---|---|

- Candidatas a limpieza (`usageDetected: false`):

## 6. Configuración

Solo nombres de claves; nunca valores.

| Clave | Consumidor | Sources | Evidencia |
|---|---|---|---|

## 7. Recursos compartidos

Un recurso usado por más de una Function es un punto de coordinación crítico — cambiarlo sin avisar a todos sus
consumidores puede romper algo que parecía no estar relacionado.

| Recurso | Consumidores | Ownership | Observación |
|---|---|---|---|

## 8. Complejidad y deuda técnica

Esta es la sección que distingue este documento de un README genérico: con todo lo anterior ya mapeado, responde
qué tan complejo y arriesgado es tocar cada parte del repositorio, y por qué. Ver
`_shared/references/complexity-debt-rubric.md` para los criterios. Esta sección informa, no planifica: no incluir
Action IDs, executor sugerido ni orden de ejecución.

### Resumen ejecutivo

- Functions legacy vs. modernas:
- Functions con criticidad `HIGH`:
- Code smells / god files detectados:
- Etiqueta agregada de complejidad del repo: `BAJA | MEDIA | ALTA`
- Combinación de señales que produjo la etiqueta:

### Complejidad por Function/slice

| Function/Slice | Criticidad | Testabilidad | Code smells detectados | Gaps de arquitectura | Etiqueta agregada |
|---|---|---|---|---|---|

### God files

Generada de forma determinista desde `inventory.json.largeFiles`. No implica automáticamente necesidad de
refactor — solo señala dónde mirar primero.

| Archivo | Líneas | Umbral |
|---|---|---|

### Deuda técnica priorizada

Ordenada por impacto, no por orden de detección — para que quien lea esto sepa qué atender primero si algún día se
decide actuar.

| # | Hallazgo | Impacto | Evidencia | Affected scope |
|---|---|---|---|---|

## 9. Cómo ejecutar/desplegar

Con el panorama completo ya cubierto, estos son los comandos concretos ya observables de forma segura para
levantar el proyecto — nunca credenciales ni pasos que requieran secretos.

| Acción | Comando | Evidencia |
|---|---|---|
| Instalar dependencias | | |
| Build | | |
| Ejecutar local | | |
| Tests, si existen | | |

## 10. Riesgos y unknowns

Cierre del documento: qué de todo lo anterior merece atención, y qué preguntas siguen sin respuesta confirmable
desde el código.

- Riesgos:
- Unknowns:

## Navegación

- Inventory (si se reusó): `.migration/00-before/inventory.json`
- Analyses reusados (si existen): `.migration/20-analysis/`
- Documentación por Function: `documentation/functions/`
