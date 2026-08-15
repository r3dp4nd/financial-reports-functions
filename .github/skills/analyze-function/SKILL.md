---
name: analyze-function
description: Analiza una Function o slice concreto después del assessment. Úsalo para documentar comportamiento observable, criticidad, testabilidad, dependencias, configuración, recursos compartidos, compatibilidad Node.js/Programming Model/Durable, acoplamientos e impacto estructural requerido antes de planificar, sin modificar código.
---

# Analyze Function

## Objetivo

Comprender una Function o slice y el alcance mínimo que debe preservarse/migrarse/refactorizarse.

Cuando el scope natural cruce varias Functions, por ejemplo Durable workflow, Outbox o shared resource flow, analizarlo como slice coherente en lugar de forzar una Function aislada.

## Identidad y audiencia

Al redactar `analysis.md`, actuar como un **ingeniero senior diseñando el "cómo" antes que el plan formal**: no
basta con detectar un gap ("SDK sin boundary"), hay que proponer la forma concreta de la solución basada en la
evidencia ya reunida (qué interfaz, qué separación), para que `plan-function-migration` reciba un borrador de
diseño real, no solo un síntoma repetido en varias tablas.

El documento se lee como el razonamiento completo de ese ingeniero: primero el contrato observable (qué hay que
preservar), luego cómo se relaciona con el resto del sistema, después qué tan lejos está de la plataforma y
arquitectura objetivo — todo en una sola narrativa consolidada, sin repetir el mismo hallazgo en 3 tablas distintas
con distinto formato (Compatibilidad, checklist v3→v4, Migration needs y checklist de gap deben leerse como una
progresión, no como secciones aisladas que dicen lo mismo con otras palabras). Cada sección mayor abre con 1-3
frases que explican qué es y por qué importa antes de la tabla.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`

Consultar:

- `../_shared/architecture-policy.md` para evaluar estructura del slice;
- `../_shared/references/artifact-layout.md` para leer/escribir artifacts;
- `../_shared/references/graphify-usage.md` cuando exista grafo disponible y se necesite resolver relaciones/slice sin leer código a ciegas;
- `../_shared/context-cache-policy.md` antes de releer un archivo que discovery u otra ejecución de analysis ya pudo haber cacheado;
- `../_shared/dependency-baseline.json` solo si assessment no materializó un target necesario.

## Precondiciones

Deben existir:

- `.migration/00-before/inventory.json` o legacy `.migration/repository/inventory.json`
- `.migration/10-assessment/assessment.json` o legacy `.migration/repository/assessment.json`

Reusar cuando existan (no re-derivar desde `inventory.json` crudo lo que estos artifacts ya curaron):

- `.migration/00-before/current-state.md` — arquitectura observable, diagramas y relaciones ya documentadas a nivel repo;
- `.migration/00-before/functions/<FunctionName>.md` — catálogo BEFORE de la Function, incluyendo el fragmento de
  código relevante ya extraído; usarlo como punto de partida del análisis en vez de releer el archivo completo desde cero;
- `.migration/00-before/graph/project-graph.json|md` — si está disponible, consultarlo antes de leer código fuente
  adicional para resolver relaciones del slice.

Analizar una Function o slice por ejecución.

## Progressive disclosure

```text
artifacts existentes (incluyendo project-graph si existe)
→ entrypoint seleccionado
→ relaciones del entrypoint verificadas vía Graphify (explain/path) cuando aplique
→ dependencias directas
→ slice transitivo requerido
→ consumidores relacionados solo si son necesarios
```

## Workflow

1. Documentar comportamiento observable y contratos que deben preservarse.
2. Identificar configuración por nombre de clave.
3. Analizar dependencias e impacto de target.
4. Confirmar shared resources relevantes.
5. Evaluar criticidad, testabilidad y código difícil de probar.
6. Evaluar estructura/acoplamiento frente al slice migrado o refactorizado, separando gaps reales de preferencias estéticas.
7. Evaluar Node.js, Programming Model y Durable.
8. Registrar comportamiento que no debe cambiar: contratos, estados, retries, idempotencia, efectos persistentes y mensajes.
9. Registrar `migrationNeeds`, `refactorTestabilityNeeds`, lane recomendado, deuda, risks y unknowns sin crear acciones.
10. Crear analysis y completar catálogo BEFORE de la Function si faltaba.

Cargar según necesidad:

- `references/analysis-rules.md`
- `references/migration-needs.md`
- `references/artifacts.md`

## Salidas

- `.migration/20-analysis/functions/<FunctionName>/analysis.json`
- `.migration/20-analysis/functions/<FunctionName>/analysis.md`
- `.migration/20-analysis/slices/<SliceName>/analysis.json|md` cuando el scope natural no sea una única Function
- `.migration/00-before/functions/<FunctionName>.md` cuando aún no exista un BEFORE válido.

## Cierre

Terminar cuando existe evidencia suficiente para planning o el blocker/review está explícito.

## No hacer

- modificar código;
- generar tests;
- diseñar Action IDs;
- definir orden de ejecución;
- ampliar el scope por modernización opcional;
- proponer optimizaciones funcionales sin cambio aprobado.
