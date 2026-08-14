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
- Si `.migration/00-before/inventory.json` ya existia y seguia vigente, lo reusa en vez de rediscover completo.
- Analiza Functions/slices una por vez (progressive disclosure), sin recargar el repositorio completo en cada invocacion de `analyze-function`.
- Si detecta una oportunidad real de reuso de contexto/tokens, registra una lesson `OBSERVED` en `.migration/90-lessons/` siguiendo `_shared/lessons-policy.md`, sin modificar el toolkit automaticamente por eso.

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
