# Architecture Policy

## Objetivo

Asegurar que el código modificado durante la migración converja de forma incremental hacia la arquitectura objetivo aprobada para el toolkit, basada en la estructura y principios usados en `financial-reports-functions`.

## Regla principal

La arquitectura objetivo **sí es un requisito del código que se refactoriza o reubica durante la migración**, pero no autoriza una reescritura completa del repositorio.

Aplicar:

```text
migrar el slice necesario
→ separar runtime de lógica funcional
→ materializar solo límites reales
→ evitar abstracciones y carpetas vacías
```

## Estructura objetivo

Cuando se toque el slice correspondiente:

- adapters/composition roots de Azure Functions en `src/functions/`;
- lógica organizada por capability o flujo de negocio;
- infraestructura aislada detrás de límites reales cuando el SDK o recurso externo lo requiera;
- recursos compartidos con ownership único y consumidores explícitos.

Consultar [references/target-architecture.md](references/target-architecture.md) para ejemplos y criterios.

## Dirección de dependencias

Preferir:

```text
Azure Function adapter
→ application/capability behavior
→ domain/contracts cuando aporten valor
→ infrastructure implementation
```

La lógica funcional no debe depender innecesariamente del runtime Azure.

## Materialización incremental

No crear capas por plantilla.

Crear solo lo necesario para el slice migrado. Si una capability no necesita `domain/`, `infrastructure/` o contratos propios, no crearlos.

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
