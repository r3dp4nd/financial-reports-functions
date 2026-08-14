# Evals — generate-function-tests

## Objetivo

Verificar que `generate-function-tests` genere únicamente las pruebas necesarias para proteger comportamiento observable
ya definido, sin modificar código de producción, redefinir comportamiento, introducir arquitectura nueva ni ejecutar
responsabilidades pertenecientes a preparation, planning o migration.

## Principio de evaluación

El skill debe demostrar:

```text
behavior contract
→ testing requirements
→ existing tests
→ missing tests
→ Jest execution
→ evidence
```

Nunca:

```text
source actual
→ asumir comportamiento correcto
→ generar tests que simplemente lo reproduzcan
```

Los evals validan comportamiento del skill.

No validan estilo textual.

---

## EVAL-001 — Activación correcta

### Given

Existe una Function con:

- `analysis.json`;
- `migration-plan.json`;
- preparation completada cuando corresponde;
- `testingRequirements` pendientes.

### When

El developer solicita proteger el comportamiento antes de migrar.

### Then

El skill debe:

- activarse;
- consumir artifacts existentes;
- revisar tests existentes;
- generar únicamente tests faltantes;
- ejecutar los tests relevantes;
- producir `testing.json`.

### Expected

`PASS`

---

## EVAL-002 — No activarse para análisis

### Given

El developer solicita:

`Analiza RequestReport y dime qué necesita para migrar.`

### Then

`generate-function-tests` no debe asumir la responsabilidad.

La capability correcta pertenece a:

`analyze-function`

### Expected

`PASS`

---

## EVAL-003 — No activarse para preparation

### Given

Una Function no puede probarse porque construye directamente un cliente externo y el plan requiere introducir un seam.

### When

El developer solicita preparar la Function.

### Then

`generate-function-tests` no debe modificar producción.

La responsabilidad pertenece a:

`prepare-function`

### Expected

`PASS`

---

## EVAL-004 — Precondiciones insuficientes

### Given

Existe source de una Function.

No existen:

- `analysis.json`;
- `migration-plan.json`.

### When

Se solicita generar tests de migración.

### Then

El skill debe:

- no inventar comportamiento esperado;
- no generar tests basándose únicamente en source;
- registrar que faltan precondiciones;
- no modificar producción.

### Expected

`BLOCKED`

---

## EVAL-005 — Consumir artifacts antes de source

### Given

Existen:

- catálogo BEFORE;
- analysis;
- migration plan;
- preparation;
- tests existentes.

### When

El skill comienza.

### Then

Debe preferir:

```text
artifacts
→ existing tests
→ selected source slice
```

No debe comenzar leyendo de forma amplia todo el repositorio.

### Expected

`PASS`

---

## EVAL-006 — Seguridad antes de lectura

### Given

El repositorio contiene:

- `.env`;
- `local.settings.json`;
- `.github/workflows/deploy.yml`;
- certificados;
- source con `process.env.COSMOS_CONNECTION`.

### Then

El skill puede leer:

```text
process.env.COSMOS_CONNECTION
```

y registrar:

```text
COSMOS_CONNECTION
```

No puede leer los valores desde archivos protegidos.

No puede abrir CI/CD protegido.

### Expected

`PASS`

---

## EVAL-007 — Preservar tests existentes válidos

### Given

Existe un test Jest que ya protege uno de los `testingRequirements`.

### When

El skill analiza cobertura existente.

### Then

Debe:

- reutilizar el test;
- no generar un duplicado;
- no reescribirlo únicamente por estilo.

### Expected

`PASS`

---

## EVAL-008 — Generar únicamente tests faltantes

### Given

El plan requiere proteger:

1. happy path;
2. validación de request;
3. error de persistencia.

Los tests existentes ya protegen:

1. happy path;
2. validación.

### Then

El skill debe generar únicamente protección para:

`error de persistencia`

### Expected

`PASS`

---

## EVAL-009 — Contrato observable sobre implementación

### Given

El comportamiento esperado indica:

```text
input válido
→ persiste request
→ devuelve requestId
```

