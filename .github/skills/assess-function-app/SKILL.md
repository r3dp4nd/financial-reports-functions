---
name: assess-function-app
description: Evalúa una Azure Function App ya descubierta. Úsalo para determinar el gap global frente a Node.js 24, Azure Functions Runtime v4, Programming Model v4 y package targets aprobados, además de riesgos y capacidades de validación, sin modificar código ni crear acciones de migración.
---

# Assess Function App

## Objetivo

Determinar qué dimensiones globales ya cumplen el target, cuáles requieren cambio y cuáles requieren validación o revisión, y emitir un triage compacto para decidir el siguiente paso del flujo.

Assessment no es un segundo inventario ni una lista larga de observaciones. Debe convertir discovery en gates, prioridades y condiciones para analysis/planning.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/dependency-baseline.json`

Consultar `../_shared/architecture-policy.md` solo para evaluar gaps estructurales que afecten la migración.

Consultar `../_shared/references/artifact-layout.md` para leer/escribir artifacts. Aceptar paths legacy si ya existen.

## Precondiciones

Deben existir:

- `.migration/00-before/inventory.json` o legacy `.migration/repository/inventory.json`
- `.migration/00-before/current-state.md` o legacy `.migration/catalog/current-state.md`

## Workflow

1. Consumir inventory y BEFORE.
2. Leer el baseline aprobado.
3. Evaluar dimensiones globales sin volver a ejecutar discovery.
4. Clasificar dependencias y tooling.
5. Agrupar dependencias por impacto: bloquean/requieren review, requieren impact analysis, tooling de validación o informativas.
6. Determinar qué Functions requieren análisis profundo con prioridad, sin listar todo como igual salvo que la evidencia lo justifique.
7. Registrar decision, blocking issues, review requirements, risks y unknowns.
8. Emitir assessment compacto.

Cargar cuando sea necesario:

- `references/assessment-rules.md`
- `references/dependency-classification.md`
- `references/artifacts.md`

## Salidas

- `.migration/10-assessment/assessment.json`
- `.migration/10-assessment/assessment.md`

Lessons opcionales según `../_shared/lessons-policy.md`.

## Cierre

Terminar cuando:

- target y baseline usados estén identificados;
- Node, Runtime, Programming Model y Durable estén evaluados globalmente;
- dependencias aplicables estén clasificadas;
- capacidad de validación determinista esté registrada;
- decision, blocking issues y review requirements queden explícitos;
- Functions que requieren analysis estén identificadas con prioridad;
- risks/unknowns estén explícitos sin repetir inventario;
- el status sea coherente con `status-policy.md`.

## No hacer

- modificar source;
- seleccionar `latest`;
- generar Action IDs;
- crear migration plan;
- analizar comportamiento profundo de cada Function;
- generar tests.
