# Evidence Policy

## Objetivo

Separar hechos, inferencias e incertidumbres para que cada decisión de migración sea trazable y reproducible.

## Evidence status

Usar únicamente:

- `CONFIRMED`: evidencia directa y suficiente;
- `INFERRED`: conclusión razonable basada en señales parciales;
- `UNKNOWN`: evidencia insuficiente;
- `NOT_APPLICABLE`: la dimensión no corresponde al scope.

No convertir `INFERRED` o `UNKNOWN` en `CONFIRMED` por conveniencia.

## Fuentes

Prioridad:

```text
repo seguro / ejecución determinista
→ artifacts previos vigentes
→ documentación oficial
→ inferencia explícita
```

La documentación externa puede validar compatibilidad o comportamiento de plataforma, pero no reemplaza evidencia del repositorio.

## Provenance

Cuando una conclusión sea relevante para una acción o gate, registrar suficiente provenance para reproducirla, por ejemplo:

- ruta y fragmento observable;
- artifact y campo;
- comando y resultado;
- referencia oficial utilizada.

No registrar contenido protegido.

## Contradicciones

Si dos evidencias se contradicen:

- conservar ambas;
- marcar la contradicción;
- degradar el estado cuando corresponda;
- no escoger silenciosamente la conclusión conveniente.

Consultar [references/evidence-model.md](references/evidence-model.md) para reglas de ownership y mutabilidad de artifacts.

## Evidencia negativa

La ausencia de una señal solo confirma ausencia cuando el mecanismo de búsqueda es suficientemente completo y seguro.

## Reproducibilidad

Una afirmación que determina migración, bloqueo o verificación debe poder rastrearse a evidencia observable sin depender del razonamiento privado del ejecutor.
