# Evals — Prepare Function

## Objetivo

Validar que la Function sea refactorizada hacia la arquitectura objetivo, con testabilidad y comportamiento protegido,
sin sobrearquitectura ni duplicación de shared resources.

## Caso 1 — Function ya correcta

### Entrada

Function con:

- adapter delgado;
- capability separada;
- infraestructura aislada;
- tests suficientes.

### Esperado

Debe poder producir:

`NOT_APPLICABLE`

o realizar cambios mínimos.

No refactorizar por uniformidad.

## Caso 2 — Lógica en adapter

### Entrada

Azure entrypoint contiene reglas funcionales.

### Esperado

Debe:

- extraer comportamiento hacia capability;
- dejar adapter delgado;
- preservar comportamiento;
- agregar tests.

## Caso 3 — Cosmos dentro del service

### Entrada

Service construye `CosmosClient`.

### Esperado

Cuando el plan lo requiera debe:

- aislar infraestructura;
- introducir contrato funcional apropiado;
- mover implementación a infraestructura;
- permitir unit tests.

## Caso 4 — Interfaz innecesaria

### Entrada

Function simple con función pura sin infraestructura.

### Esperado

No debe crear interfaces ni layers artificiales.

## Caso 5 — Shared repository ya preparado

### Entrada

Function depende de `SR-ACTION-001`, completada globalmente.

### Esperado

Debe:

- consumir el resultado;
- no crear otro repository equivalente.

## Caso 6 — Shared action pendiente

### Entrada

Plan declara dependencia obligatoria no completada.

### Esperado

Resultado:

`BLOCKED`

No crear solución local duplicada.

## Caso 7 — Ownership

### Entrada

Repository es propiedad de la capability.

### Esperado

Debe mantenerlo dentro de la capability.

No moverlo a `shared` arbitrariamente.

## Caso 8 — process.env

### Entrada

Lógica funcional accede directamente a configuración.

### Esperado

Si el plan lo exige para testabilidad/arquitectura:

- aislar configuración;
- pasarla desde composition;
- no leer valores sensibles.

## Caso 9 — Refactor SIGNIFICANT aprobado

### Entrada

Plan explícitamente aprueba un refactor significativo.

### Esperado

Puede ejecutarlo dentro del alcance definido.

## Caso 10 — Refactor SIGNIFICANT no aprobado

### Esperado

Resultado:

`REQUIRES_REVIEW`

No ampliar el alcance.

## Caso 11 — Characterization

### Entrada

Legacy code difícil de separar sin riesgo.

### Esperado

Debe poder agregar characterization tests para fijar comportamiento antes de extraer.

## Caso 12 — Unit tests

### Entrada

Lógica ya aislada.

### Esperado

Preferir tests unitarios sobre capability.

No depender del Azure Functions Host.

## Caso 13 — Durable Activity

### Entrada

Activity con lógica e infraestructura.

### Esperado

Puede refactorizar internamente hacia arquitectura objetivo sin cambiar semántica del workflow.

No migrar todavía Durable.

## Caso 14 — Adapter v4 existente

### Entrada

Function ya v4.

### Esperado

Debe preservar registro v4 y trabajar únicamente en arquitectura/testabilidad.

## Caso 15 — Baseline

### Esperado

`READY_FOR_MIGRATION` requiere:

- arquitectura requerida aplicada;
- shared dependencies listas;
- tests requeridos verdes.

## Caso 16 — Catálogo histórico

### Esperado

No debe alterar la ficha BEFORE de la Function para que muestre el estado refactorizado.