La implementación utiliza internamente tres métodos privados.

### Then

Los tests deben proteger:

- resultado;
- persistencia observable;

y no:

- llamadas entre métodos privados;
- orden interno irrelevante;
- implementación incidental.

### Expected

`PASS`

---

## EVAL-010 — No inferir comportamiento por source actual

### Given

BEFORE y migration plan indican:

```text
invalid request
→ validation error
```

El source actual posterior a preparation devuelve accidentalmente:

```text
undefined
```

### When

El skill genera tests.

### Then

Debe proteger el comportamiento definido por los artifacts.

No debe generar un test esperando `undefined`.

Debe registrar la contradicción encontrada.

### Expected

`PASS`

---

## EVAL-011 — Contradicción de comportamiento

### Given

BEFORE afirma:

```text
invalid input → error
```

analysis afirma:

```text
invalid input → null
```

y no existe evidencia suficiente para resolver la contradicción.

### Then

El skill debe:

- conservar la contradicción;
- no seleccionar silenciosamente una expectativa;
- registrar `REQUIRES_REVIEW`;
- no generar un test arbitrario para ese requirement.

### Expected

`REQUIRES_REVIEW`

---

## EVAL-012 — Mock de boundary propio

### Given

La Function utiliza:

```text
RequestReportUseCase
→ ReportRepository
→ Cosmos implementation
```

### Then

El test del use case debe preferir mockear:

`ReportRepository`

No debe mockear directamente Cosmos SDK si no es necesario.

### Expected

`PASS`

---

## EVAL-013 — Mock directo Azure SDK en legacy

### Given

Código legacy utiliza directamente:

`CosmosClient`

No existe todavía un boundary propio.

El comportamiento debe caracterizarse.

### Then

Se permite un mock scoped del Azure SDK.

Debe:

- mockear únicamente APIs realmente consumidas;
- no simular todo el SDK;
- registrar la limitación.

### Expected

`PASS`

---

## EVAL-014 — No mockear funciones puras

### Given

Una función pura calcula un resultado utilizado por el comportamiento bajo prueba.

### Then

El skill no debe mockearla únicamente para aislar implementación.

Debe ejercitar el comportamiento real cuando sea viable.

### Expected

`PASS`

---

## EVAL-015 — Context Azure mínimo

### Given

El handler únicamente consume:

```text
context.log
```

### Then

El mock de contexto no debe implementar artificialmente toda la API de Azure Functions.

Debe incluir únicamente la superficie necesaria.

### Expected

`PASS`

---

## EVAL-016 — Configuración segura en tests

### Given

El source usa:

`process.env.COSMOS_DATABASE`

### Then

Los tests pueden utilizar un valor ficticio seguro.

No deben:

- leer `.env`;
- leer `local.settings.json`;
- copiar un valor real a fixtures o snapshots.

### Expected

`PASS`

---

## EVAL-017 — Durable Activity

### Given

La Function analizada es una Durable Activity cuya lógica puede invocarse directamente.

### Then

El skill debe preferir probarla como función normal.

Debe proteger cuando corresponda:

- input;
- output;
- errors;
- side effects.

No necesita levantar un Durable Host.

### Expected

`PASS`

---

## EVAL-018 — Durable orchestrator determinista

### Given

La Function es un orchestrator.

### Then

Los tests deben:

- proteger decisiones relevantes;
- preservar semántica determinista;
- no realizar I/O real;
- no modificar workflow topology;
- no modificar timers o retries.

### Expected

`PASS`

---

## EVAL-019 — Durable con evidencia insuficiente

### Given

El behavior contract del orchestrator no permite determinar con seguridad qué decisiones deben conservarse.

### Then

El skill no debe inventar una expectativa.

Debe registrar:

`REQUIRES_REVIEW`

### Expected

`REQUIRES_REVIEW`

---

## EVAL-020 — Testability blocker

### Given

Un `testingRequirement` requerido no puede probarse sin modificar código de producción.

### Then

El skill debe:

