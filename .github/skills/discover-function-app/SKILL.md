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

La arquitectura se usa únicamente como referencia de análisis.

Este skill no refactoriza.

## Entradas

- repositorio objetivo;
- artefactos existentes en `.migration/` cuando correspondan.

## Principio

Preferir descubrimiento determinista antes que razonamiento.

No usar IA para repetir hechos obtenibles mediante el script interno.

## Script de inventario

Ejecutar primero:

`scripts/inventory.js`

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

A partir de la salida determinista, leer únicamente el código necesario para identificar:

- relaciones entre Functions;
- capabilities observables;
- workflows Durable;
- arquitectura actual;
- patrones observables;
- infraestructura compartida;
- recursos compartidos candidatos.

No evaluar todavía el cambio requerido hacia el target.

## Arquitectura actual

Registrar únicamente lo observable:

- organización del source;
- ubicación de entrypoints;
- mezcla o separación entre runtime, lógica e infraestructura;
- contracts existentes;
- repositories;
- services;
- dependencias compartidas.

No diseñar todavía la arquitectura futura.

## Patrones

Registrar patrones únicamente con evidencia.

Ejemplos:

- Durable Workflow;
- Repository;
- Outbox;
- Adapter;
- Service;
- Factory;
- direct SDK usage.

No inferir un patrón únicamente por naming.

## Recursos compartidos candidatos

Detectar recursos usados por múltiples Functions o capabilities cuando exista evidencia.

Ejemplos:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositories;
- configuración;
- servicios comunes.

Registrar cuando sea posible:

- id;
- type;
- paths;
- consumers;
- configuration keys;
- ownership;
- status;
- evidence.

Scopes iniciales:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

No fusionar recursos únicamente porque usen la misma tecnología.

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

No asumir que toda Function App requiere migración del Programming Model.

## Durable

Identificar cuando exista evidencia:

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

`inventory.json` es el owner de los hechos estructurados de discovery.

No incluir:

- recomendaciones;
- plan;
- refactors;
- decisiones de migración.

## Catálogo BEFORE

Crear:

`.migration/catalog/current-state.md`

Usar:

`../_shared/templates/current-state.template.md`

El catálogo representa el estado anterior a la migración.

No convertirlo en documentación del target.

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
- configuración fue registrada sin valores;
- Programming Model quedó identificado o `UNKNOWN`;
- arquitectura y patrones observables quedaron registrados;
- recursos compartidos candidatos quedaron registrados;
- se creó `current-state.md`;
- no se leyeron archivos sensibles;
- se generaron inventory y lessons.

## Fuera de alcance

No debe:

- modificar código;
- refactorizar;
- actualizar dependencias;
- agregar tests;
- evaluar detalladamente Node.js 24;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar;
- generar planes.

Siguiente skill sugerido:

`assess-function-app`
