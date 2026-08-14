# Reglas de discovery

Este archivo es un índice corto. Cargar el archivo específico según la duda concreta que tengas, en vez de cargar todo.

| Necesito... | Cargar |
|---|---|
| Usar Graphify / decidir qué modo de consulta usar | `references/graphify-usage.md` |
| Documentar Arquitectura observable / generar diagramas (incluyendo repos legacy sin separación clara) | `references/architecture-diagrams.md` |
| Clasificar Programming Model, Runtime, Durable, Configuración o shared resource candidates ambiguos | `references/ambiguous-signals.md` |

## Progressive disclosure

```text
security exclusions
→ optional Graphify/indexer with exclusions
→ inventory script
→ Function entrypoints/configuration metadata
→ direct related source only when needed
```

No construir call graphs completos.

## Profundidad esperada

Discovery debe maximizar información segura y útil como punto de partida de migración, pero mantenerla compacta.

Capturar cuando exista evidencia directa:

- metadatos de plataforma: `host.json`, `extensionBundle`, Node, Programming Model, Durable y packages;
- metadatos de triggers/bindings: tipo, nombre de Function, archivo, route/methods/schedule/topic/queue/container cuando sean literales o nombres de settings;
- composition roots: qué adapters registran Functions y qué handlers/use cases/repositories/publishers/storage adapters componen;
- capabilities y módulos por ruta/import directo;
- nombres de configuration keys y archivos consumidores;
- recursos compartidos candidatos con paths/consumidores observables;
- relaciones entre Functions solo cuando aparezcan en registros, imports, clientes Durable, nombres de activities/orchestrators invocados como literales, o producers/consumers explícitos;
- criticidad inicial por Function/slice cuando surja de señales observables;
- señales iniciales de testabilidad por Function/slice, sin diseñar refactors todavía;
- comandos de validación existentes (`build`, `typecheck`, `test`, `start`) sin ejecutarlos salvo que el workflow lo pida;
- diagrama Mermaid compacto de arquitectura actual cuando las relaciones principales sean suficientes.

Revelar la **ausencia** de estructura, tests o separación de responsabilidades es tan valioso como documentar una estructura existente. Un repositorio legacy o con mala arquitectura no es un fallo de discovery: es evidencia crítica que debe capturarse con el mismo nivel de detalle que un repositorio bien organizado. Ver `references/architecture-diagrams.md` para cómo diagramar ese caso.

No capturar en discovery:

- lógica de negocio paso a paso;
- full call graph;
- valores de configuración;
- inferencias de ownership definitivo;
- recomendaciones de refactor;
- compatibilidad target o acciones de migración;
- listas masivas de imports que no expliquen arquitectura, recursos o relaciones.

Regla de tamaño: preferir tablas y bullets compactos. Si una dimensión necesita demasiado detalle, documentar el resumen y dejar el detalle para `analyze-function`.
