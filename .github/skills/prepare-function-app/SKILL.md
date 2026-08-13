---
name: prepare-function-app
description: Prepara la base técnica y arquitectónica global de una Azure Function App aplicando únicamente cambios planificados y coordinando recursos compartidos sin modificar comportamiento funcional.
---

# Prepare Function App

## Objetivo

Ejecutar las acciones globales necesarias antes de preparar Functions individuales.

Puede modificar:

- configuración global;
- dependencias;
- tooling;
- estructura base;
- recursos compartidos cuyo ownership permita tratamiento global.

No modifica comportamiento funcional específico de una Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`
- `.migration/repository/assessment.json`
- `.migration/plans/migration-plan.json`

Cuando existan shared resources:

`.migration/resources/shared-resources.json`

El plan global debe estar:

- `READY`;
- o `PARTIAL` cuando existan acciones independientes seguras.

## Entradas

Consumir primero:

- inventory;
- assessment;
- plan global;
- shared resources;
- shared resource actions.

No volver a analizar el repositorio completo.

## Principio

Aplicar únicamente acciones planificadas.

Antes de modificar:

1. confirmar action ID;
2. comprobar estado actual;
3. preservar lo válido;
4. aplicar el menor cambio necesario;
5. validar;
6. registrar resultado.

No modificar por uniformidad o conveniencia.

## IDs

Ejecutar acciones existentes del plan.

Acciones globales:

`GLOBAL-*`

Acciones sobre recursos compartidos:

`SR-ACTION-*`

No generar nuevos IDs salvo que una inconsistencia del plan obligue a detenerse y registrarla.

No modificar silenciosamente el plan.

## Arquitectura

Aplicar:

`../_shared/architecture-policy.md`

Puede preparar:

`src/functions/`

cuando esté planificado.

No crear por anticipado:

- `application/`;
- `domain/`;
- `infrastructure/`;
- `shared/`;
- interfaces;
- factories.

Crear únicamente estructura con responsabilidad real.

## Cambios globales

Aplicar cuando estén explícitamente planificados:

- Node.js;
- Azure Functions dependencies;
- Durable dependencies;
- Azure SDK dependencies;
- TypeScript;
- Jest;
- coverage;
- scripts;
- build;
- `host.json`;
- `.funcignore`;
- estructura base;
- configuración transversal.

## Node.js

Actualizar únicamente cuando exista una acción global respaldada por:

`assessment.technicalDimensions.node.actionStatus = REQUIRED`

No tratar el cambio de versión como prueba de compatibilidad del código.

## Azure Functions Runtime

Modificar únicamente configuración observable y controlada por el repositorio.

Cuando el Runtime efectivo dependa de infraestructura externa no observable:

no inferirlo.

Mantener la validación pendiente.

## Programming Model

Puede preparar dependencias o estructura global necesarias.

No migrar registros individuales.

## Dependencias

Actualizar únicamente paquetes incluidos en el plan.

Registrar:

- actionId;
- package;
- before;
- after;
- reason.

No actualizar por antigüedad.

## Package manager

Preservar el mecanismo existente cuando sea compatible con el target.

Mantener lockfile consistente.

## TypeScript

Modificar únicamente lo necesario para:

- target;
- build;
- tests;
- arquitectura planificada.

No introducir configuraciones complejas sin necesidad.

## Jest

Preparar tooling global cuando esté planificado.

No crear tests funcionales aquí.

## Recursos compartidos

Consumir:

`.migration/resources/shared-resources.json`

y:

`sharedResourceActions`

del plan global.

Cada recurso que requiera cambio debe modificarse mediante una única acción propietaria.

No duplicar una transformación en cada consumidor.

## Ownership

Respetar:

- `REPOSITORY`
- `FUNCTION_APP`
- `CAPABILITY`
- `WORKFLOW`

Una acción global solo debe ejecutarse aquí cuando su ownership y alcance lo permitan.

Si requiere conocimiento funcional específico:

delegar a `prepare-function`.

## Shared resource action

Ejemplo:

    {
      "id": "SR-ACTION-001",
      "resourceId": "SR-COSMOS-REPORTS"
    }

Registrar el resultado de ejecución sin modificar:

`shared-resources.json`

para aparentar que el recurso siempre estuvo así.

## Configuración

Trabajar únicamente con nombres de claves.

Nunca leer valores sensibles.

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

salvo metadatos de navegación explícitamente permitidos.

## Build

El build global final no es gate de este skill.

Puede ejecutarse validación selectiva cuando aporte evidencia.

No considerar un estado intermedio mixto como fallo definitivo por sí solo.

## Salida estructurada

Crear:

`.migration/repository/preparation.json`

## preparation.json

Debe contener como mínimo:

- `schemaVersion`;
- `status`;
- `executedActions`;
- `globalChanges`;
- `architecturePreparation`;
- `sharedResourceActions`;
- `filesModified`;
- `dependenciesChanged`;
- `validations`;
- `skippedActions`;
- `blockedActions`;
- `risks`;
- `unknowns`.

## Estado principal

Usar exclusivamente:

- `COMPLETED`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

Ejemplo:

    {
      "status": "COMPLETED"
    }

No usar:

    {
      "status": "CONFIRMED"
    }

La evidencia interna usa:

`evidenceStatus`

## Validaciones

Cada validación usa:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Ejemplo:

    {
      "name": "typescript-config",
      "status": "PASS"
    }

## Salida humana

Crear:

`.migration/repository/preparation.md`

Usar:

`../_shared/templates/repository-preparation.template.md`

## Lecciones

Crear:

`.migration/lessons/prepare-function-app/lessons.json`

`.migration/lessons/prepare-function-app/lessons.md`

## Criterio de cierre

`COMPLETED` requiere:

- todas las acciones globales aplicables ejecutadas;
- shared actions de este scope completadas;
- configuración válida preservada;
- no existen blockers globales pendientes para esta etapa.

`PARTIAL` se permite cuando otras acciones independientes pueden continuar.

## Fuera de alcance

No debe:

- modificar lógica funcional específica;
- agregar tests de comportamiento;
- migrar Functions;
- migrar Durable;
- ejecutar acciones no planificadas;
- resolver deuda no bloqueante;
- optimizar;
- leer CI/CD protegido;
- desplegar.

Siguiente skill sugerido:

`prepare-function`
