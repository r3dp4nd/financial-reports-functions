# Plan de migración — <FunctionName>

## Referencias

- Analysis: `.migration/20-analysis/functions/<FunctionName>/analysis.json|md` (o slice equivalente)
- Global plan: `.migration/30-plan/migration-plan.json|md`
- BEFORE (catálogo de la Function): `.migration/00-before/functions/<FunctionName>.md`

## Estado y scope

- Status:
- Capability:
- Effective slice:

## Comportamiento a preservar

Antes de cualquier acción, esta sección fija el contrato que ninguna acción puede romper — copiado literal de la
sección "Contrato a preservar" del `analysis.json|md` de esta Function/slice, nunca reinterpretado.
`verify-function-app` usará esta misma referencia para comparar AFTER.

- Contratos observables:

## Acciones FN

Vista compacta de todas las acciones de esta Function, técnicas y de reestructuración, en una sola tabla — el
detalle ejecutable de cada una vive en la sección "Manual de ejecución" más abajo.

| Action ID | Lane | Cambio | Executor sugerido | Owner/stage | requiredForMigration | requiredForRefactor | Preserve behavior | Prohibited changes | dependsOn | Criterio verificable |
|---|---|---|---|---|---|---|---|---|---|---|

## Migración técnica (v3 → v4, mecánica)

Estas acciones transcriben la Function a la plataforma objetivo siguiendo las reglas oficiales v3→v4 — bajo riesgo
de diseño, alto riesgo de omitir un detalle mecánico si no se sigue el checklist exacto. Cada una debe leerse como
un manual: código antes/después real, comandos, pasos numerados.

### <Action ID técnica>

**Código antes** (leído del BEFORE, archivo + líneas):

```ts
```

**Código después** (destino):

```ts
```

**Árbol de carpetas antes → después** (cuando aplique):

```text
```

**Comandos exactos** (instalación/desinstalación/build, en orden):

```bash
```

**Pasos numerados**:

1.
2.
3.

**Comando de verificación y resultado esperado literal**:

```bash
```

## Reestructuración (mejores prácticas, testabilidad)

A diferencia de la migración técnica, estas tareas requieren diseño: no basta con transcribir, hay que proponer
la estructura concreta (interfaz, módulo, composición) que resuelve el gap detectado en `analysis.json`. Están
numeradas y ordenadas por dependencia — si solo se quiere implementar una tarea autocontenida para empezar, la
columna "Por dónde empezar" lo indica.

| Tarea | Depende de | ¿Cambia comportamiento observable? | Por dónde empezar |
|---|---|---|---|

### Tarea <N> — <nombre>

**Rationale** (por qué existe esta tarea, qué gap de `analysis.json` resuelve):

**Estructura propuesta** (interfaz/módulo concreto, no solo "necesita boundary"):

```ts
```

**Código antes → después** (si aplica cambio de código, no solo de estructura):

```ts
```

**Árbol de carpetas antes → después**:

```text
```

**¿Cambia comportamiento observable?**: `Sí | No` — si `Sí`, explicar exactamente qué cambia y por qué requiere
aprobación humana.

## Dependencias globales/shared

| Action/Resource | Motivo |
|---|---|

## Arquitectura requerida

Resumen de a dónde debería llegar esta Function tras completar tanto la migración técnica como la reestructuración
— el destino final que las secciones anteriores describen paso a paso.

- Adapter Azure:
- Capability:
- Infrastructure boundary:
- Shared ownership:

## Programming Model

- Current:
- Target:
- Applicable action:
- Paquete `@azure/functions`: versión actual → versión target (confirmar en `dependencies`, no `devDependencies`)

## Durable

- Applicable:
- Workflow/participants:
- Paquete `durable-functions`: versión actual → versión target (v3→`2.x`, v4→`3.x`; ver `_shared/references/official-sources.md`)
- Llamadas a `DurableClient` API con firma afectada (si el plan incluye un starter/trigger):

| Método | Firma actual | Firma target |
|---|---|---|

## Validación

- checks intermedios seguros:
- gates finales:

## Contrato de evaluación local

Tabla final que conecta cada acción con su criterio de éxito/fracaso — la misma tabla que `verify-function-app`
usará para confirmar el cierre.

| Action ID | Expected result | Preserve behavior | Prohibited changes | Verification criteria | Failure criteria |
|---|---|---|---|---|---|

## Riesgos, unknowns y deuda

- Riesgos:
- Unknowns:
- Debt fuera de alcance:
