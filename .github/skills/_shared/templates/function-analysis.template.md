# Análisis — <FunctionName>

## Objetivo

Analizar el impacto técnico y estructural de migrar `<FunctionName>` al target aprobado, preservando su comportamiento
observable y limitando el análisis al scope necesario.

## Referencias

Estado BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

Assessment:

`.migration/repository/assessment.md`

Inventario:

`.migration/repository/inventory.json`

Baseline técnico:

`.github/skills/_shared/dependency-baseline.json`

## Estado

`READY | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Capability

`<Capability>`

## Scope analizado

### Solicitado

-

### Slice analizado

-

### Dependencias compartidas relevantes

-

### Fuera del scope

-

No expandir el análisis a módulos no necesarios para comprender el impacto de migración de esta Function.

## Contrato que debe preservarse

### Entrada

-

### Salida

-

### Errores relevantes

-

### Efectos observables

-

Referenciar el estado BEFORE cuando sea suficiente.

No duplicar su descripción completa.

## Slice actual

<!--
Representar únicamente el flujo relevante para esta Function.

Ejemplo conceptual:

Trigger
→ handler
→ servicio
→ repository / publisher
→ sistema externo
-->

-

## Configuración

| Clave | Uso | Ownership | Estado |
|-------|-----|-----------|--------|
|       |     |           |        |

Registrar únicamente nombres de claves.

Nunca valores.

No leer archivos protegidos para completar esta sección.

## Dependencias internas

| Dependencia | Uso | Compartida | Impacto |
|-------------|-----|------------|---------|
|             |     |            |         |

Analizar únicamente dependencias directas o transitivas necesarias para comprender el slice.

## Dependencias externas

| Paquete / sistema | Uso | Estado actual | Impacto de migración |
|-------------------|-----|---------------|----------------------|
|                   |     |               |                      |

No seleccionar nuevas versiones target en esta sección.

## Infraestructura

| Boundary / acceso actual | Tecnología | Uso | Estado |
|--------------------------|------------|-----|--------|
|                          |            |     |        |

Ejemplos cuando correspondan:

- Cosmos DB;
- Service Bus;
- Blob Storage;
- APIs externas.

No exigir un contrato o adapter nuevo únicamente por convención arquitectónica.

## Compatibilidad técnica

### Node.js

Resultado:

`NOT_REQUIRED | REQUIRED | REQUIRES_VALIDATION | NOT_APPLICABLE`

Hallazgos:

-

### Programming Model

Resultado:

`NOT_REQUIRED | REQUIRED | REQUIRES_VALIDATION | NOT_APPLICABLE`

Hallazgos:

-

### Azure Functions APIs

Hallazgos:

-

### Azure SDK y dependencias

| Dependencia | Estado | Impacto observado | Validación requerida |
|-------------|--------|-------------------|----------------------|
|             |        |                   |                      |

Analizar únicamente dependencias relevantes para esta Function.

### Durable Functions

Resultado:

`NOT_APPLICABLE | REQUIRED | REQUIRES_VALIDATION`

Workflow:

-

Rol:

-

Hallazgos:

-

Si la Function pertenece a un workflow Durable, identificar el workflow como unidad coherente de migración.

## Testabilidad

Estado:

`HIGH | MEDIUM | LOW | REQUIRES_REVIEW`

### Pruebas existentes relevantes

-

### Bloqueadores de testabilidad

-

### Seams existentes

-

### Seams mínimos potencialmente necesarios

-

No diseñar aquí una refactorización completa.

No exigir cambios estructurales cuando el comportamiento ya pueda protegerse adecuadamente.

## Acoplamientos legacy

### Hallazgos

-

### Consumidores relacionados

-

### Responsabilidades observadas

-

### Clasificación

`NONE | LEGACY_COUPLING | LEGACY_MONOLITH_CANDIDATE | REQUIRES_REVIEW`

Estado de evidencia:

`CONFIRMED | INFERRED | UNKNOWN`

No clasificar un servicio como monolito únicamente por tamaño o nombre.

Considerar cuando corresponda:

- número de consumidores;
- responsabilidades observables;
- dependencias externas;
- persistencia;
- messaging;
- configuración;
- orquestación;
- métodos utilizados por otras Functions.

## Slice y ownership

### Responsabilidad específica de esta Function

-

### Responsabilidad compartida

-

### Responsabilidad fuera del scope

-

No mover automáticamente código compartido al scope de la Function seleccionada.

## Recursos compartidos

| Resource ID / candidato | Uso | Consumidores conocidos | Estado |
|-------------------------|-----|------------------------|--------|
|                         |     |                        |        |

No confirmar ownership únicamente por utilizar el mismo SDK.

## Impacto fuera del scope

| Function / workflow | Relación | Impacto | Estado |
|---------------------|----------|---------|--------|
|                     |          |         |        |

Registrar consumidores afectados sin incorporarlos automáticamente al scope efectivo.

La expansión de scope se decide durante planificación.

## Cambios potencialmente requeridos

| Tipo | Necesidad | Evidencia |
|------|-----------|-----------|
|      |           |           |

Tipos aplicables cuando corresponda:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_DEPENDENCY`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

Esta sección identifica necesidades.

No asignar todavía pasos concretos de implementación ni `Action ID` definitivos.

## Riesgos

| Riesgo | Impacto | Evidencia |
|--------|---------|-----------|
|        |         |           |

## Incertidumbres

| Incertidumbre | Afecta | Validación necesaria |
|---------------|--------|----------------------|
|               |        |                      |

No reemplazar `UNKNOWN` por una inferencia sin evidencia.

## Revisión requerida

-

Registrar únicamente decisiones que realmente necesiten intervención humana.

## Resultado

La Function:

`está lista para planificación / puede avanzar parcialmente / está bloqueada / requiere revisión`.

Siguiente etapa:

`plan-function-migration`
