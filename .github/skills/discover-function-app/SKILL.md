---
name: discover-function-app
description: Descubre de forma segura una Azure Function App antes de migrarla o refactorizarla. Inventaría estructura, Functions, triggers, bindings, configuración, Programming Model, Durable Functions, arquitectura observable y recursos compartidos sin modificar código ni leer información sensible.
---

# Discover Function App

## Objetivo

Construir una fotografía segura y reutilizable del estado actual del repositorio antes de modificar código.

Debe producir:

- inventario estructurado;
- catálogo humano inicial;
- candidatos a recursos compartidos.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

La política arquitectónica se usa aquí como referencia de análisis.

Este skill no refactoriza.

## Entradas

- repositorio objetivo;
- artefactos existentes en `.migration/` cuando correspondan.

## Principio

Preferir descubrimiento determinista antes que razonamiento.

No usar IA para repetir hechos que pueda obtener el script interno.

## Script de inventario

Ejecutar primero:

`scripts/inventory.js`

sobre el repositorio objetivo.

Usar su salida como fuente primaria para:

- Function Apps;
- `package.json`;
- `host.json`;
- Functions legacy;
- Functions v4;
- triggers;
- bindings;
- Durable Functions;
- dependencias;
- Node.js declarado;
- claves `process.env`;
- archivos sensibles detectados sin lectura.

Los scripts deben ser compatibles con Node.js 14 o superior.

## Análisis selectivo

Usando la salida del script y únicamente el código necesario, identificar:

- relaciones entre Functions;
- capabilities observables;
- workflows Durable;
- arquitectura actual;
- patrones observables;
- infraestructura compartida;
- recursos compartidos candidatos.

No realizar todavía assessment de compatibilidad.

## Arquitectura actual

Documentar únicamente lo observable.

Considerar:

- organización de source;
- ubicación de entrypoints;
- separación o mezcla entre runtime, lógica e infraestructura;
- contratos existentes;
- servicios;
- repositorios;
- dependencias compartidas;
- estructura por capas o por capability.

No evaluar todavía la refactorización necesaria en detalle.

## Patrones

Registrar patrones solo cuando exista evidencia.

Ejemplos:

- Durable Workflow;
- Repository;
- Outbox;
- Adapter;
- Service;
- Factory;
- direct SDK usage.

No inferir un patrón únicamente por nombres.

## Recursos compartidos candidatos

Detectar recursos utilizados por múltiples Functions o capabilities cuando exista evidencia.

Ejemplos:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositorios;
- configuración;
- servicios comunes.

Cada candidato debe contener cuando sea posible:

- `id`;
- `type`;
- `paths`;
- `usedBy`;
- `configurationKeys`;
- `ownership`;
- `status`;
- `evidence`.

Scopes iniciales:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

No mover ni refactorizar recursos.

## Configuración

Registrar únicamente nombres de claves.

Ejemplo:

`process.env.COSMOS_DATABASE`

Nunca registrar valores.

## Programming Model

Identificar:

- legacy;
- v4;
- mixed;
- unknown.

No asumir que toda App necesita migración de Programming Model.

## Durable

Identificar cuando sea posible:

- client;
- starter;
- orchestrator;
- activity;
- sub-orchestrator;
- entity.

No analizar todavía el workflow en profundidad.

## Salidas estructuradas

Crear:

`.migration/repository/inventory.json`

`.migration/repository/inventory.md`

El JSON debe incluir como mínimo:

- metadata;
- repository;
- Function Apps;
- platform observable;
- dependencies;
- Functions;
- triggers/bindings;
- configuration keys;
- relationships;
- architecture observations;
- patterns;
- shared resource candidates;
- unknowns;
- evidence.

## Catálogo del estado actual

Crear:

`.migration/catalog/current-state.md`

Este documento es la fotografía humana principal antes de la migración.

Debe incluir:

- resumen del sistema;
- plataforma;
- Function Apps;
- catálogo de Functions;
- arquitectura actual observable;
- capabilities;
- patrones;
- recursos compartidos candidatos;
- configuración por nombre de clave;
- relaciones principales;
- testing actual observable;
- riesgos iniciales;
- unknowns;
- navegación hacia fichas por Function cuando existan.

No debe describir todavía la arquitectura futura como si ya estuviera implementada.

## Lecciones

Crear:

`.migration/lessons/discover-function-app/lessons.json`

`.migration/lessons/discover-function-app/lessons.md`

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- el script fue ejecutado;
- las Function Apps fueron identificadas;
- las Functions fueron inventariadas;
- la configuración fue registrada sin valores;
- Programming Model fue identificado o quedó UNKNOWN;
- arquitectura y patrones observables fueron documentados;
- candidatos a recursos compartidos fueron registrados;
- se creó `current-state.md`;
- no se leyeron archivos sensibles;
- se generaron inventory y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- refactorizar;
- actualizar dependencias;
- agregar tests;
- evaluar detalladamente compatibilidad Node.js 24;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar;
- generar el plan de migración.

El siguiente skill sugerido es:

`assess-function-app`
