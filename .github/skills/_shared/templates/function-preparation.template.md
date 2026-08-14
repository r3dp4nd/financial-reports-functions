# Preparación — <FunctionName>

## Objetivo

Registrar cómo `<FunctionName>` fue preparada mediante los cambios estructurales y de testabilidad aprobados antes de su
migración técnica.

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

Registrar únicamente contratos observables cuya preservación haya sido comprobada o protegida.

Considerar cuando corresponda:

- entrada;
- salida;
- errores;
- efectos observables.

## Arquitectura antes

Resumen breve:

-

No duplicar el catálogo completo.

## Cambios estructurales

| Action ID | Cambio | Resultado |
|-----------|--------|-----------|
|           |        |           |

Registrar únicamente acciones estructurales aprobadas y ejecutadas para esta preparación.

Las acciones de modernización con `requiredForMigration: false` no deben ejecutarse en esta etapa.

## Estructura resultante

```text
<estructura relevante después de la preparación>
```

Mostrar únicamente la estructura relevante creada o modificada.

No imponer nuevas rutas o convenciones cuando las existentes sean coherentes.

## Azure adapter

Responsabilidades que permanecen en el adapter cuando correspondan:

- registro;
- adaptación de entrada;
- composición de dependencias;
- invocación;
- adaptación de salida.

Registrar únicamente responsabilidades realmente presentes.

Registrar desviaciones cuando existan.

## Capability

Responsabilidades extraídas o reorganizadas:

-

No reorganizar responsabilidades fuera del scope efectivo aprobado.

## Contratos introducidos

| Contrato | Responsabilidad | Justificación |
|----------|-----------------|---------------|
|          |                 |               |

Si no fueron necesarios:

`No se introdujeron nuevos contratos.`

No introducir contratos únicamente para satisfacer una estructura arquitectónica.

## Infraestructura aislada

| Infraestructura | Implementación | Contrato |
|-----------------|----------------|----------|
|                 |                |          |

No introducir un contrato únicamente para completar esta tabla.

## Recursos compartidos

| Resource ID | Action ID | Uso | Estado |
|-------------|-----------|-----|--------|
|             |           |     |        |

No duplicar acciones compartidas.

Registrar únicamente recursos realmente consumidos por esta Function.

## Configuración

Cambios relevantes:

-

Registrar únicamente nombres de claves.

Indicar ownership local o compartido cuando haya sido modificado.

Nunca valores.

No leer archivos protegidos para completar esta sección.

## Preparación para pruebas

Cambios realizados para mejorar o habilitar testabilidad:

-

Estado:

`READY | BLOCKED | REQUIRES_REVIEW | NOT_APPLICABLE`

Bloqueos restantes:

-

## Baseline de pruebas disponible

Comando:

`<command>`

Resultado:

`PASS | FAIL | NOT_EXECUTED | NOT_APPLICABLE`

Resumen:

- suites:
- pruebas:
- fallos:
- coverage cuando aplique:

No generar pruebas nuevas desde esta sección.

Si se requieren pruebas adicionales, deben quedar identificadas para la etapa de testing correspondiente.

## Validaciones adicionales

| Validación | Resultado | Evidencia |
|------------|-----------|-----------|
|            |           |           |

Estados aplicables:

- `PASS`
- `FAIL`
- `NOT_EXECUTED`
- `NOT_APPLICABLE`
- `REQUIRES_REVIEW`

No afirmar `PASS` sin evidencia.

## Riesgos pendientes

-

## Incertidumbres

-

## Deuda restante

-

La deuda restante no bloquea automáticamente la migración.

## Resultado

La Function:

`está lista / no está lista`

para la siguiente etapa.

Siguiente etapa sugerida:

`migrate-programming-model-v4`

o:

`migrate-durable-functions-v4`

cuando corresponda.
