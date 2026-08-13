---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones técnicas, arquitectónicas y de recursos compartidos requieren cambio o validación para alcanzar el target sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el gap global entre el estado actual de la Function App y el target de migración.

Debe responder qué dimensiones:

- ya cumplen;
- requieren cambio;
- requieren validación;
- presentan gap arquitectónico;
- presentan riesgo transversal.

No analiza todavía comportamiento detallado por Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/catalog/current-state.md`

Si existen contradicciones o información insuficiente:

- registrarlas;
- no reconstruir discovery;
- usar `REQUIRES_VALIDATION` o `REQUIRES_REVIEW`.

## Entradas

Consumir primero:

- inventory;
- catálogo BEFORE;
- shared resource candidates.

Consultar source únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión.

No cargar el repositorio completo.

## Target

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- capacidad de build y tests;
- arquitectura objetivo;
- recursos compartidos con ownership y límites coherentes.

El target no implica optimización.

## Dimensiones técnicas

Evaluar independientemente:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- testing;
- capacidad global de validación.

No convertir todas estas dimensiones en una sola conclusión.

## Acción

Usar:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Node.js

Determinar:

- versión declarada;
- target;
- necesidad de cambio;
- riesgos globales.

No considerar una declaración de Node.js como evidencia suficiente de compatibilidad del source.

## Azure Functions Runtime

Determinar la versión cuando exista evidencia suficiente.

No confundir Runtime con Programming Model.

Cuando dependa de infraestructura externa no observable:

`REQUIRES_VALIDATION`

## Programming Model

Si está confirmado v4:

`NOT_REQUIRED`

Si está confirmado legacy y el target exige v4:

`REQUIRED`

Si existe estado mixto o contradictorio:

`REQUIRES_VALIDATION`

## Durable Functions

Si no existe:

`NOT_APPLICABLE`

Si existe:

evaluar globalmente:

- paquete;
- modelo;
- workflows observables;
- necesidad de migración especializada.

El detalle pertenece a análisis posteriores.

## Dependencias

Evaluar únicamente dependencias relevantes para:

- Node.js 24;
- Azure Functions;
- Durable;
- Azure SDK;
- build;
- tests;
- infraestructura compartida.

No exigir actualización solo por antigüedad.

## TypeScript

Determinar:

- versión actual;
- necesidad de cambio;
- riesgos relevantes.

No modificar configuración.

## Testing global

Registrar:

- framework;
- scripts;
- presencia general de tests;
- coverage observable;
- capacidad aparente de baseline.

No evaluar todavía testabilidad detallada por Function.

## Architecture assessment

Evaluar globalmente frente a:

`../_shared/architecture-policy.md`

Considerar:

- ubicación de adapters;
- mezcla runtime/lógica;
- organización por capability;
- acoplamiento a SDKs;
- configuración;
- contracts;
- infraestructura;
- ownership de shared resources.

Usar:

- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`

No decidir todavía archivos concretos a mover o interfaces a crear.

## Shared resources assessment

Evaluar candidatos detectados durante discovery.

Considerar:

- tipo;
- consumers;
- ownership;
- impacto transversal;
- compatibilidad técnica;
- incertidumbre.

No consolidar dos recursos únicamente porque utilicen la misma tecnología.

## Riesgos globales

Registrar únicamente riesgos relevantes como:

- dependencia compartida con muchos consumidores;
- SDK construido repetidamente;
- configuración transversal acoplada;
- workflow Durable complejo;
- estado legacy/v4 mixto;
- ausencia de baseline;
- arquitectura altamente acoplada.

Un riesgo no es automáticamente un blocker.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

`assessment.json` es el owner del gap global.

Debe contener:

- target;
- technical dimensions;
- architecture assessment;
- shared resources assessment;
- testing assessment;
- risks;
- unknowns;
- external evidence;
- status.

## Markdown

`assessment.md` debe ser una síntesis humana del assessment.

No necesita template dedicado mientras su estructura siga siendo pequeña.

Debe responder:

- qué ya cumple;
- qué cambia;
- qué requiere validación;
- cuál es el estado arquitectónico;
- qué recursos compartidos son relevantes;
- qué riesgos permanecen.

## Catálogo

No modificar las secciones BEFORE de:

`.migration/catalog/current-state.md`

Puede referenciarse, pero no reescribirse para mostrar el target.

## Estado general

Usar:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Lecciones

Crear:

`.migration/lessons/assess-function-app/lessons.json`

`.migration/lessons/assess-function-app/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory y catálogo fueron consumidos;
- las dimensiones técnicas fueron evaluadas por separado;
- arquitectura global fue evaluada;
- shared resources fueron considerados;
- lo satisfecho quedó como `NOT_REQUIRED`;
- unknowns permanecen visibles;
- riesgos globales quedaron registrados;
- no se modificó código;
- se generaron assessment y lessons.

## Fuera de alcance

No debe:

- modificar código;
- generar planes;
- analizar comportamiento detallado por Function;
- decidir estructura concreta;
- crear contracts;
- mover shared resources;
- agregar tests;
- migrar;
- optimizar.

Siguiente skill sugerido:

`analyze-function`
