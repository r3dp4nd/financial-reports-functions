# Recursos compartidos

## Objetivo

Presentar los recursos compartidos confirmados que participan en la migración, su ownership, consumidores y acciones
asociadas.

Fuente estructurada:

`.migration/resources/shared-resources.json`

Este documento se genera únicamente cuando existan recursos compartidos confirmados.

## Resumen

| Recurso | Tipo | Ownership | Consumidores | Estado |
|---------|------|-----------|--------------|--------|
|         |      |           |              |        |

## Recursos confirmados

### <Resource ID>

Tipo:

`<tipo>`

Ownership:

`<owner>`

Consumidores:

- `<FunctionName>`

Evidencia:

-

Acción propietaria:

`<SR-ACTION-*>`

Dependencias:

-

Cada recurso debe tener una única acción propietaria.

Las Functions consumidoras deben depender de esa acción mediante `dependsOn` cuando corresponda.

## Candidatos no confirmados

| Candidato | Tipo | Evidencia | Estado |
|-----------|------|-----------|--------|
|           |      |           |        |

Los candidatos no deben recibir ownership definitivo ni acciones `SR-ACTION-*`
hasta disponer de evidencia suficiente.

## Riesgos

-

## Incertidumbres

-

## Revisión requerida

-

Registrar únicamente decisiones de ownership o consolidación que requieran intervención humana.
