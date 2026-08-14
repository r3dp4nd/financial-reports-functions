---
name: prepare-function
description: Prepara una Function concreta ejecutando acciones FN aprobadas de estructura o adaptación previa. Úsalo antes de migrar el Programming Model/Durable cuando el plan requiera separar adapters, capability logic, infraestructura o dependencias locales, preservando el comportamiento observable.
---

# Prepare Function

## Objetivo

Dejar el slice local en una forma segura para la migración técnica y alineada incrementalmente con la arquitectura objetivo cuando el plan lo requiera.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`

## Precondiciones

Deben existir analysis, plan de Function, plan global y preparación global aplicable.

## Workflow

1. Procesar solo acciones `FN-*` asignadas a preparation.
2. Verificar `dependsOn` y `requiredForMigration`.
3. Aplicar el menor cambio estructural/adaptación local aprobado.
4. Preservar comportamiento observable y configuración por nombre de clave.
5. Respetar owner de shared resources.
6. Ejecutar validaciones selectivas seguras.
7. Registrar Action IDs, evidence y deviations.

Cargar:

- `references/preparation-rules.md`
- `references/artifacts.md`

## Salidas

- `.migration/functions/<FunctionName>/preparation.json`
- `.migration/functions/<FunctionName>/preparation.md`

## Cierre

Status `READY_FOR_MIGRATION` cuando todas las precondiciones locales requeridas para la siguiente etapa estén satisfechas.

## No hacer

- generar tests;
- migrar registration/bindings v4;
- migrar topology Durable;
- modificar shared resources sin su acción propietaria;
- modernizar código fuera del slice aprobado.
