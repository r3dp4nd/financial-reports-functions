---
name: migrate-durable-functions-v4
description: Migra un workflow Durable Functions de Node.js al Programming Model v4 preservando su comportamiento, relaciones entre starter, orchestrator y activities, restricciones de determinismo y baseline de tests.
---

# Migrate Durable Functions v4

## Objetivo

Migrar un workflow Durable Functions al Programming Model v4 de Node.js.

Este skill trata el workflow como una unidad coherente.

Puede modificar:

- Durable starter o client;
- orchestrator;
- activities;
- registros Durable;
- bindings Durable legacy;
- tipos y APIs Durable;
- integración necesaria con Programming Model v4.

No debe modificar intencionalmente el comportamiento funcional del workflow.

## Precondiciones

Deben existir:

`.migration/repository/assessment.json`

`.migration/plans/migration-plan.json`

y los artefactos de análisis, preparación y migración correspondientes a las Functions que forman el workflow.

Las Functions involucradas deben haber sido preparadas cuando su testabilidad lo requiera.

La baseline de tests aplicable debe estar verde.

La migración general requerida hacia Programming Model v4 debe estar preparada según el plan.

## Aplicabilidad

Ejecutar este skill únicamente cuando exista evidencia de Durable Functions.

Si Durable Functions no está presente:

`NOT_APPLICABLE`

Si el workflow ya utiliza Durable Functions compatible con Programming Model v4 y no requiere cambios:

`NOT_APPLICABLE`

Si el workflow no puede reconstruirse con suficiente evidencia:

`REQUIRES_REVIEW`

No migrar Activities aisladamente cuando pertenezcan a un workflow coordinado.

## Unidad de migración

La unidad de trabajo es el workflow Durable.

Puede incluir:

- starter;
- Durable client;
- orchestrator;
- activities;
- sub-orchestrators;
- entities cuando existan;
- componentes directamente necesarios para comprender el flujo.

No cargar toda la Function App si no es necesario.

## Evidencia previa

Consumir primero:

- inventory;
- assessment;
- análisis de las Functions relacionadas;
- migration plan;
- preparation;
- migraciones generales ya realizadas.

No volver a descubrir todo el repositorio.

Si existe contradicción entre artefactos y código:

- registrar la inconsistencia;
- detener la transformación afectada;
- marcar `REQUIRES_REVIEW`.

## Grafo Durable

Antes de modificar código, reconstruir el grafo mínimo del workflow usando evidencia existente.

Ejemplo conceptual:

`StartGenerateReport`

→ `ReportOrchestrator`

→ `GetOrders`

→ `GetPayments`

→ `GenerateExcel`

→ `CompleteGeneration`

Registrar únicamente relaciones confirmadas.

No inferir Activities por similitud de nombres.

## Roles

Identificar el rol de cada Function:

- `CLIENT`
- `STARTER`
- `ORCHESTRATOR`
- `ACTIVITY`
- `SUB_ORCHESTRATOR`
- `ENTITY`
- `UNKNOWN`

Una Function puede cumplir más de una responsabilidad observable únicamente cuando exista evidencia directa.

## Migración Durable v4

Transformar las APIs y registros Durable legacy según la documentación oficial vigente.

En Programming Model v4, Durable Functions utiliza registros en código para elementos como:

- orchestration;
- activity;
- client-related triggers.

Usar únicamente APIs confirmadas por documentación oficial.

No inventar equivalencias de bindings.

## Starter y Durable Client

Preservar cuando corresponda:

- nombre del orchestrator iniciado;
- instance id cuando aplique;
- input;
- respuesta HTTP;
- status endpoints;
- metadata relevante;
- manejo de errores.

No cambiar la semántica de inicio del workflow.

## Orchestrator

Preservar:

- orden de Activities;
- decisiones;
- fan-out/fan-in;
- retries;
- sub-orchestrations;
- timers;
- eventos externos;
- manejo de errores;
- compensaciones;
- resultados.