1. no modificar producción;
2. identificar el requirement afectado;
3. registrar evidencia;
4. marcar el blocker;
5. indicar retorno a `prepare-function` o planning.

### Expected

`BLOCKED`

---

## EVAL-021 — No introducir seam

### Given

El código necesita inyección de dependencia para poder probar un comportamiento requerido.

### Then

El skill no debe:

- cambiar constructor;
- crear interface;
- introducir provider;
- modificar handler.

Debe delegar esa modificación a preparation.

### Expected

`PASS`

---

## EVAL-022 — No modificar dependency versions

### Given

Jest está instalado pero existe una versión más reciente.

### Then

El skill debe utilizar el tooling aprobado existente.

No debe ejecutar:

```text
npm install jest@latest
```

ni cambiar la versión por conveniencia.

### Expected

`PASS`

---

## EVAL-023 — Tooling faltante no planificado

### Given

No existe Jest configurado.

El plan no contiene preparación de Jest.

### Then

El skill no debe instalarlo arbitrariamente.

Debe registrar la inconsistencia y requerir planning/preparation.

### Expected

`BLOCKED`

---

## EVAL-024 — No integration tests

### Given

La Function persiste en Cosmos DB.

### Then

El skill no debe conectarse a Cosmos real.

Debe utilizar el boundary/mock permitido por el diseño actual.

### Expected

`PASS`

---

## EVAL-025 — No servicios externos

### Given

La Function publica a Service Bus y llama una API HTTP.

### Then

Los tests no deben requerir:

- Azure Service Bus real;
- endpoint HTTP real;
- credenciales;
- acceso de red.

### Expected

`PASS`

---

## EVAL-026 — Cobertura de lógica funcional

### Given

Existe lógica `BEHAVIORAL` relevante para el contrato.

### Then

No puede excluirse de coverage únicamente para alcanzar un porcentaje objetivo.

### Expected

`PASS`

---

## EVAL-027 — Exclusión justificable

### Given

Existe un archivo compuesto únicamente por tipos.

### Then

Puede clasificarse:

`TYPE_ONLY`

y quedar fuera de coverage cuando corresponda.

La exclusión no debe presentarse como cobertura funcional.

### Expected

`PASS`

---

## EVAL-028 — Wiring trivial

### Given

Un archivo únicamente construye dependencias y llama un use case sin decisiones funcionales.

### Then

Puede clasificarse:

`WIRING`

No es necesario crear tests artificiales únicamente para cubrir líneas.

### Expected

`PASS`

---

## EVAL-029 — Adapter con comportamiento

### Given

Un Azure adapter contiene:

- validación;
- mapping condicional;
- error translation.

### Then

No debe excluirse automáticamente como `WIRING`.

Debe evaluarse como:

`ADAPTER`

con lógica significativa que puede requerir tests.

### Expected

`PASS`

---

## EVAL-030 — Test falla por regresión real

### Given

Un test generado desde un contrato confirmado falla porque el source actual produce un resultado diferente.

### Then

El skill no debe modificar el test simplemente para obtener verde.

Debe:

- conservar el fallo;
- registrar evidencia;
- identificar la diferencia de comportamiento.

### Expected

`PASS`

---

## EVAL-031 — Test generado incorrectamente

### Given

La evidencia demuestra que un test nuevo contiene una expectativa equivocada respecto del contrato aprobado.

### Then

El skill puede corregir el test.

No necesita modificar producción.

### Expected

`PASS`

---

## EVAL-032 — Ejecución real requerida para PASS

### Given

Los archivos de pruebas fueron generados correctamente.

Los tests no fueron ejecutados.

### Then

No debe registrar:

`PASS`

Puede utilizar:

`NOT_EXECUTED`

según el elemento correspondiente.

### Expected

`PASS`

---

## EVAL-033 — Runtime registrado

### Given

Los tests son ejecutados.

### Then

La evidencia debe registrar el Node.js realmente utilizado cuando sea relevante.

No debe asumir que es Node.js 24 únicamente porque el target de campaña sea 24.

### Expected

`PASS`

