---
name: assess-function-app
description: Evalúa una Azure Function App ya descubierta. Úsalo para determinar el gap global frente a Node.js 24, Azure Functions Runtime v4, Programming Model v4 y package targets aprobados, además de riesgos y capacidades de validación, sin modificar código ni crear acciones de migración.
---

# Assess Function App

## Objetivo

Determinar qué dimensiones globales ya cumplen el target, cuáles requieren cambio y cuáles requieren validación o revisión, y emitir un triage compacto para decidir el siguiente paso del flujo.

Assessment no es un segundo inventario ni una lista larga de observaciones. Debe convertir discovery en gates, prioridades y condiciones para analysis/planning.

## Identidad y audiencia

Al redactar `assessment.md`, actuar como un **arquitecto de migración senior evaluando un gate de decisión
ejecutiva**: la audiencia es quien decide si el proyecto avanza a análisis/planning, se bloquea o requiere más
evidencia — no un lector que solo quiere una lista de hechos. Cada `reviewBeforePlanning`/`reviewBeforeExecution`
debe explicar la **consecuencia de decidir mal**, no solo el qué revisar (ej. "si no se confirma el runtime real
antes de migrar, el deploy puede fallar silenciosamente en producción" en vez de solo "confirmar runtime real").

El documento entero debe leerse en el orden en que un arquitecto razonaría el problema: primero la decisión y su
consecuencia, luego el respaldo (target técnico, dependencias, arquitectura), y al final los riesgos que quedan
abiertos. Cada sección mayor abre con 1-3 frases que dicen qué es y por qué importa antes de la tabla, y cuando una
sección se apoya en la anterior (por ejemplo, "Functions que requieren análisis" después de "Arquitectura y shared
resources"), una frase de transición lo dice explícitamente — sin agregar ningún hecho no respaldado por
`inventory.json`/`current-state.md`.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/language-policy.md`
- `../_shared/dependency-baseline.json`

Consultar:

- `../_shared/architecture-policy.md` solo para evaluar gaps estructurales que afecten la migración;
- `../_shared/references/validation-tooling.md` para clasificar capacidad de validación y gaps de tooling.

Consultar `../_shared/references/artifact-layout.md` para leer/escribir artifacts. Aceptar paths legacy si ya existen.

## Precondiciones

Deben existir:

- `.migration/00-before/inventory.json` o legacy `.migration/repository/inventory.json`
- `.migration/00-before/current-state.md` o legacy `.migration/catalog/current-state.md`

Opcional cuando exista: `.migration/00-before/graph/project-graph.json|md`. Si discovery ya identificó relaciones o
slices vía Graphify, reusarlas al evaluar gaps estructurales y shared resources en vez de re-derivarlas.

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
