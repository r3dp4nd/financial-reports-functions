# Persistencia Cosmos DB y MongoDB

## Propósito

Detectar smells en acceso a datos y guiar cómo aclararlos para volver el flujo testeable cuando la Function App usa Azure Cosmos DB NoSQL, Azure Cosmos DB for MongoDB, MongoDB driver, Mongoose o utilidades legacy de persistencia.

Esta referencia sustenta `assess-function-app`, `analyze-function`, `refactor-function`, `migrate-shared-component` y `test-function` cuando detecten `@azure/cosmos`, `CosmosClient`, `container.items.query`, `mongodb`, `MongoClient`, `mongoose`, `documentdb`, connection strings de Cosmos/Mongo o servicios de query compartidos.

## Diferenciar antes de cambiar

No trates Cosmos SQL API, Cosmos API for MongoDB y MongoDB nativo como equivalentes.

Clasifica primero:

```text
cliente usado
API real del servicio
paquete npm
tipo de query
modelo de paginación/cursor
partition key o shard key
settings/env usados
consumidores
contrato de salida
```

Señales comunes:

- Cosmos NoSQL: `@azure/cosmos`, `CosmosClient`, `database.container`, `container.items.query`, SQL `SELECT * FROM c`.
- Cosmos API for MongoDB o MongoDB: `mongodb`, `MongoClient`, `collection.find`, `aggregate`, cursor, `mongoose`.
- Legacy Cosmos: `documentdb` o wrappers propios antiguos.

## Smells a identificar

Registra estos smells como hallazgos, no como patrones aceptados:

- servicio de persistencia que arma filtros, ejecuta query, mapea negocio, escribe archivo temporal y decide reporte;
- query string concatenada con parámetros opcionales;
- `IN` construido manualmente como texto;
- retorno dentro del primer ciclo de paginación cuando el contrato parece requerir todas las páginas;
- callbacks de `fs.writeFile` o `fs.appendFile` sin esperar resultado;
- acumulación de páginas en arrays intermedios antes de escribir salida grande;
- mapeo de documento con reglas de negocio extensas dentro del repository/query service;
- normalización de fechas duplicada o dispersa;
- logs con datos de negocio o trazas no sanitizadas;
- cliente Cosmos/Mongo creado o configurado de forma opaca en utilidades globales.

Para cada smell, documenta:

```text
evidencia
impacto en testabilidad
riesgo de cambiarlo
corte incremental sugerido
validación mínima
```

## Principio

La persistencia debe quedar detrás de un repositorio o reader con contrato claro. El mapeo de negocio y la generación de reportes no deberían vivir dentro del cliente de base de datos.

```text
caso de uso
   ↓
puerto repository/query reader
   ↓
cosmos-<capability>.repository.ts
   ↓
mapper de documento a modelo/row
   ↓
salida controlada: iterable | page | NDJSON | stream
```

No mezcles en una misma pasada:

- cambio de SDK;
- cambio de query;
- cambio de paginación;
- cambio de mapeo funcional;
- cambio de salida temporal/stream;
- cambio de generación Excel.

Esta referencia no define una arquitectura final obligatoria. Define cómo reconocer smells y ordenar el acceso a datos para poder probar query, paginación, mapeo y reglas sin depender de Cosmos/Mongo reales.

## Orden para volverlo testeable

Cuando encuentres un servicio grande de persistencia o reportes, no lo reescribas completo. Aclara los smells en este orden, aplicando solo los cortes que reduzcan acoplamiento real:

1. registra el contrato observable: filtros, query, paginación, shape de documento y shape de salida;
2. encapsula el armado de filtros/query para probar combinaciones sin llamar a la base;
3. separa el mapper de documento hacia DTO/modelo/row;
4. encapsula paginación o cursor detrás de una función iterable/page reader testeable con dobles;
5. separa escritura temporal/NDJSON si el flujo la usa como contrato hacia otra etapa;
6. deja el cliente `@azure/cosmos`, `mongodb` o `mongoose` concentrado en infraestructura;
7. introduce un puerto repository/query reader solo cuando el caso de uso necesite aislar persistencia;
8. agrega tests de query builder, mapper, paginación y escritura temporal con datos pequeños.

No cambies semántica de filtros ni arregles bugs sospechosos sin evidencia y aprobación. Si un comportamiento parece incorrecto pero puede ser legacy, protégelo con caracterización o regístralo como bloqueo/deuda.

## Inventario mínimo

Antes de refactorizar, registra:

```text
container/collection
partition key/shard key conocida
query base
parámetros requeridos
parámetros opcionales
ordenamiento
paginación/cursor
tamaño de página
continuation token o cursor mode
campos proyectados
shape del documento
shape de salida
side effects: archivo temporal | stream | evento | log
errores actuales
```

No copies connection strings ni valores de settings.

## Queries dinámicas

