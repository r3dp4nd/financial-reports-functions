# Ingenieria de contexto

## Proposito

Controlar cuanta evidencia se carga antes de decidir, especialmente en repositorios grandes, Functions con muchos imports o componentes compartidos con varios consumidores.

Esta referencia no reemplaza el analisis tecnico de cada skill. Define una forma ordenada de leer contexto para evitar duplicar investigacion, cargar archivos irrelevantes o llenar la conversacion con detalles que no cambian la decision.

## Regla base

```text
scan -> shortlist -> lectura puntual -> resumen -> siguiente decision
```

1. Haz un scan liviano con nombres de archivos, imports, scripts, configuraciones y artefactos `.migration/` vigentes.
2. Construye una shortlist de archivos relevantes antes de abrir implementaciones completas.
3. Lee solo los archivos necesarios para responder el objetivo actual.
4. Resume evidencia, incertidumbres y archivos no leidos con razon.
5. Carga referencias especializadas solo cuando aparezca una senal concreta.

## Presupuesto mental de contexto

Prioriza evidencia en este orden:

1. Archivos globales que definen plataforma, scripts y convenciones.
2. Artefactos `.migration/` vigentes aplicables al alcance.
3. Entry points de Functions, handlers y composition roots.
4. Imports directos y contratos publicos.
5. Implementaciones profundas solo cuando el contrato o el comportamiento no quede claro.
6. Tests existentes que documenten comportamiento.
7. Documentacion externa u oficial cuando se deba confirmar compatibilidad o versiones.

Si un archivo no cambia la decision actual, no lo cargues todavia.

## Orden sugerido por alcance

### Function App

1. `package.json`, lockfile, `host.json`, `tsconfig*`, `jest*`, `sonar*`, `local.settings` sanitizado o plantillas equivalentes.
2. Listado de `src/` y entry points de Functions.
3. Artefactos `.migration/` existentes.
4. Imports globales y componentes compartidos.
5. Implementaciones profundas solo para aclarar runtime, bindings, orden de ejecucion o riesgos.

### Function concreta

1. Artefacto global vigente.
2. Handler/entry point.
3. Imports directos.
4. DTOs, puertos, servicios o repositorios usados por el flujo.
5. Tests existentes de esa Function o capability.
6. Implementaciones indirectas solo si afectan comportamiento observable.

### Componente compartido

1. Contrato publico exportado.
2. Consumidores detectables por imports.
3. Tests existentes del componente o consumidores principales.
4. Configuracion y dependencias usadas por el componente.
5. Implementacion completa cuando el contrato no explique side effects, errores o datos.

### Verificacion

1. Artefactos `.migration/` vigentes.
2. Diff actual y archivos globales.
3. Scripts de build/test/coverage.
4. Registro final de Functions, bindings y dependencias.
5. Implementaciones solo para investigar discrepancias.

## Senales para referencias pesadas

Carga una referencia especializada solo si existe una senal observable:

- Azure Functions Runtime, Programming Model, bindings o Durable: `azure-functions/*`.
- Dependencias, SDKs Azure o versiones objetivo: `dependencies/*`.
- Estructura, naming, coverage, DI o slicing: `architecture/*`.
- Variables de entorno, bindings o plantillas locales: `configuration/environment-and-bindings.md`.
- ExcelJS, streams o templates de reporte: `infrastructure/exceljs-document-generation.md`.
- Cosmos, Mongo, queries o cursors: `infrastructure/cosmos-mongo-persistence.md`.
- Jest, coverage o Sonar: `testing/jest.md` y `quality/sonar.md`.
- Alcance, deuda o mejoras futuras: `planning/migration-scope-and-debt.md`.

## Resumen antes de profundizar

Antes de abrir muchos archivos, deja una mini fotografia:

```text
Objetivo:
Evidencia ya leida:
Shortlist:
Por que estos archivos:
Archivos no leidos por ahora:
Riesgo si no se leen:
Siguiente decision:
```

Este resumen puede vivir en la respuesta o en `.migration/` si la skill ya esta produciendo evidencia.

## Contexto no leido

No leer un archivo tambien es una decision. Cuando el alcance sea grande, registra brevemente:

- archivos o carpetas excluidos por sensibilidad;
- archivos no leidos porque no impactan el objetivo;
- archivos pendientes si aparece una discrepancia;
- referencias no cargadas porque no habia senal observable.

## Uso de `.migration/`

Antes de reconstruir inventarios, revisa si existe evidencia vigente:

```text
evidencia vigente -> consumir y validar con muestreo dirigido
evidencia parcial -> completar solo huecos
evidencia desactualizada -> registrar motivo antes de actualizar
sin evidencia -> producir minimo necesario
```

No copies artefactos completos entre skills. Enlaza o menciona el artefacto usado y registra solo la diferencia que aporta el alcance actual.

## No hacer

- No abrir todo `src/` por defecto.
- No cargar referencias especializadas sin una senal concreta.
- No reconstruir inventarios completos si `.migration/` ya contiene evidencia vigente.
- No leer secretos para completar contexto.
- No usar el numero de archivos leidos como medida de calidad.
