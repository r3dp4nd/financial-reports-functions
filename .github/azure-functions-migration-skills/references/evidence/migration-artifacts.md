# Contrato de artefactos `.migration/`

## Propósito

Definir una memoria compartida ligera entre skills para reutilizar evidencia sin convertir `.migration/` en un motor de workflow.

Esta referencia sustenta todas las skills cuando el repositorio use una carpeta de evidencia.

## Principio

Cada artefacto debe tener un dueño claro y una responsabilidad única. Una skill puede reutilizar evidencia previa, actualizarla cuando detecte que ya no está vigente o registrar una discrepancia, pero no debe duplicar inventarios completos sin necesidad.

```text
evidencia previa vigente -> reutilizar
evidencia previa parcial -> completar solo el hueco
evidencia previa desactualizada -> registrar motivo y actualizar
evidencia inexistente -> producir el artefacto mínimo necesario
```

## Estructura sugerida

```text
.migration/
├── app-assessment.md
├── preparation.md
├── functions/
│   └── <function-name>/
│       ├── analysis.md
│       ├── migration.md
│       ├── refactor.md
│       └── tests.md
├── shared-components/
│   └── <component-name>.md
└── verification.md
```

La estructura es una convención de evidencia, no un estado obligatorio. Si el repositorio ya tiene una convención equivalente, respétala y registra la correspondencia.

## Artefactos

### `.migration/app-assessment.md`

Dueño: `assess-function-app`.

Contiene:

- propósito observable de la Function App;
- archivos globales revisados y evidencia aportada;
- inventario de Functions;
- triggers, bindings y recursos externos por Function;
- mapa de ejecución observable entre Functions, handlers, orchestrators, activities, outputs y eventos;
- versiones observables de runtime, Node.js, Programming Model, TypeScript y dependencias relevantes;
- inventario de dependencias con uso, consumidores y acción sugerida;
- componentes compartidos y consumidores conocidos;
- arquitectura observable;
- servicios monolíticos o god files con capabilities candidatas cuando existan;
- generación de documentos Excel/CSV y templates detectados cuando existan;
- persistencia Cosmos/Mongo, queries y paginación detectadas cuando existan;
- brechas, riesgos, deuda e incógnitas;
- alcance de migración y elementos fuera de alcance;
- variables de entorno/configuración requeridas, solo por nombre;
- mapa de migración de alto nivel.

Este artefacto es la autoridad inicial para inventario global. Otras skills no deben reconstruirlo completo salvo que el código haya cambiado o falte evidencia necesaria.

### `.migration/preparation.md`

Dueño: `prepare-function-app`.

Contiene:

- cambios globales aplicados;
- scripts disponibles;
- configuración de build, test, coverage y calidad;
- configuración TypeScript base/prod/spec cuando aplique;
- variables necesarias para ejecución local, solo por nombre;
- dependencias o cambios pospuestos y motivo;
- incompatibilidades detectadas durante la preparación.

No reemplaza el assessment; lo complementa con decisiones de tooling.

### `.migration/functions/<function-name>/analysis.md`

Dueño: `analyze-function`.

Contiene:

- trigger, bindings, entradas, salidas y configuración usada por la Function;
- flujo funcional observable;
- reglas de negocio, side effects y manejo de errores;
- dependencias internas y externas;
- variables de entorno y bindings usados por la Function, solo por nombre;
- componentes compartidos consumidos;
- responsabilidades mezcladas;
- separación conceptual mínima propuesta;
- mapa de slicing por capability cuando detecte servicios monolíticos o god files;
- contrato de generación de documentos cuando la Function produzca Excel/CSV;
- contrato de persistencia/query cuando la Function lea Cosmos/Mongo;
- escenarios de comportamiento a preservar;
- incógnitas.

Este artefacto es la autoridad para comportamiento de una Function antes de migrarla, refactorizarla o probarla.

### `.migration/functions/<function-name>/migration.md`

Dueño: `migrate-function`.

Contiene:

- definición legacy transformada;
- equivalencia de trigger, inputs y outputs;
- adaptaciones obligatorias introducidas por Programming Model v4;
- archivos legacy conservados o eliminados y motivo;
- validaciones ejecutadas;
- riesgos o bloqueos pendientes de convergencia global.

No debe repetir el análisis funcional salvo para citar la evidencia que preserva.

### `.migration/functions/<function-name>/refactor.md`

Dueño: `refactor-function`.

Contiene:

