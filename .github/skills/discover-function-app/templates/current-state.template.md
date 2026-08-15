# <Nombre de la Function App> — Estado actual (AS-IS)

> Documento BEFORE. No actualizar con estado posterior a la migración.

## Cómo leer este documento

- **CONFIRMED**: hay evidencia directa y suficiente.
- **INFERRED**: conclusión razonable a partir de señales parciales, no confirmada al 100%.
- **UNKNOWN**: no hay evidencia suficiente todavía.
- **NOT_APPLICABLE**: esa dimensión no corresponde a este repositorio.

## 1. Información general

| Atributo | Valor |
|---|---|
| Repositorio | |
| Function App(s) | |
| Node.js | |
| Azure Functions Runtime | |
| Programming Model | |
| Durable Functions | |
| CI/CD provider(s) | |
| Fecha/evidencia | |

## 2. Propósito

Derivado solo de evidencia observable (nombres de Functions, triggers, capabilities) — nunca inventar propósito de
negocio no respaldado; si no es 100% claro, decirlo explícitamente.

## 3. Arquitectura de alto nivel

```text
```

## 4. Functions existentes

| Function | Trigger | Capability | Programming Model | Durable role | Criticidad inicial |
|---|---|---|---|---|---|

## 5. Dependencias generales

| Package | Versión observable | usageDetected | Evidencia |
|---|---|---|---|

## 6. Matriz de dependencias por Function

Generada a partir de `inventory.json`/`azureResourcePackageUsage` — qué recursos consume cada Function, para ver
de un vistazo los puntos de coordinación.

| Function | Cosmos DB | Service Bus | Blob Storage | Otro |
|---|:---:|:---:|:---:|:---:|

## 7. Dependencias técnicas

```text
Function App
│
├── Programming Model / Runtime
│
├── Paquetes npm
│   ├── ...
│
├── Configuration
│   ├── ...
│
└── Servicios externos
    ├── ...
```

## 8. Dependencias de configuración

Solo nombres de claves; nunca valores. `sources` proviene de `inventory.json.configurationKeys[].sources`
(`SOURCE_CODE`/`FUNCTION_JSON_BINDING`/`V4_REGISTRATION_OPTION`).

| Clave | Consumidor | Sources | Evidencia |
|---|---|---|---|

## 9. Seguridad observable

Solo lo verificable desde código fuente no protegido — nunca se leen secretos ni valores de configuración.

- Autenticación observada (nombres de mecanismos, no valores):
- Archivos protegidos detectados (ruta + categoría, sin leer contenido):

| Ruta | Categoría | Provider (si CI_CD) | contentRead |
|---|---|---|---|

## 10. Observabilidad

- Application Insights / logging configurado en código:
- Evidencia:

## 11. CI/CD

| Provider |
|---|

## 12. Detalle por Function

Ver `.migration/00-before/functions/<FunctionName>.md` por cada Function/slice — cada uno documenta su Flujo (ASCII
compacto), dependencias, configuración y señales iniciales con el mismo nivel de detalle.

| Function | Detalle |
|---|---|

## 13. Riesgos e incertidumbres

### Archivos con tamaño elevado

Generada de forma determinista por `scripts/inventory.js` (campo `largeFiles`). Umbral: >300 líneas. Evidencia
siempre `CONFIRMED`; no implica automáticamente necesidad de refactor — solo señala dónde mirar primero.

| Archivo | Líneas | Umbral |
|---|---|---|

- Riesgos:
- Unknowns:

## Navegación

- Inventory: `.migration/00-before/inventory.json`
- Functions: `.migration/00-before/functions/`
