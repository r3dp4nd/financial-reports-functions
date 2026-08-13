# Evidence Policy

## Objetivo

Definir cómo los skills distinguen hechos, inferencias e incertidumbre.

## Estados

Usar:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

### CONFIRMED

Existe evidencia directa suficiente.

### INFERRED

Existe evidencia parcial que permite una conclusión razonable, pero no definitiva.

La evidencia utilizada debe quedar identificada.

### UNKNOWN

No existe evidencia suficiente.

No reemplazar `UNKNOWN` por una suposición.

### NOT_APPLICABLE

La dimensión evaluada no aplica al caso analizado.

## Evidencia del repositorio

Preferir referencias mínimas como:

- archivo;
- configuración;
- dependencia;
- registro;
- llamada;
- resultado de una tool determinista.

No almacenar código completo cuando una referencia breve sea suficiente.

## Evidencia externa

Para afirmaciones sobre:

- Node.js;
- Azure Functions;
- Programming Model;
- Durable Functions;
- SDKs;
- compatibilidad;
- soporte;
- versiones;

usar documentación oficial vigente.

Orden preferido:

1. Microsoft Learn o documentación oficial de Azure.
2. documentación oficial de Node.js.
3. documentación oficial del SDK o paquete.
4. npm oficial cuando sea necesario.

No copiar documentación completa.

Guardar solo la referencia necesaria para justificar la conclusión.

## Contradicciones

Si una evidencia nueva contradice un artefacto anterior:

- no sobrescribir silenciosamente la conclusión previa;
- registrar la inconsistencia;
- marcar la dimensión afectada como `UNKNOWN` o `REQUIRES_REVIEW` cuando corresponda;
- recomendar regenerar únicamente el artefacto que haya quedado desactualizado.

## Principio

No inventar.

No convertir una inferencia en hecho.

No considerar compilación exitosa como prueba suficiente de compatibilidad funcional.
