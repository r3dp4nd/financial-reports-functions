# Uso de Graphify / project graph

Cargar esta referencia solo cuando Graphify o un indexador de grafo equivalente esté disponible y se necesite acelerar relaciones, slices o señales iniciales.

## Cuándo usarlo

Usar Graphify o un indexador de grafo solo cuando esté disponible y pueda respetar las exclusiones de seguridad.

El grafo ayuda a acelerar:

- relaciones adapter → handler/use case → repository/publisher/storage;
- fan-in/fan-out por Function, workflow, capability o shared resource;
- slices naturales: Durable workflow, Outbox, shared clients, capability;
- candidatos de criticidad inicial por conectividad, trigger externo, side effects o persistencia;
- señales de testabilidad: SDK/config global instanciado en composition root, lógica mezclada con runtime, I/O directo, tiempo/random directo.

## Reglas

- `inventory.js` sigue siendo la fuente primaria de hechos estructurados;
- el grafo es evidencia auxiliar y sus conclusiones deben quedar `INFERRED` salvo que estén confirmadas por source seguro;
- no persistir secretos, valores de configuración, CI/CD leído ni rutas excluidas;
- no volcar un call graph completo en `current-state.md`;
- registrar solo subgrafos/slices útiles para migración o analysis.

## Cómo consultar (elegir modo por tipo de señal)

Antes de una consulta nueva, verificar primero si el resumen de grafo ya disponible en contexto (god nodes, communities, corpus check) resuelve la pregunta sin costo adicional.

| Señal a acelerar | Modo recomendado | Ejemplo genérico |
|---|---|---|
| Relación adapter → handler → use-case → repository de una capability/Function específica | `explain` sobre el nodo de esa capability/handler | `graphify_query(explain, "<NombreDeCapabilityOHandler>")` |
| Fan-in/fan-out de un shared resource (cuántas capabilities/Functions usan un cliente o módulo compartido) | `explain` sobre el nodo del módulo compartido | `graphify_query(explain, "<NombreDelModuloCompartido>")` |
| Conexión/dependencia entre dos nodos conocidos (ej. Function origen y Function/orchestrator destino) | `path` con origen y destino explícitos | `graphify_query(path, "<NombreNodoOrigen>", "<NombreNodoDestino>")` |
| Pregunta exploratoria amplia sin nodo conocido de antemano | `query`, aceptando que puede requerir un refinamiento adicional | `graphify_query(query, "<pregunta exploratoria sobre relaciones/arquitectura observable>")` |
| Confirmar organización/arquitectura global | preferir el resumen de grafo ya presente en contexto antes de cualquier query nueva | usar directamente el resumen existente (god nodes, communities) |

Los nombres de nodo (capability, handler, módulo compartido) deben tomarse de la evidencia real de `inventory.js` o del propio grafo del repositorio bajo análisis; nunca fijar en esta referencia nombres de un repositorio concreto.

Límite sugerido: no más de 2-3 queries de Graphify por ejecución de discovery. Si se necesitan más, es señal de que el inventario determinista o el source directo deberían resolver la pregunta en su lugar.

## Artifacts opcionales

- `.migration/00-before/graph/project-graph.json` para facts estructurados seguros;
- `.migration/00-before/graph/project-graph.md` para resumen humano de slices/relaciones.