No convertir la migración en un rediseño del workflow.

## Determinismo

El orchestrator debe conservar las restricciones de determinismo requeridas por Durable Functions.

Revisar especialmente:

- tiempo actual;
- generación de identificadores aleatorios;
- I/O directo;
- llamadas HTTP directas;
- acceso directo a bases de datos;
- APIs Node.js no deterministas;
- side effects ejecutados dentro del orchestrator.

Cuando exista código potencialmente no determinista:

- registrar el hallazgo;
- no introducir una nueva implementación sin evidencia;
- clasificar el cambio requerido según el plan.

No mover lógica hacia el orchestrator si actualmente pertenece a una Activity.

## Activities

Preservar para cada Activity:

- nombre lógico;
- input;
- output;
- errores relevantes;
- interacción externa;
- comportamiento protegido por tests.

Migrar únicamente su integración Durable cuando corresponda.

No rediseñar Activities que ya estén correctamente aisladas.

## Sub-orchestrators

Cuando existan sub-orchestrators:

- preservar el nombre;
- preservar el input;
- preservar el orden y dependencias;
- mantener la relación padre-hijo observable.

No tratarlos como workflows completamente independientes si forman parte del flujo analizado.

## Retries

Preservar políticas de retry existentes cuando exista evidencia.

Registrar:

- número de intentos;
- intervalos;
- backoff;
- errores relevantes.

No cambiar retries con fines de optimización durante la migración.

## Timers

Preservar timers Durable y su semántica.

No sustituirlos por timers normales de Node.js.

No introducir APIs de tiempo no deterministas dentro del orchestrator.

## External Events

Cuando el workflow utilice eventos externos:

preservar:

- nombre del evento;
- espera;
- orden;
- timeout;
- comportamiento posterior.

No renombrar eventos sin necesidad contractual explícita.

## Error handling

Preservar:

- errores propagados;
- retries;
- compensaciones;
- estados finales;
- manejo explícito de fallos.

No convertir errores existentes en nuevos comportamientos silenciosos.

## Nombres

Preservar nombres lógicos de:

- orchestrators;
- activities;
- sub-orchestrators;
- eventos;

cuando sea posible.

Cambiar nombres puede afectar instancias existentes, callers o contratos del workflow.

No renombrar solo por convención.

## Instancias existentes

No asumir que cambiar código Durable es inocuo para instancias en ejecución.

Si existe posibilidad de workflows activos en producción y la compatibilidad de replay o versionado no puede
confirmarse:

`REQUIRES_REVIEW`

Registrar esta consideración como riesgo operativo.

No deducir estado de producción leyendo pipelines o secretos.

## Programming Model v4

Este skill complementa la migración general a Programming Model v4.

No debe reimplementar trabajo ya realizado por:

`migrate-programming-model-v4`

Cuando el registro general ya esté correcto, modificar únicamente las partes específicas de Durable.

Microsoft mantiene separadas la migración general del modelo v4 y la migración específica de Durable Functions.

## Dependencias

Usar versiones y decisiones previamente confirmadas por `assessment.json`.

No actualizar paquetes arbitrariamente.

Cuando Durable Functions requiera una versión compatible con Programming Model v4, usar únicamente la versión definida
por evidencia oficial y el plan.

Si la compatibilidad sigue siendo desconocida:

`REQUIRES_REVIEW`

## Tests

Ejecutar los tests definidos durante preparación.

Priorizar cuando correspondan:

- orchestrator decisions;
- secuencia de Activities;
- Activities individuales;
- errores;
- retry behavior;
- inputs y outputs.

No cambiar tests para aceptar comportamiento accidentalmente modificado.

Microsoft dispone de guía específica para unit testing de orchestrators, activities y client functions; seguir las
prácticas vigentes cuando sean necesarias.

## Verificación del workflow

Después de migrar el workflow verificar cuando sea posible:

