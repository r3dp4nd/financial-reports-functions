# Reglas Durable

## Unidad de migración

El owner es el workflow coherente, no un archivo aislado.

Mapear:

- starter/client;
- orchestrator;
- activities;
- sub-orchestrators;
- entities;
- external events;
- timers/retries;
- shared resources usados por participantes.

## Determinismo

Preservar las restricciones de replay del orchestrator. No introducir I/O externo, tiempo aleatorio o side effects no deterministas dentro del orchestrator por conveniencia.

## Nombres y referencias

Validar que nombres de activities/sub-orchestrators/entities usados por callers coincidan con registrations AFTER.

## Retries/timers/events

Preservar parámetros observables salvo acción explícita de cambio. Una migración técnica no autoriza tuning funcional.

## Active instances

Si existen instancias activas o su estado no puede conocerse de forma segura, registrar riesgo/revisión para estrategia de despliegue. No leer secretos ni telemetría privada sin autorización.

## Dependency target

Usar el package target aprobado. No resolver con `latest`.

## Validación

Sin crear tests nuevos, comprobar:

- topology referencial;
- registration/API coherence;
- determinism checks estáticos;
- typecheck/build selectivo cuando sea viable;
- absence de legacy residual no aprobado.
