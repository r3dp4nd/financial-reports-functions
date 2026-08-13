---
name: verify-function-app
description: Verifica de forma determinista una Azure Function App después de su migración, consolidando dependencias, typecheck, build, tests, registro de Functions, artefactos legacy, packaging, target alcanzado y deuda técnica restante.
---

# Verify Function App

## Objetivo

Determinar mediante evidencia reproducible si la Function App alcanzó correctamente el target de migración.

Este skill verifica.

No corrige.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Precondiciones

Consumir los artefactos existentes de:

- discovery;
- assessment;
- preparation;
- plan;
- análisis;
- preparación de Functions;
- migraciones;
- Durable cuando aplique.

No exigir artefactos de skills marcados previamente como `NOT_APPLICABLE`.

## Principio

Preferir evidencia determinista:

1. instalación;
2. typecheck;
3. build;
4. tests;
5. coverage;
6. Azure Functions Host;
7. inventario final;
8. legacy scan;
9. packaging.

No declarar éxito porque el código "parece correcto".

## Target

Usar el target de `assessment.json`.

No redefinirlo durante verificación.

## Node.js

Registrar:

- versión declarada;
- versión usada durante validaciones.

Cuando sea posible, ejecutar las verificaciones finales bajo Node.js 24.

## Dependencias

Usar instalación reproducible compatible con el package manager existente.

Con npm y lockfile:

`npm ci`

No actualizar dependencias.

## Typecheck

Ejecutar el comando definido por el proyecto.

Registrar:

- comando;
- resultado;
- errores relevantes.

## Build

Ejecutar el build global final.

A diferencia de etapas intermedias, aquí sí funciona como gate de toda la Function App.

Registrar:

- comando;
- resultado;
- artefactos relevantes.

## Tests

Ejecutar la suite requerida.

Registrar:

- suites;
- tests;
- pass;
- fail;
- skipped.

Los tests que protegieron comportamiento deben seguir verdes.

## Coverage

Ejecutar cuando forme parte del contrato preparado.

Registrar:

- statements;
- branches;
- functions;
- lines;
- thresholds;
- resultado.

No convertir coverage arbitrario en criterio nuevo.

## Azure Functions Host

Cuando exista configuración sanitizada y aprobada suficiente, iniciar el Host para verificar:

- startup;
- carga de módulos;
- registro de Functions;
- errores relevantes.

Esto no constituye integration testing.

Si no puede ejecutarse:

`NOT_EXECUTED`

con razón explícita.

## Functions esperadas

Comparar:

`inventory inicial`

contra:

`Functions finales`

considerando cambios planificados.

Detectar:

- Function faltante;
- Function no planificada;
- cambio inesperado de nombre;
- cambio de trigger;
- Activity faltante;
- orchestrator faltante.

## Programming Model

Verificar que las Functions que debían migrar realmente estén en v4.

Las Functions ya v4 deben simplemente seguir registradas correctamente.

## Durable

Verificar workflows como unidades:

- starter/client;
- orchestrator;
- activities;
- sub-orchestrators cuando existan;
- nombres;
- relaciones.

No afirmar compatibilidad de replay de instancias productivas solo con validación local.

## Legacy scan

Buscar artefactos que el plan esperaba retirar.

Ejemplos:

- `function.json`;
- adapters legacy;
- imports obsoletos;
- configuraciones antiguas;
- dependencias que debían eliminarse.

Clasificar:

- `BLOCKING`
- `TECHNICAL_DEBT`
- `EXPECTED`
- `UNKNOWN`

No eliminar nada.

## Packaging

Verificar el contenido esperado para deployment.

Comprobar cuando corresponda:

- `dist`;
- `package.json`;
- lockfile;
- runtime dependencies;
- `host.json`;
- exclusiones `.funcignore`.

Detectar artefactos innecesarios como:

- `.migration`;
- tests;
- coverage;
- test-results;
- documentación de desarrollo.

## Compatibilidad Node.js 24

Consolidar:

- assessment;
- análisis por Function;
- dependencias;
- ejecución real bajo Node.js 24 cuando esté disponible.

Mantener visibles los unknowns no resueltos.

## Deuda técnica

Consolidar deuda no bloqueante identificada durante la migración.

Separar:

- blockers;
- technical debt;
- optimization opportunities.

No resolver ninguna en este skill.

## Estado de verificaciones

Usar:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

Cada fallo debe indicar si bloquea cierre.

## Estado final

Usar:

- `VERIFIED`
- `VERIFIED_WITH_DEBT`
- `BLOCKED`
- `REQUIRES_REVIEW`

### VERIFIED

Todas las verificaciones obligatorias pasaron.

### VERIFIED_WITH_DEBT

El target fue alcanzado y las verificaciones obligatorias pasaron, pero queda deuda técnica no bloqueante.

### BLOCKED

Existe al menos un fallo que bloquea cierre.

### REQUIRES_REVIEW

La evidencia disponible no permite una conclusión definitiva.

## Salidas

Crear:

`.migration/verification/verification.json`

`.migration/verification/verification.md`

Y:

`.migration/lessons/verify-function-app/lessons.json`

`.migration/lessons/verify-function-app/lessons.md`

## verification.json

Registrar como mínimo:

- target;
- runtime de validación;
- instalación;
- typecheck;
- build;
- tests;
- coverage;
- Host;
- Functions esperadas;
- Functions detectadas;
- Durable;
- legacy scan;
- packaging;
- blockers;
- risks;
- unknowns;
- technical debt;
- optimization opportunities;
- final status.

## verification.md

Debe responder brevemente:

- ¿la migración terminó?;
- ¿qué pasó?;
- ¿qué no pudo ejecutarse?;
- ¿las Functions siguen presentes?;
- ¿quedó legacy activo?;
- ¿qué bloquea?;
- ¿qué deuda queda?;
- ¿qué requiere revisión manual?

## Lecciones aprendidas

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- se consumieron artefactos previos;
- se ejecutaron las verificaciones obligatorias posibles;
- se ejecutó build global;
- se ejecutaron tests;
- se revisó registro de Functions;
- se revisó Durable cuando aplica;
- se ejecutó legacy scan;
- se verificó packaging;
- blockers, risks y unknowns quedaron visibles;
- deuda y optimizaciones quedaron separadas;
- se emitió un estado final;
- se generaron verification y lessons.

## Fuera de alcance

Este skill no debe:

- corregir código;
- modificar tests;
- actualizar dependencias;
- refactorizar;
- migrar;
- eliminar legacy;
- modificar pipelines;
- desplegar;
- optimizar.

Si el resultado es `BLOCKED`, debe volver a ejecutarse el skill responsable del problema.

Si el resultado es `VERIFIED` o `VERIFIED_WITH_DEBT`, la migración técnica puede considerarse cerrada.
