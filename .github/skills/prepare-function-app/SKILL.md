---
name: prepare-function-app
description: Prepara la base técnica global de una Azure Function App ejecutando únicamente acciones aprobadas del plan, incluidas dependencias, tooling, configuración y recursos compartidos, sin modificar comportamiento funcional.
---

# Prepare Function App

## Objetivo

Ejecutar las acciones globales y compartidas aprobadas que deben completarse antes de la preparación o migración técnica
de las Functions.

Puede modificar cuando esté planificado:

- configuración global segura;
- dependencias;
- tooling;
- estructura global requerida;
- recursos compartidos mediante su acción propietaria.

No modifica comportamiento funcional específico de una Function.

No reinterpreta el plan.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`;
- `.migration/repository/assessment.json`;
- `.migration/plans/migration-plan.json`.

Cuando existan shared resources confirmados:

`.migration/resources/shared-resources.json`

El plan global debe estar:

- `READY`;
- o `PARTIAL` cuando existan acciones independientes seguras que puedan ejecutarse.

No ejecutar acciones dependientes de partes bloqueadas o pendientes de revisión.

## Entradas

Consumir primero:

- inventory;
- assessment;
- plan global;
- baseline referenciada por el plan;
- shared resources cuando existan.

No volver a analizar el repositorio completo.

No volver a determinar qué debería cambiar.

Planning es owner de esa decisión.

## Principio

Aplicar únicamente acciones aprobadas por el plan.

Antes de modificar:

1. confirmar Action ID;
2. confirmar que la acción pertenece a esta etapa;
3. comprobar el estado actual;
4. preservar lo válido;
5. aplicar el menor cambio necesario;
6. validar el resultado relevante;
7. registrar `executionStatus`;
8. registrar cualquier desviación.

No modificar por uniformidad, conveniencia o preferencia.

Si el estado actual ya satisface el resultado esperado:

- no repetir innecesariamente el cambio;
- registrar evidencia del estado encontrado;
- utilizar el `executionStatus` correspondiente.

## Action IDs

Ejecutar únicamente acciones existentes del plan.

Acciones globales:

`GLOBAL-*`

Acciones propietarias sobre recursos compartidos:

`SR-ACTION-*`

Este skill no genera nuevos Action IDs.

Si descubre una necesidad no representada por el plan:

- no ejecutarla;
- registrar la desviación o bloqueo;
- no modificar silenciosamente el plan;
- requerir replanificación cuando sea necesaria para continuar.

## Execution status

Cada acción procesada debe utilizar:

- `COMPLETED`;
- `FAILED`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Aplicar la semántica definida en:

`../_shared/status-policy.md`

`executionStatus` describe la ejecución de una acción.

No utilizar `PASS` o `FAIL` como sustituto.

## Dependency baseline

La versión ejecutada debe coincidir con la acción aprobada del plan.

El plan debe conservar provenance hacia:

- `baselineId`;
- `baselineRevision`.

Registrar para cada cambio de package cuando corresponda:

- `actionId`;
- package;
- before;
- target;
- baselineId;
- baselineRevision.

No resolver versiones mediante:

- `latest`;
- rangos arbitrarios;
- upgrades oportunistas.

Si el target del plan contradice el baseline referenciado:

- no elegir silenciosamente una versión;
- no ejecutar el cambio afectado;
- registrar `REQUIRES_REVIEW`.

Una versión distinta solo puede utilizarse mediante un plan actualizado y aprobado.

## Runtime de ejecución

Distinguir:

```text
runtime de las tools
≠
runtime de validación de la Function App
```

Los scripts internos del toolkit deben seguir siendo compatibles con Node.js 14 o superior.

Las operaciones sobre la aplicación, como:

- install;
- typecheck;
- pruebas;
- build selectivo;

deben registrar el Node.js realmente utilizado cuando sea relevante.

Si una operación requiere Node.js target y este no está disponible:

- no sustituirlo silenciosamente por el runtime de las tools;
- utilizar `NOT_EXECUTED`, `BLOCKED` o `REQUIRES_REVIEW` según corresponda.

## Preparación estructural global

Aplicar:

`../_shared/architecture-policy.md`

únicamente cuando exista una acción estructural aprobada.

Ejecutar cambios estructurales de esta etapa únicamente cuando:

`requiredForMigration = true`

No crear por anticipado:

- `src/functions/`;
- `application/`;
- `domain/`;
- `infrastructure/`;
- `shared/`;
- interfaces;
- factories.

Preservar las convenciones existentes cuando sean coherentes.

Crear únicamente estructura con responsabilidad real y requerida por el plan.

## Cambios globales

Aplicar únicamente cuando estén explícitamente planificados:

- configuración de Node.js controlada por el repositorio;
- Azure Functions dependencies;
- Durable dependencies;
- Azure SDK dependencies;
- TypeScript;
- Jest;
- coverage tooling;
- scripts;
- build configuration;
- `host.json`;
- `.funcignore`;
- estructura global requerida;
- configuración transversal segura.

No convertir esta lista en cambios obligatorios.

## Node.js

Ejecutar únicamente acciones globales aprobadas relacionadas con Node.js.

Puede incluir cuando corresponda elementos controlados por el repositorio, como:

- `package.json` engines;
- tooling;
- tipos Node;
- configuración de build.

No considerar estos cambios evidencia de que el runtime Azure desplegado ya utiliza Node.js 24.

No modificar CI/CD protegido para actualizar el runtime.

No tratar un cambio de versión declarada como prueba de compatibilidad del source.

## Azure Functions Runtime

Modificar únicamente configuración segura y controlada directamente por el repositorio cuando exista una acción
aprobada.

No confundir:

`host.json`

con:

`Azure Functions Runtime version`

Cuando el Runtime efectivo dependa de infraestructura externa, deployment configuration o CI/CD protegido:

- no inferir su estado;
- no leer contenido protegido;
- no afirmar que el Runtime fue actualizado;
- registrar la validación o acción externa pendiente.

Este skill no despliega.

## Programming Model

Puede preparar:

- package target;
- tooling;
- estructura global requerida;

cuando exista una acción aprobada.

No migrar registros individuales de Functions.

La adaptación de Programming Model pertenece a:

`migrate-programming-model-v4`

## Dependencias

Actualizar únicamente packages representados por acciones aprobadas.

Registrar:

- actionId;
- package;
- before;
- after;
- baselineId;
- baselineRevision;
- reason;
- evidence.

No actualizar por antigüedad.

No modificar dependencias no listadas.

La actualización del package no implica que este skill deba adaptar todos sus consumidores.

Las adaptaciones locales o compartidas deben seguir las acciones propietarias definidas por planning.

## Package manager

Preservar el package manager existente cuando sea compatible con el target.

No cambiar entre npm, yarn o pnpm únicamente por preferencia.

Cuando una acción aprobada modifique dependencias:

- mantener el lockfile existente coherente;
- no crear un tipo de lockfile diferente sin una acción explícita.

## TypeScript

Modificar únicamente lo aprobado y necesario para:

- target técnico;
- build;
- tooling de pruebas;
- cambios estructurales aprobados que requieran configuración TypeScript.

No introducir configuración compleja sin necesidad.

No seleccionar una nueva versión si el plan no contiene un target aprobado.

## Jest

Preparar tooling global únicamente cuando esté planificado.

Puede incluir cuando corresponda:

- dependencias;
- configuración;
- scripts;
- coverage configuration.

No generar pruebas de comportamiento desde este skill.

## Recursos compartidos

Consumir:

`.migration/resources/shared-resources.json`

cuando exista.

Ejecutar las `SR-ACTION-*` aprobadas asignadas a esta etapa.

Cada transformación shared debe ejecutarse mediante una única acción propietaria.

No duplicar la transformación en cada consumidor.

Una adaptación específica de un consumidor debe estar representada mediante una acción `FN-*`.

Si una `SR-ACTION-*` no está suficientemente definida para ejecutarse de forma segura:

- no delegarla informalmente;
- registrar la limitación;
- utilizar `BLOCKED` o `REQUIRES_REVIEW` cuando corresponda;
- volver a planning si el plan necesita corrección.

## Ownership

Respetar ownership confirmado:

- `REPOSITORY`;
- `FUNCTION_APP`;
- `CAPABILITY`;
- `WORKFLOW`.

Ownership identifica responsabilidad sobre el recurso.

No autoriza ampliar el scope ni modificar comportamiento funcional.

## Shared resource action

Ejemplo:

    {
      "id": "SR-ACTION-001",
      "resourceId": "SR-COSMOS-REPORTS"
    }

Registrar el resultado de ejecución en:

`.migration/repository/preparation.json`

No modificar:

`.migration/resources/shared-resources.json`

para aparentar que el estado posterior siempre fue el estado original.

## Configuración

Trabajar únicamente con configuración segura permitida por:

`security-policy.md`

Registrar únicamente nombres de claves cuando corresponda.

Nunca leer o registrar valores sensibles.

No modificar archivos protegidos originales.

Detectar una referencia `process.env.KEY` no autoriza resolver su valor.

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

salvo metadata de navegación expresamente diseñada para actualizarse.

Los artifacts BEFORE representan el estado original.

## Build y validación selectiva

El build global final no es gate de este skill.

Pertenece a:

`verify-function-app`

Puede ejecutarse validación selectiva cuando:

- esté relacionada con la acción ejecutada;
- aporte evidencia útil;
- no requiera completar todavía Functions pendientes.

Ejemplos:

- validación de configuración;
- package installation cuando sea viable;
- typecheck selectivo;
- pruebas de tooling;
- static checks.

No considerar un estado intermedio mixto como fallo definitivo de toda la Function App.

No corregir automáticamente fallos fuera de las acciones aprobadas.

## Validaciones

Cada validación debe utilizar:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

Registrar evidencia.

Ejemplo:

    {
      "name": "typescript-config",
      "status": "PASS",
      "evidence": [
        "tsconfig.json"
      ]
    }

No afirmar `PASS` sin evidencia.

## Desviaciones del plan

Registrar únicamente diferencias entre lo planificado y lo ejecutado.

Una desviación no autoriza trabajo nuevo.

Distinguir cuando corresponda:

- efecto secundario esperado de una acción aprobada;
- acción que no pudo ejecutarse;
- estado actual diferente al esperado;
- necesidad nueva no representada por el plan.

Cuando una necesidad nueva sea requerida para continuar:

no ejecutarla hasta que planning la incorpore de forma explícita.

## Salida estructurada

Crear:

`.migration/repository/preparation.json`

## preparation.json

Debe contener cuando corresponda:

- `schemaVersion`;
- `status`;
- `planRef`;
- `baselineRef`;
- `actionResults`;
- `globalChanges`;
- `structuralPreparation`;
- `sharedResourceActions`;
- `filesModified`;
- `dependenciesChanged`;
- `validations`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

### actionResults

Cada acción procesada debe registrar como mínimo:

- `actionId`;
- `executionStatus`.

Registrar además cuando corresponda:

- reason;
- before;
- after;
- evidence.

Ejemplo:

    {
      "actionId": "GLOBAL-001",
      "executionStatus": "COMPLETED",
      "evidence": []
    }

## Estado principal

Usar exclusivamente:

- `COMPLETED`;
- `PARTIAL`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### COMPLETED

Todas las acciones requeridas asignadas a esta etapa están:

- `COMPLETED`;
- o justificadamente `NOT_APPLICABLE`.

Las acciones con:

`requiredForMigration = false`

no son necesarias para obtener `COMPLETED`.

### PARTIAL

Parte del trabajo requerido fue completado y existe trabajo independiente seguro que puede continuar.

### BLOCKED

Un impedimento técnico conocido impide completar trabajo requerido de esta etapa.

### REQUIRES_REVIEW

Completar esta etapa depende de una decisión humana.

Una acción `FAILED` puede provocar `BLOCKED`, pero ambos estados representan conceptos diferentes.

## Salida humana

Crear:

`.migration/repository/preparation.md`

Usar:

`../_shared/templates/repository-preparation.template.md`

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

El skill termina cuando:

- plan y baseline reference fueron consumidos;
- únicamente acciones aprobadas de esta etapa fueron procesadas;
- cada acción procesada tiene `executionStatus`;
- las dependency versions ejecutadas coinciden con el plan y baseline referenciado;
- shared actions aplicables fueron ejecutadas una sola vez;
- cambios estructurales ejecutados eran requeridos por el plan;
- configuración protegida no fue leída ni modificada;
- archivos modificados quedaron registrados;
- validaciones realizadas contienen evidencia;
- desviaciones del plan quedaron explícitas;
- no se generaron nuevos Action IDs;
- no se modificó el plan;
- no se modificó el catálogo BEFORE;
- no se ejecutó el build global final;
- el estado principal fue determinado.

La ausencia de lessons no impide cerrar preparation.

## Fuera de alcance

No debe:

- modificar lógica funcional específica;
- generar pruebas de comportamiento;
- migrar registros de Functions;
- migrar workflows Durable;
- ejecutar acciones no planificadas;
- generar nuevos Action IDs;
- seleccionar nuevas dependency versions;
- consultar `latest`;
- corregir silenciosamente el plan;
- ejecutar acciones con `requiredForMigration = false` como trabajo obligatorio;
- resolver deuda no bloqueante;
- modernizar;
- optimizar;
- leer o modificar CI/CD protegido;
- desplegar;
- ejecutar el build global final.

Siguiente skill sugerido:

`prepare-function`
