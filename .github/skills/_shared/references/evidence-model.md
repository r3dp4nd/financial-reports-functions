# Modelo de evidencia y artifacts

## Ownership

Cada dato debe tener un owner claro para evitar reconstrucción y drift.

Ejemplos:

- discovery es owner del estado observado inicial;
- assessment es owner del gap global;
- analysis es owner del impacto local por Function;
- planning es owner de acciones y dependencias;
- execution artifacts son owner del resultado de cada acción;
- verification es owner del cierre final.

Una etapa posterior consume artifacts previos; no los reescribe para ajustarlos al resultado actual.

## BEFORE, PLAN, EXECUTION, AFTER

Mantener esta separación:

```text
BEFORE    estado observado antes de cambios
PLAN      cambio aprobado
EXECUTION resultado de acciones ejecutadas
AFTER     evidencia final observada
```

No actualizar BEFORE con información de AFTER.

## Artifacts históricos

Los artifacts que representan una ejecución concreta no deben mutarse retroactivamente para ocultar desviaciones. Si se requiere una nueva ejecución, crear la evidencia correspondiente según el contrato de la etapa.

## Referencias oficiales

Usar fuentes oficiales para:

- Azure Functions;
- Node.js;
- Azure SDKs;
- Durable Functions;
- Agent Skills cuando corresponda al toolkit.

Un target investigado externamente no se convierte automáticamente en target aprobado del proyecto; debe pasar por el baseline o la decisión humana definida.
