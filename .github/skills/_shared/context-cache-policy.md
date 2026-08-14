# Context Cache Policy

## Objetivo

Evitar que múltiples skills paguen el costo de releer el mismo archivo o repetir la misma consulta (Graphify u otra)
durante una misma migración. Cualquier hecho ya extraído y verificado debe quedar indexado en un formato compacto
que un agente pueda releer en lugar de volver a abrir el archivo original o repetir la consulta.

Esta cache es una optimización de rendimiento, no una fuente de evidencia oficial. La evidencia oficial sigue
viviendo en los artifacts de fase (`00-before/`…`50-verification/`) definidos en
[references/artifact-layout.md](references/artifact-layout.md). Si la cache y un artifact de fase se contradicen,
el artifact de fase gana siempre.

## Cuándo cachear

Cachear cuando el costo de obtener el hecho fue no trivial y es razonablemente probable que otro skill (o el mismo,
en otra ejecución) necesite el mismo hecho:

- lectura completa de un archivo de source para extraer imports, exports, dependencias internas, o el fragmento de
  código central citado en un artifact;
- una consulta a Graphify (`explain`/`path`/`query`) ya resuelta y verificada;
- un resumen de un archivo grande (`largeFiles` de discovery) que ya fue leído para analysis.

No cachear:

- lecturas triviales de una línea o metadata ya disponible en `inventory.json`;
- contenido protegido según `security-policy.md` (nunca, bajo ninguna circunstancia);
- valores de configuración, secretos o cualquier dato prohibido por `evidence-policy.md`.

## Estructura

```text
.migration/
└── _cache/
    ├── index.json
    └── entries/
        └── <slug>.json
```

`_cache/` vive fuera de las fases `00-before`…`50-verification`: es regenerable y descartable sin pérdida de
evidencia oficial. Puede borrarse por completo y una nueva ejecución la reconstruye según necesidad.

## `index.json`

Índice liviano que se consulta primero, antes de decidir si vale la pena abrir un `entryFile` completo o repetir una
lectura/consulta.

```json
{
  "schemaVersion": 1,
  "entries": {
    "<cacheKey>": {
      "kind": "FILE_EXTRACT | GRAPHIFY_QUERY",
      "entryFile": "entries/<slug>.json",
      "contentHash": "sha256:<hash-del-archivo-o-de-la-respuesta>",
      "sourceRef": "<ruta-de-archivo-o-modo:target-de-graphify>",
      "producedBy": "<skill-que-lo-generó>",
      "producedAt": "<ISO-8601>",
      "repoCommit": "<hash-de-commit-si-aplica>",
      "summary": "<resumen de una línea del hecho cacheado>"
    }
  }
}
```

`cacheKey` debe ser determinista y derivarse de la fuente, por ejemplo:

- `file:<ruta-relativa>` para extractos de archivo;
- `graphify:<mode>:<target>` o `graphify:<mode>:<target>:<targetB>` para consultas de Graphify.

`summary` existe para que un agente decida si necesita abrir `entryFile` sin cargarlo primero.

## `entries/<slug>.json`

Contiene el hecho extraído, no el archivo crudo. Para un archivo de source:

```json
{
  "path": "src/RequestReport/handler.ts",
  "contentHash": "sha256:...",
  "evidenceStatus": "CONFIRMED",
  "imports": ["../application/request-report.use-case", "@azure/functions"],
  "exports": ["default"],
  "coreFragment": "<fragmento de código literal citado en el artifact que originó esta lectura>",
  "notes": "adapter HTTP trigger; delega a request-report.use-case"
}
```

Para una consulta de Graphify:

```json
{
  "mode": "explain",
  "target": "ReportCosmosDbService",
  "evidenceStatus": "INFERRED",
  "edges": [
    { "type": "imports", "from": "report-generation.repository.ts", "to": "ReportCosmosDbService" }
  ],
  "verifiedAgainstSource": false
}
```

El `slug` del nombre de archivo debe derivarse determinísticamente de `cacheKey` (por ejemplo, sustituyendo `/` y `:`
por `__`), para que dos ejecuciones que cacheen el mismo hecho produzcan el mismo nombre de archivo.

## Flujo antes de leer/consultar

```text
1. ¿Existe `index.json`? Si no, crearlo vacío antes de la primera escritura.
2. Buscar `cacheKey` correspondiente en `index.json`.
3. Si existe:
   a. Si es un archivo de source: comparar `contentHash` contra el hash actual del archivo.
      - si coincide → reusar `entryFile` sin volver a leer el archivo;
      - si no coincide → el archivo cambió desde que se cacheó; releer y regenerar la entrada.
   b. Si es una consulta de Graphify: comparar `repoCommit` contra el commit actual del repositorio.
      - si coincide → reusar `entryFile` sin repetir la consulta;
      - si no coincide → el repositorio cambió; repetir la consulta si la relación sigue siendo necesaria.
4. Si no existe o quedó invalidada, leer/consultar normalmente, extraer solo lo necesario y escribir la entrada +
   actualizar `index.json`.
```

Este flujo evita que `analyze-function` relea un archivo que `discover-function-app` ya leyó para el mismo Function,
o que `plan-function-migration` repita una consulta de Graphify que `analyze-function` ya verificó.

## Relación con `evidence-policy.md`

El `evidenceStatus` de una entrada de cache sigue el mismo vocabulario (`CONFIRMED`/`INFERRED`/`UNKNOWN`) y las
mismas reglas de degradación. Una entrada cacheada como `INFERRED` no se convierte en `CONFIRMED` por estar cacheada;
solo cambia de estado cuando se verifica contra el source real, igual que cualquier otra evidencia.

## Relación con `graphify-usage.md`

La regla "reusar evidencia ya persistida antes de consultar Graphify" de
[references/graphify-usage.md](references/graphify-usage.md) usa esta cache como primer nivel de búsqueda, antes
incluso de revisar los artifacts de fase (`project-graph.json`, `analysis.json.relationships`): la cache es más
granular y más rápida de indexar que releer un artifact completo.

## No hacer

- cachear contenido protegido;
- cachear valores de configuración o secretos;
- tratar una entrada de cache como sustituto de un artifact de fase;
- dejar `index.json` desincronizado de `entries/` (toda entrada referenciada debe existir físicamente);
- mutar una entrada existente sin actualizar `contentHash`/`repoCommit` para reflejar por qué cambió.
