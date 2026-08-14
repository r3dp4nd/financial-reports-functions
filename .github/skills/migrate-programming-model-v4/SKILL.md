---
name: migrate-programming-model-v4
description: Migra una Function Azure Functions Node.js desde Programming Model v3 a v4 ejecutando únicamente las acciones aprobadas de integración con el runtime y preservando su comportamiento observable, configuración y dependencias compartidas.
---

# Migrate Programming Model v4

## Objetivo

Migrar únicamente la integración de una Function con Azure Functions desde Programming Model v3 hacia Programming Model
v4.

Debe preservar cuando corresponda:

- comportamiento observable;
- contratos;
- Function name;
- trigger semantics;
- bindings;
- configuration key names;
- estructura requerida ya preparada;
- shared resources;
- comportamiento protegido por pruebas.

No rediseña la Function.

No ejecuta modernización.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

`architecture-policy.md` se utiliza únicamente para evitar revertir cambios estructurales requeridos por el plan.

No se utiliza para introducir nueva arquitectura durante migration.

## Precondiciones

Deben existir:

- `analysis.json`;
- Function migration plan;
- global migration plan.

Cuando el plan requiera preparation local:

`.migration/functions/<FunctionName>/preparation.json`

Las acciones de preparation requeridas por esta migración deben estar completadas o justificadamente `NOT_APPLICABLE`.

Cuando existan testing requirements requeridos antes de migration:

`.migration/functions/<FunctionName>/testing.json`

Todos los requirements de los que dependa esta acción con:

`requiredBeforeMigration = true`

deben encontrarse satisfechos.

No utilizar `READY_FOR_MIGRATION` de preparation como permiso para omitir testing gates definidos por el plan.

## Entradas

Consumir primero:

- Function analysis;
- Function migration plan;
- global plan;
- preparation cuando aplique;
- `testing.json` cuando aplique;
- global preparation relevante;
- shared resources relevantes.

No reconstruir analysis.

No reinterpretar planning.

No volver a seleccionar targets.

## Progressive disclosure

Preferir:

```text
plan action
→ current adapter
→ trigger/binding definition
→ directly related source
```

No volver a analizar toda la capability.

No ampliar el slice salvo que una adaptación técnica concreta lo requiera.

## Aplicabilidad

Usar el Programming Model observado y el plan aprobado.

### V4

Si la Function está confirmada en `V4` y el plan no contiene una acción requerida de Programming Model:

`status = NOT_APPLICABLE`

Si está confirmada en `V4` pero el plan contiene una acción que afirma que requiere migración:

registrar la contradicción.

No resolverla silenciosamente.

`status = REQUIRES_REVIEW`

### V3

La migración puede ejecutarse cuando:

- existe acción aprobada;
- sus dependencies están satisfechas;
- preparation requerida está completa;
- testing gates requeridos están satisfechos.

### UNKNOWN

No inventar una transformación.

`status = REQUIRES_REVIEW`

### MIXED

Ejecutar únicamente cuando el plan identifique inequívocamente el adapter v3 y la acción que debe migrarse.

Cuando no pueda determinarse con seguridad:

`status = REQUIRES_REVIEW`

## Acciones

Ejecutar únicamente acciones `FN-*` aprobadas cuya responsabilidad corresponda a esta migración de Programming Model.

No ejecutar:

- acciones de preparation;
- acciones globales;
- acciones shared propietarias;
- acciones Durable asignadas al workflow;
- deuda;
- optimizaciones;
- acciones con `requiredForMigration = false` como trabajo obligatorio.

Preservar exactamente los IDs del plan.

Este skill no genera nuevos Action IDs.

## Execution status

Cada acción procesada utiliza:

- `COMPLETED`;
- `FAILED`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Aplicar la semántica de:

`../_shared/status-policy.md`

No utilizar `PASS` o `FAIL` como estado de ejecución de una acción.

## Dependencia `@azure/functions`

El target de:

`@azure/functions`

debe provenir del plan y de la baseline referenciada.

Este skill no selecciona una versión distinta.

La preparación global es responsable de los cambios de package definidos por el plan.

Este skill no debe volver a modificar `package.json` o lockfiles para seleccionar otra versión.

Si el target requerido no se encuentra preparado según el plan:

`status = BLOCKED`

No ejecutar:

```text
npm install @azure/functions@latest
```

No utilizar una versión distinta por conveniencia.

## Documentación técnica externa

Cuando sea necesario resolver la forma exacta de una API del Programming Model v4:

puede consultarse documentación oficial mínima conforme a `evidence-policy.md`.

La investigación puede responder:

`¿Cómo implementamos el target aprobado?`

No:

`¿Qué nueva versión deberíamos seleccionar?`

Planning y baseline siguen siendo owners del target.

