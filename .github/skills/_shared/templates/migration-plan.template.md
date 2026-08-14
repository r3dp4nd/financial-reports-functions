# Plan global de migración

## Objetivo

Migrar la Function App desde su estado actual hacia el target técnico definido, preservando el comportamiento
observable, coordinando cambios globales, recursos compartidos y Functions, y aplicando únicamente los cambios
estructurales requeridos para una migración segura y verificable.

## Punto de partida

Referencia:

`.migration/catalog/current-state.md`

Resumen:

<!--
Máximo unos pocos párrafos.
No duplicar todo el catálogo.
-->

## Alcance

- Alcance solicitado:
- Alcance efectivo:
- Functions afectadas fuera del alcance:

<!--
El alcance efectivo puede expandirse únicamente cuando exista una dependencia
técnica o funcional necesaria para ejecutar una migración coherente.
-->

## Target técnico

| Dimensión               | Target                               |
|-------------------------|--------------------------------------|
| Node.js                 | 24                                   |
| Azure Functions Runtime | v4                                   |
| Programming Model       | v4                                   |
| Pruebas                 | Baseline de comportamiento protegida |

## Estrategia

Secuencia general:

1. preparar base global;
2. preparar recursos compartidos requeridos;
3. aplicar cambios estructurales mínimos requeridos para migración y testabilidad;
4. proteger y validar el comportamiento mediante pruebas cuando corresponda;
5. migrar adapters de plataforma;
6. migrar workflows Durable;
7. ejecutar build y verificación final.

Omitir etapas que sean `NOT_APPLICABLE`.

## Cambios globales

| ID           | Acción | Estado | Dependencias |
|--------------|--------|--------|--------------|
| `GLOBAL-001` |        |        |              |

## Principios arquitectónicos aplicables

Referencia:

`.github/skills/_shared/architecture-policy.md`

Aplicar únicamente los principios necesarios para las acciones aprobadas de esta migración.

La modernización arquitectónica no requerida para alcanzar el target técnico queda fuera de alcance.

### Principios aplicables

- Azure adapters bajo `src/functions/`;
- lógica organizada por capability;
- infraestructura aislada cuando corresponda;
- recursos compartidos con ownership explícito;
- sin carpetas o capas vacías;
- mínima dependencia del runtime desde lógica funcional.

Toda acción `STRUCTURAL` debe indicar si `requiredForMigration` es `true` o `false`.

Las acciones con `requiredForMigration: false` no forman parte de la ejecución obligatoria de la migración técnica.

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

- pruebas selectivas;
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

## Incertidumbres

| Incertidumbre | Afecta | Acción |
|---------------|--------|--------|
|               |        |        |

Un estado `UNKNOWN` debe bloquear únicamente las acciones que dependan de él.

## Deuda fuera de alcance

-

Registrar aquí deuda o mejoras estructurales no requeridas para alcanzar el target técnico.

## Optimizaciones fuera de alcance

-

Las oportunidades no requeridas para la migración no deben convertirse en acciones obligatorias del plan.

## Criterios de verificación final

La migración debe demostrar como mínimo:

- target técnico alcanzado;
- build global exitoso;
- pruebas requeridas verdes;
- Functions esperadas presentes;
- workflows Durable completos;
- acciones estructurales requeridas por el plan aplicadas;
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
