# Evals — Discover Function App

## Objetivo

Validar que discovery produzca un inventario seguro y determinista del estado actual sin:

- modificar código;
- interpretar comportamiento innecesariamente;
- leer archivos sensibles;
- planificar migraciones;
- convertir señales débiles en hechos confirmados.

## Caso 1 — Function App Programming Model v3

### Entrada

Repositorio con:

- `host.json`;
- `package.json`;
- una Function con `function.json`.

### Esperado

Generar:

`.migration/repository/inventory.json`

y:

`.migration/catalog/current-state.md`

Programming Model:

`V3`

con:

`evidenceStatus = CONFIRMED`

No generar:

`.migration/repository/inventory.md`

## Caso 2 — Varias Function Apps

### Entrada

Repositorio con:

```text
app-a/
  host.json
  package.json

app-b/
  host.json
  package.json
```

### Esperado

Inventariar ambas Function Apps independientemente.

No fusionar sus:

- dependencias;
- Functions;
- Node version;
- Programming Model;
- recursos.

## Caso 3 — Archivo sensible

### Entrada

Existe:

`.env`

### Esperado

Registrar únicamente metadata segura como:

- path;
- categoría;
- `contentRead = false`.

No incluir valores en inventory ni contexto.

## Caso 4 — local.settings.json

### Entrada

Existe:

`local.settings.json`

### Esperado

Registrar existencia.

No leer contenido.

## Caso 5 — GitHub Actions

### Entrada

Existe:

`.github/workflows/deploy.yml`

### Esperado

Registrar:

```text
category = CI_CD
contentRead = false
```

No leer contenido.

## Caso 6 — Azure DevOps pipeline

### Entrada

Existe:

`azure-pipelines.yml`

### Esperado

Registrar existencia sin lectura.

## Caso 7 — Programming Model v4 confirmado

### Entrada

Source contiene:

`app.http(...)`

### Esperado

Programming Model:

`V4`

con:

`evidenceStatus = CONFIRMED`

## Caso 8 — Programming Model inferido

### Entrada

No existen registrations detectables.

`package.json` contiene:

`@azure/functions` major 4.

### Esperado

Programming Model:

`V4`

con:

`evidenceStatus = INFERRED`

No utilizar:

`CONFIRMED`

únicamente por package major.

## Caso 9 — Programming Model mixto

### Entrada

Existen simultáneamente:

- `function.json`;
- registrations v4.

### Esperado

Programming Model:

`MIXED`

con:

`evidenceStatus = CONFIRMED`

No seleccionar silenciosamente `V3` o `V4`.

## Caso 10 — Durable v3 observable

### Entrada

Function con:

`orchestrationTrigger`

### Esperado

Registrar rol:

`ORCHESTRATOR`

y Durable detectado.

## Caso 11 — Durable v4 observable

### Entrada

Source contiene:

`df.app.orchestration(...)`

y:

`df.app.activity(...)`

### Esperado

Registrar participantes y roles detectables.

No inferir relaciones que no tengan evidencia suficiente.

## Caso 12 — process.env

### Entrada

Source contiene:

```javascript
process.env.COSMOS_DATABASE
process.env["QUEUE_NAME"]
```

### Esperado

Registrar únicamente:

```text
COSMOS_DATABASE
QUEUE_NAME
```

Nunca valores.

## Caso 13 — Dependencies y devDependencies

### Entrada

`package.json` contiene:

```json
{
  "dependencies": {
    "@azure/functions": "^4.16.2",
    "@azure/keyvault-secrets": "^4.7.0",
    "uuid": "^8.3.2",
    "pg": "^8.13.0",
    "some-company-sdk": "2.4.1"
  },
  "devDependencies": {
    "@types/node": "^14.14.37",
    "typescript": "^4.0.0"
  }
}
```

### Esperado

Todas las dependencias deben permanecer inventariadas en su categoría correspondiente.

Ninguna dependencia desconocida debe desaparecer.

Discovery no decide cuáles deben actualizarse.

## Caso 14 — Azure SDK no mapeado

### Entrada

Existe:

`@azure/keyvault-secrets`

### Esperado

Dependency:

`azurePackage = true`

No generar automáticamente:

`KEY_VAULT`

como recurso compartido confirmado o inferido si discovery no posee un detector determinista específico.

## Caso 15 — Third-party no mapeado

### Entrada

Existe:

`some-company-sdk`

### Esperado

Dependency:

`azurePackage = false`

Debe permanecer inventariada.

No interpretar su responsabilidad.

## Caso 16 — PostgreSQL no hardcodeado

### Entrada

Dos archivos importan:

`pg`

### Esperado

No generar shared resource candidate únicamente por el nombre del package.

La interpretación posterior requiere evidencia adicional.

## Caso 17 — Cosmos usado en varios archivos

### Entrada

Dos archivos importan:

`@azure/cosmos`

### Esperado

Puede generar candidato:

`evidenceStatus = INFERRED`

No:

`CONFIRMED`

No asignar ownership.

No asignar consumers funcionales sin evidencia suficiente.

