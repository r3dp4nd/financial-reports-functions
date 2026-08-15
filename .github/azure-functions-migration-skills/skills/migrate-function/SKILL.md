---
name: migrate-function
description: Migra una Azure Function legacy hacia Programming Model v4 preservando trigger, bindings, contratos y comportamiento observable. Usar cuando una Function ya fue comprendida y se necesita realizar la transformación técnica del modelo de programación sin introducir todavía un refactor arquitectónico amplio.
---

# Migrate Function

## Propósito

Transformar una Function al Programming Model objetivo con el menor cambio funcional posible.

Antes de ejecutar, aplica `../../principles/copilot-rules.md`.

## Precondiciones

- La Function y su comportamiento relevante están comprendidos.
- Se conocen trigger, bindings, configuración y dependencias.
- Se conoce si existen requisitos especiales, por ejemplo Durable Functions.
- El desarrollador entiende que la convergencia de Programming Model se valida a nivel Function App.

## Trabajo

1. Identifica la definición legacy que debe reemplazarse.
2. Traduce trigger y bindings al Programming Model v4 usando la API oficial correspondiente.
3. Preserva:
   - nombre funcional cuando sea contractual;
   - route;
   - métodos;
   - auth level;
   - bindings;
   - entradas y salidas;
   - semántica observable de errores;
   - side effects.
4. Mantén la lógica existente lo más intacta posible durante esta transformación.
5. Registra cualquier adaptación obligatoria introducida por la API v4.
6. Si detectas Durable Functions u otra variante especializada, carga la referencia correspondiente antes de aplicar cambios.
7. Ejecuta validaciones locales proporcionales al alcance disponible.

## No hacer

- No aplicar arquitectura limpia simultáneamente salvo cambio mínimo indispensable para compilar.
- No modernizar reglas de negocio.
- No actualizar SDKs no relacionados solo por oportunidad.
- No asumir que una Function App con mezcla temporal de modelos es un estado operacional final válido.
- No eliminar evidencia legacy antes de asegurar que su semántica fue trasladada.

## Evidencia esperada

Registra:

- definición legacy transformada;
- equivalencia de trigger/bindings;
- adaptaciones técnicas obligatorias;
- validaciones ejecutadas;
- riesgos o bloqueos pendientes de convergencia global.

Cuando exista `.migration/`, registra esta evidencia según `../../references/evidence/migration-artifacts.md` y reutiliza el análisis vigente de la Function antes de reconstruir comportamiento.

## Finalización

Termina cuando la Function está expresada en Programming Model v4 de forma equivalente y cualquier limitación pendiente está explícita. La validez integral de la Function App corresponde a `verify-function-app`.

## Referencias

- `../../references/azure-functions/programming-model-v4.md`: reglas base de la transformación v3 -> v4.
- `../../references/azure-functions/bindings-v4.md`: traslado de triggers, inputs y outputs.
- `../../references/azure-functions/durable-v4.md`: cargar únicamente si la Function usa Durable Functions.
- `../../references/evidence/migration-artifacts.md`: contrato de evidencia reutilizable bajo `.migration/`.
