---
name: plan-function-migration
description: Consolida el inventario, assessment y análisis individuales para construir un único plan global de migración de una Azure Function App, definiendo orden, dependencias, riesgos y criterios de ejecución sin volver a analizar código ni modificar el repositorio.
---

# Plan Function Migration

## Objetivo

Construir un único plan global de migración para una Azure Function App.

El plan debe coordinar las acciones ya identificadas por:

- discovery;
- assessment;
- análisis Function por Function.

Este skill no vuelve a diseñar cada Function.

No modifica código.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

y los:

`.migration/functions/<FunctionName>/analysis.json`

necesarios.

Si faltan análisis críticos:

- registrar qué falta;
- no inventar acciones;
- marcar el plan como `PARTIAL` o `BLOCKED`.

## Entradas

Consumir:

- `inventory.json`;
- `assessment.json`;
- todos los `analysis.json` disponibles.

No volver a analizar el repositorio por defecto.

Cada `analysis.json` debe aportar sus propias:

`requiredActions`

Este skill las coordina, no las vuelve a descubrir.

## Principio

El plan global debe responder:

- qué cambios globales son necesarios;
- qué Functions requieren preparación;
- qué Functions necesitan migración de Programming Model;
- qué workflows Durable existen;
- qué dependencias existen entre acciones;
- qué orden reduce riesgo;
- qué verificaciones deberán cerrar la migración.

No generar un segundo análisis técnico de las Functions.

## Estado objetivo

Usar el target definido por `assessment.json`.

No redefinir versiones target.

No asumir que todas las dimensiones necesitan cambios.

## Categorías

Preservar las categorías provenientes de los análisis:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

El plan operativo debe priorizar únicamente cambios requeridos.

`TECHNICAL_DEBT` se documenta salvo que bloquee migración o testabilidad.

`OPTIMIZATION` queda fuera de alcance.

## Cambios globales

Consolidar únicamente cambios transversales respaldados por el assessment o los análisis.

Ejemplos:

- Node.js;
- Azure Functions Runtime;
- dependencias compartidas;
- TypeScript;
- Jest;
- coverage;
- build;
- estructura base;
- `host.json`;
- `.funcignore`;
- configuración necesaria para validación.

No incluir cambios globales por simple preferencia.

## Acciones por Function

No generar archivos de plan por Function.

Consumir directamente:

`analysis.json -> requiredActions`

El plan global puede referenciar esas acciones para construir el orden de ejecución.

Ejemplo conceptual:

    {
      "function": "RequestReport",
      "actions": [
        "REQ-REQUEST-001",
        "REQ-REQUEST-002"
      ]
    }

La descripción detallada permanece en:

`.migration/functions/RequestReport/analysis.json`

## Functions ya en v4

Si una Function ya utiliza Programming Model v4:

- no incluir migración del modelo;
- conservar únicamente acciones realmente requeridas;
- permitir refactor/testabilidad/Node compatibility cuando corresponda.

## Functions legacy

Cuando el análisis contenga una acción:

`REQUIRED_PLATFORM`

para migrar Programming Model, incluirla en el orden global.

No generar nuevamente los detalles técnicos de conversión.

## Durable Functions

Los workflows Durable deben coordinarse como unidades coherentes.

Identificar usando evidencia disponible:

- starter/client;
- orchestrator;
- activities;
- sub-orchestrators cuando existan.

Las acciones de sus Functions pueden permanecer en sus respectivos `analysis.json`, pero el plan global debe agrupar la
ejecución del workflow cuando exista dependencia.

No planificar Activities como migraciones independientes si pertenecen al mismo workflow.

## Preparación

Ordenar cuando corresponda:

1. preparación global;
2. preparación de Functions;
3. baseline de tests;
4. migración de plataforma;
5. migración Durable;
6. verificación global.

No exigir este orden cuando la evidencia demuestre que una etapa es `NOT_APPLICABLE`.

## Tests

Los tests definidos en cada análisis deben ejecutarse durante `prepare-function`.

El plan global debe asegurar que la baseline exista antes de cambios que puedan afectar comportamiento cuando sea
posible.

No duplicar en este archivo el detalle de todos los tests.

Referenciar el análisis correspondiente.

## Dependencias

Resolver dependencias de ejecución entre acciones.

Ejemplos:

- configuración Jest antes de crear tests;
- actualización global de una dependencia antes de adaptar imports;
- preparación de una Function antes de migrar su adapter;
- preparación del workflow antes de migrar Durable.

No inventar dependencias basadas únicamente en nombres.

## Orden de ejecución

