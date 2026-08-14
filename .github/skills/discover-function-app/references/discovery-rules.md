# Reglas de discovery

Cargar esta referencia cuando el inventario determinista no sea suficiente para clasificar una señal.

## Progressive disclosure

```text
security exclusions
→ optional Graphify/indexer with exclusions
→ inventory script
→ Function entrypoints/configuration metadata
→ direct related source only when needed
```

No construir call graphs completos.

## Graphify / project graph

Usar Graphify o un indexador de grafo solo cuando esté disponible y pueda respetar las exclusiones de seguridad.

El grafo ayuda a acelerar:

- relaciones adapter → handler/use case → repository/publisher/storage;
- fan-in/fan-out por Function, workflow, capability o shared resource;
- slices naturales: Durable workflow, Outbox, shared clients, capability;
- candidatos de criticidad inicial por conectividad, trigger externo, side effects o persistencia;
- señales de testabilidad: SDK/config global instanciado en composition root, lógica mezclada con runtime, I/O directo, tiempo/random directo.

Reglas:

- `inventory.js` sigue siendo la fuente primaria de hechos estructurados;
- el grafo es evidencia auxiliar y sus conclusiones deben quedar `INFERRED` salvo que estén confirmadas por source seguro;
- no persistir secretos, valores de configuración, CI/CD leído ni rutas excluidas;
- no volcar un call graph completo en `current-state.md`;
- registrar solo subgrafos/slices útiles para migración o analysis.

Artifacts opcionales:

- `.migration/graph/project-graph.json` para facts estructurados seguros;
- `.migration/graph/project-graph.md` para resumen humano de slices/relaciones.

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

No capturar en discovery:

- lógica de negocio paso a paso;
- full call graph;
- valores de configuración;
- inferencias de ownership definitivo;
- recomendaciones de refactor;
- compatibilidad target o acciones de migración;
- listas masivas de imports que no expliquen arquitectura, recursos o relaciones.

Regla de tamaño: preferir tablas y bullets compactos. Si una dimensión necesita demasiado detalle, documentar el resumen y dejar el detalle para `analyze-function`.

## Múltiples Function Apps

Mantener separadas sus:

- rutas raíz;
- `host.json` y package metadata segura;
- Functions;
- dependencias;
- Programming Model;
- Runtime;
- shared resources.

No fusionar apps por estar en el mismo repositorio.

## Programming Model

Ejemplos de evidencia:

- `function.json` observable → señal v3;
- registrations como `app.http`, `app.timer`, etc. → señal v4;
- ambas familias → `MIXED`;
- package major por sí solo puede apoyar una inferencia, no siempre confirma el modelo real.

Registrar `UNKNOWN` cuando no exista evidencia suficiente.

## Runtime

Usar `host.json` y metadata segura observable. No leer configuración protegida para inferir runtime.

## Durable

Detectar señales como:

- orchestration trigger;
- activity trigger;
- entity trigger;
- imports/registrations Durable.

Discovery registra rol y relaciones observables; el análisis profundo del workflow pertenece a etapas posteriores.

Si el workflow contiene nombres literales de activities/sub-orchestrators, registrarlos como relaciones observables. Si la relación depende de variables dinámicas o convenciones de naming, marcarla `INFERRED` o dejarla en unknowns.

## Configuración

Registrar únicamente nombres de claves referenciadas, nunca valores.

Ejemplo:

```text
COSMOS_CONNECTION
SERVICE_BUS_CONNECTION
```

## Arquitectura observable

Describir sin puntuar:

- entrypoints;
- ubicación de lógica funcional;
- adapters o composition roots existentes;
- módulos/capabilities observables;
- infraestructura compartida observable;
- acoplamiento directo al runtime cuando sea evidente.

No comparar todavía contra arquitectura target.

Cuando sea útil, incluir un diagrama Mermaid `flowchart` con nodos principales: triggers, Functions, orchestrator/activities, capabilities, shared resources y external resources candidatos. Usar enlaces sólidos solo para relaciones `CONFIRMED`; usar enlaces punteados para relaciones `INFERRED`.

## Shared resource candidates

Una señal candidata requiere más que el mismo SDK. Buscar identidad/reuse observable, por ejemplo:

- mismo módulo de cliente/repository importado por varias Functions;
- misma implementación concreta compartida;
- mismo recurso/configuration key usado por varios consumidores.

En discovery siguen siendo candidatos, no ownership definitivo.

## Evidence status

Aplicar `../_shared/evidence-policy.md`.

No convertir una convención de naming en hecho confirmado sin evidencia adicional.
