# Status Policy

## Objetivo

Definir una semántica común para los estados utilizados por los skills.

Separar siempre:

- evidencia;
- necesidad de cambio;
- decisión humana;
- estado de ejecución;
- resultado de verificación.

No usar `status` para representar conceptos diferentes.

## Evidence status

Campo:

`evidenceStatus`

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

### CONFIRMED

Existe evidencia directa suficiente.

### INFERRED

Existe evidencia parcial que permite una conclusión razonable, pero no definitiva.

### UNKNOWN

No existe evidencia suficiente.

### NOT_APPLICABLE

La dimensión no aplica.

`evidenceStatus` responde:

`¿Qué tan sustentada está esta afirmación?`

No indica si debe ejecutarse un cambio.

## Action status

Campo:

`actionStatus`

Valores:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

### REQUIRED

Existe evidencia suficiente de que un cambio o validación posterior es necesaria para alcanzar el target.

### NOT_REQUIRED

No se necesita cambio.

Puede significar que:

- la dimensión ya satisface el target;
- el recurso ya es compatible;
- no existe trabajo necesario sobre ese elemento.

### REQUIRES_VALIDATION

Falta evidencia técnica para decidir si el cambio es necesario.

Ejemplos:

- compatibilidad de una dependencia;
- Runtime desplegado no observable;
- comportamiento que necesita ejecución adicional.

`actionStatus` responde:

`¿Necesitamos hacer algo sobre esta dimensión?`

## Execution status

Campo:

`executionStatus`

Valores:

- `COMPLETED`
- `FAILED`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### COMPLETED

La acción fue ejecutada y alcanzó el resultado esperado.

### FAILED

La acción fue ejecutada pero no alcanzó el resultado esperado.

### NOT_EXECUTED

La acción aplicaba pero no fue ejecutada.

Debe registrar el motivo.

### NOT_APPLICABLE

La acción no aplica al contexto finalmente observado.

Debe existir evidencia que justifique por qué dejó de aplicar.

### BLOCKED

Existe un impedimento conocido que impide ejecutar o completar la acción.

### REQUIRES_REVIEW

Ejecutar o continuar la acción requiere una decisión humana.

`executionStatus` responde:

`¿Qué ocurrió al intentar ejecutar esta acción?`

No utilizar `PASS` o `FAIL` como sustitutos de `executionStatus`.

## Revisión humana

Usar:

`REQUIRES_REVIEW`

cuando exista suficiente información sobre el problema, pero continuar requiera una decisión humana.

Ejemplos:

- refactor significativo fuera del alcance aprobado;
- comportamiento contradictorio;
- decisión arquitectónica ambigua;
- riesgo sobre instancias Durable activas;
- posible modificación de contrato observable.

No usar `REQUIRES_REVIEW` como sinónimo de:

- `UNKNOWN`;
- `REQUIRES_VALIDATION`;
- `BLOCKED`.

## Status principal

El campo:

`status`

se reserva para representar el estado principal del artefacto o ejecución.

No usarlo para evidencia interna.

## Assessment

Estados:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_ANALYSIS

Existe evidencia suficiente para comenzar análisis por Function.

### PARTIAL

Existen unknowns o validaciones pendientes, pero puede continuar trabajo independiente seguro.

### BLOCKED

Existe un impedimento conocido que impide continuar la siguiente etapa necesaria.

### REQUIRES_REVIEW

Existe una decisión humana global pendiente.

## Planning

Estados:

- `READY`
- `PARTIAL`
- `BLOCKED`

### READY

El plan tiene evidencia suficiente para ejecutar las acciones requeridas.

### PARTIAL

Parte del plan puede ejecutarse y otra permanece pendiente.

### BLOCKED

No existe actualmente un camino seguro para ejecutar las acciones necesarias.

Cuando una acción particular necesite decisión humana:

registrar `REQUIRES_REVIEW` sobre esa acción o riesgo.

No agregar `REQUIRES_REVIEW` como estado global adicional del plan.

## Global preparation

`prepare-function-app` usa:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Function preparation

