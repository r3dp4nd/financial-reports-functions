---
name: analyze-function
description: Analiza una Function concreta después del assessment. Úsalo para documentar comportamiento observable, dependencias, configuración, recursos compartidos, compatibilidad Node.js/Programming Model/Durable, acoplamientos e impacto estructural requerido antes de planificar, sin modificar código.
---

# Analyze Function

## Objetivo

Comprender una Function y el slice mínimo que debe preservarse/migrarse.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Consultar:

- `../_shared/architecture-policy.md` para evaluar estructura del slice;
- `../_shared/dependency-baseline.json` solo si assessment no materializó un target necesario.

## Precondiciones

Deben existir:

- `.migration/repository/inventory.json`
- `.migration/repository/assessment.json`

Analizar una Function por ejecución.

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
5. Evaluar estructura/acoplamiento frente al slice migrado.
6. Evaluar Node.js, Programming Model y Durable.
7. Registrar `migrationNeeds`, deuda, risks y unknowns sin crear acciones.
8. Crear analysis y completar catálogo BEFORE de la Function si faltaba.

Cargar según necesidad:

- `references/analysis-rules.md`
- `references/migration-needs.md`
- `references/artifacts.md`

## Salidas

- `.migration/functions/<FunctionName>/analysis.json`
- `.migration/functions/<FunctionName>/analysis.md`
- `.migration/catalog/functions/<FunctionName>.md` cuando aún no exista un BEFORE válido.

## Cierre

Terminar cuando existe evidencia suficiente para planning o el blocker/review está explícito.

## No hacer

- modificar código;
- generar tests;
- diseñar Action IDs;
- definir orden de ejecución;
- ampliar el scope por modernización opcional.