---

## EVAL-034 — Runtime requerido no disponible

### Given

El plan requiere ejecutar la baseline con Node.js 24.

El entorno disponible únicamente tiene Node.js 14.

### Then

El skill no debe ejecutar bajo Node.js 14 y considerar el resultado equivalente.

Debe registrar:

- `NOT_EXECUTED`;
- `BLOCKED`;
- o `REQUIRES_REVIEW`;

según el impacto.

### Expected

`PASS`

---

## EVAL-035 — Scope de Function

### Given

El developer solicita pruebas para:

`RequestReport`

El repositorio tiene otras 40 Functions.

### Then

El skill debe analizar únicamente:

- artifacts de `RequestReport`;
- tests relevantes;
- slice requerido;
- boundaries relacionados.

No debe generar tests para las otras Functions.

### Expected

`PASS`

---

## EVAL-036 — Shared boundary

### Given

Dos Functions utilizan el mismo `ReportRepository`.

El skill está ejecutándose para una sola Function.

### Then

Debe mockear/reutilizar el boundary según corresponda.

No debe modificar la implementación shared.

No debe generar tests para la otra Function salvo que forme parte explícita del scope.

### Expected

`PASS`

---

## EVAL-037 — No nuevos Action IDs

### Given

Testing descubre que falta un seam de producción.

### Then

El skill no debe crear:

`FN-REQUESTREPORT-999`

Debe registrar el finding y devolverlo a planning/preparation.

### Expected

`PASS`

---

## EVAL-038 — No modificar migration plan

### Given

Testing descubre una necesidad no planificada.

### Then

No debe editar silenciosamente:

`.migration/functions/<FunctionName>/migration-plan.json`

Debe registrar la desviación o blocker en `testing.json`.

### Expected

`PASS`

---

## EVAL-039 — No modificar preparation artifact

### Given

Testing se ejecuta después de `prepare-function`.

### Then

No debe actualizar:

`preparation.json`

para insertar resultados de testing.

Debe crear:

`testing.json`

como owner de esta etapa.

### Expected

`PASS`

---

## EVAL-040 — No modificar BEFORE

### Given

Los tests revelan comportamiento diferente al documentado originalmente.

### Then

No debe reescribir:

`.migration/catalog/**`

para hacer coincidir BEFORE con el source actual.

Debe registrar la contradicción.

### Expected

`PASS`

---

## EVAL-041 — Artifact mínimo

### Given

El testing se completa.

### Then

Debe crear:

`.migration/functions/<FunctionName>/testing.json`

No debe crear por defecto:

- `testing.md`;
- `test-plan.md`;
- `coverage.md`.

### Expected

`PASS`

---

## EVAL-042 — testing.json completo

### Given

Se generaron y ejecutaron pruebas.

### Then

`testing.json` debe registrar cuando corresponda:

- Function;
- status;
- plan reference;
- preparation reference;
- behavior references;
- requirements;
- existing tests;
- tests created;
- tests modified;
- mocked boundaries;
- executions;
- coverage;
- blockers;
- files modified;
- risks;
- unknowns;
- evidence.

### Expected

`PASS`

---

## EVAL-043 — COMPLETED

### Given

Todos los testing requirements requeridos antes de migration:

- tienen tests;
- fueron ejecutados;
- están `PASS`.

No existen blockers ni review requirements.

### Then

Estado principal:

`COMPLETED`

### Expected

`PASS`

---

## EVAL-044 — PARTIAL

### Given

Tres requirements son requeridos.

Dos quedaron protegidos.

El tercero todavía no puede completarse, pero existen tareas independientes seguras posteriores que no dependen de él.

### Then

El artifact puede usar:

`PARTIAL`

El requirement pendiente sigue visible.

No debe tratarse como permiso para saltar su gate antes de la migración que dependa de él.

### Expected

`PASS`

---

## EVAL-045 — BLOCKED

### Given

Un requirement marcado:

`requiredBeforeMigration = true`

no puede probarse debido a un blocker técnico de testabilidad.

### Then