- responsabilidades movidas;
- capability origen/destino de cada responsabilidad movida cuando aplique;
- límites creados y razón;
- dependencias desacopladas;
- generación de documentos separada como infraestructura cuando aplique;
- persistencia separada como infraestructura cuando aplique;
- componentes compartidos detectados durante el refactor;
- validaciones incrementales realizadas;
- desviaciones frente al análisis inicial.
- deuda técnica o mejoras futuras detectadas fuera del alcance.

No debe apropiarse de cambios transversales; si aparecen, registra el hallazgo y deriva a `migrate-shared-component`.

### `.migration/functions/<function-name>/tests.md`

Dueño: `test-function`.

Contiene:

- escenarios cubiertos;
- tests agregados o modificados;
- comandos ejecutados;
- resultados;
- cobertura disponible;
- casos pendientes y razón.

Los escenarios deben enlazar con `analysis.md` o explicar por que se agrego nueva evidencia de comportamiento.

### `.migration/shared-components/<component-name>.md`

Dueño: `migrate-shared-component`.

Contiene:

- consumidores conocidos;
- contrato preservado o cambio explícito;
- responsabilidades del componente;
- dependencias actualizadas;
- contrato de documento/template cuando el componente genere Excel/CSV;
- contrato de query/cursor cuando el componente acceda a Cosmos/Mongo;
- impacto por consumidor;
- verificaciones realizadas;
- riesgos compartidos pendientes.
- configuración compartida afectada, solo por nombre de setting.

Este artefacto evita que cada Function tome decisiones incompatibles sobre el mismo componente.

### `.migration/verification.md`

Dueño: `verify-function-app`.

Contiene:

- comparación entre inventario inicial y estado final;
- versiones objetivo observadas;
- estado de Functions, triggers, bindings y componentes compartidos;
- artefactos legacy pendientes o eliminados;
- comandos de install, build, test, coverage y arranque local ejecutados;
- resultado de cada verificación;
- bloqueos, desviaciones, desconocidos y conclusión sustentada.
- deuda técnica y mejoras futuras documentadas.

No declara éxito si una comprobación requerida no pudo ejecutarse.

## Reutilización por skill

| Skill | Produce | Reutiliza |
|---|---|---|
| `assess-function-app` | `app-assessment.md` | evidencia directa del repositorio |
| `prepare-function-app` | `preparation.md` | `app-assessment.md` |
| `analyze-function` | `functions/<name>/analysis.md` | `app-assessment.md` |
| `migrate-function` | `functions/<name>/migration.md` | `app-assessment.md`, `functions/<name>/analysis.md` |
| `refactor-function` | `functions/<name>/refactor.md` | `functions/<name>/analysis.md`, `functions/<name>/migration.md`, artefactos compartidos |
| `migrate-shared-component` | `shared-components/<name>.md` | `app-assessment.md`, análisis de Functions consumidoras |
| `test-function` | `functions/<name>/tests.md` | `functions/<name>/analysis.md`, `functions/<name>/refactor.md` cuando exista |
| `verify-function-app` | `verification.md` | todos los artefactos aplicables |

## Metadatos mínimos

Cada artefacto debe incluir al inicio:

```text
# <titulo>

- Skill: <skill>
- Alcance: <app | function | component>
- Objetivo: <nombre o descripción>
- Fecha: <YYYY-MM-DD>
- Estado de evidencia: vigente | parcial | desactualizada
```

Si el artefacto actualiza o reemplaza evidencia previa, registra brevemente:

- qué cambió en el repositorio;
- qué evidencia previa quedó obsoleta;
- qué se reutilizó sin volver a investigar.

## Reglas de coherencia

- No dupliques un inventario global dentro de un artefacto por Function.
- No copies secretos ni valores sensibles; registra solo nombres de claves de configuración.
- No conviertas `.migration/` en una lista de pasos obligatorios.
- No marques una evidencia como vigente si depende de código que no fue inspeccionado después de cambios relevantes.
- Prefiere enlaces relativos a otros artefactos antes que repetir bloques completos.
- Si una skill necesita evidencia de otra y no existe, produce solo la mínima evidencia local o registra la ausencia como incógnita.

## Secciones transversales recomendadas

Cuando el artefacto lo amerite, usa estas secciones sin duplicar contenido ya registrado en otro archivo:

```text
## Alcance de migración

## Fuera de alcance

## Variables de entorno y configuración

## Deuda técnica y mejoras futuras
```

`Fuera de alcance` y `Deuda técnica y mejoras futuras` no autorizan cambios funcionales durante la migración. Solo preservan decisiones para una iniciativa posterior.
