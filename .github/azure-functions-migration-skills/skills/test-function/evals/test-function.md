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
- `references/evidence/artifact-contracts.md` solo si necesita detalle completo de `tests.md`
- `references/azure-functions/programming-model-v4.md` solo si prueba directamente un adapter/handler v4
- `references/infrastructure/exceljs-document-generation.md` si prueba generación ExcelJS, templates o streaming
- `references/infrastructure/cosmos-mongo-persistence.md` si prueba repositorios, query builders, paginación o mappers Cosmos/Mongo

## Debe producir

`.migration/functions/<function-name>/tests.md` o salida equivalente con:

- escenarios cubiertos;
- tests agregados o ajustados;
- resultados de ejecución;
- cobertura disponible;
- exclusiones aplicadas por convención;
- evidencia de templates/documentos generados cuando aplique;
- evidencia de query/paginación/mapping cuando aplique;
- huecos pendientes y razón.

## No debe

- generar tests solo para inflar coverage;
- probar interfaces, tipos o contratos sin comportamiento;
- cambiar negocio para que un test pase;
- mockear detalles internos sin valor contractual;
- validar solo que ExcelJS fue llamado sin comprobar contrato observable del documento;
- validar solo que el cliente Cosmos/Mongo fue llamado sin comprobar query, paginación o mapping observable;
- crear abstracciones productivas únicamente para facilitar mocks.