Construir el orden global mínimo necesario.

Preferir pasos con responsabilidad clara.

Ejemplo conceptual:

1. preparar Function App;
2. preparar Functions independientes;
3. preparar workflow Durable;
4. migrar Functions legacy no Durable;
5. migrar workflow Durable;
6. ejecutar verificación global.

Dentro de cada grupo, referenciar las Functions afectadas.

No convertir el plan en una lista de modificaciones línea por línea.

## Build

No requerir build completo después de cada Function.

Durante estados intermedios pueden existir incompatibilidades temporales entre:

- dependencias;
- Programming Models;
- configuración;
- Functions aún pendientes.

Permitir validaciones estáticas o selectivas intermedias.

Usar el build completo como gate final una vez completadas las adaptaciones planificadas de la Function App.

## Riesgos

Consolidar los riesgos ya identificados.

Cada riesgo debe indicar:

- origen;
- impacto;
- acción de mitigación o validación;
- si bloquea alguna etapa.

No inventar nuevos riesgos sin evidencia.

## Unknowns

Los unknowns deben permanecer visibles.

Cada unknown debe:

- indicar evidencia faltante;
- señalar qué acción depende de resolverlo.

Un unknown local no debe bloquear automáticamente toda la migración.

## Estado del plan

Usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

### READY

Existe evidencia suficiente para iniciar las acciones planificadas.

### PARTIAL

El plan permite avanzar parcialmente, pero faltan análisis o decisiones que afectan etapas posteriores.

### BLOCKED

Falta información crítica que impide iniciar de forma segura las acciones necesarias.

## Salidas

Crear únicamente:

`.migration/plans/migration-plan.json`

`.migration/plans/migration-plan.md`

Y:

`.migration/lessons/plan-function-migration/lessons.json`

`.migration/lessons/plan-function-migration/lessons.md`

No crear:

`.migration/functions/<FunctionName>/migration-plan.json`

ni:

`.migration/functions/<FunctionName>/migration-plan.md`

## migration-plan.json

Debe contener como mínimo:

- metadata;
- target;
- estado;
- precondiciones;
- cambios globales;
- Functions incluidas;
- referencias a `requiredActions`;
- workflows Durable;
- dependencias entre acciones;
- orden recomendado;
- riesgos;
- unknowns;
- criterios de verificación;
- evidencia de origen.

Ejemplo conceptual:

    {
      "status": "READY",
      "executionOrder": [
        {
          "step": 1,
          "skill": "prepare-function-app"
        },
        {
          "step": 2,
          "skill": "prepare-function",
          "functions": [
            "RequestReport",
            "CompleteReport"
          ]
        },
        {
          "step": 3,
          "skill": "migrate-programming-model-v4",
          "functions": [
            "RequestReport",
            "CompleteReport"
          ]
        },
        {
          "step": 4,
          "skill": "migrate-durable-functions-v4",
          "workflows": [
            "GenerateReport"
          ]
        },
        {
          "step": 5,
          "skill": "verify-function-app"
        }
      ]
    }

El ejemplo no define un schema exhaustivo.

## migration-plan.md

Debe explicar brevemente:

- punto de partida;
- objetivo;
- qué ya está cumplido;
- qué cambios globales son necesarios;
- qué Functions requieren trabajo;
- qué workflows Durable requieren tratamiento especializado;
- orden recomendado;
- riesgos;
- unknowns;
- condiciones para iniciar.

No copiar los `analysis.md`.

No repetir detalle técnico Function por Function.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

Registrar especialmente:

- acciones duplicadas;
- dependencia no contemplada;
- análisis faltante;
- orden inadecuado;
- planificación innecesariamente detallada;
- oportunidad de simplificación.

## Criterio de cierre

El skill termina cuando:

- inventory fue consumido;
- assessment fue consumido;
- los análisis disponibles fueron consolidados;
- las `requiredActions` fueron referenciadas;
- los análisis faltantes están visibles;
- los cambios globales fueron definidos;
- los workflows Durable fueron agrupados correctamente;
- las dimensiones ya satisfechas no generan trabajo innecesario;
- riesgos y unknowns permanecen explícitos;
- existe un orden global recomendado;
- se generaron migration-plan y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- volver a analizar Functions;
- crear planes individuales por Function;
- agregar tests;
- actualizar dependencias;
- resolver unknowns mediante suposiciones;
- aplicar arquitectura;
- resolver deuda técnica no bloqueante;
- ejecutar migraciones;
- optimizar.

El siguiente skill sugerido es:

`prepare-function-app`
