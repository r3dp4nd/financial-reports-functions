# Cómo usar Azure Functions Migration Skills

## Propósito

Usa este toolkit para migrar Function Apps Node.js/TypeScript hacia Azure Functions Runtime v4, Programming Model v4 y Node.js 24, mejorando estructura y testabilidad sin cambiar comportamiento funcional.

El toolkit no ejecuta un workflow autónomo. El desarrollador decide qué capacidad usar según el estado del repositorio.

## Regla base

Antes de pedir cambios, pide evidencia.

```text
comprender -> definir alcance -> preparar -> transformar -> probar -> verificar
```

No mezcles cambios funcionales con migración tecnológica.

## Orden recomendado

### 1. Diagnóstico inicial

Usa `assess-function-app` para entender el estado actual.

Ejemplo de solicitud:

```text
Usa assess-function-app para analizar esta Function App y generar el assessment inicial en .migration/.
```

Debe producir o actualizar:

```text
.migration/app-assessment.md
```

Busca:

- Functions, triggers y bindings;
- Runtime, Programming Model, Node.js y TypeScript;
- dependencias;
- estructura y madurez;
- variables/settings usados por código y bindings, solo por nombre;
- alcance, fuera de alcance, riesgos, deuda e incógnitas.

### 2. Preparación global

Usa `prepare-function-app` cuando ya exista suficiente assessment.

Ejemplo:

```text
Usa prepare-function-app para preparar TypeScript, Jest, coverage, Sonar y scripts npm sin migrar Functions todavía.
```

Debe producir o actualizar:

```text
.migration/preparation.md
```

Puede preparar:

- `tsconfig.json`;
- `tsconfig.prod.json`;
- `tsconfig.spec.json`;
- `jest.config.js`;
- `sonar-project.properties`;
- scripts npm;
- plantillas seguras de settings locales.

No debe migrar Programming Model ni refactorizar negocio.

### 3. Análisis de una Function

Usa `analyze-function` antes de tocar una Function cuyo comportamiento no esté claro.

Ejemplo:

```text
Usa analyze-function para analizar <FunctionName>, reconstruir comportamiento y proponer separación testeable.
```

Debe producir o actualizar:

```text
.migration/functions/<function-name>/analysis.md
```

Debe aclarar:

- trigger y bindings;
- input/output;
- settings usados, solo por nombre;
- reglas de negocio;
- side effects;
- errores;
- dependencias;
- componentes compartidos;
- escenarios que deben preservarse.

### 4. Migración a Programming Model v4

Usa `migrate-function` cuando la Function ya fue comprendida.

Ejemplo:

```text
Usa migrate-function para migrar <FunctionName> a Programming Model v4 preservando trigger, bindings y comportamiento.
```

Debe producir o actualizar:

```text
.migration/functions/<function-name>/migration.md
```

No debe hacer refactor amplio. Primero traslada la semántica legacy a v4.

### 5. Componentes compartidos

Usa `migrate-shared-component` cuando un cliente, repositorio, configuración o servicio tenga varios consumidores.

Ejemplo:

```text
Usa migrate-shared-component para migrar este cliente compartido, identificando consumidores y contrato preservado.
```

Debe producir o actualizar:

```text
.migration/shared-components/<component-name>.md
```

No dupliques adapters o repositorios por Function para evitar entender el contrato compartido.

### 6. Refactor estructural

Usa `refactor-function` cuando el modelo técnico esté estable o suficientemente comprendido.

Ejemplo:

```text
Usa refactor-function para ordenar <FunctionName> por capability, application, domain e infrastructure sin cambiar comportamiento.
```

Debe producir o actualizar:

```text
.migration/functions/<function-name>/refactor.md
```

Aplica la estructura objetivo solo cuando aporte claridad inmediata:

```text
application/use-cases
application/commands
application/queries
application/results
application/events
application/ports

domain/models
domain/types
domain/ports
domain/errors

infrastructure/persistence
infrastructure/messaging
infrastructure/storage
infrastructure/document
```

No crees carpetas, interfaces o capas vacías.

### 7. Tests

Usa `test-function` para proteger comportamiento.

Ejemplo:

```text
Usa test-function para agregar tests de caracterización y tests de use cases para <CapabilityName>.
```

Debe producir o actualizar:

```text
.migration/functions/<function-name>/tests.md
```

Prioriza:

- dominio;
- casos de uso;
- handlers con mapping o errores relevantes;
- infraestructura con comportamiento propio.

No escribas tests triviales solo para subir cobertura.

### 8. Verificación integral

Usa `verify-function-app` cuando la Function App deba demostrar convergencia.

Ejemplo:

```text
Usa verify-function-app para comprobar estado final, build, tests, coverage, Functions registradas y deuda pendiente.
```

Debe producir o actualizar:

```text
.migration/verification.md
```

Debe comprobar:

- inventario inicial vs final;
- Runtime v4, Programming Model v4, Node.js objetivo;
- bindings y settings preservados;
- ausencia de artefactos legacy pendientes;
- build, tests y coverage;
- deuda técnica y mejoras futuras documentadas.

## Uso de `.migration/`

`.migration/` conserva evidencia. No es un motor de estado ni una lista obligatoria de pasos.

Usa los artefactos para evitar que una skill vuelva a investigar lo mismo:

```text
app-assessment.md
preparation.md
functions/<function-name>/analysis.md
functions/<function-name>/migration.md
functions/<function-name>/refactor.md
functions/<function-name>/tests.md
shared-components/<component-name>.md
verification.md
```

## Settings y secretos

El toolkit puede inventariar settings y ayudar a pedir `local.settings.json`, pero nunca debe registrar secretos.

Permitido:

```text
SETTING_NAME
uso
fuente
si es sensible
si falta para local
```

No permitido:

```text
connection strings
keys
tokens
passwords
valores secretos
```

Si hace falta ejecución local, genera o actualiza una plantilla segura como:

```text
local.settings.sample.json
```

con placeholders.

## Cuándo detenerse

Detén o registra como deuda cuando el cambio:

- agrega funcionalidad;
- cambia reglas de negocio;
- modifica contratos externos sin necesidad de migración;
- requiere decisión de infraestructura hospedada;
- no puede validarse con evidencia proporcional;
- afecta componentes compartidos no analizados.

## Validaciones habituales

Según el estado del repo:

```text
npm run typecheck
npm run build:prod
npm run test:ci
func start
```

No declares terminada una migración si una validación requerida no pudo ejecutarse.