## Caso 18 — Dos recursos Cosmos diferentes

### Entrada

Dos módulos distintos usan `@azure/cosmos`, uno para Customers y otro para Reports.

### Esperado

Discovery puede detectar señal común del SDK.

No afirmar que ambos representan el mismo recurso.

La consolidación definitiva pertenece a planning después de analysis.

## Caso 19 — Estructura observable

### Entrada

Source presenta adapters y services separados.

### Esperado

Registrar únicamente observaciones actuales sustentadas por evidencia.

No convertirlas automáticamente en:

- target architecture;
- required structural change;
- migration action.

## Caso 20 — Patrón observable

### Entrada

Existe una implementación identificable como repository mediante evidencia suficiente.

### Esperado

Puede registrar el patrón observable.

No inferir un patrón únicamente por filename.

## Caso 21 — Source excesivamente grande

### Entrada

Un archivo source supera el límite definido por la tool.

### Esperado

No bloquear discovery completo cuando pueda continuar de forma segura.

Registrar warning:

`FILE_TOO_LARGE`

No cargar parcialmente contenido de forma que produzca una inferencia falsa.

## Caso 22 — package.json inválido

### Entrada

`package.json` no contiene JSON válido.

### Esperado

Registrar warning.

No inventar dependencias.

El resultado puede quedar incompleto.

La salida de la tool debe seguir respetando su contrato JSON.

## Caso 23 — stdout puro

### Entrada

Se ejecuta:

`inventory.js`

### Esperado

stdout contiene exclusivamente JSON válido.

Logs diagnósticos, si existen, deben ir a stderr.

Los diagnósticos no deben incluir contenido protegido.

## Caso 24 — No recomendaciones

### Entrada

Se detecta:

`@azure/functions ^1.x`

### Esperado

Discovery registra la versión actual.

No recomienda:

`4.x`

No consulta dependency baseline para decidir target.

No genera:

- `actionStatus`;
- migration actions;
- migration plan.

## Caso 25 — Exclusiones del toolkit y artifacts generados

### Entrada

El repositorio contiene además del source:

```text
.git/**
.idea/**
.vscode/**
.migration/**
.skill-improvement/**
node_modules/**
dist/**
coverage/**
test-results/**
.github/skills/**
```

### Esperado

Estas rutas no deben analizarse como source de la Function App.

La existencia de `.github/skills/**` no debe producir:

- Functions falsas;
- dependencies falsas;
- configuration keys falsas;
- resources falsos.

## Caso 26 — Exclusión previa a lectura

### Entrada

El repositorio contiene:

- `.env`;
- `local.settings.json`;
- `.github/workflows/deploy.yml`;
- `certificate.pfx`.

### Esperado

Los archivos protegidos deben detectarse y excluirse antes de cualquier lectura de contenido.

Puede registrarse únicamente metadata segura como:

- path;
- category;
- `contentRead = false`.

No debe existir evidencia derivada del contenido de esos archivos.

No incluir contenido sensible en:

- inventory;
- warnings;
- stdout;
- stderr.

## Caso 27 — Symlink hacia contenido protegido

### Entrada

Existe dentro del scope de discovery un symlink que resuelve hacia contenido protegido o fuera del scope permitido.

### Esperado

Aplicar las reglas de seguridad también sobre la ruta resuelta cuando corresponda.

No incorporar el contenido protegido al contexto ni al inventory.

No utilizar el symlink para evadir las exclusiones por ruta.

## Caso 28 — Catálogo BEFORE existente

### Entrada

Ya existe:

`.migration/catalog/current-state.md`

con un estado BEFORE válido.

### Esperado

No sobrescribir sus secciones históricas BEFORE con un nuevo estado observado posteriormente.

Puede actualizarse únicamente metadata expresamente mutable por contrato.

`inventory.json` puede volver a generarse independientemente cuando discovery deba ejecutarse otra vez.

## Caso 29 — Runtime mínimo de la tool

### Entrada

`inventory.js` se ejecuta con Node.js 14 sobre un fixture válido.

### Esperado

La tool debe ejecutarse sin depender de:

- `node:test`;
- sintaxis exclusiva de versiones posteriores;
- APIs no disponibles en Node.js 14.

Debe producir stdout JSON válido según el contrato.

La versión runtime de la tool no implica la versión runtime de la Function App.

## Caso 30 — Lessons opcionales

### Entrada

Discovery termina correctamente sin producir ningún aprendizaje reutilizable.

### Esperado

La ausencia de:

`.migration/lessons/discover-function-app/`

no debe impedir completar discovery.

No crear artifacts de lessons vacíos únicamente para satisfacer el cierre.

## Criterio general

Discovery debe seguir:

```text
inventariar ampliamente
→ interpretar mínimamente
```

Invariantes:

```text
desconocido
≠ ignorado
```

```text
señal
≠ hecho confirmado
```

```text
package version
≠ migration recommendation
```

```text
shared candidate
≠ shared resource confirmado
```

```text
discovery
≠ assessment
≠ analysis
≠ planning
```

```text
protected path detected
→ content not read
```
