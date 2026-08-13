---
name: verify-function-app
description: Verifica de forma determinista una Azure Function App después de su migración, consolidando plataforma, build, tests, Functions, Durable, recursos compartidos, arquitectura objetivo, legacy residual, packaging y deuda restante sin modificar código.
---

# Verify Function App

## Objetivo

Determinar mediante evidencia reproducible si la Function App alcanzó correctamente el target técnico y arquitectónico.

Este skill verifica.

No corrige.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Consumir cuando existan:

- inventory;
- assessment;
- catálogo BEFORE;
- plan global;
- planes por Function;
- preparation global;
- preparations por Function;
- migrations;
- durable migrations;
- shared resource actions.

No exigir artefactos de skills que fueron correctamente `NOT_APPLICABLE`.

## Principio

Preferir evidencia determinista.

Secuencia sugerida:

1. instalación;
2. runtime;
3. typecheck;
4. build global;
5. tests;
6. coverage;
7. Function registrations;
8. Durable workflows;
9. arquitectura;
10. shared resources;
11. legacy scan;
12. packaging;
13. deuda y unknowns.

No declarar éxito porque compile.

## Target

Usar:

`.migration/repository/assessment.json`

y:

`.migration/plans/migration-plan.json`

como definición del target.

No redefinirlo durante verificación.

## Comparación BEFORE / PLAN / AFTER

Utilizar tres perspectivas:

### BEFORE

`.migration/catalog/current-state.md`

y fichas por Function.

### PLAN

plan global y planes específicos.

### AFTER

estado real del repositorio y resultados de validación.

La verificación debe identificar cambios esperados y desviaciones no planificadas.

## Node.js

Registrar:

- versión declarada;
- versión real utilizada para instalación;
- versión real utilizada para tests;
- versión real utilizada para build.

La verificación completa de target Node.js requiere ejecutar las validaciones relevantes con la versión objetivo cuando
sea técnicamente posible.

## Dependencias

Usar instalación reproducible.

Con npm y lockfile:

`npm ci`

cuando corresponda al proyecto.

No actualizar dependencias durante verificación.

Registrar fallos sin corregirlos.

## Typecheck

Ejecutar el comando definido por el proyecto.

Registrar:

- comando;
- runtime;
- resultado;
- errores relevantes.

## Build

Ejecutar el build global final.

Aquí sí es un gate.

Registrar:

- comando;
- resultado;
- outputs;
- errores;
- runtime utilizado.

## Tests

Ejecutar la suite requerida.

Registrar:

- suites;
- tests;
- pass;
- fail;
- skipped.

Los tests que protegían comportamiento antes de migración deben continuar verdes.

## Coverage

Ejecutar cuando forme parte del contrato.

Registrar:

- statements;
- branches;
- functions;
- lines;
- thresholds;
- resultado.

No introducir nuevos thresholds durante verificación.

## Azure Functions Host

Cuando exista configuración sanitizada y aprobada suficiente, validar:

- startup;
- module loading;
- Function registration;
- errors relevantes.

No realizar integration testing en el alcance actual.

Si no puede ejecutarse:

`NOT_EXECUTED`

con razón.

Nunca abrir automáticamente configuración sensible.

## Functions esperadas

Comparar:

- inventory inicial;
- planes;
- Functions finales.

Detectar:

- Function faltante;
- Function adicional no planificada;
- rename inesperado;
- cambio de trigger;
- binding inesperado;
- registration faltante.

## Programming Model

Verificar que:

- Functions que debían migrar estén realmente en v4;
- Functions ya v4 continúen registradas;
- legacy residual no permanezca activo cuando debía retirarse.

## Durable

Verificar cada workflow como unidad.

Comprobar cuando aplique:

- starter/client;
- orchestrator;
- activities;
- sub-orchestrators;
- entities;
- nombres;
- graph esperado;
- registrations.

No afirmar compatibilidad de replay productivo únicamente mediante validación local.

## Arquitectura objetivo

Verificar que el estado resultante respete:

`../_shared/architecture-policy.md`

La verificación debe comprobar únicamente reglas que puedan observarse con evidencia suficiente.

## Azure adapters

Verificar cuando corresponda que:

`src/functions/`

contenga principalmente responsabilidades de integración Azure.

Detectar como desviación cuando exista evidencia clara de:

- lógica de negocio significativa dentro del adapter;
- acceso directo innecesario a infraestructura desde el adapter;
- duplicación de comportamiento funcional.

No bloquear por estilo.

Bloquear únicamente cuando contradiga una acción arquitectónica obligatoria del plan.

## Capabilities

Verificar que el código refactorizado esté organizado por capability según el plan.

No exigir carpetas no planificadas.

No considerar ausencia de:

- `application`;
- `domain`;
- `infrastructure`;

como error si no eran necesarias.

## Capas vacías

Detectar carpetas o abstracciones creadas sin uso cuando sean claramente resultado de la migración.

Clasificar normalmente como:

`TECHNICAL_DEBT`

salvo que afecten comportamiento o build.

## Runtime coupling

Verificar que acciones planificadas para desacoplar:

- Azure runtime;
- process.env;
- SDK clients;
- infraestructura;

hayan sido realmente aplicadas.

No exigir aislamiento que no estuviera en el plan.

## Shared resources

Consolidar los shared resources definidos en el plan.

Para cada recurso verificar:

- ownership;
- implementación esperada;
- consumidores;
- acción propietaria;
- ausencia de migraciones duplicadas;
- configuración por nombre de clave;
- dependencias.

