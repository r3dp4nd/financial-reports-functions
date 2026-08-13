---
name: migrate-programming-model-v4
description: Migra una Function legacy de Azure Functions Node.js al Programming Model v4, transformando únicamente su integración con el runtime y preservando el comportamiento protegido por tests.
---

# Migrate Programming Model v4

## Objetivo

Migrar una Function legacy al Azure Functions Node.js Programming Model v4.

Este skill puede modificar:

- entrypoint Azure;
- registro de trigger;
- bindings;
- tipos Azure Functions;
- adaptación de request, context y response;
- archivos `function.json` legacy relacionados.

No debe modificar comportamiento funcional intencionalmente.

## Precondiciones

Deben existir:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/migration-plan.json`

`.migration/functions/<FunctionName>/preparation.json`

La Function debe estar en estado:

`READY_FOR_MIGRATION`

La baseline de tests requerida debe estar verde.

La preparación global necesaria de la Function App debe haberse realizado previamente.

## Aplicabilidad

Consultar primero el estado del Programming Model registrado en los artefactos previos.

Si la Function ya utiliza Programming Model v4:

- registrar `NOT_APPLICABLE`;
- no modificar su registro;
- no migrarla nuevamente.

Si el estado es `UNKNOWN`:

- no iniciar la transformación;
- registrar `REQUIRES_REVIEW`.

Si la Function pertenece a un workflow Durable que requiere migración especializada:

- no migrarla aisladamente;
- delegar al skill `migrate-durable-functions-v4`.

## Principio

Transformar:

`adapter Azure legacy`

en:

`adapter Azure Programming Model v4`

preservando:

- comportamiento;
- entrada;
- validaciones;
- decisiones;
- efectos secundarios;
- salida;
- manejo de errores;
- contratos relevantes.

No aprovechar esta migración para rediseñar la lógica interna.

## Evidencia previa

Consumir primero:

- inventory;
- assessment;
- analysis;
- migration plan;
- preparation.

No volver a analizar toda la Function App.

Leer únicamente los archivos necesarios para realizar la transformación.

Si el código actual contradice los artefactos previos:

- detener la transformación afectada;
- registrar la inconsistencia;
- marcar `REQUIRES_REVIEW`.

## Registro v4

Transformar la configuración declarativa legacy en registro mediante las APIs correspondientes del Programming Model v4.

Ejemplos de registros pueden incluir:

- `app.http`;
- `app.timer`;
- `app.serviceBusQueue`;
- `app.serviceBusTopic`;
- registros de Cosmos DB;
- otros triggers o bindings soportados.

Usar la API específica documentada oficialmente para el trigger o binding real.

No inventar propiedades de configuración.

## Nombre de Function

Preservar el nombre lógico existente cuando sea posible.

Un cambio de nombre puede afectar:

- invocaciones;
- monitoring;
- Durable workflows;
- infraestructura;
- consumidores externos.

No renombrar una Function únicamente por convenciones de código.

## function.json

Para una Function legacy migrada correctamente al modelo v4:

- trasladar al registro en código la configuración necesaria;
- eliminar el `function.json` correspondiente únicamente cuando deje de ser necesario.

No eliminar todos los `function.json` de la aplicación de forma indiscriminada.

La limpieza final de artefactos legacy debe verificarse a nivel Function App.

## HTTP Functions

Cuando corresponda, transformar el contrato legacy basado en elementos como:

- `context`;
- `context.req`;
- `context.res`;
- `context.bindings`;

hacia las APIs del Programming Model v4.

Preservar:

- métodos HTTP;
- route;
- auth level;
- status codes;
- headers;
- body;
- comportamiento de errores.

No cambiar contratos HTTP durante la migración salvo que el plan lo requiera explícitamente.

## Timer Functions

Preservar:

- schedule;
- configuración relevante;
- comportamiento del handler.

No alterar la expresión de schedule por motivos de estilo.

## Service Bus

Preservar cuando corresponda:

- queue o topic;
- subscription;
- nombre de connection setting;
- cardinalidad;
- metadata relevante;
- comportamiento de procesamiento.

No leer el valor de la connection string.

Registrar únicamente el nombre de la configuración.

## Cosmos DB

Preservar cuando corresponda:

- database;
- container;
- connection setting;
- lease configuration;
- demás opciones relevantes al binding.

No leer secretos ni connection strings.

## Bindings

Migrar cada binding basándose en documentación oficial vigente.

Distinguir:

- trigger;
- input binding;
- output binding.

No asumir que todos los bindings legacy tienen una traducción idéntica.

Cuando la equivalencia no pueda confirmarse:

`REQUIRES_REVIEW`

## context

No realizar reemplazos mecánicos globales de `context`.

Analizar qué responsabilidades utiliza realmente la Function.

Ejemplos:

- logging;
- invocation metadata;
- bindings;
- response;
- trigger metadata.

Adaptar únicamente esas responsabilidades a las APIs disponibles en v4.

## Logging

Preservar el comportamiento observable de logging cuando sea razonable.

No convertir esta migración en una iniciativa de observabilidad.

Cambiar logging únicamente cuando el Programming Model lo requiera.

## Código funcional

Preferir que la lógica preparada previamente permanezca sin cambios.

Ejemplo conceptual:

`v4 adapter -> application behavior`

La migración debería concentrarse principalmente en el adapter Azure.

Si es necesario modificar lógica interna para que compile:

- justificarlo;
- clasificar el cambio;
- comprobar que los tests siguen protegiendo comportamiento.

## Estructura

Cuando la Function App utilice la estructura objetivo acordada, los registros Azure pueden ubicarse bajo:

`src/functions/`

Ejemplo:

`src/functions/request-report.function.ts`

La implementación funcional puede permanecer bajo:

`src/<Capability>/`

No mover nuevamente archivos si la estructura ya fue preparada.

## package.json

El Programming Model v4 utiliza el entrypoint configurado para cargar los módulos que registran Functions.

Verificar que la configuración preparada globalmente permita cargar los registros migrados.

No realizar cambios globales adicionales si `prepare-function-app` ya dejó esta configuración correcta.

## Mezcla de modelos

No considerar segura una Function App parcialmente mezclada sin validación explícita.

Si durante la migración aparecen simultáneamente artefactos legacy y registros v4 activos:

- registrar el estado;
- no asumir que ambos modelos funcionarán de forma independiente;
- completar las adaptaciones planificadas antes del gate final de la Function App.

No usar un estado intermedio como evidencia de producción.

## Durable Functions

Este skill no realiza migración Durable especializada.

Si se detectan:

- `orchestrationTrigger`;
- `activityTrigger`;
- Durable client;
- starter;
- orchestrator;
- activities;

seguir el plan del workflow y utilizar:

`migrate-durable-functions-v4`

cuando corresponda.

No migrar Activities aisladamente si pertenecen a una migración Durable coordinada.

## Cambios permitidos

Este skill ejecuta principalmente cambios:

`REQUIRED_PLATFORM`

Puede realizar ajustes `STRUCTURAL` mínimos cuando sean necesarios para registrar correctamente la Function.

No ejecutar:

- `OPTIMIZATION`;
- deuda técnica no bloqueante;
- refactors funcionales no planificados.

## Tests

Después de la transformación ejecutar los mismos tests establecidos durante `prepare-function`.

Los tests deben continuar verdes.

No reescribir tests únicamente para adaptarlos a un comportamiento nuevo introducido accidentalmente.

Si un test falla:

1. identificar si el adapter cambió comportamiento;
2. corregir la migración;
3. preservar la expectativa existente cuando representa comportamiento confirmado.

Si el test estaba incorrecto o la baseline era incompleta:

- registrar la evidencia;
- marcar `REQUIRES_REVIEW`.

## Validación estática

Ejecutar cuando corresponda:

- tests de la Function;
- typecheck selectivo;
- validaciones estáticas relevantes.

No exigir todavía el build final de toda la Function App cuando otras Functions permanezcan legacy o en estado
intermedio.

## Registro de migración

Crear:

`.migration/functions/<FunctionName>/migration.json`

`.migration/functions/<FunctionName>/migration.md`

Y:

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.json`

