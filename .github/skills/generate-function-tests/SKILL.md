---
name: generate-function-tests
description: Genera y ejecuta pruebas Jest faltantes para proteger el comportamiento observable de una Function antes de su migración técnica, consumiendo los contratos y requisitos ya definidos sin modificar código de producción.
---

# Generate Function Tests

## Objetivo

Proteger mediante pruebas automatizadas el comportamiento observable que el plan exige preservar antes de continuar con
la migración técnica de una Function.

Debe:

- consumir comportamiento y testing requirements existentes;
- identificar cobertura de comportamiento ya disponible;
- generar únicamente las pruebas faltantes;
- utilizar boundaries apropiados para mocks;
- ejecutar las pruebas relevantes;
- registrar evidencia reproducible.

No modifica código de producción.

No refactoriza.

No redefine comportamiento.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/lessons-policy.md`

La estructura y seams requeridos deben haber sido resueltos previamente por:

`prepare-function`

Este skill no aplica `architecture-policy.md` para modificar producción.

## Precondiciones

Deben existir:

- analysis de la Function;
- migration plan de la Function.

Cuando el plan requiera preparation local, debe existir:

`.migration/functions/<FunctionName>/preparation.json`

La preparation requerida debe haber concluido sin blockers que impidan testing.

Cuando Jest o tooling dependan de preparación global, debe existir evidencia de que las acciones globales requeridas
fueron ejecutadas.

Si falta una condición requerida:

- no inventar infraestructura de testing;
- registrar el blocker;
- no modificar producción para resolverlo.

## Entradas

Consumir primero:

- catálogo BEFORE de la Function;
- `analysis.json`;
- Function migration plan;
- `preparation.json` cuando exista;
- tests existentes relevantes;
- configuración Jest existente;
- package scripts relevantes.

No reconstruir analysis.

No reinterpretar planning.

## Fuente del comportamiento esperado

El comportamiento que debe protegerse proviene principalmente de:

```text
BEFORE
+
analysis.behavior
+
plan.behaviorToPreserve
+
plan.testingRequirements
```

El source actual se utiliza para implementar las pruebas y resolver detalles técnicos.

No utilizar exclusivamente el source actual para redefinir qué comportamiento es correcto.

Si existe contradicción entre:

- BEFORE;
- analysis;
- plan;
- source actual;

registrarla conforme a `evidence-policy.md`.

No resolverla silenciosamente mediante un test que simplemente reproduzca el source encontrado.

## Progressive disclosure

Preferir:

```text
testingRequirements
→ existing tests
→ selected Function slice
→ direct boundaries
→ additional source only when necessary
```

No cargar todas las pruebas del repositorio.

No analizar todas las Functions.

Reutilizar convenciones existentes cuando sean compatibles y relevantes.

## Tests existentes

Antes de generar pruebas:

1. localizar tests relevantes;
2. identificar qué comportamiento ya protegen;
3. identificar gaps respecto de `testingRequirements`;
4. preservar tests válidos;
5. evitar duplicados.

No reescribir una suite válida únicamente para uniformizar estilo.

## Qué proteger

Priorizar comportamiento observable.

Cuando corresponda:

1. flujo principal;
2. validaciones relevantes;
3. decisiones funcionales;
4. outputs;
5. errores relevantes;
6. persistencia observable;
7. mensajes publicados;
8. llamadas externas relevantes;
9. otros side effects definidos por el contrato.

Regla:

```text
same input
→ same output
→ same relevant errors
→ same observable side effects
```

No probar detalles internos sin valor contractual.

## Tipo de pruebas

El alcance actual utiliza Jest.

Priorizar:

- characterization tests;
- unit tests;
- contract-like tests sobre boundaries propios cuando sean útiles.

No agregar integration tests.

No depender de servicios Azure reales.

No depender de bases de datos reales.

No depender de red.

## Clasificación de unidades

Cuando sea útil para decidir cobertura, clasificar código relevante como:

- `BEHAVIORAL`;
- `ADAPTER`;
- `WIRING`;
- `CONTRACT`;
- `TYPE_ONLY`;
- `GENERATED`.

### BEHAVIORAL

Contiene decisiones o comportamiento funcional.

Debe estar protegido cuando forme parte del contrato relevante.

### ADAPTER

Adaptación entre runtime, protocolo o infraestructura y lógica interna.

Cubrir cuando contenga comportamiento significativo.

No exigir cobertura artificial sobre wiring trivial.

### WIRING

Composición sin comportamiento significativo.

Puede quedar fuera de cobertura cuando exista justificación.

### CONTRACT

Interfaces, tipos o contratos sin lógica.

No requieren tests únicamente para aumentar coverage.

### TYPE_ONLY

Código exclusivamente de tipos.

No requiere tests de runtime.

### GENERATED

Código generado.

Excluir cuando corresponda.

## Coverage

Coverage debe utilizarse como evidencia de qué comportamiento está protegido.

No utilizarlo como objetivo aislado.

No excluir código únicamente para aumentar el porcentaje.

Cuando exista exclusión, debe corresponder a una categoría justificable como:

- `WIRING`;
- `CONTRACT`;
- `TYPE_ONLY`;
- `GENERATED`.

Lógica `BEHAVIORAL` excluida para mejorar coverage debe registrarse como finding.

Mantener compatibilidad con herramientas como SonarQube cuando la configuración del proyecto lo requiera.

Este skill no modifica configuración global de coverage salvo que exista una acción explícita del plan asignada a esta
capability.

## Mocks

Preferir mocks sobre boundaries externos.

Ejemplos:

- Repository;
- Publisher;
- Gateway;
- Storage;
- Provider;
- Client abstraction.

No mockear funciones puras.

No mockear implementación interna únicamente para hacer pasar un test.

No acoplar tests a:

- métodos privados;
- orden interno irrelevante;
- detalles de composición que no formen parte del contrato.

## Azure SDK y legacy

Cuando exista un boundary propio:

```text
Function / UseCase
→ mock own boundary
```

Preferirlo sobre mocks directos del Azure SDK.

Cuando código legacy todavía dependa directamente de un Azure SDK y no exista boundary apropiado:

puede utilizarse un mock scoped del SDK para characterization.

En ese caso:

- mockear únicamente la superficie consumida;
- evitar representar APIs no utilizadas;
- no convertir el mock en una simulación completa del SDK;
- registrar la limitación.

La necesidad de un boundary nuevo no autoriza modificar producción desde este skill.

## Configuración

Puede mockear o proporcionar nombres de configuración requeridos por el código bajo prueba cuando sea seguro.

No leer:

- `.env*`;
- `local.settings.json`;
- CI/CD protegido;
- otros archivos protegidos.

Nunca cargar valores reales.

Los tests deben utilizar valores ficticios seguros cuando necesiten representar configuración.

## Azure Functions context

Cuando sea necesario representar contexto Azure:

- utilizar únicamente la superficie consumida por la Function;
- mantener el mock mínimo;
- no simular APIs no observadas.

No utilizar un Azure Functions Host real como requisito para unit tests.

## Durable Activities

Una Durable Activity puede probarse como función normal cuando su comportamiento lo permita.

Proteger:

- input;
- output;
- errores;
- side effects relevantes.

No ejecutar un workflow completo para probar una Activity aislada.

## Durable orchestrators

Para orchestrators:

- preservar decisiones observables;
- respetar determinismo;
- no realizar I/O real;
- mockear Activities o boundaries correspondientes cuando sea necesario;
- no modificar topology, retries, timers o events desde testing.

Cuando no pueda construirse una prueba confiable sin conocimiento adicional del workflow:

registrar `REQUIRES_REVIEW`.

## Testability blocker

Si una prueba requerida no puede implementarse sin modificar producción:

1. no modificar producción;
2. registrar el blocker;
3. identificar qué `testingRequirement` está afectado;
4. registrar evidencia;
5. indicar que debe volver a `prepare-function` o planning.

Ejemplo conceptual:

```text
required behavior
→ no existe seam sustituible
→ production change required
→ BLOCKED
→ prepare-function
```

Este skill no introduce el seam por sí mismo.

## Cambios permitidos

Puede:

- crear archivos de pruebas;
- modificar tests existentes únicamente cuando sea necesario y preserve su intención;
- utilizar helpers de test existentes;
- crear helpers de test locales cuando reduzcan duplicación real y tengan responsabilidad clara.

No debe modificar:

- código de producción;
- dependency versions;
- runtime configuration;
- Programming Model;
- Durable workflow;
- package manager;
- CI/CD protegido.

La modificación de configuración global Jest o coverage debe haber sido planificada y asignada explícitamente a esta
capability; de lo contrario pertenece a preparación global.

## Ejecución

Ejecutar únicamente la suite relevante cuando sea posible.

Registrar:

- command;
- Node.js runtime utilizado;
- suites;
- tests;
- passed;
- failed;
- skipped;
- duration cuando esté disponible;
- coverage cuando corresponda;
- status;
- evidence.

No utilizar el runtime Node.js de las tools como sustituto silencioso del runtime requerido por la aplicación.

## Resultado de pruebas

Cada ejecución o requirement evaluado utiliza:

- `PASS`;
- `FAIL`;
- `NOT_EXECUTED`;
- `NOT_APPLICABLE`;
- `REQUIRES_REVIEW`.

No afirmar `PASS` sin ejecución.

Un test que falla porque detecta una diferencia real de comportamiento no debe modificarse automáticamente para hacerlo
verde.

Registrar primero la contradicción.

## Tests fallidos

Ante un fallo:

### Test incorrecto

Si la evidencia demuestra que el test contradice el contrato aprobado:

corregir únicamente el test.

### Producción incompatible con comportamiento esperado

No modificar producción.

Registrar el finding y detener el requirement afectado.

### Evidencia insuficiente

Usar:

`REQUIRES_REVIEW`

No escoger silenciosamente qué comportamiento debe considerarse correcto.

## Salida estructurada

Crear:

`.migration/functions/<FunctionName>/testing.json`

No generar un Markdown adicional por defecto.

Los archivos Jest constituyen la evidencia ejecutable.

## testing.json

Debe contener cuando corresponda:

- `schemaVersion`;
- `function`;
- `status`;
- `planRef`;
- `preparationRef`;
- `behaviorRefs`;
- `testingRequirements`;
- `existingTests`;
- `testsCreated`;
- `testsModified`;
- `testabilityBlockers`;
- `mockedBoundaries`;
- `coverageClassification`;
- `executions`;
- `coverage`;
- `filesModified`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `evidence`.

No debe contener:

- cambios de producción;
- migration actions nuevas;
- dependency targets nuevos;
- architecture target.

## Testing requirements

Cada requirement debe registrar cuando corresponda:

- comportamiento esperado;
- evidencia de origen;
- test que lo protege;
- execution result.

Ejemplo conceptual:

    {
      "behavior": "Una solicitud válida persiste el request y retorna el identificador.",
      "testFile": "test/request-report.test.ts",
      "status": "PASS"
    }

No asignar Action IDs nuevos desde este skill.

## Estado principal

Usar:

- `COMPLETED`;
- `PARTIAL`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### COMPLETED

Todos los `testingRequirements` requeridos para continuar están protegidos y las validaciones requeridas finalizaron
satisfactoriamente.

### PARTIAL

Parte del comportamiento requerido quedó protegido, pero existen requirements pendientes que no invalidan trabajo
independiente.

No permite saltar un testing gate requerido por el plan.

### BLOCKED

Un impedimento técnico conocido impide proteger un comportamiento requerido.

### REQUIRES_REVIEW

La evidencia disponible no permite decidir de forma segura qué comportamiento debe protegerse o cómo resolver una
contradicción.

## Evidencia de comportamiento

Una suite verde demuestra únicamente los contratos cubiertos por esas pruebas.

No afirmar:

```text
all behavior preserved
```

si las pruebas solo cubren parte del contrato.

Registrar explícitamente gaps restantes.

## Catálogo BEFORE

No modificar:

`.migration/catalog/**`

Los tests protegen el comportamiento definido a partir de BEFORE.

No reescribir BEFORE a partir de los tests generados.

## Preparation artifact

No modificar:

`.migration/functions/<FunctionName>/preparation.json`

para reflejar testing posterior.

`testing.json` es owner de esta etapa.

## Migration plan

No modificar silenciosamente:

`.migration/functions/<FunctionName>/migration-plan.json`

Si testing revela una necesidad nueva:

- registrarla;
- no crear una nueva acción;
- volver a planning cuando corresponda.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts vacíos como requisito de cierre.

## Criterio de cierre

`COMPLETED` requiere:

- analysis y migration plan fueron consumidos;
- preparation requerida fue consumida;
- tests existentes fueron reutilizados cuando correspondía;
- testing requirements requeridos quedaron protegidos;
- tests generados protegen comportamiento observable y no detalles innecesarios;
- boundaries externos fueron mockeados de forma mínima;
- no se utilizó infraestructura real;
- pruebas requeridas fueron ejecutadas;
- resultados tienen evidencia;
- blockers y contradicciones quedaron explícitos;
- no se modificó código de producción;
- no se generaron nuevos Action IDs;
- no se redefinió comportamiento;
- no se modificó el catálogo BEFORE;
- se creó `testing.json`.

La ausencia de lessons no impide cerrar testing.

## Fuera de alcance

No debe:

- modificar código de producción;
- introducir nuevos seams;
- refactorizar;
- seleccionar dependency versions;
- instalar upgrades no planificados;
- cambiar Programming Model;
- cambiar Runtime;
- cambiar workflows Durable;
- crear integration tests;
- usar servicios externos reales;
- modificar tests únicamente para ocultar una regresión;
- aumentar coverage mediante exclusiones injustificadas;
- generar nuevos Action IDs;
- modificar silenciosamente el migration plan;
- modernizar;
- desplegar.

Siguiente etapa según el plan:

- `migrate-programming-model-v4`;
- `migrate-durable-functions-v4`;
- u otra acción técnica aprobada.
