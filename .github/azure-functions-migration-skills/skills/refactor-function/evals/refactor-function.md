# Eval: refactor-function

## Escenario

Function ya comprendida o migrada, con responsabilidades mezcladas entre adapter Azure, aplicación, dominio e infraestructura.

## Prompt

```text
Usa refactor-function para ordenar <FunctionName> por capability, DI, application, domain e infrastructure sin cambiar comportamiento.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/architecture/function-architecture.md`
- `references/architecture/capability-slicing.md` si divide un servicio monolítico o god file
- `references/infrastructure/exceljs-document-generation.md` si refactoriza generación Excel/CSV
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`

## Debe producir

Artefactos bajo `.migration/functions/<function-name>/` con:

- estructura y naming aplicados;
- responsabilidades movidas por evidencia;
- capability origen/destino de responsabilidades extraídas;
- separación entre filtros/reglas de aplicación y generator ExcelJS;
- DI aplicada o descartada con razón;
- validaciones incrementales;
- deuda o mejoras futuras fuera de alcance.

## No debe

- cambiar comportamiento funcional;
- crear capas, interfaces o archivos sin uso inmediato;
- alterar bindings o settings salvo que sea consecuencia técnica documentada;
- convertir mejoras futuras en parte de la migración;
- reescribir un servicio monolítico completo sin cortes incrementales;
- apropiarse de componentes compartidos sin revisar consumidores.
