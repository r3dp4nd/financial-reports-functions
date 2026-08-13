---
name: verify-function-app
description: Verifica de forma determinista una Azure Function App después de su migración comparando BEFORE, PLAN y AFTER sin modificar código.
---

# Verify Function App

## Objetivo

Determinar mediante evidencia reproducible si la Function App alcanzó el target técnico, funcional y arquitectónico
requerido.

Este skill verifica.

No corrige.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Entradas

Consumir artefactos aplicables de:

- inventory;
- assessment;
- catálogo BEFORE;
- shared resources;
- global plan;
- dependency baseline referenciada;
- Function plans;
- global preparation;
- Function preparations;
- migrations;
- Durable migrations.

No exigir artefactos correctamente `NOT_APPLICABLE`.

## Principio

Comparar:

`BEFORE → PLAN → AFTER`

No reconstruir el target.

No corregir fallos encontrados.

## Secuencia

Cuando corresponda:

1. instalación;
2. runtime;
3. dependency baseline;
4. typecheck;
5. build global;
6. tests;
7. coverage;
8. Function registration;
9. Programming Model;
10. Durable;
11. architecture;
12. shared resources;
13. legacy scan;
14. packaging;
15. blockers/debt/unknowns.

## Checks

Todo check individual usa:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Ejemplo:

    {
      "build": {
        "status": "PASS"
      }
    }

## Evidence status

Si un hallazgo describe certeza y no resultado de ejecución:

usar:

`evidenceStatus`

Ejemplo:

    {
      "function": "RequestReport",
      "evidenceStatus": "CONFIRMED"
    }

No usar `PASS` para representar simplemente que algo fue observado.

## Target

Usar:

- assessment;
- plan global.

No cambiar el target durante verification.

## Dependency baseline

Consumir la baseline referenciada por el plan.

No consultar `latest` para determinar el resultado esperado.

Verificar únicamente packages relevantes para la migración.

Para cada dependencia target registrar cuando corresponda:

- package;
- expectedVersion;
- installedVersion;
- baselineId;
- status.

Ejemplo:

    {
      "package": "@azure/functions",
      "expectedVersion": "4.16.2",
      "installedVersion": "4.16.2",
      "baselineId": "node24-azure-functions-v4",
      "status": "PASS"
    }

Una versión diferente no debe evaluarse automáticamente contra npm latest.

Clasificar según el contrato aprobado:

- `FAIL` si contradice un target obligatorio;
- `REQUIRES_REVIEW` si existe una desviación no aprobada cuya equivalencia debe decidirse;
- `NOT_APPLICABLE` cuando el package no aplica.

## Node.js

Registrar:

- versión declarada;
- runtime utilizado para install;
- runtime utilizado para typecheck;
- runtime utilizado para build;
- runtime utilizado para tests.

Si el target exige Node.js 24 y no fue utilizado en gates relevantes:

no declarar `VERIFIED`.

## Instalación

Usar el mecanismo reproducible del proyecto.

Ejemplo cuando corresponda:

`npm ci`

No actualizar dependencias.

## Typecheck

Ejecutar comando real del proyecto cuando exista o sea parte del plan.

Registrar:

`status`

y evidencia.

## Build global

Ejecutar después de completar todas las adaptaciones requeridas.

Es gate final cuando el proyecto necesita build.

Un fallo implica:

`status final = BLOCKED`

salvo que el build sea explícitamente `NOT_APPLICABLE`.

## Tests

Ejecutar la baseline requerida.

Los mismos comportamientos protegidos antes de migración deben continuar verdes.

Un test obligatorio en `FAIL`:

bloquea cierre.

## Coverage

Verificar únicamente si forma parte del contrato acordado.

No crear thresholds nuevos.

## Azure Functions Host

Ejecutar únicamente cuando exista configuración sanitizada y aprobada.

Si aplicaba pero no puede ejecutarse:

    {
      "status": "NOT_EXECUTED",
      "reason": "No approved sanitized configuration available."
    }

No leer `local.settings.json`.

## Functions

Comparar:

- Functions BEFORE;
- Functions esperadas por el plan;
- Functions detectadas AFTER.

Registrar:

- missing;
- unexpected;
- renamed;
- trigger changes;
- binding changes.

## Programming Model

Verificar por Function cuando corresponda.

Una Function que debía migrar y sigue legacy:

