---
name: prepare-function-app
description: Ejecuta únicamente las acciones globales y de shared resources asignadas a la preparación de una Function App. Úsalo después de planning para actualizar configuración, tooling, dependencias o estructura global requerida sin migrar todavía Functions individuales.
---

# Prepare Function App

## Objetivo

Aplicar la preparación global aprobada con el menor cambio necesario y dejar evidencia de ejecución por Action ID.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir:

- inventory;
- assessment;
- global migration plan;
- shared-resources artifact cuando aplique.

## Workflow

Para cada acción asignada a esta etapa:

1. confirmar Action ID y dependencies;
2. comprobar estado actual;
3. preservar lo ya válido;
4. aplicar solo el cambio planificado;
5. validar el resultado local seguro;
6. registrar `executionStatus` y evidencia;
7. registrar cualquier desviación sin inventar una nueva acción.

Cargar:

- `references/preparation-rules.md` para reglas por dimensión;
- `references/artifacts.md` para salida.

## Salidas

- `.migration/repository/preparation.json`
- `.migration/repository/preparation.md`

## Cierre

Terminar cuando todas las acciones globales/shared de esta etapa estén completadas, explícitamente no aplicables o bloqueadas/reviewed con evidencia.

## No hacer

- reinterpretar planning;
- crear nuevos Action IDs;
- migrar una Function individual;
- generar tests;
- ejecutar build global como gate final antes de completar todas las Functions;
- usar `latest` fuera del target aprobado.
