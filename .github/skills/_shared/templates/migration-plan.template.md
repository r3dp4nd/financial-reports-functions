# Plan global de migración

## Objetivo

Migrar la Function App desde su estado actual hacia el target técnico y arquitectónico definido, preservando el
comportamiento observable y coordinando cambios globales, recursos compartidos y Functions.

## Punto de partida

Referencia:

`.migration/catalog/current-state.md`

Resumen:

<!--
Máximo unos pocos párrafos.
No duplicar todo el catálogo.
-->

## Target

| Dimensión               | Target                       |
|-------------------------|------------------------------|
| Node.js                 | 24                           |
| Azure Functions Runtime | v4                           |
| Programming Model       | v4                           |
| Arquitectura            | `architecture-policy.md`     |
| Testing                 | Baseline funcional protegida |

## Estrategia

Secuencia general:

1. preparar base global;
2. preparar recursos compartidos requeridos;
3. refactorizar Functions hacia arquitectura objetivo;
4. agregar y validar tests;
5. migrar adapters de plataforma;
6. migrar workflows Durable;
7. ejecutar build y verificación final.

Omitir etapas que sean `NOT_APPLICABLE`.

## Cambios globales

| ID           | Acción | Estado | Dependencias |
|--------------|--------|--------|--------------|
| `GLOBAL-001` |        |        |              |

## Arquitectura objetivo

Referencia:

`.github/skills/_shared/architecture-policy.md`

### Principios aplicables

- Azure adapters bajo `src/functions/`;
- lógica organizada por capability;
- infraestructura aislada cuando corresponda;
- recursos compartidos con ownership explícito;
- sin carpetas o capas vacías;
- mínima dependencia del runtime desde lógica funcional.

## Recursos compartidos

| Action ID       | Resource ID | Ownership | Consumidores | Acción |
|-----------------|-------------|-----------|--------------|--------|
| `SR-ACTION-001` |             |           |              |        |

Cada recurso debe modificarse mediante una única acción propietaria.

Las Functions consumidoras referencian esta acción mediante `dependsOn`.

## Functions

| Function | Capability | Estado del plan | Dependencias | Plan |
|----------|------------|-----------------|--------------|------|
|          |            |                 |              |      |

Plan individual:

`.migration/functions/<FunctionName>/migration-plan.md`

## Workflows Durable

| Workflow | Participantes | Estado | Acción |
|----------|---------------|--------|--------|
|          |               |        |        |

La migración Durable debe ejecutarse como workflow, no como Functions independientes cuando exista dependencia
funcional.

## Orden de ejecución

1.
2.
3.

El orden debe referenciar IDs o Functions existentes.

Ejemplo:

1. `GLOBAL-001`
2. `SR-ACTION-001`
3. `RequestReport`
4. `GenerateReport`
5. workflow `ReportGeneration`
6. verificación final

## Dependencias críticas

<!--
Solo dependencias que condicionan el orden.
-->

-

## Validaciones intermedias

Puede incluir:

- tests selectivos;
- typecheck selectivo;
- validaciones estáticas;
- consistencia de configuración.

El build global completo no es requerido después de cada Function.

## Build final

El build global completo se ejecuta como gate final después de completar las adaptaciones necesarias.

## Riesgos

| Riesgo | Impacto | Mitigación/Control |
|--------|---------|--------------------|
|        |         |                    |

## Unknowns

| Unknown | Afecta | Acción |
|---------|--------|--------|
|         |        |        |

Un unknown debe bloquear únicamente las acciones que dependan de él.

## Deuda fuera de alcance

-

## Optimizaciones fuera de alcance

-

## Criterios de verificación final

La migración debe demostrar como mínimo:

- target técnico alcanzado;
- build global exitoso;
- tests requeridos verdes;
- Functions esperadas presentes;
- workflows Durable completos;
- arquitectura planificada aplicada;
- recursos compartidos consistentes;
- legacy residual clasificado;
- packaging correcto.

## Estado

`READY | PARTIAL | BLOCKED`

## Ejecución

Este plan es neutral respecto del ejecutor.

Puede ser realizado:

- mediante skills;
- mediante IA;
- manualmente por un developer.

Los criterios técnicos no cambian.
