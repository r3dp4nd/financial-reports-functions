---
name: analyze-function
description: Analiza una Function o slice concreto después del assessment. Úsalo para documentar comportamiento observable, criticidad, testabilidad, dependencias, configuración, recursos compartidos, compatibilidad Node.js/Programming Model/Durable, acoplamientos e impacto estructural requerido antes de planificar, sin modificar código.
---

# Analyze Function

## Objetivo

Comprender una Function o slice y el alcance mínimo que debe preservarse/migrarse/refactorizarse.

Cuando el scope natural cruce varias Functions, por ejemplo Durable workflow, Outbox o shared resource flow, analizarlo como slice coherente en lugar de forzar una Function aislada.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`

Consultar:

- `../_shared/architecture-policy.md` para evaluar estructura del slice;
- `../_shared/references/artifact-layout.md` para leer/escribir artifacts;
- `../_shared/dependency-baseline.json` solo si assessment no materializó un target necesario.

## Precondiciones

Deben existir:

- `.migration/00-before/inventory.json` o legacy `.migration/repository/inventory.json`
- `.migration/10-assessment/assessment.json` o legacy `.migration/repository/assessment.json`

Analizar una Function o slice por ejecución.

## Progressive disclosure

```text
artifacts existentes
→ entrypoint seleccionado
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
