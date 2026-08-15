# Generación de documentos con ExcelJS

## Propósito

Detectar smells en generación Excel basada en `exceljs` y guiar cómo aclararlos para volver el flujo testeable, especialmente cuando el repositorio usa streams, archivos temporales, NDJSON/JSON lines o templates JSON para construir reportes grandes.

Esta referencia sustenta `assess-function-app`, `analyze-function`, `refactor-function`, `migrate-shared-component` y `test-function` cuando detecten `exceljs`, `Excel.stream.xlsx.WorkbookWriter`, templates de reporte, headers dinámicos, filtros o generación XLSX/CSV.

## Señales para cargar esta referencia

Carga esta referencia si detectas:

- imports de `exceljs`;
- `Excel.stream.xlsx.WorkbookWriter`;
- `workbook.xlsx.writeFile`, `writeBuffer` o `write`;
- lectura línea por línea con `readline`;
- templates JSON para hojas, columnas, estilos o encabezados agrupados;
- generación de reportes desde archivos temporales;
- salida a Blob Storage, HTTP response, filesystem temporal o cola/evento posterior;
- utilidades grandes tipo `excel-util`, `exceljs-util`, `report-generator` o similares.

## Smells a identificar

Registra estos smells como hallazgos, no como patrones aceptados:

- una utilidad ExcelJS arma filtros de negocio y también escribe celdas;
- `config: any` contiene filename, rutas, report type, template y reglas sin contrato;
- el template JSON define decisiones de negocio en vez de estructura visual;
- grouped headers están hardcodeados por reporte dentro del generator;
- el generator conoce enums, estados, productos, usuarios o defaults del caso de uso;
- se escribe un archivo temporal sin contrato claro de creación, consumo y limpieza;
- se usa callback de filesystem sin esperar el resultado cuando el siguiente paso depende del archivo;
- se cambia entre stream, buffer y file sin razón documentada;
- los tests solo verifican que se llamó a ExcelJS y no el contrato observable del documento.

Para cada smell, documenta:

```text
evidencia
impacto en testabilidad
riesgo de cambiarlo
corte incremental sugerido
validación mínima
```

## Principio

La generación de Excel es infraestructura de documento. Las reglas de negocio, filtros y selección de datos deben quedar fuera del detalle de ExcelJS cuando sea viable.

```text
Function adapter
      ↓
caso de uso / aplicación
      ↓
puerto DocumentGenerator
      ↓
exceljs-<capability>.generator.ts
      ↓
template JSON + stream/output
```

No migres ExcelJS mezclando cambio funcional, rediseño visual y cambio de transporte al mismo tiempo.

Esta referencia no define cómo debe quedar todo al final. Define cómo reconocer smells y ordenar el código existente para aislar comportamiento y volverlo testeable paso a paso.

## Orden para volverlo testeable

Cuando encuentres una utilidad grande de ExcelJS, no la reescribas completa. Aclara los smells en este orden, deteniéndote donde el repo ya quede suficientemente claro:

1. identifica el contrato observable del archivo: columnas, filtros, grouped headers, formatos y destino;
2. extrae la construcción de filtros fuera del generator si depende de enums, fechas, defaults o reglas;
3. tipa el template/configuración mínima que ya existe sin cambiar su formato;
4. encapsula lectura de template/schema detrás de un reader simple si hoy está mezclada con generación;
5. deja ExcelJS concentrado en una implementación de infraestructura;
6. introduce un puerto de generación solo cuando el caso de uso necesite probarse sin ExcelJS;
7. agrega tests del caso de uso con un fake generator;
8. agrega tests del generator con template y dataset pequeños.

No ejecutes todos los pasos si uno no aporta testabilidad real en el estado actual del repo.

## Inventario mínimo

Antes de refactorizar o migrar, registra:

```text
origen de datos
formato de entrada: array | JSON | NDJSON | stream | archivo temporal
volumen esperado
destino: archivo | Buffer | stream | Blob | HTTP response
template/schema usado
hojas generadas
headers y grouped headers
filtros mostrados
estilos relevantes
formatos de fecha/número/moneda
columnas obligatorias
errores esperados
settings/env usados
```

No copies valores sensibles ni rutas locales reales; usa nombres de settings o placeholders.

## Streaming vs workbook en memoria

Usa streaming cuando:

- el origen puede tener muchas filas;
- ya existe entrada por archivo/stream;
- la salida final se escribe a archivo, Blob o HTTP stream;
- se busca evitar cargar todo el workbook en memoria.

Con `WorkbookWriter`:

- especifica `filename` o `stream`; si no, ExcelJS puede mantener el contenido en memoria;
- llama `.commit()` en cada fila agregada cuando ya no se necesite modificarla;
- llama `worksheet.commit()` al terminar la hoja;
- llama `workbook.commit()` al terminar el documento;
- recuerda que una fila committeada ya no puede modificarse;
- evita operaciones incompatibles con streaming después de commitear filas.

