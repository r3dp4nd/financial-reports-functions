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

## Narrativa

> Ver la sección "Identidad y audiencia" de `SKILL.md`: interpretar el código con dominio experto del ecosistema
> Azure Functions, explicando qué hace y por qué en prosa fluida — no transcribir variables/líneas de código como
> pseudocódigo. Nombrar identificadores reales solo cuando aporte trazabilidad hacia la evidencia, nunca como
> sustituto de la explicación. El detalle literal exacto vive en "Contrato observable" y "Fragmento de código
> relevante" más abajo.

### Narrativa funcional (para onboarding no-técnico)

Qué problema de negocio resuelve esta Function, en 2-4 frases, sin jerga técnica. Si el propósito de negocio no es
100% claro desde la evidencia disponible, decirlo explícitamente en vez de asumirlo.

### Narrativa técnica (para onboarding técnico)

Cómo lo hace, en prosa fluida (paginación, batching, reintentos, validaciones, gestión de throughput, etc.),
siempre trazable a la sección "Contrato observable" o al fragmento de código citado más abajo.

## Contrato observable

La narrativa contó la historia; esta sección es su versión exacta y verificable — qué entra, qué pasa, qué sale y
qué puede fallar, con el mismo detalle que se citará si algún día se decide migrar esta Function.

### Entrada

### Comportamiento

### Salida

### Efectos y errores relevantes

## Fragmento de código relevante

El contrato de arriba se describe en prosa/estructura; este fragmento es la evidencia literal que lo respalda.

```ts
```

*(archivo: ruta/al/archivo.ts, líneas X-Y)*

## Dependencias

Toda Function depende de otros módulos y paquetes externos para cumplir su contrato — esta sección lista
exactamente cuáles.

- internas: (nombres reales de clases/módulos importados, no descripciones)
- externas:
- shared resources/candidates:

## Configuración

Solo nombres de claves.

## Relaciones

Más allá de las dependencias técnicas, esta sección ubica a la Function dentro del flujo más amplio del
repositorio: quién la invoca, a quién invoca ella, y si forma parte de un workflow coordinado.

- callers/producers:
- consumers/downstream:
- workflow participants:

## Arquitectura actual

Con el contrato, dependencias y relaciones ya claros, esta sección resume cómo está organizado el código
internamente — si el adapter Azure está separado de la lógica de negocio, o si todo vive mezclado.

- Azure adapter:
- lógica funcional:
- infraestructura:
- acoplamientos:

## Complejidad y deuda técnica

Con la arquitectura ya descrita, esta sección responde qué tan arriesgado es tocar esta Function y por qué — la
misma clasificación que alimentará el resumen ejecutivo de `repository.md`.

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
