# Preparación — <FunctionName>

## Objetivo

Registrar cómo `<FunctionName>` fue preparada antes de su migración de plataforma.

## Referencias

Estado BEFORE:

`.migration/catalog/functions/<FunctionName>.md`

Análisis:

`.migration/functions/<FunctionName>/analysis.md`

Plan:

`.migration/functions/<FunctionName>/migration-plan.md`

## Estado

`READY_FOR_MIGRATION | BLOCKED | REQUIRES_REVIEW | NOT_APPLICABLE`

## Capability

`<Capability>`

## Comportamiento preservado

-
-

## Arquitectura antes

Resumen breve:

-

No duplicar el catálogo completo.

## Cambios arquitectónicos

| Action ID | Cambio | Resultado |
|-----------|--------|-----------|
|           |        |           |

## Estructura resultante

```text
src/
├── functions/
└── <Capability>/
```

Mostrar únicamente la estructura relevante creada o modificada.

## Azure adapter

Responsabilidades que permanecen en el adapter:

- registro;
- mapping;
- composition;
- invocation;
- response mapping.

Registrar desviaciones cuando existan.

## Capability

Responsabilidades extraídas o reorganizadas:

-

## Contratos introducidos

| Contrato | Responsabilidad | Justificación |
|----------|-----------------|---------------|
|          |                 |               |

Si no fueron necesarios:

`No se introdujeron nuevos contratos.`

## Infraestructura aislada

| Infraestructura | Implementación | Contrato |
|-----------------|----------------|----------|
|                 |                |          |

## Recursos compartidos

| Resource ID | Action ID | Uso | Estado |
|-------------|-----------|-----|--------|
|             |           |     |        |

No duplicar acciones compartidas.

## Configuración

Cambios relevantes:

-

Solo nombres de claves.

## Tests agregados

| Test | Tipo | Comportamiento protegido |
|------|------|--------------------------|
|      |      |                          |

## Baseline

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED`

Resumen:

- suites:
- tests:
- failures:
- coverage cuando aplique:

## Validaciones adicionales

| Validación | Resultado |
|------------|-----------|
|            |           |

## Riesgos pendientes

-

## Unknowns

-

## Deuda restante

-

## Resultado

La Function:

`está lista / no está lista`

para la siguiente etapa.

Siguiente capability sugerido:

`migrate-programming-model-v4`

o:

`migrate-durable-functions-v4`

cuando corresponda.
