# Gates de verification

Marcar cada check como `PASS`, `FAIL`, `NOT_EXECUTED`, `NOT_APPLICABLE` o `REQUIRES_REVIEW`.

## 1. Plan compliance

Todas las acciones con `requiredForMigration = true` deben estar completadas o justificadamente `NOT_APPLICABLE` según el plan.

## 2. Dependencies

Verificar que packages gestionados estén en targets aprobados y que no exista un downgrade/drift accidental.

## 3. Node.js

Verificar metadata/configuración target y usar Node.js 24 para install/build cuando el entorno lo permita.

## 4. Runtime

Verificar Azure Functions Runtime v4 y configuración requerida.

## 5. Installation

`npm install`/equivalente debe completarse con el package manager definido por el repo, salvo blocker documentado.

## 6. Typecheck

Ejecutar cuando el proyecto TypeScript tenga un comando/configuración reproducible.

## 7. Build global

Gate obligatorio cuando exista build definido. Ejecutarlo solo después de completar la migración/adaptación de todas las Functions de la Function App.

## 8. Existing tests

Si el repositorio ya contiene tests relevantes y pueden ejecutarse de forma segura, usarlos como evidencia adicional. Su ausencia no es fallo y no se generan nuevos.

## 9. Functions / Programming Model

Verificar que las Functions esperadas sigan presentes y que cada una termine en el modelo aprobado. `MIXED` residual no planificado es fallo.

## 10. Durable

Cuando aplique, validar participants, topology, names/API refs y ausencia de residual incompatible.

## 11. Structural compliance

Verificar únicamente acciones estructurales requeridas por el plan y el código refactorizado: adapters en `src/functions/`, capability ownership y boundaries/shared ownership aprobados.

## 12. Shared resources

Confirmar que la acción propietaria se ejecutó una sola vez y consumers quedaron coherentes.

## 13. Host local

`func start` es opcional cuando requiere secretos/servicios no disponibles o no puede ejecutarse de forma segura. Si era un gate explícito del plan y no se ejecuta, registrar la consecuencia correspondiente.

## 14. AFTER comparison

Reinventariar o inspeccionar de forma determinista lo necesario para demostrar:

- lo que debía cambiar cambió;
- lo que debía preservarse permanece;
- no quedan artifacts legacy incompatibles no aprobados.