## Scope de modificación

Modificar únicamente:

- registro Azure Functions;
- adaptación de trigger;
- adaptación de bindings;
- runtime context usage;
- input/output mapping requerido por el Programming Model;
- artifacts legacy cuya sustitución esté aprobada;
- código directamente necesario para adaptar el contrato del runtime.

No volver a refactorizar la capability.

No reorganizar carpetas por convención.

No crear nuevas capas.

## Estructura preparada

Preservar los cambios estructurales requeridos que ya fueron ejecutados durante preparation.

No imponer paths como:

`src/functions/**`

Si el plan no exige mover un adapter existente:

preservar su ubicación.

La migración no debe reintroducir acoplamiento que una acción `requiredForMigration = true` ya eliminó.

## Shared resources

Consumir los recursos y límites existentes.

No:

- duplicar repositories;
- duplicar publishers;
- duplicar factories;
- crear clientes alternativos;
- cambiar ownership;
- reemplazar recursos compartidos por implementaciones locales.

Respetar:

`dependsOn`

Si una dependencia shared requerida por esta acción no está completada:

no ejecutar la acción dependiente.

Cuando impida completar esta migración:

`status = BLOCKED`

## Durable ownership

Una Function Durable no se delega automáticamente.

Usar el owner definido por planning.

Si una acción pertenece a la migración coordinada del workflow Durable:

no ejecutarla desde este skill.

Será responsabilidad de:

`migrate-durable-functions-v4`

Evitar que ambos skills modifiquen el mismo adapter o acción.

## Registro v4

Transformar únicamente el registro correspondiente al trigger confirmado y aprobado.

Preservar cuando corresponda:

- Function name;
- trigger type;
- route;
- methods;
- schedules;
- queue/topic/blob identifiers;
- configuration key names;
- input semantics;
- output semantics;
- binding intent;
- relevant error behavior.

La sintaxis puede cambiar.

La semántica observable debe preservarse.

No inventar configuración.

## Configuración

Trabajar únicamente con nombres de configuración permitidos.

Ejemplo:

`COSMOS_CONNECTION`

Nunca:

- leer valores;
- copiar valores;
- resolver valores desde `local.settings.json`;
- leer CI/CD protegido.

Detectar una configuration key no autoriza obtener su valor.

## Bindings

Adaptar únicamente bindings pertenecientes a la Function migrada.

Registrar:

- before;
- after;
- semántica preservada;
- evidencia.

No agregar un binding nuevo únicamente porque sea posible en Programming Model v4.

Cualquier cambio de comportamiento requiere revisión.

## Código funcional

No modificar reglas funcionales.

Puede modificarse únicamente código de boundary necesario para adaptar:

```text
runtime input
→ existing behavior
→ runtime output
```

Si la adaptación aparentemente requiere cambiar:

- decisión funcional;
- output contractual;
- error relevante;
- observable side effect;

detener el cambio afectado.

`status = REQUIRES_REVIEW`

No normalizar silenciosamente una diferencia funcional como parte de la migración.

## Legacy artifacts

Retirar únicamente artifacts legacy directamente reemplazados por la acción aprobada.

Antes de retirar un artifact:

- confirmar que pertenece a la Function migrada;
- confirmar que su reemplazo existe;
- confirmar que el plan permite retirarlo;
- confirmar que no sigue siendo requerido por build o registration observable.

Si existe incertidumbre:

preservarlo y registrar el finding.

No realizar cleanup global.

## Dependencies y APIs

Registrar únicamente dependencias o APIs realmente involucradas en esta migración.

No volver a realizar dependency assessment.

Registrar cuando corresponda:

- package;
- target aprobado utilizado;
- API before;
- API after;
- adaptación aplicada;
- evidence.

No incluir dependencias que no hayan participado en el cambio.

## Tests

Consumir los tests que protegen los contratos requeridos.

Después de la migración ejecutar nuevamente las pruebas relevantes cuando sea viable.

No generar nuevas pruebas desde este skill.

No modificar expectations únicamente para hacer verde la migración.

Si un test basado en un contrato confirmado falla:

- registrar `FAIL`;
- conservar evidencia;
- no modificar el test para aceptar la regresión;
- determinar el impacto sobre el estado principal.

Una suite verde demuestra únicamente los contratos cubiertos.

## Validaciones

Ejecutar únicamente validaciones locales relevantes.

Pueden incluir:

- tests relevantes;
- typecheck selectivo;
- registration check;
- static check.

Usar:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

Cada validación debe conservar evidencia.

No utilizar el build global final como gate de este skill.

El build global final pertenece a:

`verify-function-app`

## Structure preserved

Comprobar únicamente que la migración no revirtió cambios estructurales requeridos por el plan.

