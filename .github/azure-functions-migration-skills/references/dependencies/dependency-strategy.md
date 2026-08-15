# Estrategia de migración de dependencias

## Propósito

Definir cómo actualizar dependencias sin convertir la modernización de Azure Functions en un `npm update` indiscriminado.

Esta referencia sustenta `assess-function-app`, `prepare-function-app` y `migrate-shared-component`.

Cuando detectes SDKs Azure para JavaScript, carga también `azure-sdk-js.md` para sugerir versiones con base en documentación oficial vigente.

## Clasificación

Para cada dependencia relevante registra:

```text
actual
objetivo o rango compatible
uso observado
consumidores
impacto esperado
acción
```

Acciones permitidas:

- mantener;
- actualizar;
- reemplazar;
- eliminar;
- investigar.

## Orden de decisión

1. Determina si la dependencia se usa realmente.
2. Identifica si es runtime o tooling.
3. Comprueba compatibilidad con Node.js 24.
4. Comprueba compatibilidad con Programming Model/Runtime cuando aplique.
5. Revisa guía de migración/changelog oficial para saltos mayores.
6. Identifica APIs usadas por el repositorio que hayan cambiado.
7. Decide el mínimo salto necesario para alcanzar el objetivo.
8. Actualiza el lockfile de forma controlada.
9. Compila y prueba después del cambio.

## Runtime vs desarrollo

Mantén en `dependencies` aquello necesario durante ejecución, por ejemplo:

- `@azure/functions` en Programming Model v4;
- Azure SDKs usados por la aplicación;
- librerías de negocio o integración requeridas en runtime.

Mantén tooling en `devDependencies`, por ejemplo:

- Jest;
- compilador TypeScript;
- tipos;
- herramientas de build/quality cuando solo se usan durante desarrollo/CI.

No muevas paquetes por estilo; decide según su uso real.

## Baseline runtime no Azure

Algunas librerías no pertenecen al Azure SDK, pero pueden ser parte del comportamiento runtime. Si el repo genera o manipula archivos Excel con `exceljs`, considera esta versión candidata:

```json
{
  "dependencies": {
    "exceljs": "^4.4.0"
  }
}
```

Antes de sugerirla o instalarla:

- confirma que el código usa `exceljs` o migra desde una librería equivalente ya presente;
- revisa npm, README oficial y changelog del paquete;
- valida que el cambio no altere formato, estilos, streaming, fechas, fórmulas ni compatibilidad de archivos;
- registra pruebas o casos manuales necesarios para comprobar equivalencia.

## No usar `latest` como estrategia

`latest` no expresa compatibilidad.

Antes de un major upgrade, identifica:

- breaking changes;
- cambios de firma;
- cambios de tipos;
- configuración obsoleta;
- comportamiento de retries/conexiones;
- soporte de Node.js;
- impacto sobre componentes compartidos.

## Componentes compartidos

Si una dependencia está encapsulada por un cliente/repositorio usado por varias Functions, actualízala preferentemente en esa frontera compartida en lugar de adaptar el SDK de forma distinta en cada Function.

Ejemplo:

```text
Function A ─┐
Function B ─┼─> OrderRepository ─> @azure/cosmos
Function C ─┘
```

Un cambio mayor de Cosmos debe analizar primero `OrderRepository` y todos sus consumidores.

## Lockfile

Preserva el lockfile como evidencia de la resolución exacta de dependencias. Evita regenerarlo repetidamente sin una razón técnica porque dificulta atribuir qué cambio introdujo una regresión.

## Evidencia mínima por actualización

- versión anterior;
- versión nueva;
- razón;
- archivos/APIs impactados;
- build/test ejecutado;
- riesgo o incompatibilidad pendiente.

## Fuentes oficiales

- Azure Functions Node.js developer reference: https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node
- npm package.json: https://docs.npmjs.com/cli/v12/configuring-npm/package-json/
- npm scripts: https://docs.npmjs.com/cli/v11/using-npm/scripts/
- exceljs npm/package: https://www.npmjs.com/package/exceljs

Para Azure SDKs concretos, consulta la documentación y changelog oficiales del paquete detectado antes de fijar una versión objetivo.
