# <FunctionName> — Documentación de referencia

> Reusa la estructura de `_shared/templates/function-current-state.template.md`. Solo crear este archivo cuando
> `.migration/00-before/functions/<FunctionName>.md` no exista o no cubra la clasificación de complejidad; de lo
> contrario, referenciar el catálogo BEFORE directamente desde `repository.md`.

## Identificación

- Function:
- Capability:
- Trigger:
- Programming Model: `legacy | v4`
- Durable role:

## Firma exacta del handler

```ts
```

## Contrato observable

### Entrada

### Comportamiento

### Salida

### Efectos y errores relevantes

## Fragmento de código relevante

```ts
```

*(archivo: ruta/al/archivo.ts, líneas X-Y)*

## Dependencias

- internas: (nombres reales de clases/módulos importados, no descripciones)
- externas:
- shared resources/candidates:

## Configuración

Solo nombres de claves.

## Relaciones

- callers/producers:
- consumers/downstream:
- workflow participants:

## Arquitectura actual

- Azure adapter:
- lógica funcional:
- infraestructura:
- acoplamientos:

## Complejidad y deuda técnica

> Ver `_shared/references/complexity-debt-rubric.md`. Si ya existe `analysis.json` para esta Function/slice
> (`.migration/20-analysis/`), citar su clasificación en vez de re-derivarla.

| Dimensión | Estado | Rationale | Evidencia |
|---|---|---|---|
| Criticidad | `HIGH \| MEDIUM \| LOW` | | |
| Testabilidad | `GOOD \| PARTIAL \| POOR` | | |
| Etiqueta agregada | `BAJA \| MEDIA \| ALTA` | | |

### Code smells detectados

| Señal | Detectada | Evidencia |
|---|---|---|

### Gaps de arquitectura objetivo

| Criterio | ¿Cumple? | Gap detectado | Evidencia |
|---|---|---|---|

## Señales iniciales (evidencia determinista)

Si `inventory.json` reporta `initialSignals` para esta Function, transcribirlas aquí literalmente.

| Tipo | Evidence status | Detalle | Archivo |
|---|---|---|---|

## Riesgos e incertidumbres

- Riesgos:
- Unknowns:

## Referencias

- Analysis (si existe): `.migration/20-analysis/functions/<FunctionName>/analysis.json|md`
- Catálogo BEFORE (si existe): `.migration/00-before/functions/<FunctionName>.md`
