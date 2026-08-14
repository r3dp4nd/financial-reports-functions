---
name: scaffold-function-capability
description: Crea scaffold de una capability y su Azure Function adapter en Node.js/TypeScript cuando el usuario lo pide explícitamente o existe un Action ID aprobado. Úsalo para generar la estructura mínima necesaria de un adapter bajo src/functions, handler testeable y opcionalmente application/domain/infrastructure reales, preservando la arquitectura objetivo sin inventar lógica de negocio.
---

# Scaffold Function Capability

## Objetivo

Crear el esqueleto mínimo de una nueva capability o slice para acelerar trabajo humano sin implementar reglas de negocio no especificadas.

Este skill sí puede modificar código, pero solo para crear scaffold nuevo o completar una acción de scaffold explícitamente aprobada.

## Políticas

Aplicar:

- `../../_shared/evidence-policy.md`
- `../../_shared/security-policy.md`
- `../../_shared/status-policy.md`
- `../../_shared/architecture-policy.md`
- `../../_shared/references/architecture-examples.md`
- `../../_shared/references/validation-tooling.md`

Consultar `../../_shared/references/artifact-layout.md` si se registra evidencia de ejecución.

## Entradas

Recibir al menos:

- capability name;
- Function name;
- trigger kind: HTTP, Service Bus, Timer, Cosmos DB, Durable activity/orchestration u otro soportado por el repo;
- variante esperada: `handler-only`, `application`, `full-boundary` o inferida por Action ID.

Opcional:

- Action ID del plan;
- route/methods/binding names/config keys por nombre;
- command/result/use case names;
- boundary real requerido.

## Workflow

1. Revisar estructura existente y naming local.
2. Confirmar que no se está sobrescribiendo una capability existente sin aprobación explícita.
3. Elegir la variante mínima:
   - `handler-only`: adapter + handler + handler spec;
   - `application`: agrega command/result/use case + spec;
   - `full-boundary`: agrega domain/infrastructure solo si hay boundary real.
4. Crear `src/functions/<function-name>.function.ts` como composition root delgado.
5. Crear `src/<Capability>/handler.ts` y spec cuando el repo usa tests.
6. Crear application/domain/infrastructure solo si la entrada o Action ID lo justifica.
7. Agregar TODOs mínimos de contrato, no pseudonegocio.
8. Ejecutar validación segura cuando aplique: typecheck o test focal si existe.
9. Reportar archivos creados, comandos ejecutados y pendientes humanos.

Cargar cuando haga falta:

- `references/scaffold-rules.md`
- `references/artifacts.md`

## Salidas

- Código scaffold bajo `src/functions/` y `src/<Capability>/`.
- Opcional: `.migration/40-execution/functions/<FunctionName>/scaffold.json|md` cuando exista Action ID o el usuario pida evidencia.

## Cierre

Terminar cuando el scaffold compila o la limitación queda explícita, sin inventar comportamiento.

## No hacer

- implementar reglas de negocio no especificadas;
- crear `domain/`, `infrastructure/` o interfaces por estética;
- conectar SDKs reales sin boundary/Action ID;
- leer secretos;
- modificar Functions existentes sin aprobación explícita;
- agregar tests si el usuario no los pidió y no hay Action ID aprobado.
