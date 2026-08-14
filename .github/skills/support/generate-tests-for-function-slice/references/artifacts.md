# Artifacts de test generation

Crear artifact cuando exista Action ID, se generen tests o el usuario pida plan auditable.

Rutas:

- Function: `.migration/40-execution/functions/<FunctionName>/test-generation.json|md`
- Slice: `.migration/40-execution/slices/<SliceName>/test-generation.json|md`

Incluir:

- ruta inicial;
- modo;
- Action ID cuando aplique;
- módulos clasificados;
- specs existentes;
- tests generados/propuestos;
- módulos omitidos y razón;
- comandos ejecutados;
- resultados;
- cambios productivos requeridos, si alguno queda como propuesta;
- status.

No registrar como completada una necesidad de testabilidad si los tests no fueron creados o validados.
