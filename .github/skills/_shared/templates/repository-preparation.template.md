# Preparación global de la Function App

## Objetivo

Registrar los cambios globales aprobados y realmente ejecutados antes de la migración de Functions.

Referencia del plan:

`.migration/plans/migration-plan.md`

## Estado

`COMPLETED | PARTIAL | BLOCKED | REQUIRES_REVIEW`

## Cambios globales ejecutados

| Action ID | Cambio | Resultado |
|-----------|--------|-----------|
|           |        |           |

## Plataforma

| Dimensión                       | Antes | Después | Resultado |
|---------------------------------|-------|---------|-----------|
| Node.js                         |       |         |           |
| Dependencias de Azure Functions |       |         |           |
| TypeScript                      |       |         |           |
| Herramientas de pruebas         |       |         |           |

Registrar únicamente dimensiones realmente modificadas.

No presentar configuración externa no modificada como si hubiese sido actualizada.

## Preparación estructural global

Cambios globales ejecutados porque eran requeridos por acciones aprobadas de la migración:

-

Ejemplos:

- wiring global requerido;
- infraestructura transversal confirmada;
- configuración de herramientas compartidas;
- estructura común requerida por acciones aprobadas.

No crear ni listar carpetas sin responsabilidad real.

No realizar modernización arquitectónica fuera del plan aprobado.

## Recursos compartidos

| Action ID | Resource ID | Ownership | Resultado |
|-----------|-------------|-----------|-----------|
|           |             |           |           |

Registrar únicamente acciones `SR-ACTION-*` aprobadas para ejecución.

## Cambios de dependencias

| Paquete | Antes | Después | Motivo |
|---------|-------|---------|--------|
|         |       |         |        |

No listar dependencias que no cambiaron.

Las versiones deben corresponder al plan aprobado.

Esta etapa no selecciona nuevos targets.

## Archivos modificados

-

## Configuración

Registrar únicamente cambios estructurales o nombres de configuración.

Nunca valores.

No leer ni documentar contenido de archivos protegidos para completar esta sección.

## Validaciones ejecutadas

| Validación | Resultado | Evidencia |
|------------|-----------|-----------|
|            |           |           |

Estados aplicables:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

No afirmar `PASS` sin evidencia de ejecución.

## Acciones omitidas

| Action ID | Motivo |
|-----------|--------|
|           |        |

## Acciones bloqueadas

| Action ID | Motivo |
|-----------|--------|
|           |        |

## Desviaciones del plan

-

Registrar únicamente diferencias respecto del plan aprobado.

No utilizar esta sección para introducir trabajo nuevo no aprobado.

## Riesgos

-

## Incertidumbres

-

## Siguiente trabajo

Functions que pueden continuar:

-

Functions o workflows bloqueados:

-
