# Eval: test-function

## Escenario

Function o capability con escenarios de comportamiento identificados y configuración Jest disponible o preparada.

## Prompt

```text
Usa test-function para diseñar, implementar y ejecutar tests útiles para <FunctionName> sin cambiar comportamiento.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/testing/jest.md`
- `references/evidence/migration-artifacts.md`
- `references/azure-functions/programming-model-v4.md` solo si prueba directamente un adapter/handler v4

## Debe producir

`.migration/functions/<function-name>/tests.md` o salida equivalente con:

- escenarios cubiertos;
- tests agregados o ajustados;
- resultados de ejecución;
- cobertura disponible;
- exclusiones aplicadas por convención;
- huecos pendientes y razón.

## No debe

- generar tests solo para inflar coverage;
- probar interfaces, tipos o contratos sin comportamiento;
- cambiar negocio para que un test pase;
- mockear detalles internos sin valor contractual;
- crear abstracciones productivas únicamente para facilitar mocks.