Si detectas strings concatenados para armar filtros, no los corrijas silenciosamente durante una migración. Registra el riesgo y, si está dentro del alcance, evoluciona hacia parámetros.

Riesgos a identificar:

- inyección o filtros mal escapados;
- `IN` construido como string;
- números interpolados sin validación;
- fechas transformadas en varios lugares;
- query base compartida por reportes con filtros especiales;
- comportamiento dependiente de mayúsculas, enums o códigos legacy.

Para Cosmos NoSQL, prefiere `querySpec` con `parameters` cuando sea viable. Para MongoDB, prefiere filtros como objetos tipados y operators explícitos.

## Paginación, cursor y memoria

Cosmos NoSQL:

- usa `queryIterator.fetchNext()` hasta consumir resultados cuando el comportamiento esperado requiere todas las páginas;
- registra `maxItemCount`;
- revisa continuation token si el flujo debe reanudarse;
- no asumas que una sola página contiene todo;
- si el código retorna dentro del primer ciclo de paginación, registra si eso es comportamiento intencional, bug legacy o bloqueo.

MongoDB driver:

- `find()` y `aggregate()` devuelven cursor;
- evita `toArray()` para resultados grandes;
- usa iteración async o stream cuando el volumen lo requiera;
- respeta backpressure si conectas cursor con escritura de archivo/stream.

## Salida temporal o NDJSON

Cuando el flujo consulta datos y escribe un archivo temporal para otra etapa:

- define quién crea, consume y borra el archivo;
- evita callbacks de filesystem sin esperar si el siguiente paso depende del archivo;
- usa escritura secuencial o stream con manejo de errores;
- no acumules todas las filas en memoria si el reporte puede ser grande;
- documenta si el archivo es NDJSON/JSON lines, CSV u otro contrato.

Este patrón puede conectarse con `exceljs-document-generation.md` cuando el archivo temporal alimenta un generator ExcelJS.

## Mapeo y reglas

Separa responsabilidades:

- repository/query reader: consulta y paginación;
- mapper de documento: transforma shape técnico a modelo interno;
- caso de uso: decide filtros, tipo de reporte y reglas de negocio;
- document generator: genera salida Excel/CSV si aplica.

Si el servicio de persistencia contiene cientos de reglas de reporte, carga `capability-slicing.md` y genera un mapa antes de mover.

## Cortes posibles

```text
domain/ports/<capability>.repository.ts
application/queries/<capability>.query.ts
application/use-cases/<action>.use-case.ts
infrastructure/persistence/cosmos-<capability>.repository.ts
infrastructure/persistence/mongo-<capability>.repository.ts
infrastructure/persistence/<capability>.document.mapper.ts
```

Usa `cosmos-*` cuando el cliente real sea `@azure/cosmos`. Usa `mongo-*` cuando el cliente real sea MongoDB driver, Mongoose o Cosmos API for MongoDB mediante protocolo Mongo.

## Tests útiles

Prueba comportamiento observable:

- armado de query/filtros con parámetros requeridos y opcionales;
- mapeo de documento a salida;
- paginación de múltiples páginas o cursor con varios batches;
- escritura NDJSON/archivo temporal;
- manejo de documento incompleto;
- errores de query y escritura.

Evita conectar a Cosmos/Mongo real en unit tests. Usa fakes de repository o dobles de cursor/query iterator. Las pruebas de integración deben quedar explícitas y aisladas.

## Evidencia

Registra en `.migration/` cuando aplique:

- API detectada: Cosmos NoSQL | Cosmos Mongo API | MongoDB;
- paquete y versión;
- query/cursor observado;
- settings por nombre;
- riesgos de query dinámica;
- comportamiento de paginación;
- contrato de salida;
- responsabilidades a separar;
- validaciones ejecutadas.

## No hacer

- No tratar un smell como arquitectura objetivo.
- No migrar de Cosmos SQL API a Mongo API ni al revés como parte de una refactorización local.
- No reemplazar `@azure/cosmos` por `mongodb` solo porque el código se parezca a Mongo.
- No cambiar semántica de filtros mientras modernizas SDK o estructura.
- No esconder riesgos de inyección/query dinámica como deuda menor si afectan datos.
- No reescribir todo el servicio de reportes en una sola pasada.
- No introducir repositorios genéricos que oculten queries específicas del negocio.

## Fuentes oficiales

- Azure Cosmos DB JavaScript SDK: https://learn.microsoft.com/en-us/javascript/api/overview/azure/cosmos-readme
- Azure Cosmos DB query pagination: https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/query/pagination
- Azure Cosmos DB for MongoDB: https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/
- Cosmos DB for MongoDB with JavaScript: https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/how-to-javascript-get-started
- MongoDB Node.js driver cursors: https://www.mongodb.com/docs/drivers/node/current/crud/query/cursor/
