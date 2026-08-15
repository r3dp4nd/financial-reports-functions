# Baseline runtime de dependencias

## Cuándo cargar

Carga esta referencia solo cuando necesites sugerir o actualizar versiones runtime en `package.json`.

## Azure Functions y SDKs frecuentes

Cuando el repo use alguno de estos paquetes, considera esta baseline estabilizada como versión objetivo inicial, siempre verificando fuente oficial vigente antes de modificar `package.json`:

```json
{
  "dependencies": {
    "@azure/cosmos": "^4.10.0",
    "@azure/functions": "~4.16.2",
    "@azure/service-bus": "^7.9.5",
    "@azure/storage-blob": "^12.33.0",
    "durable-functions": "~3.5.0"
  }
}
```

Criterios:

- `@azure/functions` usa `~` para evitar saltos menores inesperados del Programming Model durante una migración.
- `durable-functions` usa `~` porque el paquete define APIs de orquestación sensibles al modelo v4.
- Azure SDK clients pueden usar `^` cuando el paquete mantiene semver estable y no se detectan breaking changes relevantes.
- No agregues un SDK ausente solo porque está en la baseline; debe existir uso real o una migración desde SDK legacy equivalente.
- Si el paquete oficial publicó una versión estable más reciente, registra si conviene mantener esta baseline por reproducibilidad o adoptar la nueva por compatibilidad/seguridad.

## Runtime no Azure

Algunas librerías no pertenecen al Azure SDK, pero pueden ser parte del comportamiento runtime. Si el repo genera o manipula archivos Excel con `exceljs`, considera esta versión candidata:

```json
{
  "dependencies": {
    "exceljs": "^4.4.0"
  }
}
```

Antes de sugerirla o instalarla:

- confirma que el código usa `exceljs` o migra desde una librería equivalente ya presente;
- carga `../infrastructure/exceljs-document-generation.md` si el cambio afecta generación, streaming o templates;
- revisa npm, README oficial y changelog del paquete;
- valida que el cambio no altere formato, estilos, streaming, fechas, fórmulas ni compatibilidad de archivos;
- registra pruebas o casos manuales necesarios para comprobar equivalencia.

## Fuentes a comprobar

- `@azure/functions`: npm y guía oficial de Programming Model v4.
- `durable-functions`: npm y guía oficial Durable Functions Node.js v4.
- SDKs `@azure/*`: índice oficial Azure SDK, releases oficiales y README/changelog del paquete.
- `exceljs`: npm y README/changelog oficial.
- exceljs npm/package: https://www.npmjs.com/package/exceljs
