---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions como una unidad coherente hacia el target definido, usando planes por Function y plan global, preservando arquitectura, determinismo, contratos y recursos compartidos.
---

# Migrate Durable Functions v4

## Objetivo

Migrar un workflow Durable como una unidad coherente.

Debe preservar:

- comportamiento;
- relaciones;
- orden;
- determinismo;
- nombres;
- contratos;
- arquitectura preparada;
- recursos compartidos.

No migrar componentes Durable de forma aislada cuando el comportamiento dependa del workflow.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

- inventory;
- assessment;
- plan global;
- analyses de las Functions participantes;
- planes específicos;
- preparations requeridas.

Los componentes necesarios deben encontrarse preparados para migración.

## Entradas

Consumir primero:

- workflow identificado;
- analyses;
- planes por Function;
- plan global;
- shared resource actions;
- preparation artifacts;
- tests existentes.

No reconstruir toda la App.

## Aplicabilidad

Si Durable no está presente:

`NOT_APPLICABLE`

Si el workflow ya utiliza el target compatible y no requiere cambios:

`NOT_APPLICABLE`

Si no puede reconstruirse el workflow con evidencia suficiente:

`REQUIRES_REVIEW`

## Unidad de migración

La unidad es el workflow.

Puede incluir:

- client;
- starter;
- orchestrator;
- activities;
- sub-orchestrators;
- entities.

Los planes individuales existen para trazabilidad y preparación.

La migración debe seguir siendo coordinada a nivel workflow.

## Grafo

Antes de modificar código, confirmar el grafo mínimo.

Registrar:

- nodos;
- roles;
- llamadas;
- eventos;
- dependencias relevantes.

No inferir relaciones únicamente por naming.

## Roles

Usar cuando corresponda:

- `CLIENT`
- `STARTER`
- `ORCHESTRATOR`
- `ACTIVITY`
- `SUB_ORCHESTRATOR`
- `ENTITY`
- `UNKNOWN`

## Arquitectura

Preservar la arquitectura preparada.

Los adapters o registrations Durable específicos del runtime deben permanecer separados de la lógica funcional cuando la
arquitectura target así lo haya establecido.

Las Activities pueden depender de capabilities y contratos internos.

No volver a mezclar Azure/Durable runtime con lógica funcional extraída previamente.

## Plan global

Consumir las acciones Durable coordinadas del plan global.

El plan debe identificar:

- workflow;
- participantes;
- orden;
- shared resources;
- dependencies;
- migration steps;
- verification criteria.

## Planes por Function

Usar los planes individuales para:

- comportamiento a preservar;
- preparación;
- dependencies;
- shared resources;
- riesgos locales;
- criterios específicos.

No ejecutar Functions como migraciones totalmente independientes.

## Shared resources

Los workflows pueden consumir recursos compartidos como:

- Cosmos repositories;
- Mongo repositories;
- SQL repositories;
- Service Bus;
- Blob Storage;
- HTTP clients;
- shared services.

Respetar ownership y `SR-ACTION-*`.

No modificar un shared resource desde varias Activities.

Si el recurso ya fue preparado globalmente:

consumirlo.

Si una shared resource action obligatoria está pendiente:

`BLOCKED`

## Starter

Preservar:

- orchestrator target;
- input;
- instance id cuando aplique;
- response;
- status behavior;
- errores.

## Client

Preservar:

- operaciones utilizadas;
- nombres;
- inputs;
- relación con workflow.

## Orchestrator

Preservar:

- orden de actividades;
- decisiones;
- branching;
- fan-out/fan-in;
- retries;
- timers;
- sub-orchestrations;
- external events;
- manejo de errores;
- compensaciones;
- resultado.

No rediseñar el workflow durante migración.

## Determinismo

Preservar las restricciones de replay y determinismo.

Revisar especialmente:

- acceso a tiempo;
- random;
- I/O;
- network;
- database;
- filesystem;
- side effects;
- APIs externas.

No introducir operaciones no deterministas dentro del orchestrator.

## Activities

Preservar para cada Activity:

- nombre;
- input;
- output;
- errores;
- efectos secundarios.

Si la Activity fue refactorizada hacia una capability:

mantener esa separación.

