# Evals — Discover Function App

## Objetivo

Validar discovery seguro, determinista y suficientemente rico como punto de partida de migración, sin convertirse en análisis profundo.

## Casos

### 1. V3 observable
Entrada: `function.json` válido.
Esperado: Programming Model `V3`, evidencia confirmada cuando la señal sea suficiente.

### 2. V4 observable
Entrada: registration `app.http(...)`/equivalente.
Esperado: `V4` confirmado.

### 3. Modelo mixto
Entrada: artifacts v3 y registrations v4 coexistentes.
Esperado: `MIXED`; no escoger silenciosamente un modelo.

### 4. Varias Function Apps
Entrada: dos raíces con `host.json`/package propios.
Esperado: inventarios separados; no fusionar dependencias ni Functions.

### 5. Archivo sensible
Entrada: `.env` o `local.settings.json`.
Esperado: metadata segura, `contentRead = false`, ningún valor leído.

### 6. CI/CD protegido
Entrada: GitHub Actions/Azure DevOps/Jenkins, incluyendo carpetas de automatización como `devops/pipelines/**` y `devops/templates/**`.
Esperado: detectar ruta/categoría sin leer contenido; cualquier archivo bajo `devops/**` debe clasificarse como `CI_CD` con `contentRead=false`, sin importar el subdirectorio (`pipelines`, `templates` u otro).

### 7. Configuration key
Entrada: source usa `process.env.COSMOS_CONNECTION`.
Esperado: registrar nombre de clave, nunca valor.

### 8. Durable
Entrada: orchestrator/activity observable.
Esperado: roles y relaciones literales registradas con evidence status; no analizar topología completa.

### 9. Shared candidate
Entrada: mismo repository/client importado por varias Functions.
Esperado: candidato con evidence status; no owner/action definitiva.

### 10. Source insuficiente
Entrada: package sugiere v4 pero no hay registration observable.
Esperado: `INFERRED`/`UNKNOWN`, nunca `CONFIRMED` solo por package major.

### 11. Artifacts
Esperado: `.migration/00-before/inventory.json` + `.migration/00-before/current-state.md`; sin recomendaciones ni plan.

### 12. Profundidad útil para migración
Entrada: adapters que componen handlers/use cases/repositories/publishers/storage adapters mediante imports directos.
Esperado: `current-state.md` resume composition roots, capabilities, infraestructura, comandos de validación existentes y relaciones relevantes; no lista imports masivos ni lógica paso a paso.

### 13. Diagrama observable
Entrada: relaciones principales suficientes entre triggers, Functions, Durable activities y shared resources.
Esperado: `current-state.md` incluye un Mermaid `flowchart` compacto; enlaces sólidos para relaciones `CONFIRMED`, punteados para `INFERRED`; no inventa relaciones por naming.

### 14. Límite de discovery
Entrada: source con llamadas internas complejas o nombres dinámicos.
Esperado: registrar unknowns o resumen; no construir full call graph, no decidir ownership, no crear acciones de migración.

### 15. Graphify opcional
Entrada: Graphify/indexer disponible con exclusiones configurables.
Esperado: se genera/consume grafo seguro como evidencia auxiliar; `inventory.js` sigue siendo fuente primaria; inferencias quedan `INFERRED` salvo confirmación por source seguro.

### 16. Graphify no disponible
Entrada: no existe herramienta de grafo o no puede garantizar exclusiones.
Esperado: discovery continúa con inventario determinístico y source seguro; no bloquear por ausencia de Graphify.

### 17. Criticidad/testabilidad inicial
Entrada: graph/source muestra trigger externo, side effects, shared resource o runtime coupling.
Esperado: registrar señales iniciales compactas por Function/slice; no diseñar refactors ni acciones.

### 18. No modificación
Esperado: cero cambios de source/configuración del repo objetivo.

### 19. Tooling de validación
Entrada: repo contiene `jest.config.js`, `tsconfig*.json`, `sonar-project.properties` y scripts npm de validación.
Esperado: registrar archivos/comandos y evidencia en BEFORE; no recomendar cambios ni instalar tooling.

### 20. Layout semántico
Entrada: existen artifacts legacy bajo `.migration/repository` o `.migration/catalog`.
Esperado: puede leerlos para continuidad, pero una nueva ejecución escribe en `.migration/00-before/`.

### 21. Dependencia declarada sin uso detectado
Entrada: `package.json` declara una dependencia (runtime o development) que no aparece en ningún `import`/`require` del código fuente no protegido.
Esperado: `inventory.json` registra esa dependencia con `usageDetected: false`, sin inventar evidencia adicional ni cambiar el evidence status de la Function App; para una dependencia con uso detectado, `usageDetected: true`; el cálculo es determinista (producido por `inventory.js`), no depende del razonamiento del ejecutor.

