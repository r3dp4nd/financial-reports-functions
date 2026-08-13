---
name: prepare-function-app
description: Prepara la base técnica y arquitectónica global de una Azure Function App para su migración aplicando únicamente cambios planificados, coordinando recursos compartidos y preservando configuraciones válidas existentes.
---

# Prepare Function App

## Objetivo

Preparar la infraestructura técnica y arquitectónica global necesaria para ejecutar la migración.

Este skill puede modificar configuración y estructura global.

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

El plan global debe estar en:

- `READY`
- o `PARTIAL` cuando existan acciones independientes seguras.

## Entradas

Consumir primero:

- inventory;
- assessment;
- plan global;
- `.migration/resources/shared-resources.json` cuando exista;
- shared resource actions del plan.

No volver a analizar el repositorio completo.

## Principio

Aplicar únicamente acciones globales planificadas.

Antes de modificar:

1. confirmar la acción propietaria;
2. verificar el estado actual;
3. preservar lo válido;
4. aplicar el menor delta necesario;
5. validar;
6. registrar el resultado.

No modificar por uniformidad.

## Arquitectura

Preparar la base definida en:

`../_shared/architecture-policy.md`

Puede preparar:

`src/functions/`

cuando el plan lo requiera.

No crear por anticipado:

- `application/`;
- `domain/`;
- `infrastructure/`;
- `shared/`;
- `ports/`;
- `adapters/`.

Crear únicamente estructura con responsabilidad real.

## Cambios globales

Aplicar cuando estén planificados:

- Node.js;
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
- configuración transversal.

## Node.js

Actualizar únicamente cuando:

`assessment → node.action = REQUIRED`

No interpretar una declaración de Node.js como evidencia de compatibilidad funcional.

## Runtime

Modificar únicamente configuración bajo control del repositorio.

Cuando dependa de infraestructura externa no observable:

dejar pendiente.

No leer CI/CD protegido para inferirla.

## Programming Model

Puede preparar:

- dependencia;
- entrypoint global;
- estructura.

No migrar Functions individuales.

## Dependencias

Actualizar únicamente paquetes autorizados por el plan.

Registrar:

- paquete;
- versión anterior;
- versión target;
- razón;
- acción relacionada.

No actualizar por antigüedad.

## Package manager

Preservar el package manager existente cuando sea válido.

Mantener lockfile consistente.

## Scripts

Mantener scripts:

- breves;
- legibles;
- multiplataforma.

Evitar cuando sea razonable comandos shell específicos de plataforma.

## TypeScript

Preservar configuración válida.

Separar producción y tests únicamente cuando aporte una necesidad real.

## Jest

Preparar infraestructura global de tests cuando el plan lo requiera.

No crear tests de Functions.

## Recursos compartidos

Consumir acciones globales de shared resources.

Cada recurso debe modificarse una sola vez mediante su acción propietaria.

Respetar:

- resourceId;
- ownership;
- consumers;
- scope;
- dependencies.

Scopes:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

No promover un recurso a `src/shared/` sin evidencia de ownership transversal.

## Shared resource funcional

Si la transformación requiere comprender comportamiento específico de una Function o capability:

no resolverla aquí.

Delegar a:

`prepare-function`

cuando corresponda.

## Configuración

Trabajar únicamente con nombres de claves.

Nunca leer valores sensibles.

## host.json

Preservar configuración válida.

Modificar únicamente propiedades justificadas.

## .funcignore

Actualizar cuando corresponda para excluir artefactos no runtime.

Ejemplos:

- `.migration`;
- `.skill-improvement`;
- tests;
- coverage;
- test-results;
- documentación de desarrollo.

No excluir contenido requerido para runtime.

## Catálogo

No modificar las secciones BEFORE de:

`.migration/catalog/**`

## Build

El build global completo no es gate de este skill.

Estados intermedios pueden ser temporalmente incompatibles.

Registrar los fallos observados y su causa cuando pueda determinarse.

## Salidas estructuradas

Crear:

`.migration/repository/preparation.json`

Debe registrar:

- status;
- executed actions;
- global changes;
- architecture preparation;
- shared resource actions;
- files modified;
- dependencies changed;
- validations;
- skipped actions;
- blocked actions;
- risks;
- unknowns.

## Salida humana

Crear:

`.migration/repository/preparation.md`

Usar:

`../_shared/templates/repository-preparation.template.md`

## Lecciones

Crear:

`.migration/lessons/prepare-function-app/lessons.json`

`.migration/lessons/prepare-function-app/lessons.md`

## Estados

Usar:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Criterio de cierre

El skill termina cuando:

- el plan global fue consumido;
- solo se ejecutaron acciones autorizadas;
- configuración válida fue preservada;
- base arquitectónica necesaria fue preparada;
- shared resources globales fueron tratados una sola vez;
- no se modificó comportamiento funcional;
- validaciones razonables fueron ejecutadas;
- blockers y unknowns quedaron visibles;
- se generaron preparation y lessons.

## Fuera de alcance

No debe:

- modificar lógica de negocio;
- crear tests de comportamiento;
- completar refactor de una Function;
- migrar registros Azure;
- migrar Durable;
- resolver deuda no bloqueante;
- optimizar;
- leer pipelines protegidos;
- desplegar.

Siguiente skill sugerido:

`prepare-function`