`.migration/lessons/migrate-programming-model-v4/<FunctionName>.md`

## migration.json

Debe registrar como mínimo:

- metadata;
- Function;
- Programming Model anterior;
- Programming Model resultante;
- trigger migrado;
- bindings migrados;
- archivos modificados;
- artefactos legacy eliminados;
- tests ejecutados;
- validaciones;
- resultados;
- comportamiento preservado;
- riesgos;
- unknowns;
- evidencia.

No incluir secretos.

## migration.md

Debe explicar brevemente:

- qué se migró;
- qué configuración legacy fue reemplazada;
- qué se preservó;
- qué tests fueron ejecutados;
- resultado de las validaciones;
- qué quedó pendiente;
- si la Function está lista para verificación global.

No debe ser un diff completo.

## Lecciones aprendidas

Registrar únicamente observaciones útiles para mejorar futuras migraciones:

- binding no contemplado;
- diferencia inesperada entre modelos;
- adaptación repetitiva;
- falso supuesto;
- código legacy especialmente acoplado;
- migración más sencilla de lo previsto;
- patrón potencialmente automatizable;
- documentación ambigua;
- contexto innecesario;
- oportunidad de simplificar el skill.

No modificar automáticamente este skill.

Toda mejora requiere revisión humana.

## Estados de salida

La Function debe quedar en uno de estos estados:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

`MIGRATED` significa que la transformación de Programming Model terminó y sus validaciones locales correspondientes
pasaron.

No significa todavía que la Function App completa esté lista para deployment.

## Criterio de cierre

El skill termina cuando:

- se verificó aplicabilidad;
- la baseline previa estaba disponible;
- el registro legacy fue transformado a v4 cuando correspondía;
- trigger y bindings fueron preservados;
- el comportamiento funcional no fue modificado intencionalmente;
- los artefactos legacy de esa Function fueron tratados correctamente;
- los mismos tests continúan verdes;
- las validaciones posibles fueron ejecutadas;
- Durable fue delegado cuando corresponde;
- no se aplicaron optimizaciones;
- no se leyeron secretos;
- se generaron migration y lessons.

## Fuera de alcance

Este skill no debe:

- migrar una Function que ya esté en v4;
- migrar Durable Functions de forma aislada;
- modificar lógica de negocio;
- agregar nuevas funcionalidades;
- aplicar optimizaciones;
- resolver deuda técnica no bloqueante;
- actualizar dependencias no planificadas;
- modificar pipelines;
- desplegar;
- certificar la Function App completa.

El siguiente skill sugerido depende del caso:

- `migrate-durable-functions-v4`
- `verify-function-app`