Usa workbook normal cuando:

- el archivo es pequeño;
- necesitas leer/modificar muchas celdas después de crearlas;
- necesitas operaciones no compatibles con streaming;
- el resultado debe ser `Buffer` y el tamaño es controlado.

## Template JSON

El template debe describir estructura, no reglas de negocio ocultas.

Contrato sugerido:

```json
{
  "sheetName": "<name>",
  "sheetTitle": "<title>",
  "showGridLines": true,
  "columns": [
    {
      "key": "<field>",
      "header": "<label>",
      "width": 18,
      "alignment": "left",
      "format": "<optional-format>"
    }
  ],
  "filterLayout": {
    "startRow": 4,
    "startColumn": 2,
    "columnsPerRow": 3
  },
  "groupedHeaders": [
    {
      "title": "<group>",
      "from": "B",
      "to": "G",
      "row": 9
    }
  ],
  "styles": {
    "title": {},
    "header": {},
    "groupedHeader": {}
  }
}
```

Adapta nombres si el repo ya tiene schema vigente. No fuerces un nuevo formato si el existente se puede evolucionar con compatibilidad.

Valida el template antes de generar:

- `sheetName`;
- columnas con `key` único;
- rangos de grouped headers coherentes;
- estilos soportados por ExcelJS;
- formatos de celdas esperados;
- ausencia de lógica condicional propia del negocio dentro del JSON.

## Filtros

Los filtros visibles del reporte son contrato de aplicación. Construye los filtros fuera del generator cuando dependen de reglas de negocio, enums, fechas o defaults.

El generator puede recibir:

```text
filters: Array<{ name: string; value: unknown }>
```

pero no debería decidir por sí mismo qué significa un estado, área, producto o usuario. Esa decisión pertenece al caso de uso o mapper de aplicación.

## Cortes posibles

Usa nombres alineados con la arquitectura objetivo cuando ayuden a expresar el corte:

```text
domain/ports/<capability>.generator.ts
infrastructure/document/exceljs-<capability>.generator.ts
infrastructure/document/<capability>-template.reader.ts
infrastructure/document/<capability>-template.types.ts
```

Si el generator es compartido por varias Functions o capabilities, trátalo con `migrate-shared-component`.

## Manejo de streams y archivos temporales

Para entrada NDJSON o JSON lines:

- usa `fs.createReadStream`;
- itera con `readline` o parser streaming equivalente;
- maneja errores de `JSON.parse` con contexto suficiente sin exponer datos sensibles;
- evita acumular todas las filas en arrays;
- cierra recursos y propaga errores.

Para salida:

- prefiere stream o archivo temporal cuando el volumen sea alto;
- documenta quién borra archivos temporales;
- no escribas en rutas hardcodeadas;
- usa settings o servicios de filesystem abstraídos si el repo ya los tiene;
- si el destino final es Blob Storage, define claramente si se sube desde archivo, stream o Buffer.

## Tests útiles

Prueba comportamiento, no implementación interna de ExcelJS.

Casos recomendados:

- template válido genera columnas esperadas;
- filtros se escriben en posiciones esperadas;
- grouped headers se aplican para el reporte correspondiente;
- filas NDJSON se agregan sin cargar todo en memoria;
- error de línea JSON inválida se propaga o registra según contrato;
- archivo/stream final se crea;
- formatos críticos de fecha, número o moneda se preservan.

Para tests unitarios, usa datasets pequeños. Para streaming, valida que el código use `WorkbookWriter` y commit por fila cuando el volumen esperado lo requiera; no intentes comprobar memoria exacta salvo que exista prueba de performance explícita.

## Evidencia

Cuando aplique, registra en `.migration/functions/<function-name>/analysis.md`, `.migration/functions/<function-name>/refactor.md` o `.migration/shared-components/<component-name>.md`:

- template/schema detectado;
- origen y destino del documento;
- motivo para usar streaming o workbook normal;
- contrato de filtros;
- responsabilidades que quedaron en aplicación vs infraestructura;
- validaciones ejecutadas;
- riesgos visuales o de compatibilidad pendientes.

## No hacer

- No tratar un smell como arquitectura objetivo.
- No meter reglas de negocio dentro del template JSON.
- No cambiar nombres, orden o formato de columnas sin evidencia y aprobación.
- No reemplazar streaming por `writeBuffer` para simplificar si el reporte puede ser grande.
- No agregar `exceljs` si el repo no genera documentos Excel o no migra desde una librería equivalente.
- No crear un generator genérico que reciba cualquier cosa si las capabilities tienen contratos distintos.
- No ocultar errores de generación como éxito de migración.

## Fuentes oficiales

- ExcelJS npm: https://www.npmjs.com/package/exceljs
- ExcelJS GitHub/README: https://github.com/exceljs/exceljs