blocker.

Una Function que ya era v4 y continúa v4:

correcta sin remigración.

## Durable

Verificar workflows como unidades.

Comprobar cuando aplique:

- dependency target;
- participantes;
- registrations;
- graph;
- determinism;
- tests;
- shared dependencies.

No afirmar compatibilidad productiva de instancias activas sin evidencia.

## Arquitectura

Verificar obligaciones reales del plan.

Puede comprobar:

- Azure adapters;
- capability boundaries;
- infrastructure isolation;
- configuration isolation;
- contracts necesarios;
- absence of planned coupling.

No verificar arquitectura por cantidad de carpetas.

La ausencia de una capa opcional no es fallo.

## Shared resources

Verificar:

- resource ID;
- ownership;
- implementation;
- consumers;
- shared action completion;
- duplications.

Una duplicación puede clasificarse como:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `UNKNOWN`

según impacto.

No bloquear por preferencias estéticas de ubicación.

## Legacy scan

Clasificar hallazgos como:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

Esta clasificación no debe reutilizar el campo principal `status` si representa tipo de hallazgo.

Preferir:

`classification`

Ejemplo:

    {
      "path": "...",
      "classification": "TECHNICAL_DEBT"
    }

## Packaging

Verificar cuando corresponda:

- `dist`;
- package metadata;
- lockfile;
- runtime dependencies;
- `host.json`;
- `.funcignore`.

Comprobar exclusión de artefactos no runtime cuando corresponda.

## Deuda

Separar claramente:

- blockers;
- technical debt;
- optimizations;
- unknowns.

No convertir deuda no bloqueante en blocker.

## Salida estructurada

Crear:

`.migration/verification/verification.json`

Debe contener:

- `schemaVersion`;
- `status`;
- `target`;
- `references`;
- `runtime`;
- `dependencyBaseline`;
- `dependencies`;
- `installation`;
- `typecheck`;
- `build`;
- `tests`;
- `coverage`;
- `host`;
- `functions`;
- `programmingModel`;
- `durable`;
- `architecture`;
- `sharedResources`;
- `legacyScan`;
- `packaging`;
- `blockers`;
- `technicalDebt`;
- `optimizationOpportunities`;
- `risks`;
- `unknowns`.

## Estado final

El campo principal:

`status`

usa exclusivamente:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

No usar otro vocabulario.

## VERIFIED

Requiere:

- target obligatorio alcanzado;
- dependency baseline obligatoria satisfecha;
- gates aplicables en `PASS`;
- build global exitoso cuando aplica;
- tests requeridos verdes;
- Functions esperadas presentes;
- Programming Model correcto;
- Durable correcto cuando aplica;
- arquitectura planificada satisfecha;
- shared resources consistentes;
- ausencia de blockers.

## VERIFIED_WITH_DEBT

Igual que `VERIFIED`, pero quedan hallazgos clasificados exclusivamente como deuda no bloqueante.

## BLOCKED

Existe un impedimento técnico conocido.

Ejemplos:

- dependency target obligatorio incorrecto;
- build fail;
- tests obligatorios fail;
- Function faltante;
- Programming Model incorrecto;
- workflow Durable incompleto.

## REQUIRES_REVIEW

La evidencia obtenida no permite cerrar sin decisión humana.

## Salida humana

Crear:

`.migration/verification/verification.md`

Usar:

`../_shared/templates/verification.template.md`

## Catálogo

No modificar:

`.migration/catalog/**`

AFTER vive en verification.

## Lecciones

Crear:

`.migration/lessons/verify-function-app/lessons.json`

`.migration/lessons/verify-function-app/lessons.md`

## Criterio de cierre

El skill termina cuando:

- BEFORE, PLAN y AFTER fueron comparados;
- dependency baseline aprobada fue verificada;
- no se comparó contra `latest`;
- gates aplicables fueron ejecutados;
- estados de checks usan vocabulario común;
- evidencia usa `evidenceStatus`;
- classifications no abusan de `status`;
- blockers/debt/unknowns están separados;
- se emitió estado final;
- no se realizaron correcciones.

## Fuera de alcance

No debe:

- corregir código;
- modificar tests;
- seleccionar nuevas dependency versions;
- refactorizar;
- actualizar dependencias;
- migrar;
- eliminar legacy;
- modificar pipelines;
- desplegar;
- optimizar.