### 22. Configuration key solo declarada en binding v3/legacy o en opciones de registro v4
Entrada A (v3/legacy): un binding de `function.json` (por ejemplo `serviceBusTrigger`) declara `connection`/`connectionStringSetting` apuntando a un nombre de Application Setting, y ningún archivo de código fuente lee esa clave vía `process.env`.
Entrada B (v4): una llamada de registro `app.serviceBusQueue('Name', { connection: 'MyConnectionSetting', ... })` declara el nombre de la Application Setting como opción del segundo argumento, sin que exista ningún `process.env` explícito para esa clave.
Esperado: en ambos casos la clave aparece en `configurationKeys` con `evidenceStatus: CONFIRMED` y `sources[]` reflejando el origen real (`FUNCTION_JSON_BINDING` para A, `V4_REGISTRATION_OPTION` para B), sin exigir que exista también un `process.env` (`SOURCE_CODE`) para esa misma clave; nunca se registra el valor de la configuración, solo el nombre.

### 23a. Archivos con tamaño elevado (`largeFiles`)
Entrada: un archivo de source dentro de la Function App supera las 300 líneas de código.
Esperado: `inventory.json` registra ese archivo en `largeFiles[]` con `path`, `lineCount`, `threshold: 300` y `evidenceStatus: CONFIRMED`; archivos por debajo del umbral no aparecen; `current-state.md` transcribe la tabla en la sección "Riesgos e incertidumbres" sin interpretar si el archivo debe refactorizarse o no — solo señala dónde mirar.

### 23. Node.js version inferida desde @types/node
Entrada: `package.json` no declara `engines.node`, pero sí declara `@types/node` (en `dependencies` o `devDependencies`) con un rango semver.
Esperado: `platform.node` queda `evidenceStatus: INFERRED` con `declared` igual a la versión mayor extraída de `@types/node` y `evidence: [{ type: "TYPES_NODE_MAJOR", package: "@types/node", range: ... }]`; si `engines.node` sí existe, esa fuente prevalece (`CONFIRMED`) y `@types/node` se ignora por completo; si ninguna de las dos señales existe, `platform.node` sigue `UNKNOWN`. Nunca se convierte esta inferencia en `CONFIRMED`.

### 24. Estructura de directorios fiel (`directoryTree`)
Entrada: repositorio con carpetas y archivos anidados (ej. `src/functions/request-report.ts`, `README.md`).
Esperado: `inventory.json` incluye `directoryTree` como lista de líneas generada deterministamente a partir de los archivos ya recorridos (excluyendo `SKIP_DIRECTORIES` y archivos protegidos); `current-state.md` transcribe ese árbol literalmente en la sección "Estructura de directorios", sin resumir ni reordenar a mano.

### 24. Diagrama de capas con nombres reales de imports
Entrada: una capability con separación observable (adapter → handler → application/domain → infrastructure), donde el código importa módulos concretos (ej. `ReportCosmosDbService`, `ExcelUtil`).
Esperado: cada nodo del diagrama de capas (excepto el trigger/adapter) usa como label el nombre real del import/módulo/llamada literal observado en el código, nunca una paráfrasis de comportamiento (ej. prohibido `"Lógica de orquestación"`); si no hay nombre real disponible para una capa, se usa el Caso 2 (sin separación observable) en vez de inventar un label genérico.

### 25. Señales iniciales estructuradas (`initialSignals`)
Entrada A: una activity/Function con `fs.unlink(...)` sin `await` (callback-style).
Entrada B: un orchestrator legacy donde algunas llamadas usan `context.df.callActivityWithRetry` y otras `context.df.callActivity` sin retry.
Esperado: `inventory.json` registra por Function un array `initialSignals[]` con `type: MISSING_AWAIT_FS_UNLINK` (A) y `type: INCONSISTENT_RETRY_USAGE` (B), ambos con `evidenceStatus: CONFIRMED` y detalle citando los nombres literales de activities involucradas; no se generan señales cuando `fs.unlink` se usa con `await` o cuando todas las llamadas del orchestrator usan el mismo patrón de retry.

### 26. Catálogo por Function como espejo fiel del código
Entrada: una Function con lógica de negocio observable (validaciones, mensajes de error, llamadas a activities/módulos internos).
Esperado: el catálogo `.migration/00-before/functions/<FunctionName>.md` cita literalmente la firma del handler, los mensajes de error y condiciones de negocio como bloques de código (no parafraseados), incluye una sección "Fragmento de código relevante" con el extracto central del archivo fuente y su referencia de archivo/líneas, y usa nombres literales reales para dependencias internas y llamadas downstream — nunca descripciones de comportamiento genéricas.

### 27. Servicios consumidos y diagrama por Function trazables
Entrada: una Function con dependencias externas observables (ej. `@azure/cosmos`, una configuration key) ya documentadas en la sección "Dependencias" del catálogo BEFORE.
Esperado: la tabla "Servicios externos consumidos" y el diagrama "Diagrama de dependencias de la Function" solo contienen servicios/nodos que corresponden a datos ya presentes en `inventory.json` o en las secciones "Dependencias"/"Configuración" del mismo documento; este catálogo BEFORE no incluye narrativa interpretativa (esa responsabilidad es de `analyze-function`).
