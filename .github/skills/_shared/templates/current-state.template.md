# Estado actual de la Function App

> Fotografía del sistema antes de iniciar la migración.
>
> Este documento representa el estado observado del repositorio y no debe actualizarse para reflejar el resultado de la
> migración.

## Resumen

<!--
Descripción breve del propósito observable de la Function App.

No inventar contexto funcional que no pueda inferirse o confirmarse.
-->

## Plataforma actual

<!--
Si el repositorio contiene más de una Function App con plataformas diferentes,
registrar esta sección por Function App o indicar explícitamente a cuál corresponde.
No combinar versiones diferentes como si representaran un único estado.
-->

| Dimensión               | Estado | Evidencia |
|-------------------------|--------|-----------|
| Node.js                 |        |           |
| Azure Functions Runtime |        |           |
| Programming Model       |        |           |
| TypeScript              |        |           |
| Durable Functions       |        |           |
| Gestor de paquetes      |        |           |
| Testing                 |        |           |

Usar cuando corresponda:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

## Function Apps

| Function App | Ruta | Estado |
|--------------|------|--------|
|              |      |        |

## Functions

| Function | Capability | Trigger | Programming Model | Durable Role | Detalle |
|----------|------------|---------|-------------------|--------------|---------|
|          |            |         |                   |              |         |

El detalle debe apuntar a:

`functions/<FunctionName>.md`

## Capabilities observadas

### <Capability>

Functions relacionadas:

- `<FunctionName>`

Responsabilidad observable:

<!-- Descripción breve. -->

Estado de evidencia:

`CONFIRMED | INFERRED | UNKNOWN`

## Arquitectura actual

### Organización

<!--
Describir la organización observable del código.

Ejemplos:
- entrypoints;
- services;
- repositories;
- infraestructura;
- shared;
- separación o mezcla de responsabilidades.
-->

### Dirección de dependencias observable

<!--
Describir brevemente relaciones importantes.

No presentar todavía la arquitectura objetivo.
-->

### Acoplamientos relevantes

<!--
Registrar únicamente acoplamientos observados o inferidos con evidencia.

Ejemplos:
- lógica dentro de Azure entrypoints;
- acceso directo a SDK;
- process.env dentro de servicios;
- recursos compartidos sin ownership.

No proponer todavía su refactorización.
-->

## Patrones observados

| Patrón | Estado | Evidencia |
|--------|--------|-----------|
|        |        |           |

Ejemplos posibles:

- Durable Workflow
- Repository
- Outbox
- Adapter
- Service
- Factory

No inferir patrones únicamente por nombres.

## Dependencias relevantes

<!--
Vista humana resumida de las dependencias que ayudan a comprender el estado actual.

El inventario completo pertenece a:
../repository/inventory.json

No recomendar versiones objetivo ni evaluar compatibilidad en esta sección.
-->

| Paquete | Versión declarada | Tipo | Evidencia |
|---------|-------------------|------|-----------|
|         |                   |      |           |

## Recursos compartidos observados o candidatos

| Recurso | Tipo | Ownership | Consumidores | Estado |
|---------|------|-----------|--------------|--------|
|         |      |           |              |        |

Discovery puede registrar candidatos.

No completar `Ownership` o `Consumidores` como hechos cuando la evidencia solo permita inferir que el recurso podría ser
compartido.

El detalle estructurado consolidado vive en:

`.migration/resources/shared-resources.json`

cuando existan recursos compartidos confirmados.

## Relaciones principales

<!--
Registrar únicamente relaciones relevantes entre Functions, capabilities y recursos.

Puede utilizarse Mermaid si mejora realmente la comprensión.
-->

## Configuración requerida

Solo registrar nombres de claves.

| Clave | Consumidores | Estado |
|-------|--------------|--------|
|       |              |        |

Nunca incluir valores.

## Archivos protegidos detectados

<!--
Registrar únicamente metadata permitida por security-policy.md.

Nunca leer ni incluir contenido.
-->

| Ruta | Categoría | Contenido leído |
|------|-----------|-----------------|
|      |           | `false`         |

## Pruebas actuales

### Framework

<!-- Jest / otro / no detectado -->

### Estado

- Tests existentes:
- Functions con tests:
- Functions sin tests:
- Coverage observable:

No utilizar ausencia de tests como evidencia automática de baja testabilidad.

## Riesgos iniciales

| Riesgo | Impacto | Evidencia |
|--------|---------|-----------|
|        |         |           |

Registrar únicamente riesgos sustentados por el estado observado.

La evaluación del gap contra el target pertenece al assessment.

## Incertidumbres

-

No reemplazar incertidumbres por suposiciones.

## Estado del análisis

<!--
Esta sección es únicamente navegación del proceso.
No forma parte de la fotografía técnica BEFORE.
-->

| Etapa                | Estado |
|----------------------|--------|
| Discovery            |        |
| Assessment           |        |
| Functions analizadas |        |
| Plan de migración    |        |

Esta sección puede actualizarse únicamente como navegación del proceso.

No modificar las secciones que describen el estado técnico BEFORE.

## Navegación

### Functions

- `functions/<FunctionName>.md`

### Artefactos estructurados

- `../repository/inventory.json`
- `../repository/assessment.json`
- `../resources/shared-resources.json` cuando aplique

### Planificación

- `../plans/migration-plan.md` cuando exista