Ejemplo:

    {
      "structurePreserved": {
        "status": "PASS",
        "evidence": []
      }
    }

Este check no evalúa calidad arquitectónica general.

No verifica modernización.

No exige convergencia hacia una estructura ideal.

## Desviaciones del plan

Registrar cualquier diferencia entre el plan y la ejecución.

Una desviación no autoriza una acción nueva.

Si se descubre una adaptación adicional necesaria:

- no generar un nuevo `FN-*`;
- no ejecutarla silenciosamente;
- registrar evidencia;
- volver a planning cuando sea necesaria.

## Salida estructurada

Crear:

`.migration/functions/<FunctionName>/migration.json`

Debe contener cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `planRef`;
- `testingRef`;
- `previousProgrammingModel`;
- `resultingProgrammingModel`;
- `actionResults`;
- `trigger`;
- `bindings`;
- `configurationKeys`;
- `adapterChanges`;
- `dependenciesAndApis`;
- `structurePreserved`;
- `sharedResources`;
- `filesModified`;
- `legacyArtifactsHandled`;
- `tests`;
- `validations`;
- `deviationsFromPlan`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

No debe duplicar:

- analysis completo;
- preparation completo;
- testing completo;
- architecture target;
- dependency assessment.

## actionResults

Cada acción procesada debe registrar como mínimo:

- `actionId`;
- `executionStatus`.

Registrar cuando corresponda:

- reason;
- filesModified;
- evidence.

Ejemplo:

    {
      "actionId": "FN-REQUESTREPORT-005",
      "executionStatus": "COMPLETED",
      "evidence": []
    }

## Estado principal

Usar únicamente:

- `MIGRATED`;
- `NOT_APPLICABLE`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### MIGRATED

La acción requerida de Programming Model fue ejecutada correctamente.

Además:

- dependencies requeridas estaban satisfechas;
- testing gates previos requeridos estaban satisfechos;
- adapter quedó en Programming Model v4;
- comportamiento observable no fue modificado intencionalmente;
- shared resources fueron preservados;
- estructura requerida por el plan no fue revertida;
- validaciones locales obligatorias fueron satisfactorias;
- no existe blocker de esta etapa.

`MIGRATED` no significa que la Function App completa esté verificada.

### NOT_APPLICABLE

La Function ya cumple Programming Model v4 y no existe una acción PM pendiente.

### BLOCKED

Un impedimento técnico conocido impide completar o validar una acción requerida de esta etapa.

### REQUIRES_REVIEW

La migración depende de una decisión humana o existe una contradicción que no puede resolverse de forma segura.

## Evidencia interna

Cuando sea necesario representar certeza de un hallazgo:

usar:

`evidenceStatus`

No utilizar el status principal para representar evidencia.

## Salida humana

Crear:

`.migration/functions/<FunctionName>/migration.md`

Usar:

`../_shared/templates/function-migration.template.md`

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

La migración representa ejecución.

No debe reescribir el estado histórico BEFORE.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

`MIGRATED` requiere:

- la Function era aplicable a migración PM v4;
- la acción `FN-*` correspondiente provenía del plan;
- todos sus `dependsOn` requeridos estaban satisfechos;
- los testing gates previos requeridos estaban satisfechos;
- `@azure/functions` target aprobado estaba preparado;
- adapter fue migrado;
- Function name y trigger semantics fueron preservados;
- bindings y configuration key names relevantes fueron preservados;
- shared resources no fueron duplicados ni redefinidos;
- cambios estructurales requeridos previamente no fueron revertidos;
- legacy artifacts fueron tratados únicamente cuando correspondía;
- acción procesada tiene `executionStatus`;
- tests relevantes fueron ejecutados cuando eran un gate requerido;
- validaciones obligatorias fueron satisfactorias;
- desviaciones quedaron explícitas;
- no se generaron nuevos Action IDs;
- no se modificó el plan;
- no se ejecutó build global final;
- no existe blocker de esta etapa.

La ausencia de lessons no impide cerrar migration.

## Fuera de alcance

No debe:

- volver a refactorizar la capability;
- generar tests;
- introducir seams;
- seleccionar versiones de dependencias;
- modificar packages globales para elegir otra versión;
- ejecutar acciones globales;
- ejecutar acciones shared propietarias;
- migrar acciones asignadas al workflow Durable;
- cambiar comportamiento funcional;
- redefinir recursos compartidos;
- cambiar ownership;
- actualizar dependencias no planificadas;
- generar nuevos Action IDs;
- resolver deuda;
- modernizar;
- optimizar;
- ejecutar build global final;
- desplegar.

Siguiente etapa según el plan:

- `migrate-durable-functions-v4` cuando exista migración Durable pendiente;
- `verify-function-app` cuando todas las migraciones requeridas estén completas.
