---
name: generate-tests-for-function-slice
description: Genera o propone tests para módulos testeables alcanzables desde una ruta de Function, handler, use case o slice cuando el usuario lo pide explícitamente o existe un Action ID aprobado. Úsalo para clasificar imports testeables, crear specs Jest/TypeScript enfocadas y preservar comportamiento observable sin tocar runtime Azure ni SDKs reales.
---

# Generate Tests For Function Slice

## Objetivo

Acelerar testabilidad de una Function o slice a partir de una ruta concreta, generando tests solo para módulos que puedan probarse de forma segura y local.

Este skill puede crear archivos de test únicamente cuando el usuario lo pide explícitamente o existe Action ID aprobado.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/architecture-policy.md`
- `../../_shared/references/validation-tooling.md`
- `../../_shared/references/artifact-layout.md`

Consultar `../../_shared/references/architecture-examples.md` solo para patrones de handler/use case tests.

## Entradas

Recibir:

- ruta inicial: Function adapter, handler, use case, domain module o slice folder;
- modo: `plan-only` o `generate`;
- Action ID cuando aplique.

Si el usuario no especifica modo, usar:

- `generate` cuando pidió "genera tests";
- `plan-only` cuando pidió "analiza/propon tests".

## Workflow

1. Leer package scripts y Jest/TS config observable.
2. Construir grafo local de imports desde la ruta inicial con profundidad mínima útil.
3. Clasificar módulos:
   - `TESTABLE_NOW`;
   - `TESTABLE_WITH_MOCKS`;
   - `NOT_TESTABLE_RUNTIME`;
   - `PASSIVE_CONTRACT`;
   - `REQUIRES_REFACTOR`;
   - `OUT_OF_SCOPE`.
4. Identificar specs existentes para evitar duplicados.
5. En `plan-only`, emitir plan de tests sin modificar código.
6. En `generate`, crear specs para módulos `TESTABLE_NOW` y `TESTABLE_WITH_MOCKS` con mocks seguros.
7. No probar composition roots Azure directamente salvo smoke/registration aprobado.
8. Ejecutar test focal si existe comando seguro.
9. Registrar archivos creados, módulos omitidos y razón.

Cargar cuando haga falta:

- `references/test-generation-rules.md`
- `references/artifacts.md`

## Salidas

- Specs creados junto al módulo o en patrón local existente.
- Opcional: `.migration/40-execution/functions/<FunctionName>/test-generation.json|md` o `.migration/40-execution/slices/<SliceName>/test-generation.json|md`.

## Cierre

Terminar cuando los tests generados están enfocados y el resultado de validación queda reportado, o cuando el plan de tests explica por qué no se generaron tests.

## No hacer

- instalar Jest/ts-jest;
- generar tests sin solicitud explícita o Action ID;
- usar Azure real, secretos o emuladores no aprobados;
- crear snapshots amplios;
- probar tipos/commands/results pasivos;
- cambiar código productivo para hacer tests pasar, salvo Action ID explícito.
