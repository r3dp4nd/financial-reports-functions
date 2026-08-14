# <Nombre de la Function App> — Documentación de referencia

> Documento de línea base, regenerable. No es evidencia de una migración en curso; es un documento de referencia
> reutilizable ante cualquier cambio futuro (onboarding, auditoría, migración, refactor, nueva feature).

## Cómo leer este documento

- **CONFIRMED** (confirmado): hay evidencia directa y suficiente.
- **INFERRED** (inferido): conclusión razonable a partir de señales parciales, no confirmada al 100%.
- **UNKNOWN** (desconocido): no hay evidencia suficiente todavía.
- **NOT_APPLICABLE** (no aplica): esa dimensión no corresponde a este repositorio.

## 1. Visión general

- Repositorio:
- Function App(s):
- Qué hace (2-4 frases, sin jerga técnica, derivado solo de evidencia observable):
- Fecha/evidencia base:

## 2. Plataforma

| Dimensión | Estado observado | Requisito mínimo oficial | Evidencia |
|---|---|---|---|
| Node.js | | `v18+` | |
| Azure Functions Runtime | | `v4.25+` | |
| Programming Model | | `@azure/functions v4.0.0+` en `dependencies` | |
| Durable Functions | | paquete `durable-functions`: `2.x`→PM v3, `3.x`→PM v4 | |
| CI/CD provider(s) | | — | |

- Si Runtime detectado es v2/v3: citar riesgo de EOL (`_shared/references/official-sources.md`).

## 3. Arquitectura observable

- Organización del código:
- Puntos de entrada de Azure (adapters):
- Lógica de negocio (application/domain):
- Conexión a servicios externos (infraestructura):
- Dependencias importantes entre partes (acoplamientos):

### Diagrama de arquitectura

```mermaid
flowchart TB
```

### Estructura de directorios

```text
```

## 4. Inventario de Functions

> Mismo nivel de detalle para Functions legacy (`function.json`) y modernas (`app.X(...)`).

| Function | Trigger | Capability | Programming Model | Durable role | Complejidad | Detalle |
|---|---|---|---|---|---|---|

## 5. Dependencias

| Package | Versión | Consumidores | usageDetected | Evidencia |
|---|---|---|---|---|

- Candidatas a limpieza (`usageDetected: false`):

## 6. Configuración

Solo nombres de claves; nunca valores.

| Clave | Consumidor | Sources | Evidencia |
|---|---|---|---|

## 7. Recursos compartidos

| Recurso | Consumidores | Ownership | Observación |
|---|---|---|---|

## 8. Complejidad y deuda técnica

> Sección obligatoria. Ver `_shared/references/complexity-debt-rubric.md` para los criterios. Esta sección informa,
> no planifica: no incluir Action IDs, executor sugerido ni orden de ejecución.

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

> Generada de forma determinista desde `inventory.json.largeFiles`. No implica automáticamente necesidad de refactor.

| Archivo | Líneas | Umbral |
|---|---|---|

### Deuda técnica priorizada

> Ordenada por impacto, no por orden de detección.

| # | Hallazgo | Impacto | Evidencia | Affected scope |
|---|---|---|---|---|

## 9. Cómo ejecutar/desplegar

> Solo comandos ya observables de forma segura. Nunca credenciales ni pasos que requieran secretos.

| Acción | Comando | Evidencia |
|---|---|---|
| Instalar dependencias | | |
| Build | | |
| Ejecutar local | | |
| Tests, si existen | | |

## 10. Riesgos y unknowns

- Riesgos:
- Unknowns:

## Navegación

- Inventory (si se reusó): `.migration/00-before/inventory.json`
- Analyses reusados (si existen): `.migration/20-analysis/`
- Documentación por Function: `documentation/functions/`