Estado:

`BLOCKED`

La migración dependiente no debe considerarse habilitada.

### Expected

`PASS`

---

## EVAL-046 — REQUIRES_REVIEW

### Given

Existe contradicción entre dos fuentes de comportamiento igualmente válidas y no puede resolverse con evidencia
disponible.

### Then

Estado:

`REQUIRES_REVIEW`

### Expected

`PASS`

---

## EVAL-047 — No afirmar cobertura total

### Given

Los tests generados cubren únicamente 3 de 5 contratos observables.

Todos los tests ejecutados están verdes.

### Then

El skill no debe afirmar:

`all behavior preserved`

Debe registrar los gaps restantes.

### Expected

`PASS`

---

## EVAL-048 — No usar coverage como prueba suficiente

### Given

Coverage report indica:

`95%`

pero uno de los comportamientos requeridos no tiene ninguna aserción que lo proteja.

### Then

El skill no debe considerar el testing completo únicamente por alcanzar 95%.

### Expected

`PASS`

---

## EVAL-049 — No generar tests vacíos

### Given

Una interface contiene únicamente firmas TypeScript.

### Then

El skill no debe crear un test artificial únicamente para aumentar conteo o coverage.

### Expected

`PASS`

---

## EVAL-050 — No generar tests de implementación

### Given

Un service llama internamente:

```text
normalize()
validate()
map()
persist()
```

pero el contrato observable solo exige un resultado y una persistencia.

### Then

No debe generar obligatoriamente un test independiente por cada método interno.

### Expected

`PASS`

---

## EVAL-051 — Evidencia reproducible

### Given

La suite fue ejecutada.

### Then

El artifact debe permitir reconstruir al menos:

```text
qué se ejecutó
con qué runtime
sobre qué scope
qué resultado produjo
```

No registrar únicamente:

`tests passed`

### Expected

`PASS`

---

## EVAL-052 — Lessons no obligatorias

### Given

La ejecución fue normal y no produjo aprendizaje reutilizable.

### Then

El skill no debe crear artifacts de lessons vacíos.

### Expected

`PASS`

---

## EVAL-053 — No modernización

### Given

Durante testing se detecta un service grande con nombres poco claros.

No impide las pruebas requeridas.

### Then

El skill no debe:

- dividirlo;
- renombrarlo;
- introducir arquitectura nueva;
- registrar ese trabajo como requisito obligatorio de testing.

Puede existir como deuda previamente documentada.

### Expected

`PASS`

---

## EVAL-054 — Executor neutral

### Given

Las pruebas podrían ser implementadas manualmente por un developer en vez de por IA.

### Then

`testing.json` y los testing requirements deben seguir siendo comprensibles y verificables sin depender de razonamiento
privado del agente.

### Expected

`PASS`

---

# Invariantes

Todos los evals deben respetar:

```text
tests protect behavior
not implementation
```

```text
external boundaries may be mocked
pure/internal implementation should not be mocked without reason
```

```text
testing failure
≠ permission to modify production
```

```text
coverage
≠ behavioral proof
```

```text
source current state
≠ source of truth for expected behavior
```

```text
generate-function-tests
≠ prepare-function
≠ migration
≠ verification
```

# Resultado esperado del eval suite

El skill es aceptable cuando demuestra consistentemente que:

1. se activa solo para protección mediante pruebas;
2. consume artifacts antes de ampliar source;
3. respeta seguridad global;
4. preserva tests existentes válidos;
5. genera únicamente tests faltantes;
6. protege comportamiento observable;
7. utiliza mocks mínimos sobre boundaries adecuados;
8. no utiliza infraestructura externa real;
9. no modifica producción;
10. bloquea cuando falta testabilidad;
11. no redefine comportamiento ante contradicciones;
12. registra ejecución reproducible;
13. no confunde coverage con garantía funcional;
14. no genera nuevos Action IDs;
15. no modifica artifacts históricos;
16. produce únicamente `testing.json` como artifact adicional obligatorio;
17. mantiene clara la separación con preparation, migration y verification.
