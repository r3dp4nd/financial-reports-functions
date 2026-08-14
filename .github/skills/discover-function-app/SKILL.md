---
name: discover-function-app
description: Descubre de forma segura Azure Function Apps Node.js dentro de un repositorio. Úsalo antes de cualquier cambio para inventariar Functions, triggers, bindings, configuración por nombre de clave, dependencias, Programming Model, Durable, arquitectura observable y candidatos a recursos compartidos sin leer contenido protegido.
---

# Discover Function App

## Objetivo

Crear la fotografía BEFORE más útil posible para iniciar migración, sin modificar código ni decidir todavía qué debe migrarse.

La profundidad esperada es: suficiente información segura para que `assess-function-app`, `analyze-function` y planning no tengan que redescubrir lo básico; no un análisis exhaustivo de comportamiento ni un call graph completo.

## Políticas obligatorias

Cargar y aplicar antes de cualquier lectura, búsqueda, listado recursivo o inspección del repositorio objetivo:

- `../_shared/security-policy.md`
- `../_shared/evidence-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`

No ejecutar `rg`, `find`, `ls` recursivo, scripts de inventario ni abrir archivos del repositorio objetivo antes de haber cargado estas políticas y aplicado sus exclusiones.

Consultar:

- `../_shared/architecture-policy.md` solo como vocabulario para describir estructura observable;
- `../_shared/references/validation-tooling.md` para identificar tooling de validación observable sin decidir cambios.

Consultar `../_shared/references/artifact-layout.md` para escribir artifacts en el layout semántico.

## Entrada

- raíz del repositorio objetivo.

Artifacts previos en `.migration/` pueden usarse únicamente para detectar una ejecución anterior o decidir si corresponde rediscovery.

Criterio explícito: si `.migration/00-before/inventory.json` no existe, ejecutar discovery completo directamente, sin evaluar rediscovery. Si existe, compararlo contra el estado actual del repositorio (por ejemplo cambios de commit) antes de decidir si basta con reutilizarlo o si se requiere una nueva ejecución completa.

## Workflow

1. Cargar políticas obligatorias sin inspeccionar todavía el repositorio objetivo.
2. Aplicar exclusiones de seguridad.
3. Si Graphify o un indexador de grafo aprobado está disponible, indexar el repositorio con las mismas exclusiones y guardar/consumir el grafo seguro como evidencia auxiliar.
4. Ejecutar `scripts/inventory.js <repository-root>`.
5. Usar su salida como fuente primaria de hechos deterministas.
6. Usar el grafo solo para acelerar relaciones, slices, fan-in/fan-out, criticidad inicial y señales de testabilidad que luego puedan rastrearse a source seguro.
7. Inspeccionar source adicional solo para enriquecer gaps concretos y relaciones directamente observables.
8. Documentar estado actual, arquitectura observable, relaciones útiles para migración y candidatos a shared resources.
9. Crear los artifacts BEFORE.

Para criterios de detección, cargar solo el archivo específico que resuelva la duda concreta (ver índice en `references/discovery-rules.md`):

- `../_shared/references/graphify-usage.md` — uso de Graphify y elección de modo de consulta;
- `references/architecture-diagrams.md` — cómo documentar arquitectura observable y generar diagramas, incluyendo repositorios legacy o sin separación clara;
- `references/ambiguous-signals.md` — Programming Model, Runtime, Durable, Configuración o shared resource candidates ambiguos.

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

- `.migration/00-before/inventory.json`
- `.migration/00-before/current-state.md`

Opcional cuando Graphify/indexer esté disponible:

- `.migration/00-before/graph/project-graph.json`
- `.migration/00-before/graph/project-graph.md`

Por Function, crear `.migration/00-before/functions/<FunctionName>.md` solo cuando la inspección necesaria para BEFORE ya sea suficiente; de lo contrario `analyze-function` lo completa antes de cualquier modificación.

Lessons son opcionales y siguen `../_shared/lessons-policy.md`.

## Cierre

Terminar cuando:

- la seguridad se aplicó antes de leer;
- las Function Apps y Functions observables fueron inventariadas;
- Programming Model, Runtime, Durable y dependencias quedaron documentados con evidence status;
- configuration keys se registraron sin valores;
- relaciones observables relevantes para migración quedaron registradas con evidence status;
- si se usó Graphify, sus inferencias quedaron marcadas como auxiliares y trazadas a source seguro cuando afecten decisiones posteriores;
- shared resource candidates y unknowns quedaron explícitos;
- los artifacts BEFORE fueron creados.

## No hacer

- leer archivos protegidos;
- evaluar compatibilidad target;
- tratar Graphify como fuente única de verdad;
- seleccionar versiones;
- planificar o migrar;
- refactorizar;
- desplegar.
