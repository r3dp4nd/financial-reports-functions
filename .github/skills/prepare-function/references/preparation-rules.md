# Reglas de preparación por Function

## Estructura

Cuando el plan requiera refactor del slice, converger a:

```text
src/functions/<adapter>.ts
→ capability/application behavior
→ infrastructure boundary cuando exista
```

Materializar únicamente carpetas/layers usadas.

## Adapter Azure

Puede contener:

- trigger registration después de la etapa correspondiente;
- adaptación de input/output;
- composition root;
- contexto runtime.

No debe absorber nueva lógica funcional.

## Contracts e infraestructura

Crear un contrato solo para aislar un boundary real necesario para migración, por ejemplo un repository/client compartido o una API de SDK que cambiará.

## Dependencias locales

Una acción local puede adaptar imports, construcción de clients o API calls después de que el target de package ya haya sido aprobado globalmente.

## Shared resources

No duplicar implementation compartida dentro de la Function. Consumir el resultado de `SR-ACTION-*` y aplicar solo la adaptación local necesaria.

## Validaciones

Usar checks selectivos que no dependan de secretos ni servicios reales. Si el repo ya tiene tests útiles pueden ejecutarse, pero no se crean nuevos.
