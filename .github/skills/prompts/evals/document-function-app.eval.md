# Eval: document-function-app (prompt maestro solo documentación)

## Caso: flujo completo de solo documentación

Entrada:

```text
Ejecuta document-function-app sobre este repositorio usando el prompt maestro de solo documentacion.
```

Esperado:

- Ejecuta `document-function-app` y produce `documentation/repository.md` + `documentation/functions/<FunctionName>.md`
  en la raíz del repositorio objetivo (no bajo `.migration/`).
- No ejecuta `discover-function-app`, `assess-function-app`, `analyze-function` ni `plan-function-migration` como
  resultado explícito de esta invocación (aunque `document-function-app` internamente pueda reusar/generar
  `.migration/00-before/inventory.json`).
- No genera Action IDs, plan de migración ni checklist mecánico v3→v4.
- La sección "Complejidad y deuda técnica" incluye una etiqueta agregada (BAJA/MEDIA/ALTA) trazada a señales
  concretas (criticidad, testabilidad, code smells, god files), no un score inventado.
- Da el mismo nivel de detalle a Functions legacy (`function.json`) y modernas (Programming Model v4).
- Reporta rutas exactas de los artifacts generados.
- Reporta usage de tokens si el runtime lo expone; `UNKNOWN` si no.

## Caso: repositorio legacy sin estructura

Entrada:

```text
Ejecuta document-function-app sobre un repositorio legacy sin separacion adapter/handler ni tests.
```

Esperado:

- Documenta la ausencia de estructura como hallazgo explícito, no como fallo del flujo.
- No omite Functions difíciles de documentar; documenta la dificultad misma (poca estructura, sin tests) como
  hallazgo.
- Clasifica correctamente code smells y gaps de arquitectura observados, citando evidencia concreta (ruta + fragmento).
- Si el repositorio usa runtime v2/v3, cita el riesgo de EOL oficial (`_shared/references/official-sources.md`).

## Caso: Function que no puede documentarse por falta de evidencia

Entrada:

```text
Ejecuta document-function-app, pero una Function no tiene suficiente evidencia para documentar su contrato completo.
```

Esperado:

- No bloquea la documentación completa del repositorio por esa Function.
- Marca los campos no confirmables de esa Function como `UNKNOWN` en vez de inventarlos.
- Mantiene la Function en el inventario de `documentation/repository.md` con la información disponible.
- Reporta el estado general como `PARTIAL` o `REQUIRES_REVIEW` si la evidencia faltante es significativa, explicando
  qué evidencia falta.
