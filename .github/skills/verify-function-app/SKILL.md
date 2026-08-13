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
3. dependency targets;
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

## Evidence status

Si un hallazgo describe certeza y no resultado de ejecución:

usar:

`evidenceStatus`

No usar `PASS` como certeza.

## Target

Usar:

- assessment;
- plan global.

No cambiar el target durante verification.

## Dependency verification

Consumir los dependency targets aprobados por el plan.

No comparar contra `latest`.

Para cada package esperado registrar:

- package;
- expectedVersion;
- installedVersion;
- recommendationSource;
- recommendationStatus previo cuando exista;
- baselineId cuando corresponda;
- status.

Ejemplo:

    {
      "package": "uuid",
      "expectedVersion": "x.y.z",
      "installedVersion": "x.y.z",
      "recommendationSource": "LEARNED_BASELINE",
      "status": "PASS"
    }

Una versión diferente puede resultar en:

- `FAIL`;
- `REQUIRES_REVIEW`;
- `NOT_APPLICABLE`;

según el contrato del plan.

## Dependency learning evidence

Cuando una dependencia cuya recomendación era:

`PROPOSED`

fue realmente utilizada y todos los gates obligatorios relacionados terminaron satisfactoriamente:

registrar evidencia suficiente para que lessons y review puedan evaluar promoción.

Verification no cambia:

`recommendationStatus`

dentro de `dependency-baseline.json`.

Puede registrar por ejemplo:

    {
      "package": "uuid",
      "targetVersion": "x.y.z",
      "recommendationSource": "EXTERNAL_RESEARCH",
      "migrationOutcome": "PASS",
      "eligibleForLearningReview": true
    }

Esto significa:

`puede ser revisado`

no:

`queda automáticamente aprobado`.

## Node.js

Registrar:

- versión declarada;
- runtime utilizado para install;
- runtime utilizado para typecheck;
- runtime utilizado para build;
- runtime utilizado para tests.

Si target exige Node.js 24 y no fue utilizado en gates relevantes:

no declarar `VERIFIED`.

## Instalación

Usar el mecanismo reproducible del proyecto.

No actualizar dependencias durante verification.

## Typecheck

Ejecutar el comando real cuando corresponda.

## Build global

Ejecutar después de completar las adaptaciones requeridas.

Un fallo obligatorio implica:

`BLOCKED`

## Tests

Ejecutar los tests requeridos.

Los mismos comportamientos protegidos antes de migración deben continuar verdes.

## Coverage

Verificar únicamente si forma parte del contrato acordado.

## Azure Functions Host

Ejecutar únicamente con configuración sanitizada y aprobada.

No leer:

`local.settings.json`

## Functions

Comparar:

- Functions BEFORE;
- Functions esperadas;
- Functions AFTER.

Registrar cambios relevantes.

## Programming Model

Verificar por Function cuando corresponda.

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

## Arquitectura

Verificar obligaciones reales del plan.

No verificar arquitectura por cantidad de carpetas.

## Shared resources

Verificar:

- resource ID;
- ownership;
- implementation;
- consumers;
- shared action completion;
- duplications.

## Legacy scan

Clasificar hallazgos como:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

Preferir:

`classification`

y no reutilizar el status principal.

## Packaging

Verificar cuando corresponda:

- dist;
- package metadata;
- lockfile;
- runtime dependencies;
- host.json;
- `.funcignore`.

## Deuda

Separar:

- blockers;
- technical debt;
- optimizations;
- unknowns.

## Salida estructurada

Crear:

`.migration/verification/verification.json`

Debe contener:

- schemaVersion;
- status;
- target;
- references;
- runtime;
- dependencyBaseline;
- dependencies;
- dependencyLearningCandidates;
- installation;
- typecheck;
- build;
- tests;
- coverage;
- host;
- functions;
- programmingModel;
- durable;
- architecture;
- sharedResources;
- legacyScan;
- packaging;
- blockers;
- technicalDebt;
- optimizationOpportunities;
- risks;
- unknowns.

## Estado final

Usar:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

## VERIFIED

Requiere:

- target obligatorio alcanzado;
- dependency targets obligatorios satisfechos;
- gates aplicables en PASS;
- build global exitoso cuando aplica;
- tests verdes;
- Functions esperadas presentes;
- Programming Model correcto;
- Durable correcto cuando aplica;
- arquitectura satisfecha;
- shared resources consistentes;
- ausencia de blockers.

## VERIFIED_WITH_DEBT

Igual que VERIFIED, con deuda no bloqueante.

## BLOCKED

Existe impedimento técnico conocido.

## REQUIRES_REVIEW

La evidencia no permite cerrar sin decisión humana.

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

Las lessons pueden registrar dependency learning candidates.

No modifican baseline.

## Criterio de cierre

El skill termina cuando:

- BEFORE, PLAN y AFTER fueron comparados;
- dependency targets fueron verificados;
- provenance de recomendaciones fue preservada;
- candidatos de aprendizaje quedaron registrados cuando correspondía;
- gates aplicables fueron ejecutados;
- blockers/debt/unknowns están separados;
- se emitió estado final;
- no se realizaron correcciones;
- no se modificó dependency baseline.

## Fuera de alcance

No debe:

- corregir código;
- modificar tests;
- seleccionar nuevas versiones;
- promover recommendations;
- modificar baseline;
- refactorizar;
- actualizar dependencias;
- migrar;
- desplegar;
- optimizar.
