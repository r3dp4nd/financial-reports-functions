# Eval: master-before-to-plan

## Caso: flujo completo hasta PLAN

Entrada:

```text
Ejecuta el flujo de migracion hasta PLAN sobre este repositorio usando el prompt maestro.
```

Esperado:

- Ejecuta `discover-function-app`.
- Ejecuta `assess-function-app` usando el inventario actual.
- Ejecuta `analyze-function` por cada Function descubierta.
- Ejecuta `plan-function-migration` con evidencia BEFORE, assessment y analysis.
- No modifica codigo productivo, tests ni configuracion de app.
- Escribe solamente artifacts bajo `.migration/`.
- Reporta estado por etapa y artifacts generados.
- Reporta tabla de metricas de consumo por etapa (Etapa | Modelo usado | Input | Output | Reasoning | Total | Evidencia), usando `UNKNOWN` para tokens no observables sin inventar cifras exactas.
- Recomienda criterio de modelo/razonamiento por tipo de tarea de forma agnostica a proveedor (sin nombres de modelo hardcodeados).
- Antes de reejecutar discovery completo, compara `.migration/00-before/inventory.json` existente contra el commit/arbol de archivos actual; lo reusa solo si sigue vigente.
- Antes de releer un archivo o repetir una consulta de Graphify, verifica `.migration/_cache/index.json` y relaciones ya persistidas en `analysis.json`/`project-graph.json`.
- Agrupa Functions en el mismo slice que discovery ya identifico (Durable/Outbox/shared resource) en vez de re-derivar la agrupacion o fragmentarla en Functions aisladas.
- Analiza Functions/slices una por vez (progressive disclosure), sin recargar el repositorio completo en cada invocacion de `analyze-function`.
- Si detecta una oportunidad real de reuso de contexto/tokens (incluyendo cache/Graphify), registra una lesson `OBSERVED` en `.migration/90-lessons/` siguiendo `_shared/lessons-policy.md`, sin modificar el toolkit automaticamente por eso.
- Reporta un resumen de cuantas lecturas/consultas se evitaron reusando `_cache/`/evidencia persistida frente a las que se ejecutaron de nuevo.

## Caso: Function bloqueada

Entrada:

```text
Ejecuta el flujo hasta PLAN, pero una Function descubierta no puede analizarse por falta de archivos.
```

Esperado:

- Mantiene la Function en el listado.
- Marca el analisis correspondiente como `BLOCKED` o `REQUIRES_REVIEW`.
- Explica evidencia faltante.
- Permite que `plan-function-migration` represente el blocker sin inventar Action IDs implementables.

## Caso: no hay usage real

Entrada:

```text
Ejecuta el prompt maestro en un entorno que no expone usage de tokens.
```

Esperado:

- No estima numeros exactos sin evidencia.
- Usa `UNKNOWN` en columnas numericas no observables.
- Reporta señales aproximadas: archivos leidos, Functions analizadas, artifacts generados y referencias cargadas.
