---
name: discover-function-app
description: Descubre de forma segura Azure Function Apps Node.js dentro de un repositorio. Úsalo antes de cualquier cambio para inventariar Functions, triggers, bindings, configuración por nombre de clave, dependencias, Programming Model, Durable, arquitectura observable y candidatos a recursos compartidos sin leer contenido protegido.
---

# Discover Function App

## Objetivo

Crear la fotografía BEFORE del repositorio sin modificar código ni decidir todavía qué debe migrarse.

## Políticas obligatorias

Cargar y aplicar antes de cualquier lectura, búsqueda, listado recursivo o inspección del repositorio objetivo:

- `../_shared/security-policy.md`
- `../_shared/evidence-policy.md`
- `../_shared/status-policy.md`

No ejecutar `rg`, `find`, `ls` recursivo, scripts de inventario ni abrir archivos del repositorio objetivo antes de haber cargado estas políticas y aplicado sus exclusiones.

Consultar `../_shared/architecture-policy.md` solo como vocabulario para describir estructura observable.

## Entrada

- raíz del repositorio objetivo.

Artifacts previos en `.migration/` pueden usarse únicamente para detectar una ejecución anterior o decidir si corresponde rediscovery.

## Workflow

1. Cargar políticas obligatorias sin inspeccionar todavía el repositorio objetivo.
2. Aplicar exclusiones de seguridad.
3. Ejecutar `scripts/inventory.js <repository-root>`.
4. Usar su salida como fuente primaria de hechos deterministas.
5. Inspeccionar source adicional solo para resolver gaps concretos.
6. Documentar estado actual y candidatos a shared resources.
7. Crear los artifacts BEFORE.

Para criterios de detección cargar solo cuando haga falta:

- `references/discovery-rules.md`

Para el contrato de salida:

- `references/artifacts.md`

## Script

Ejecutar desde la raíz del skill:

```text
node scripts/inventory.js <repository-root>
```

No duplicar con razonamiento hechos que el script ya produce.

## Salidas

Obligatorias:

- `.migration/repository/inventory.json`
- `.migration/catalog/current-state.md`

Por Function, crear `.migration/catalog/functions/<FunctionName>.md` solo cuando la inspección necesaria para BEFORE ya sea suficiente; de lo contrario `analyze-function` lo completa antes de cualquier modificación.

Lessons son opcionales y siguen `../_shared/lessons-policy.md`.

## Cierre

Terminar cuando:

- la seguridad se aplicó antes de leer;
- las Function Apps y Functions observables fueron inventariadas;
- Programming Model, Runtime, Durable y dependencias quedaron documentados con evidence status;
- configuration keys se registraron sin valores;
- shared resource candidates y unknowns quedaron explícitos;
- los artifacts BEFORE fueron creados.

## No hacer

- leer archivos protegidos;
- evaluar compatibilidad target;
- seleccionar versiones;
- planificar o migrar;
- refactorizar;
- desplegar.
