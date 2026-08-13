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

Existe al menos un blocker que impide cerrar la migración.

### REQUIRES_REVIEW

No puede emitirse una conclusión final sin decisión humana.

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

## BLOCKED vs REQUIRES_REVIEW

Usar `BLOCKED` cuando el impedimento técnico es conocido.

Ejemplo:

`tests = FAIL`

Usar `REQUIRES_REVIEW` cuando el siguiente paso depende de una decisión humana.

## Principio

No convertir incertidumbre en éxito.

No convertir deuda no bloqueante en bloqueo.

No utilizar la misma propiedad para evidencia, acción y ejecución.