## Sub-orchestrators

Preservar:

- nombre;
- input;
- relación;
- resultado;
- orden de invocación.

## Entities

Cuando existan:

- preservar identidad;
- operaciones;
- state transitions;
- contratos observables.

No rediseñar entidades como parte de migración.

## Retries

Preservar:

- policy;
- attempts;
- delay/backoff;
- errores que disparan retry;

cuando exista evidencia.

No optimizar retries.

## Timers

Preservar timers Durable.

No sustituirlos por mecanismos de timer comunes de Node.js.

## External Events

Preservar:

- event name;
- wait semantics;
- timeout cuando exista;
- comportamiento posterior.

## Naming

Preservar nombres lógicos de:

- orchestrators;
- activities;
- events;
- entities;

salvo que exista una acción explícita aprobada.

## Instancias activas

No afirmar que la migración es segura para instancias productivas actualmente en ejecución sin evidencia.

Si existe riesgo de replay/versioning/active instances:

registrar:

`REQUIRES_REVIEW`

cuando afecte el cierre.

## Dependencias

Actualizar únicamente dependencias Durable incluidas en el plan global.

No actualizar otros paquetes por conveniencia.

## Tests

Ejecutar la baseline preparada para el workflow.

Priorizar:

- decisiones del orchestrator;
- secuencia;
- activity contracts;
- retries;
- errors;
- inputs;
- outputs;
- events;
- sub-orchestrations cuando existan.

No agregar integration tests.

## Validación

Validar cuando sea posible:

- registrations;
- nombres;
- referencias;
- tests;
- typecheck selectivo;
- workflow graph consistency.

La validación global Host pertenece a:

`verify-function-app`

## Catálogo

No modificar las fichas BEFORE para reflejar estado migrado.

Documentar los cambios en el artefacto de migración Durable.

## Salidas

Crear por workflow:

`.migration/functions/<WorkflowName>/durable-migration.json`

`.migration/functions/<WorkflowName>/durable-migration.md`

Y:

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.json`

`.migration/lessons/migrate-durable-functions-v4/<WorkflowName>.md`

## durable-migration.json

Debe registrar como mínimo:

- metadata;
- workflow;
- plan references;
- participants;
- graph;
- roles;
- previous model;
- resulting model;
- architecture preserved;
- shared resources;
- dependencies;
- registrations;
- retries;
- timers;
- events;
- sub-orchestrators;
- entities cuando existan;
- tests;
- validations;
- active instance risks;
- unknowns;
- status.

## durable-migration.md

Debe explicar:

- qué workflow fue migrado;
- qué componentes participan;
- cómo estaba organizado;
- qué runtime integration cambió;
- cómo se preservó arquitectura;
- qué shared resources utiliza;
- cómo se preservó comportamiento y determinismo;
- tests;
- riesgos;
- pendientes.

## Estados

Usar:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

## MIGRATED

Usar cuando:

- el workflow fue migrado coherentemente;
- graph y nombres fueron preservados;
- arquitectura preparada permanece válida;
- shared resources no fueron duplicados;
- determinismo fue preservado;
- tests requeridos están verdes.

## BLOCKED

Ejemplos:

- participant no preparado;
- shared resource action pendiente;
- baseline falla;
- dependency Durable requerida no disponible.

## REQUIRES_REVIEW

Ejemplos:

- workflow graph incompleto;
- active instance risk no resuelto;
- replay behavior incierto;
- semántica no puede preservarse con suficiente evidencia.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- workflow y participantes fueron confirmados;
- planes fueron consumidos;
- roles y grafo fueron validados;
- APIs/registrations necesarias fueron migradas;
- arquitectura y ownership fueron preservados;
- determinismo permaneció válido;
- tests siguen verdes;
- riesgos operativos siguen visibles;
- se generaron durable-migration y lessons.

## Fuera de alcance

Este skill no debe:

- rediseñar workflow;
- modificar reglas de negocio;
- optimizar paralelismo;
- modificar retries por conveniencia;
- redefinir shared resources;
- ejecutar build global final;
- declarar seguridad de instancias activas sin evidencia;
- desplegar.

El siguiente skill sugerido es:

`verify-function-app`
