# Reglas de planning

## Scope

`requestedScope` representa lo solicitado inicialmente.

`effectiveScope` incluye todo lo que debe migrarse coordinadamente para completar el target de forma coherente, por ejemplo participantes de un workflow Durable o consumidores afectados por un shared resource modificado.

Registrar Functions afectadas fuera del requested scope.

## Shared resources primero

Para cada recurso confirmado:

1. identificar owner;
2. identificar consumidores;
3. crear una única acción propietaria;
4. hacer depender adaptaciones consumidoras de esa acción cuando corresponda.

## Orden conceptual

```text
shared/global prerequisites
→ preparation global
→ preparation local
→ Programming Model migration cuando aplique
→ Durable migration cuando aplique
→ verification global
```

El plan puede ajustar el orden por dependencias reales.

## Arquitectura

Para todo slice que vaya a refactorizarse, planificar la convergencia mínima a la arquitectura objetivo. No crear carpetas/layers que no tengan uso real.

## V4 existente

Si una Function ya está en Programming Model v4, no crear acción de migración de modelo. Planificar solo las dimensiones faltantes.

## Unknowns

Una incertidumbre que impide definir resultado verificable debe bloquear o requerir revisión; no fabricar una acción vaga para ocultarla.
