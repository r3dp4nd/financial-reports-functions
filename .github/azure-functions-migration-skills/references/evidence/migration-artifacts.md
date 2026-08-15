# Uso de artefactos `.migration/`

## Propósito

Definir una memoria compartida ligera entre skills para reutilizar evidencia sin convertir `.migration/` en un motor de workflow.

Esta referencia sustenta todas las skills cuando el repositorio use una carpeta de evidencia. Carga `artifact-contracts.md` solo cuando necesites el detalle completo de contenido por artefacto.

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

## Contratos detallados

Consulta `artifact-contracts.md` cuando necesites saber el contenido esperado de cada artefacto.

Para decidir que evidencia leer primero y cuando evitar reconstruir inventarios, usa `../context/context-engineering.md`.

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
