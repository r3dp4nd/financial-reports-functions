# Alcance de migración y deuda técnica

## Propósito

Definir cómo separar el trabajo propio de la migración de cambios funcionales, rediseños o mejoras futuras.

Esta referencia sustenta `assess-function-app`, `refactor-function`, `migrate-shared-component` y `verify-function-app`.

## Principio

La migración puede cambiar plataforma, estructura, testabilidad y compatibilidad. No debe cambiar comportamiento funcional salvo decisión explícita del desarrollador.

```text
migración permitida
  = compatibilidad + estructura + testabilidad + preservación

fuera de alcance
  = nueva funcionalidad + cambio funcional + rediseño no necesario
```

## Dentro del alcance

Puede formar parte de la migración:

- converger a Azure Functions Runtime v4;
- converger a Programming Model v4;
- preparar Node.js 24 cuando la plataforma lo soporte;
- actualizar dependencias necesarias para compatibilidad;
- trasladar triggers y bindings preservando semántica;
- ordenar estructura por capability;
- separar runtime, aplicación, dominio e infraestructura;
- introducir puertos o dependency injection cuando reduzcan acoplamiento real;
- configurar TypeScript, Jest, coverage y Sonar;
- agregar tests que protejan comportamiento existente;
- documentar riesgos, bloqueos, deuda e incógnitas.

## Fuera del alcance

Debe quedar documentado, no mezclado silenciosamente:

- nuevas funcionalidades;
- cambios de reglas de negocio;
- cambios en contratos externos no requeridos por la migración;
- optimizaciones de performance no necesarias para compatibilidad;
- rediseños de dominio que cambien semántica;
- cambios de infraestructura hospedada no aprobados;
- cambios de datos, backfills o procesos operativos externos;
- reemplazos de servicios por preferencia técnica sin necesidad de migración.

## Clasificación de hallazgos

Usa categorías claras:

| Categoría | Significado |
|---|---|
| Bloqueo | Impide continuar o verificar sin decisión externa. |
| Riesgo | Puede afectar la migración, pero no impide avanzar todavía. |
| Incógnita | Falta evidencia para decidir. |
| Deuda técnica | Problema existente que conviene tratar después. |
| Mejora futura | Oportunidad útil fuera del alcance actual. |

No conviertas una mejora futura en requisito de migración.

## Registro recomendado

En `.migration/app-assessment.md`:

```text
## Alcance de migración

## Fuera de alcance

## Riesgos, bloqueos e incógnitas

## Deuda técnica y mejoras futuras
```

En artefactos por Function o componente, registra solo hallazgos específicos de ese alcance y enlaza el assessment si ya existe.

## Criterio de decisión

Antes de aplicar un cambio dudoso, pregunta:

1. ¿Es necesario para Runtime v4, Programming Model v4, Node.js 24, compatibilidad o testabilidad?
2. ¿Preserva comportamiento observable?
3. ¿Reduce acoplamiento real o solo cambia estilo?
4. ¿Puede validarse con build, tests o comparación antes/después?
5. ¿Pertenece a una Function o es compartido?

Si la respuesta no justifica el cambio dentro de la migración, documenta como deuda o mejora futura.

