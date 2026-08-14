# Architecture Policy

## Objetivo

Asegurar que el código modificado durante la migración converja de forma incremental hacia una arquitectura objetivo aprobada, expresada como principios transferibles y verificables.

## Regla principal

La arquitectura objetivo **sí es un requisito del código que se refactoriza o reubica durante la migración**, pero no autoriza una reescritura completa del repositorio.

Aplicar:

```text
migrar el slice necesario
→ separar runtime de lógica funcional
→ materializar solo límites reales
→ preservar comportamiento descubierto
→ evitar abstracciones y carpetas vacías
```

## Estructura objetivo

Cuando se toque el slice correspondiente:

- adapters/composition roots de Azure Functions delgados y separados de la lógica funcional;
- handlers testeables que traduzcan runtime/contrato hacia comandos, queries o inputs internos;
- lógica organizada por capability, workflow o flujo de negocio observable;
- use cases para orquestar intención funcional cuando exista coordinación o regla de aplicación;
- domain para invariantes/reglas que tengan comportamiento propio;
- infraestructura aislada detrás de límites reales cuando el SDK, recurso externo, storage, mensajería o persistencia lo requiera;
- recursos compartidos con ownership único y consumidores explícitos.

Consultar [references/target-architecture.md](references/target-architecture.md) para ejemplos y criterios.

## Dirección de dependencias

Preferir:

```text
Azure Function adapter
→ handler testeable
→ application/use case o capability behavior
→ domain/contracts cuando aporten valor real
→ infrastructure implementation
```

La lógica funcional no debe depender innecesariamente del runtime Azure.

## Preservación funcional

La refactorización cambia estructura interna, no comportamiento.

Mantener salvo cambio explícitamente aprobado:

- triggers, rutas, métodos, schedules, bindings y nombres públicos;
- queues, topics, subscriptions, containers, blobs y claves de configuración observables;
- payloads, status codes, códigos de error y estados de dominio;
- idempotencia, retries, ordering, fan-out/fan-in, failure handling y concurrencia;
- efectos persistentes, mensajes publicados y archivos generados.

No optimizar reglas de negocio, flujos o contratos durante una migración/refactorización estructural.

## Materialización incremental

No crear capas por plantilla.

Crear solo lo necesario para el slice migrado. Si una capability no necesita `domain/`, `infrastructure/` o contratos propios, no crearlos.

## Quality gates

Planning debe convertir la arquitectura aplicable en acciones verificables. Execution debe implementar solo esas acciones. Verification debe fallar cuando:

- una acción estructural aprobada no se completó;
- el código nuevo mezcla runtime Azure con lógica funcional sin justificación;
- se introdujeron folders, interfaces o capas sin responsabilidad real;
- se modificó comportamiento descubierto sin aprobación explícita.

## Recursos compartidos

Mismo SDK no significa mismo recurso.

Un shared resource confirmado debe tener:

- identidad;
- owner;
- consumidores;
- una única acción propietaria cuando se modifique.

Usar `src/shared/` solo si no existe ownership más natural dentro de una capability/workflow.

## Legacy

No refactorizar un módulo completo solo porque el slice lo utiliza. Si hace falta aislarlo, utilizar el boundary mínimo aprobado y dejar la modernización restante fuera del scope.

## Verification

Verificar únicamente los requisitos estructurales aprobados por planning y aplicables al código modificado. No puntuar "clean architecture" ni exigir cantidad fija de carpetas/interfaces.
