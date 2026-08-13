---
name: prepare-function-app
description: Prepara la base técnica y arquitectónica global de una Azure Function App para su migración aplicando únicamente cambios planificados, coordinando recursos compartidos y preservando configuraciones válidas existentes.
---

# Prepare Function App

## Objetivo

Preparar la infraestructura técnica y arquitectónica global necesaria para ejecutar la migración.

Este skill puede modificar configuración y estructura global del proyecto.

No modifica comportamiento funcional de una Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`
- `.migration/repository/assessment.json`
- `.migration/plans/migration-plan.json`

El plan global debe encontrarse en estado:

- `READY`
- o `PARTIAL` cuando las acciones ejecutadas sean independientes de los bloqueos existentes.

## Entradas

Consumir primero:

- inventory;
- assessment;
- plan global;
- shared resource actions cuando existan.

No volver a analizar el repositorio completo.

## Principio

Aplicar únicamente cambios globales previamente planificados.

Antes de modificar un archivo:

1. comprobar su estado actual;
2. identificar la acción del plan que justifica el cambio;
3. preservar todo lo que ya sea válido;
4. aplicar el menor delta necesario;
5. registrar el resultado.

No reemplazar configuración correcta únicamente por uniformidad.

## Arquitectura objetivo

Preparar la base necesaria para la arquitectura definida en:

`../_shared/architecture-policy.md`

La estructura base recomendada es:

    src/
    └── functions/

Crear otras carpetas únicamente cuando exista una responsabilidad real planificada.

No crear por anticipado para todas las capabilities:

- `application/`;
- `domain/`;
- `infrastructure/`;
- `shared/`;
- `ports/`;
- `adapters/`.

Estas carpetas se materializan cuando exista código real que deba vivir en ellas.

## src/functions

Preparar `src/functions/` cuando el plan requiera convergencia hacia la arquitectura objetivo.

Esta carpeta funcionará como ubicación de:

- Azure Function registrations;
- adapters;
- composition roots;
- wiring específico de runtime.

No mover todavía lógica funcional de Functions salvo que sea estrictamente necesario para una acción global aprobada.

La refactorización funcional pertenece a:

`prepare-function`

## Cambios globales

Aplicar cuando estén planificados:

- Node.js target;
- Azure Functions dependencies;
- Durable dependencies;
- Azure SDK dependencies;
- TypeScript;
- Jest;
- coverage;
- build;
- package scripts;
- estructura base;
- `host.json`;
- `.funcignore`;
- configuración técnica transversal.

## Node.js

Actualizar declaraciones de Node.js únicamente cuando:

`assessment → node.action = REQUIRED`

Ejemplos:

- `engines.node`;
- archivos de versión explícitamente utilizados por el proyecto.

No interpretar el cambio de versión declarada como prueba de compatibilidad.

## Azure Functions Runtime

Modificar únicamente configuración bajo control real del repositorio.

Si el Runtime depende de infraestructura externa no disponible:

mantener la acción pendiente.

No inspeccionar pipelines protegidos para inferir configuración.

## Programming Model

Puede preparar dependencias y estructura necesarias para Programming Model v4.

No migrar handlers ni registros individuales.

Eso pertenece a:

`migrate-programming-model-v4`

o:

`migrate-durable-functions-v4`

## Dependencias

Actualizar únicamente dependencias incluidas explícitamente en el plan.

Para cada cambio registrar:

- paquete;
- versión anterior;
- versión target;
- razón;
- acción del plan;
- consumidores relevantes cuando aplique.

No actualizar paquetes únicamente porque exista una versión más reciente.

## Package manager

Preservar el package manager existente cuando sea válido.

No migrar entre:

- npm;
- yarn;
- pnpm;

sin una acción explícita.

## Lockfile

Mantener el lockfile consistente con los cambios aprobados.

No eliminarlo para simplificar una actualización.

## Scripts npm

Mantener scripts:

- breves;
- legibles;
- multiplataforma.

Evitar cuando sea razonable operaciones dependientes del shell como:

- `rm -rf`;
- `cp`;
- `mv`;
- `mkdir -p`;
- asignaciones de environment variables específicas de Unix.

Preferir herramientas compatibles entre Windows, macOS y Linux cuando exista necesidad real.

## TypeScript

Preservar configuración existente válida.

Separar configuraciones de:

- producción;
- tests;

solo cuando sea necesario.

No generar múltiples `tsconfig` por convención si el proyecto puede resolverse correctamente con menos archivos.

## Jest

Cuando el plan lo requiera, preparar la infraestructura global de tests.

Puede incluir:

- dependencias;
- configuración;
- scripts;
- coverage;
- reporting.

No crear tests de comportamiento de Functions.

Eso pertenece a:

`prepare-function`

## Coverage

Configurar únicamente reglas justificadas.

No excluir lógica productiva para satisfacer métricas.

## Recursos compartidos

Consumir:

`sharedResourceActions`

del plan global.

Un recurso compartido puede involucrar:

- Cosmos DB;
- MongoDB;
- SQL;
- Service Bus;
- Blob Storage;
- HTTP clients;
- repositories;
- configuración;
- servicios comunes.

## Ownership de recursos compartidos

Cada cambio sobre un recurso compartido debe corresponder a una única acción propietaria del plan.

No modificar el mismo recurso como parte independiente de múltiples Functions.

Antes de ejecutar una acción compartida comprobar:

- `resourceId`;
- ownership;
- consumidores;
- paths;
- acción requerida;
- dependencias;
- criterios de validación.

## Scope de recursos

Respetar el scope definido:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Un recurso `CAPABILITY` o `WORKFLOW` no debe promoverse automáticamente a `src/shared/`.

## src/shared

Crear `src/shared/` únicamente cuando:

- el plan confirme reuse transversal real;
- no exista un ownership funcional más apropiado.

No utilizar `shared` como destino genérico.

## Preparación de recursos compartidos

Este skill puede preparar cambios estructurales o técnicos globales de un recurso compartido cuando la acción
propietaria esté asignada a nivel Function App.

Ejemplos:

- actualizar dependencia Cosmos utilizada por varias Functions;
- preparar una factory compartida;
- preparar configuración común;
- mover un cliente transversal a ubicación acordada.

No modificar comportamiento funcional de sus consumidores.

Cuando la transformación requiera comprender comportamiento particular de una capability, delegar al correspondiente
`prepare-function`.

## Configuración

Trabajar únicamente con nombres de claves conocidas.

Nunca resolver valores.

Si una validación requiere settings locales:

- indicar las claves necesarias;
- solicitar configuración sanitizada o aprobada;
- no abrir automáticamente `local.settings.json`.

## host.json

Preservar configuración válida existente.

Modificar únicamente propiedades justificadas por el plan.

No reemplazar el archivo por una plantilla genérica.

## .funcignore

Actualizar cuando sea necesario para que deployment preserve únicamente contenido requerido.

Considerar exclusiones como:

- `.migration`;
- `.skill-improvement`;
- tests;
- coverage;
- test-results;
- documentación de desarrollo;
- archivos locales.

No excluir runtime code necesario.

## Catálogo

No modificar el contenido histórico de:

`.migration/catalog/current-state.md`

para reflejar el nuevo estado.

Ese documento representa el BEFORE.

Puede añadir referencias de navegación únicamente si no alteran la descripción histórica del sistema.

## Validación

Ejecutar las validaciones razonables disponibles en este estado.

Ejemplos:

- JSON;
- package metadata;
- instalación;
- TypeScript configuration;
- Jest configuration;
- estructura;
- scripts.

No exigir que todo el proyecto compile todavía cuando existan Functions pendientes de adaptar.

## Build

El build global final no es gate de este skill.

Durante preparación pueden existir estados temporales incompatibles.

Registrar cualquier fallo observable y distinguir:

- fallo causado por cambio global incorrecto;
- fallo esperado por Functions aún pendientes;
- causa desconocida.

## Salidas

Crear:

`.migration/repository/preparation.json`

`.migration/repository/preparation.md`

Y:

`.migration/lessons/prepare-function-app/lessons.json`

`.migration/lessons/prepare-function-app/lessons.md`

## preparation.json

Debe registrar como mínimo:

- metadata;
- plan actions executed;
- global changes;
- architecture preparation;
- shared resource actions;
- files modified;
- dependencies changed;
- configuration changes;
- validations;
- skipped actions;
- blocked actions;
- risks;
- unknowns;
- status.

## Shared resource result

Para cada recurso tratado registrar:

- `resourceId`;
- `actionId`;
- ownership;
- files modified;
- consumers;
- result;
- validations;
- pending consumer work.

No duplicar el mismo resultado en cada Function.

## preparation.md

Explicar brevemente:

- qué base global cambió;
- qué ya estaba correcto;
- qué arquitectura se preparó;
- qué recursos compartidos fueron tratados;
- qué se preservó;
- qué quedó pendiente;
- qué validaciones fueron ejecutadas;
- qué Functions todavía requieren preparación.

## Estado

Usar:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

`PARTIAL` es válido cuando se completaron acciones independientes pero quedan otras bloqueadas.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- el plan global fue consumido;
- solo se ejecutaron acciones autorizadas;
- configuración válida fue preservada;
- la base arquitectónica necesaria fue preparada;
- los recursos compartidos globales fueron tratados una sola vez;
- no se modificó comportamiento funcional de Functions;
- se ejecutaron validaciones razonables;
- blockers y unknowns permanecen visibles;
- se generaron preparation y lessons.

## Fuera de alcance

Este skill no debe:

- modificar lógica de negocio;
- crear tests de comportamiento;
- completar refactor de una Function;
- migrar registros Azure individuales;
- migrar Durable workflows;
- resolver deuda no bloqueante;
- optimizar;
- leer pipelines protegidos;
- desplegar.

El siguiente skill sugerido es:

`prepare-function`
