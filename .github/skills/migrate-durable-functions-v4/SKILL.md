---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions al Programming Model v4 preservando starter, orchestrator, activities, relaciones, determinismo y comportamiento protegido por tests.
---

# Migrate Durable Functions v4

## Objetivo

Migrar un workflow Durable como una unidad coherente.

No migrar sus componentes como Functions aisladas cuando su comportamiento dependa del workflow.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir los artefactos de:

- assessment;
- análisis;
- plan global;
- preparación;

para las Functions que participan en el workflow.

La baseline correspondiente debe estar verde.

## Aplicabilidad

Si Durable no está presente:

`NOT_APPLICABLE`

Si ya está en una configuración compatible con el target y no requiere cambios:

`NOT_APPLICABLE`

Si el workflow no puede reconstruirse con suficiente evidencia:

`REQUIRES_REVIEW`

## Unidad de migración

La unidad es el workflow.

Puede incluir:

- starter;
- client;
- orchestrator;
- activities;
- sub-orchestrators;
- entities cuando existan.

## Grafo

Antes de modificar código, confirmar el grafo mínimo usando evidencia existente.

No inferir relaciones por nombres.

## Roles

Usar cuando corresponda:

- `CLIENT`
- `STARTER`
- `ORCHESTRATOR`
- `ACTIVITY`
- `SUB_ORCHESTRATOR`
- `ENTITY`
- `UNKNOWN`

## Orchestrator

Preservar:

- orden;
- decisiones;
- fan-out/fan-in;
- retries;
- timers;
- sub-orchestrations;
- external events;
- manejo de errores;
- resultados.

No rediseñar workflow.

## Determinismo

Preservar restricciones propias de orchestrators.

Revisar especialmente:

- tiempo;
- random;
- I/O directo;
- HTTP directo;
- acceso a DB;
- side effects;
- APIs no deterministas.

No introducir nuevas operaciones no deterministas.

## Activities

Preservar:

- nombre;
- input;
- output;
- errores;
- efectos externos.

No rediseñar Activities ya correctamente aisladas.

## Starter y Client

Preservar:

- orchestrator iniciado;
- input;
- instance id cuando aplique;
- response;
- status endpoints;
- manejo de errores.

## Retries

Preservar comportamiento y política existente cuando esté confirmada.

No optimizar retries.

## Timers

Preservar timers Durable.

No sustituir por timers comunes de Node.js.

## External Events

Preservar:

- nombre;
- espera;
- timeout;
- orden;
- comportamiento posterior.

## Nombres

Preservar nombres lógicos de orchestrators, Activities y eventos salvo decisión explícita.

## Instancias activas

No asumir que una migración es segura para instancias Durable actualmente en ejecución.

Cuando no pueda confirmarse compatibilidad operativa:

`REQUIRES_REVIEW`

## Dependencias

Usar las versiones y decisiones ya confirmadas en assessment.

No actualizar paquetes arbitrariamente.

## Tests

Ejecutar los tests definidos durante preparación.

Priorizar:

- decisiones del orchestrator;
- secuencia;
- activities;
- errores;
- retries;
- inputs/outputs.

## Verificación local

Confirmar cuando sea posible:

- starter registrado;
- orchestrator registrado;
- Activities registradas;
- nombres preservados;
- tests verdes;
- typecheck válido.

La validación Host global pertenece a `verify-function-app`.

## Salidas

Crear por workflow:

`.migration/functions/<WorkflowName>/durable-migration.json`

`.migration/functions/<WorkflowName>/durable-migration.md`

Y:

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.json`

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.md`

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## durable-migration.json

Registrar:

- workflow;
- Functions;
- grafo;
- roles;
- modelo anterior;
- modelo resultante;
- cambios;
- nombres;
- retries;
- timers;
- events;
- tests;
- validaciones;
- riesgos;
- unknowns.

## durable-migration.md

Explicar:

- qué workflow se migró;
- qué Functions participan;
- cómo se preservó el flujo;
- qué cambió;
- tests;
- riesgos;
- pendientes.

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- el workflow fue identificado;
- el grafo mínimo fue confirmado;
- los roles fueron identificados;
- las APIs requeridas fueron migradas;
- se preservó la semántica;
- se preservó determinismo;
- los tests siguen verdes;
- riesgos operativos permanecen visibles;
- se generaron durable-migration y lessons.

## Fuera de alcance

Este skill no debe:

- rediseñar workflow;
- cambiar comportamiento;
- optimizar paralelismo;
- modificar retries por conveniencia;
- resolver deuda no bloqueante;
- desplegar;
- declarar compatibilidad productiva de instancias activas sin evidencia.

El siguiente skill sugerido es:

`verify-function-app`