## Duplicación de shared resources

Detectar casos como:

- múltiples Cosmos repositories para la misma responsabilidad creados por la migración;
- múltiples client factories equivalentes;
- contracts duplicados;
- ownership contradictorio.

Clasificar según impacto:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `UNKNOWN`

## Ownership

Verificar que recursos `CAPABILITY` o `WORKFLOW` no hayan sido promovidos arbitrariamente a global/shared.

La ubicación concreta no debe juzgarse por convención, sino por el ownership definido en plan.

## Legacy scan

Buscar artefactos que el plan esperaba retirar.

Ejemplos:

- `function.json`;
- adapters legacy;
- imports antiguos;
- dependencies antiguas;
- configuration obsolete;
- code paths no utilizados.

Clasificar:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

No eliminar nada.

## Packaging

Verificar contenido requerido para deployment.

Comprobar cuando corresponda:

- `dist`;
- `package.json`;
- lockfile;
- runtime dependencies;
- `host.json`;
- `.funcignore`.

Detectar contenido que no debería desplegarse, por ejemplo:

- `.migration`;
- `.skill-improvement`;
- tests;
- coverage;
- test-results;
- documentación de desarrollo.

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

durante verificación.

El catálogo debe conservar la fotografía original.

## Documentación AFTER

El estado final se documenta en:

`.migration/verification/verification.md`

No sobrescribir la baseline histórica.

## Compatibilidad futura

Evaluar únicamente las acciones explícitas del plan destinadas a reducir impacto futuro.

Por ejemplo:

- adapters Azure aislados;
- infrastructure detrás de contratos;
- capabilities independientes del runtime.

No afirmar que futuras migraciones serán automáticamente compatibles.

El objetivo es verificar reducción de acoplamiento, no garantizar el futuro.

## Deuda técnica

Consolidar deuda no bloqueante.

Separar:

- blockers;
- technical debt;
- optimization opportunities.

No resolverlas.

## Verificaciones

Cada check debe usar:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

## Estado final

Usar:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## VERIFIED

Usar cuando:

- target obligatorio alcanzado;
- build pasa;
- tests obligatorios pasan;
- Functions esperadas están presentes;
- arquitectura obligatoria planificada fue aplicada;
- no existen blockers conocidos.

## VERIFIED_WITH_DEBT

Usar cuando:

- todos los gates obligatorios pasan;
- queda deuda técnica no bloqueante.

## BLOCKED

Usar cuando exista al menos un fallo obligatorio.

Ejemplos:

- build FAIL;
- tests FAIL;
- Function faltante;
- workflow Durable incompleto;
- arquitectura requerida por el plan no aplicada;
- shared resource incompatible o duplicado de forma bloqueante.

## REQUIRES_REVIEW

Usar cuando la evidencia disponible no permite decidir con suficiente confianza.

## Salidas

Crear:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

Y:

`.migration/lessons/verify-function-app/lessons.json`

`.migration/lessons/verify-function-app/lessons.md`

## verification.json

Debe contener como mínimo:

- metadata;
- target;
- before reference;
- plan reference;
- runtime validation;
- installation;
- typecheck;
- build;
- tests;
- coverage;
- host;
- expected functions;
- detected functions;
- programming model;
- durable;
- architecture;
- shared resources;
- legacy scan;
- packaging;
- blockers;
- technical debt;
- optimization opportunities;
- risks;
- unknowns;
- final status.

## Architecture verification

Debe incluir cuando corresponda:

- adapters;
- capabilities;
- dependency boundaries;
- infrastructure isolation;
- configuration isolation;
- shared resource ownership;
- structural deviations.

Cada hallazgo debe referenciar la acción del plan correspondiente cuando exista.

## Shared resource verification

Registrar por recurso:

- resourceId;
- ownership;
- consumers expected;
- consumers detected;
- expected action;
- resulting implementation;
- duplicate implementations;
- verification status.

## verification.md

Debe responder claramente:

- ¿la migración terminó?;
- ¿el target técnico fue alcanzado?;
- ¿la arquitectura objetivo fue aplicada?;
- ¿las Functions siguen registradas?;
- ¿los workflows Durable están completos?;
- ¿los recursos compartidos quedaron consistentes?;
- ¿qué verificaciones no pudieron ejecutarse?;
- ¿queda legacy activo?;
- ¿qué bloquea?;
- ¿qué deuda queda?;
- ¿qué requiere revisión manual?

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se consumieron artefactos relevantes;
- BEFORE, PLAN y AFTER fueron considerados;
- instalación fue validada;
- typecheck fue ejecutado;
- build global fue ejecutado;
- tests fueron ejecutados;
- Functions fueron comparadas;
- Durable fue verificado cuando aplica;
- arquitectura fue verificada contra el plan;
- shared resources fueron verificados;
- legacy scan fue ejecutado;
- packaging fue revisado;
- blockers, debt, optimizations y unknowns quedaron separados;
- se emitió estado final;
- se generaron verification y lessons.

## Fuera de alcance

Este skill no debe:

- corregir código;
- modificar tests;
- refactorizar;
- actualizar dependencias;
- migrar;
- mover recursos compartidos;
- eliminar legacy;
- modificar pipelines;
- desplegar;
- optimizar.

Si el resultado es `BLOCKED`, debe identificarse el capability responsable de resolver cada bloqueo.

Si el resultado es `VERIFIED` o `VERIFIED_WITH_DEBT`, la migración técnica puede considerarse cerrada.
