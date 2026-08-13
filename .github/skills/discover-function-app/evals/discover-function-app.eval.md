# Evals — Discover Function App

## Objetivo

Validar que discovery produzca un inventario seguro y determinista del estado actual sin:

- modificar código;
- interpretar comportamiento innecesariamente;
- leer archivos sensibles;
- planificar migraciones;
- convertir señales débiles en hechos confirmados.

## Caso 1 — Function App legacy

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

`legacy`

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

Registrar:

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

## Caso 7 — Programming Model v4

### Entrada

Source contiene:

`app.http(...)`

### Esperado

Programming Model:

`v4`

con:

`evidenceStatus = CONFIRMED`

## Caso 8 — Programming Model inferido

### Entrada

No existen registrations detectables.

`package.json` contiene:

`@azure/functions` major 4.

### Esperado

Programming Model:

`v4`

con:

`evidenceStatus = INFERRED`

No utilizar `CONFIRMED`.

## Caso 9 — Mixed

### Entrada

Existen simultáneamente:

- `function.json`;
- registrations v4.

### Esperado

Programming Model:

`mixed`

con:

`evidenceStatus = CONFIRMED`

## Caso 10 — Durable legacy

### Entrada

Function con:

`orchestrationTrigger`

### Esperado

Registrar rol:

`ORCHESTRATOR`

y Durable detectado.

## Caso 11 — Durable v4

### Entrada

Source contiene:

`df.app.orchestration(...)`

y:

`df.app.activity(...)`

### Esperado

Registrar participantes y roles detectables.

## Caso 12 — process.env

### Entrada

Source contiene:

```javascript
process.env.COSMOS_DATABASE
process.env['QUEUE_NAME']
```

### Esperado

Registrar únicamente:

```text
COSMOS_DATABASE
QUEUE_NAME
```

Nunca valores.

## Caso 13 — Todas las dependencias

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
  }
}
```

### Esperado

Todas deben aparecer en:

`dependencies`

Ninguna dependencia desconocida debe desaparecer.

## Caso 14 — Azure SDK no mapeado

### Entrada

Existe:

`@azure/keyvault-secrets`

### Esperado

Dependency:

```text
azurePackage = true
```

No generar automáticamente:

```text
KEY_VAULT
```

como recurso compartido confirmado o inferido si discovery no tiene detector determinista específico.

## Caso 15 — Third-party no mapeado

### Entrada

Existe:

`some-company-sdk`

### Esperado

Dependency:

```text
azurePackage = false
```

Debe permanecer inventariada.

No interpretar su responsabilidad.

## Caso 16 — PostgreSQL no hardcodeado

### Entrada

Dos archivos importan:

`pg`

### Esperado

No generar shared resource candidate únicamente por el nombre del package.

La interpretación pertenece a analysis.

## Caso 17 — Cosmos usado en varios archivos

### Entrada

Dos archivos importan:

`@azure/cosmos`

### Esperado

Puede generar candidato:

```text
evidenceStatus = INFERRED
```

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

## Caso 19 — Arquitectura observable

### Entrada

Source presenta adapters y services separados.

### Esperado

Registrar observaciones actuales.

No declarar automáticamente:

`ALIGNED`

porque esa evaluación pertenece a assessment.

## Caso 20 — Patrón observable

### Entrada

Existe una implementación claramente identificable como repository.

### Esperado

Puede registrar patrón observable con evidencia.

No inferir patrón solo por filename.

## Caso 21 — Source excesivamente grande

### Entrada

Archivo source supera el límite del script.

### Esperado

No bloquear discovery completo.

Registrar warning:

`FILE_TOO_LARGE`

y continuar cuando sea seguro.

## Caso 22 — package.json inválido

### Entrada

`package.json` no contiene JSON válido.

### Esperado

Registrar warning.

No inventar dependencias.

El resultado puede quedar incompleto.

## Caso 23 — stdout puro

### Entrada

Se ejecuta:

`inventory.js`

### Esperado

stdout contiene exclusivamente JSON válido.

Logs diagnósticos, si existen, deben ir a stderr.

## Caso 24 — No recomendaciones

### Entrada

Se detecta:

`@azure/functions ^1.x`

### Esperado

Discovery registra versión actual.

No recomienda:

`4.x`

No consulta baseline.

No genera actionStatus.

## Caso 25 — No lectura de toolkit

### Entrada

Repositorio contiene:

`.github/skills/**`

además del source.

### Esperado

Los archivos del toolkit no se analizan como source de la Function App.

## Criterio general

Discovery debe seguir:

`inventariar ampliamente → interpretar mínimamente`

Desconocido:

`≠ ignorado`

Señal:

`≠ hecho confirmado`
