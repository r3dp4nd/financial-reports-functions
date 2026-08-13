# Status Policy

## Objetivo

Definir el significado común de estados utilizados por los skills y evitar que una misma palabra represente conceptos
diferentes.

Los estados se dividen por responsabilidad.

No crear un estado nuevo cuando uno existente represente correctamente el caso.

## 1. Estado de evidencia

Usar únicamente para indicar qué tan sustentada está una afirmación.

Valores:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

### CONFIRMED

Existe evidencia directa suficiente.

### INFERRED

Existe evidencia parcial y la conclusión debe mantenerse explícitamente como inferencia.

### UNKNOWN

No existe evidencia suficiente.

### NOT_APPLICABLE

La dimensión no aplica al caso analizado.

Estos estados no indican si una migración debe ejecutarse.

## 2. Decisión de cambio

Usar para indicar si una dimensión necesita trabajo.

Valores:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

### REQUIRED

Existe evidencia suficiente de que el cambio es necesario.

### NOT_REQUIRED

La dimensión ya satisface el target o no requiere modificación.

### REQUIRES_VALIDATION

Todavía falta evidencia técnica para decidir.

Ejemplos:

- compatibilidad de una dependencia;
- Runtime desplegado no observable;
- comportamiento que requiere ejecución adicional para confirmarse.

`REQUIRES_VALIDATION` no significa necesariamente revisión humana.

## 3. Revisión humana

Usar:

`REQUIRES_REVIEW`

cuando continuar requiere una decisión humana y no únicamente obtener más evidencia técnica.

Ejemplos:

- comportamiento contradictorio;
- refactor significativo fuera del alcance aprobado;
- riesgo de instancias Durable activas;
- decisión arquitectónica ambigua;
- cambio que podría modificar comportamiento.

No usar `REQUIRES_REVIEW` como equivalente de `UNKNOWN`.

## 4. Estado de assessment

Usar:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_ANALYSIS

Existe evidencia suficiente para comenzar análisis por Function.

### PARTIAL

Existen unknowns, pero parte del trabajo puede continuar de forma segura.

### BLOCKED

No puede continuar la siguiente etapa necesaria sin resolver un impedimento conocido.

### REQUIRES_REVIEW

Existe una decisión humana pendiente.

## 5. Estado de planificación

Usar:

- `READY`
- `PARTIAL`
- `BLOCKED`

### READY

El plan tiene evidencia suficiente para ejecutar sus acciones.

### PARTIAL

Parte del plan es ejecutable y otra permanece pendiente.

### BLOCKED

No existe un camino seguro para ejecutar las acciones necesarias actualmente.

Cuando la planificación necesite una decisión humana, registrar el motivo como `REQUIRES_REVIEW` en el elemento afectado
y mantener el plan `PARTIAL` o `BLOCKED` según impacto.

No agregar `REQUIRES_REVIEW` como cuarto estado global del plan.

## 6. Preparación global

`prepare-function-app` usa:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### COMPLETED

Todas las acciones globales aplicables fueron ejecutadas.

### PARTIAL

Se completaron acciones independientes y quedan otras pendientes.

### BLOCKED

Una condición conocida impide completar preparación necesaria.

### REQUIRES_REVIEW

El siguiente cambio requiere decisión humana.

## 7. Preparación por Function

`prepare-function` usa:

- `READY_FOR_MIGRATION`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_MIGRATION

La Function cumple las precondiciones necesarias para realizar su siguiente migración de plataforma.

### NOT_APPLICABLE

No necesita preparación adicional.

### BLOCKED

Existe una dependencia o fallo conocido que impide continuar.

### REQUIRES_REVIEW

La preparación requiere una decisión humana.

## 8. Migración

Los skills de migración usan:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

### MIGRATED

La responsabilidad específica del skill fue completada.

### NOT_APPLICABLE

La migración específica no era necesaria.

### BLOCKED

Existe un impedimento técnico conocido.

### REQUIRES_REVIEW

Existe una decisión humana pendiente.

## 9. Checks de verificación

Cada check de `verify-function-app` usa:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

### PASS

La comprobación fue ejecutada y satisface el criterio.

### FAIL

La comprobación fue ejecutada y no satisface el criterio.

### NOT_EXECUTED

La comprobación aplicaba pero no pudo ejecutarse.

Debe incluir razón.

### NOT_APPLICABLE

La comprobación no aplica.

### REQUIRES_REVIEW

El resultado no puede clasificarse correctamente sin decisión humana.

## 10. Estado final de migración

`verify-function-app` usa:

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

La evidencia no permite una conclusión final sin intervención humana.

## Blocked vs Requires Review

Usar `BLOCKED` cuando sabemos cuál es el impedimento técnico.

Ejemplo:

`tests = FAIL`

Usar `REQUIRES_REVIEW` cuando existe evidencia pero la siguiente decisión no puede tomarse automáticamente.

Ejemplo:

un refactor necesario puede cambiar un contrato observable y el alcance no fue aprobado.

## Partial vs Blocked

Usar `PARTIAL` cuando existe trabajo independiente seguro que puede continuar.

Usar `BLOCKED` cuando no existe trabajo necesario que pueda continuar de forma segura.

## Principio

Los estados representan la condición actual.

No deben utilizarse como instrucciones.

No convertir incertidumbre en éxito.

No convertir deuda no bloqueante en bloqueo.