1. starter o client registrado;
2. orchestrator registrado;
3. Activities registradas;
4. nombres preservados;
5. relaciones preservadas;
6. tests verdes;
7. typecheck válido;
8. ausencia de bindings Durable legacy para las Functions migradas.

La validación local del Azure Functions Host se realizará como parte de la verificación global cuando el estado de la
Function App lo permita.

## Cambios permitidos

Principalmente:

- `REQUIRED_PLATFORM`

Y ajustes mínimos:

- `STRUCTURAL`

No ejecutar:

- `OPTIMIZATION`;
- rediseños del workflow;
- deuda técnica no bloqueante;
- mejoras de performance;
- cambios de negocio.

## Salidas

Crear un artefacto por workflow.

Ejemplo:

`.migration/functions/GenerateReport/durable-migration.json`

`.migration/functions/GenerateReport/durable-migration.md`

Y:

`.migration/lessons/migrate-durable-functions-v4/GenerateReport.json`

`.migration/lessons/migrate-durable-functions-v4/GenerateReport.md`

El nombre de la carpeta debe representar la capacidad o workflow identificado, no necesariamente una Activity
individual.

## durable-migration.json

Debe contener como mínimo:

- metadata;
- workflow;
- Functions participantes;
- grafo Durable;
- roles;
- Programming Model anterior;
- Programming Model resultante;
- cambios aplicados;
- nombres preservados;
- retries;
- timers;
- external events;
- tests ejecutados;
- validaciones;
- resultados;
- riesgos;
- unknowns;
- evidencia.

No incluir secretos.

## durable-migration.md

Debe explicar brevemente:

- qué workflow fue migrado;
- qué Functions participan;
- cómo se preservó el flujo;
- qué APIs Durable cambiaron;
- qué tests fueron ejecutados;
- qué riesgos permanecen;
- qué validaciones faltan;
- si el workflow está listo para verificación global.

No debe ser un diff completo.

## Lecciones aprendidas

Registrar únicamente observaciones útiles para futuras migraciones:

- patrón Durable no contemplado;
- Activity omitida inicialmente;
- relación difícil de detectar;
- replay risk;
- retry no contemplado;
- sub-orchestrator inesperado;
- external event;
- API Durable distinta a la esperada;
- análisis demasiado amplio;
- patrón potencialmente automatizable;
- oportunidad de simplificación.

No modificar automáticamente el skill.

Toda mejora requiere revisión humana.

## Estados de salida

El workflow debe quedar en:

- `MIGRATED`
- `NOT_APPLICABLE`
- `BLOCKED`
- `REQUIRES_REVIEW`

`MIGRATED` significa que la transformación Durable correspondiente fue realizada y las validaciones disponibles pasaron.

No significa todavía que la Function App esté lista para deployment.

## Criterio de cierre

El skill termina cuando:

- el workflow fue identificado;
- su grafo mínimo fue confirmado;
- sus Functions y roles fueron identificados;
- las APIs Durable necesarias fueron migradas;
- el orchestrator preserva su semántica;
- las Activities preservan sus contratos;
- retries, timers y eventos fueron preservados cuando aplican;
- no se introdujeron operaciones no deterministas;
- los tests correspondientes siguen verdes;
- los artefactos legacy tratados por este workflow fueron gestionados;
- riesgos de replay o instancias existentes están explícitos cuando correspondan;
- no se aplicaron optimizaciones;
- no se leyeron secretos;
- se generaron durable-migration y lessons.

## Fuera de alcance

Este skill no debe:

- rediseñar el workflow;
- cambiar comportamiento de negocio;
- optimizar paralelismo;
- cambiar políticas de retry por conveniencia;
- renombrar orchestrators o Activities sin necesidad;
- resolver deuda técnica no bloqueante;
- modificar pipelines;
- desplegar;
- declarar segura una migración para instancias activas sin evidencia.

El siguiente skill sugerido es:

`verify-function-app`
