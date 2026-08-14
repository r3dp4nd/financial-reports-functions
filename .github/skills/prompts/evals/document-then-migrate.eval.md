# Eval: document-then-migrate

## Caso: flujo completo documentacion + migracion hasta PLAN

Entrada:

```text
Ejecuta documentacion y luego migracion hasta PLAN sobre este repositorio usando el prompt maestro document-then-migrate.
```

Esperado:

- Ejecuta `document-function-app` primero, generando `documentation/repository.md` y
  `documentation/functions/<FunctionName>.md` en la raiz del repositorio (no bajo `.migration/`).
- La seccion "Complejidad y deuda tecnica" de `documentation/repository.md` incluye una etiqueta agregada (BAJA/MEDIA/ALTA)
  trazada a señales concretas, no un score inventado.
- Verifica si `.migration/00-before/inventory.json` quedo generado/reusado por la etapa de documentacion antes de
  decidir si ejecuta `discover-function-app` de nuevo; no rediscover innecesario si ya es vigente.
- Ejecuta `assess-function-app` usando el inventario resultante.
- Ejecuta `analyze-function` por cada Function/slice, reusando la clasificacion de criticidad/testabilidad ya
  calculada en `documentation/repository.md` en vez de re-derivarla desde cero.
- Ejecuta `plan-function-migration` con evidencia BEFORE, assessment y analysis.
- No modifica codigo productivo, tests ni configuracion de app.
- Escribe `documentation/*` en la raiz del repo (se commitea) e `inventory`/`assessment`/`analysis`/`plan`
  solamente bajo `.migration/` (no se commitea).
- Reporta estado por etapa (incluyendo la etapa de documentacion) y artifacts generados.
- Reporta tabla de metricas de consumo por etapa (Etapa | Modelo usado | Input | Output | Reasoning | Total | Evidencia).
- Reporta un resumen explicito de cuanta evidencia de la etapa de documentacion se reuso en la etapa de migracion.
- Agrupa Functions en el mismo slice que discovery ya identifico (Durable/Outbox/shared resource).
- Analiza Functions/slices una por vez (progressive disclosure).
- Si detecta una oportunidad real de reuso de contexto/tokens, registra una lesson `OBSERVED` en
  `.migration/90-lessons/` siguiendo `_shared/lessons-policy.md`.

## Caso: repositorio sin intencion de migrar (solo documentacion)

Entrada:

```text
Ejecuta solo la etapa de documentacion de este prompt, sin avanzar a la migracion.
```

Esperado:

- Ejecuta `document-function-app` y produce `documentation/repository.md` + `documentation/functions/`.
- No ejecuta `discover-function-app`, `assess-function-app`, `analyze-function` ni `plan-function-migration` como
  parte de esta invocacion (aunque `document-function-app` internamente pueda reusar/generar `inventory.json`).
- No genera Action IDs ni migration plan.
- El documento es util por si mismo, sin asumir que habra una migracion posterior.

## Caso: Function bloqueada durante la etapa de migracion

Entrada:

```text
Ejecuta document-then-migrate, pero una Function descubierta no puede analizarse por falta de archivos.
```

Esperado:

- La etapa de documentacion completa igual para las demas Functions (no bloquea todo el documento por una Function
  problematica).
- Mantiene la Function en el listado de `documentation/repository.md` con la informacion disponible.
- Marca el `analyze-function` correspondiente como `BLOCKED` o `REQUIRES_REVIEW` en la etapa de migracion.
- Permite que `plan-function-migration` represente el blocker sin inventar Action IDs implementables.

## Caso: no hay usage real de tokens

Entrada:

```text
Ejecuta document-then-migrate en un entorno que no expone usage de tokens.
```

Esperado:

- No estima numeros exactos sin evidencia.
- Usa `UNKNOWN` en columnas numericas no observables, incluyendo la etapa de documentacion.
- Reporta señales aproximadas: archivos leidos, Functions documentadas/analizadas, artifacts generados.
