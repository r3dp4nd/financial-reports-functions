---
name: verify-function-app
description: Verifica de forma determinista una Azure Function App después de su migración, consolidando plataforma, build, tests, Functions, Durable, arquitectura, recursos compartidos, legacy residual y packaging sin modificar código.
---

# Verify Function App

## Objetivo

Determinar mediante evidencia reproducible si la Function App alcanzó el target técnico y arquitectónico.

Este skill verifica.

No corrige.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Consumir los artefactos aplicables de:

- discovery;
- assessment;
- catálogo BEFORE;
- plan global;
- Function plans;
- global preparation;
- Function preparations;
- migrations;
- Durable migrations;
- shared resources.

No exigir artefactos correctamente `NOT_APPLICABLE`.

## Principio

Comparar:

`BEFORE → PLAN → AFTER`

Preferir evidencia determinista.

## Secuencia

Cuando corresponda:

1. instalación;
2. runtime;
3. typecheck;
4. build global;
5. tests;
6. coverage;
7. Function registration;
8. Durable;
9. architecture;
10. shared resources;
11. legacy scan;
12. packaging;
13. debt/unknowns.

## Target

Usar assessment y plan global.

No redefinir target durante verification.

## Node.js

Registrar versión declarada y realmente utilizada para:

- install;
- typecheck;
- build;
- tests.

No afirmar validación completa bajo Node.js 24 si no se utilizó donde correspondía.

## Instalación

Usar el mecanismo reproducible del proyecto.

No actualizar dependencias.

## Typecheck

Ejecutar el comando real del proyecto.

Registrar resultado.

## Build

Ejecutar build global final.

Aquí sí es gate obligatorio cuando el proyecto requiere compilación.

## Tests

Ejecutar suite requerida.

Los tests de baseline deben continuar verdes.

## Coverage

Verificar únicamente cuando forme parte del contrato existente.

No crear thresholds nuevos.

## Azure Functions Host

Ejecutar solo cuando exista configuración sanitizada/aprobada suficiente.

Validar:

- startup;
- module loading;
- registrations;
- errores relevantes.

Si no puede ejecutarse:

`NOT_EXECUTED`

con razón.

No leer settings sensibles automáticamente.

## Functions

Comparar:

- BEFORE;
- PLAN;
- AFTER.

Detectar:

- missing;
- unexpected;
- renamed;
- trigger changes;
- binding differences.

## Programming Model

Verificar:

- Functions que debían migrar;
- Functions ya v4;
- legacy residual.

## Durable

Verificar workflows como unidades.

No afirmar replay compatibility productiva únicamente por pruebas locales.

## Arquitectura

Verificar únicamente obligaciones del plan.

Comprobar cuando corresponda:

- adapters Azure;
- capability boundaries;
- infrastructure isolation;
- configuration isolation;
- dependency boundaries.

No verificar arquitectura por cantidad de carpetas.

La ausencia de `domain/` o `infrastructure/` no es fallo si no eran necesarias.

## Shared resources

Verificar por resource:

- ownership;
- consumers;
- implementation;
- shared action;
- duplications;
- deviations.

No bloquear por preferencia de ubicación.

Bloquear únicamente cuando contradiga una obligación real o produzca riesgo funcional.

## Legacy scan

Clasificar:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

No eliminar nada.

## Packaging

Verificar cuando corresponda:

- dist;
- package.json;
- lockfile;
- runtime dependencies;
- host.json;
- `.funcignore`.

Detectar artefactos no runtime que no deberían desplegarse.

## Catálogo

No modificar:

`.migration/catalog/**`

El catálogo conserva BEFORE.

## Deuda y optimización

Separar:

- blockers;
- technical debt;
- optimization opportunities.

No resolverlas.

## Checks

Usar:

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

Requiere:

- target obligatorio alcanzado;
- build requerido exitoso;
- tests obligatorios verdes;
- Functions completas;
- architecture obligations satisfechas;
- shared resources consistentes;
- ausencia de blockers.

## VERIFIED_WITH_DEBT

Los gates obligatorios pasan y solo queda deuda no bloqueante.

## Salidas estructuradas

Crear:

`.migration/verification/verification.json`

Debe contener:

- final status;
- target;
- BEFORE/PLAN references;
- runtime;
- installation;
- typecheck;
- build;
- tests;
- coverage;
- host;
- functions;
- programming model;
- Durable;
- architecture;
- shared resources;
- legacy scan;
- packaging;
- blockers;
- debt;
- optimizations;
- risks;
- unknowns.

## Salida humana

Crear:

`.migration/verification/verification.md`

Usar:

`../_shared/templates/verification.template.md`

## Lecciones

Crear:

`.migration/lessons/verify-function-app/lessons.json`

`.migration/lessons/verify-function-app/lessons.md`

## Criterio de cierre

El skill termina cuando:

- BEFORE, PLAN y AFTER fueron comparados;
- installation fue evaluada;
- typecheck fue ejecutado cuando aplica;
- build global fue ejecutado cuando aplica;
- tests fueron ejecutados;
- Functions fueron comparadas;
- Durable fue verificado cuando aplica;
- arquitectura fue verificada contra obligaciones reales;
- shared resources fueron comprobados;
- legacy scan fue ejecutado;
- packaging fue revisado;
- blockers/debt/optimizations/unknowns fueron separados;
- se emitió estado final;
- se generaron verification y lessons.

## Fuera de alcance

No debe:

- corregir código;
- modificar tests;
- refactorizar;
- actualizar dependencias;
- migrar;
- mover shared resources;
- eliminar legacy;
- modificar pipelines;
- desplegar;
- optimizar.

Si el resultado es `BLOCKED`, identificar el capability responsable de cada bloqueo.

Si es `VERIFIED` o `VERIFIED_WITH_DEBT`, la migración técnica puede considerarse cerrada.