`prepare-function` usa:

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Migration

Los skills de migración usan:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Verification checks

Usar:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

### PASS

La comprobación fue ejecutada y cumple el criterio.

### FAIL

La comprobación fue ejecutada y no cumple el criterio.

### NOT_EXECUTED

La comprobación aplicaba pero no pudo ejecutarse.

Debe registrar el motivo.

### NOT_APPLICABLE

La comprobación no aplica.

### REQUIRES_REVIEW

El resultado necesita interpretación o decisión humana.

Un gate obligatorio con estado `NOT_EXECUTED` impide emitir `VERIFIED` hasta determinar si corresponde `BLOCKED` o
`REQUIRES_REVIEW`.

## Final verification

Estados:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

### VERIFIED

Todos los gates obligatorios fueron satisfechos.

### VERIFIED_WITH_DEBT

Todos los gates obligatorios fueron satisfechos y queda deuda técnica no bloqueante.

### BLOCKED

Existe al menos un blocker confirmado que impide cerrar la migración.

### REQUIRES_REVIEW

No existe un blocker técnico confirmado, pero no puede emitirse una conclusión final sin decisión humana.

## Agregación final

Derivar el estado final únicamente a partir de gates obligatorios, decisiones humanas pendientes y deuda documentada.

Reglas:

- un gate obligatorio fallido o un blocker técnico confirmado produce `BLOCKED`;
- si no existe blocker pero una decisión humana impide cerrar, usar `REQUIRES_REVIEW`;
- si todos los gates obligatorios están satisfechos y existe deuda no bloqueante, usar `VERIFIED_WITH_DEBT`;
- si todos los gates obligatorios están satisfechos y no existe deuda relevante, usar `VERIFIED`.

Las acciones con `requiredForMigration: false`, deuda no bloqueante y optimizaciones fuera de alcance no impiden
`VERIFIED`.

Cuando existan simultáneamente blockers técnicos y decisiones humanas pendientes, el estado principal permanece
`BLOCKED` y las revisiones pendientes deben seguir registradas.

## UNKNOWN vs REQUIRES_VALIDATION

`UNKNOWN` describe evidencia.

Ejemplo:

    {
      "evidenceStatus": "UNKNOWN"
    }

`REQUIRES_VALIDATION` describe la acción necesaria.

Ejemplo:

    {
      "evidenceStatus": "UNKNOWN",
      "actionStatus": "REQUIRES_VALIDATION"
    }

## NOT_APPLICABLE vs NOT_REQUIRED

`NOT_APPLICABLE` pertenece principalmente a evidencia o ejecución.

Ejemplo:

Durable no existe:

    {
      "evidenceStatus": "NOT_APPLICABLE"
    }

`NOT_REQUIRED` significa que la dimensión existe o fue evaluada pero no necesita cambio.

Ejemplo:

Programming Model ya es v4:

    {
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "NOT_REQUIRED"
    }

Si posteriormente se invoca el skill de migración v4:

    {
      "status": "NOT_APPLICABLE"
    }

## PARTIAL vs BLOCKED

Usar `PARTIAL` cuando existe trabajo independiente seguro.

Usar `BLOCKED` cuando no puede continuar el trabajo necesario.

## FAILED vs BLOCKED

`FAILED` describe el resultado de una acción ejecutada.

`BLOCKED` describe un impedimento que evita completar el trabajo necesario.

Una acción `FAILED` puede provocar que el estado principal del artefacto sea `BLOCKED`.

## BLOCKED vs REQUIRES_REVIEW

Usar `BLOCKED` cuando el impedimento técnico es conocido.

Ejemplo:

`gate obligatorio de pruebas = FAIL`

Usar `REQUIRES_REVIEW` cuando el siguiente paso depende de una decisión humana.

## Principio

No convertir incertidumbre en éxito.

No convertir deuda no bloqueante en bloqueo.

No convertir un check opcional fallido en blocker obligatorio.

No utilizar la misma propiedad para evidencia, acción, ejecución y verificación.
