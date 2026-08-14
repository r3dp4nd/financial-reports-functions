# Uso de Graphify / project graph

Referencia transversal: cualquier skill que necesite relaciones entre módulos, slices, fan-in/fan-out o señales de
dependencia puede cargarla, no solo `discover-function-app`.

Cargar esta referencia solo cuando Graphify o un indexador de grafo equivalente esté disponible y se necesite acelerar relaciones, slices o señales iniciales.

## Reusar evidencia ya persistida antes de consultar Graphify

Antes de ejecutar cualquier `graphify_query`, revisar si la relación que se necesita ya fue verificada y persistida
por una ejecución previa en `.migration/`:

1. `.migration/00-before/graph/project-graph.json|md` — relaciones a nivel repositorio ya inferidas/confirmadas por `discover-function-app`;
2. `.migration/00-before/functions/<FunctionName>.md` — relaciones por Function ya verificadas con `explain` durante discovery;
3. `.migration/20-analysis/functions/<FunctionName>/analysis.json` (campo `relationships`) o `.migration/20-analysis/slices/<SliceName>/analysis.json` — relaciones verificadas por `analyze-function` para ese slice, incluyendo `affectedFunctionsOutsideScope`;
4. artifacts de ejecución ya emitidos (`programming-model-v4.json`, `durable-v4.json`) cuando se necesite confirmar qué se migró en una etapa previa.

Si la relación buscada ya existe en alguno de estos artifacts con evidence status `CONFIRMED` o `INFERRED` verificable,
reusarla directamente citando la fuente en lugar de repetir la consulta a Graphify. Solo consultar Graphify cuando el
artifact previo no cubra la relación necesaria, o cuando el estado del repositorio cambió desde que se generó (por
ejemplo nuevo commit) y la evidencia previa ya no es confiable.

Esta regla evita que cada skill pague el costo de una consulta que otro skill ya resolvió y dejó documentada.

Además de los artifacts de fase listados arriba, revisar primero `.migration/_cache/index.json` — ver
[`../context-cache-policy.md`](../context-cache-policy.md) — antes de repetir una consulta de Graphify: es más
granular y más rápido de indexar que releer un artifact de fase completo, y cachea también consultas puntuales que
no necesariamente llegaron a citarse en un artifact de fase.

## Cuándo usarlo

Usar Graphify o un indexador de grafo solo cuando esté disponible y pueda respetar las exclusiones de seguridad.

El grafo ayuda a acelerar:

- relaciones adapter → handler/use case → repository/publisher/storage;
- fan-in/fan-out por Function, workflow, capability o shared resource;
- slices naturales: Durable workflow, Outbox, shared clients, capability;
- candidatos de criticidad inicial por conectividad, trigger externo, side effects o persistencia;
- señales de testabilidad: SDK/config global instanciado en composition root, lógica mezclada con runtime, I/O directo, tiempo/random directo.

## Reglas base

- `inventory.js` sigue siendo la fuente primaria de hechos estructurados;
- el grafo es evidencia auxiliar y sus conclusiones deben quedar `INFERRED` salvo que estén confirmadas por source seguro;
- no persistir secretos, valores de configuración, CI/CD leído ni rutas excluidas;
- no volcar un call graph completo en `current-state.md`;
- registrar solo subgrafos/slices útiles para migración o analysis.

## Modos disponibles y cómo sacarles el jugo

Antes de una consulta nueva, verificar primero si el resumen de grafo ya disponible en contexto (god nodes, communities, corpus check) resuelve la pregunta sin costo adicional.

### 1. `explain` — primera opción por defecto

Dado el nombre exacto de un nodo (clase, función, archivo, capability), devuelve su ubicación, tipo y **todas sus conexiones directas** con el tipo de relación explícito (`imports`, `calls`, `contains`, `method`, `implements`).

Es el modo más barato y confiable: respuesta compacta, sin ruido, con edges tipados.

Usar cuando:

- ya se conoce el nombre exacto del nodo (obtenido de `inventory.js` o de un resultado previo de Graphify);
- se necesita responder "¿quién usa este módulo compartido?", "¿qué importa este archivo?", "¿qué conexiones tiene esta capability?".

```text
graphify_query(explain, "<NombreDeNodoConocido>")
```

### 2. `path` — segunda opción, requiere verificar el tipo de edge

Busca el camino más corto entre dos nodos conocidos, mostrando cada salto y el tipo de edge que lo compone.

**Advertencia basada en evidencia real**: el grafo puede mezclar edges de código (`imports`, `calls`, `contains`, `implements`) con edges de historial de versiones (por ejemplo `MODIFIES`, cuando el camino pasa por un nodo tipo commit git). Un camino que atraviesa un commit **no es una relación de arquitectura**, es solo la coincidencia de que dos archivos fueron tocados en el mismo commit.

Ejemplo genérico de lo que puede ocurrir:

```text
Camino devuelto:
  NodoA --contains--> archivoA.ts --MODIFIES--> [commit abc123] --MODIFIES--> archivoB.ts

Interpretación correcta: NO es una dependencia real entre NodoA y archivoB.
El salto MODIFIES pasa por un commit, no por una relación de código.
```

Regla de oro antes de citar un `path`:

- si **todos** los edges del camino son de tipo código (`imports`/`calls`/`contains`/`implements`) → puede citarse como relación `INFERRED` (o `CONFIRMED` si además se verifica leyendo el source);
- si **algún** edge del camino es de historial (`MODIFIES` o equivalente, asociado a un nodo tipo commit/git) → descartar esa relación, es ruido, no arquitectura.

```text
graphify_query(path, "<NombreNodoOrigen>", "<NombreNodoDestino>")
```

### 3. `query` — último recurso exploratorio

Interpreta una pregunta en lenguaje natural y devuelve una lista de nodos candidatos, **sin sintetizar una respuesta directa**.

Es el modo más caro en tokens y menos preciso de los tres. Basado en evidencia real: puede devolver decenas de nodos sueltos (mezclando código del repositorio, commits git, y en algunos casos nodos del propio toolkit si Graphify indexó `.github/skills/**` junto con el repositorio objetivo) truncados por presupuesto de tokens, sin responder la pregunta directamente.

Tratar su salida siempre como **candidatos a verificar**, nunca como respuesta final:

1. ejecutar `query` solo si no hay ningún nombre de nodo de partida (exploración pura);
2. de la lista de candidatos, identificar 1-2 nodos que parezcan relevantes para la pregunta;
3. confirmar la relación real con `explain` sobre esos nodos antes de citarla en cualquier artifact.

```text
graphify_query(query, "<pregunta exploratoria sobre relaciones/arquitectura observable>")
```

### Nota sobre indexación del propio toolkit

Si el resultado de una consulta incluye nodos con `src` bajo `.github/skills/**` (por ejemplo funciones internas de `inventory.js` u otros scripts del toolkit), son nodos del propio toolkit, no del repositorio objetivo. Ignorarlos al interpretar arquitectura del repo bajo análisis.

## Regla de verificación cruzada

Cualquier relación obtenida de Graphify (en cualquier modo) que se vaya a citar en un artifact (`current-state.md`, `analysis.md`, etc.) debe:

1. revisarse el tipo de cada edge involucrado antes de confiar en ella;
2. quedar marcada `INFERRED` por defecto;
3. pasar a `CONFIRMED` únicamente si se verifica leyendo el source real (el import/llamada es visible directamente en el archivo).

No convertir una coincidencia de grafo en un hecho confirmado sin esa verificación.

## Límite de consultas

No más de 2-3 queries de Graphify por ejecución de discovery. Este límite aplica sobre todo al modo `query` (el más caro y menos preciso). El modo `explain` puede usarse de forma más libre cuando hay varios nodos concretos que verificar, ya que es barato y compacto — el límite busca evitar exploración indiscriminada, no penalizar verificaciones puntuales y baratas.

Si se necesitan más de 2-3 consultas exploratorias, es señal de que el inventario determinista o la lectura directa de source deberían resolver la pregunta en su lugar.

## Cobertura pobre del grafo (comunidades delgadas, nodos aislados)

No todo repositorio produce un grafo útil. Si tras 1-2 consultas iniciales el grafo devuelve comunidades delgadas
(pocos edges reales de código), nodos aislados sin conexiones relevantes, o resultados dominados por edges de
historial (`MODIFIES`) en lugar de edges de código, esto es evidencia de que el grafo no cubre bien este repositorio
concreto — no un fallo de la consulta.

En ese caso:

1. documentar la limitación explícitamente (ej. "Graphify usado; cobertura pobre para este repo — comunidades
   delgadas, sin relaciones de código útiles más allá de lo ya confirmado por lectura directa");
2. proceder con lectura directa de source como fuente principal, sin insistir en más consultas al grafo para
   compensar la cobertura pobre;
3. no penalizar al ejecutor por "no usar más el grafo" cuando ya se determinó que no aporta valor adicional — el
   objetivo es evidencia útil, no maximizar el uso de una herramienta.

## Uso sistemático de `explain` por Function (catálogo por Function)

Cuando se documente el catálogo por Function (`.migration/00-before/functions/<FunctionName>.md`), no limitar el uso de `explain` a 2-3 consultas genéricas por todo el repositorio. En su lugar, para cada Function que tenga imports internos relevantes (detectables directamente en `inventory.js`/lectura de source — módulos propios del repositorio, no paquetes de terceros), ejecutar `explain` sobre esos módulos concretos (ej. `ReportCosmosDbService`, `ExcelUtil`, `ReportServiceBusService`) antes de redactar las secciones "Dependencias" y "Relaciones" de esa Function.

Esto no viola el límite de la sección anterior: ese límite acota exploración indiscriminada (sobre todo del modo `query`), no verificaciones puntuales y baratas de `explain` sobre nombres ya conocidos por Function. El objetivo es que el catálogo por Function tenga el mismo nivel de detalle verificable que `current-state.md`, en vez de prosa genérica como "ninguna directa de `helper/` salvo tipos".

Toda relación citada de esta forma sigue las mismas reglas de verificación cruzada ya descritas: `INFERRED` por defecto, `CONFIRMED` solo tras verificar contra el source real.

Los nombres de nodo (capability, handler, módulo compartido) deben tomarse de la evidencia real de `inventory.js` o del propio grafo del repositorio bajo análisis; nunca fijar en esta referencia nombres de un repositorio concreto.

## Artifacts opcionales

- `.migration/00-before/graph/project-graph.json` para facts estructurados seguros;
- `.migration/00-before/graph/project-graph.md` para resumen humano de slices/relaciones.
