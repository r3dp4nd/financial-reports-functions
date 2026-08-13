# Evals — Analyze Function

## Caso 1 — Function simple y testeable

### Entrada

Function HTTP con:

- Programming Model v4.
- handler pequeño.
- lógica delegada a un servicio.
- dependencias inyectables.
- unit tests existentes.
- sin Durable Functions.

### Esperado

El skill debe:

- identificar el comportamiento principal;
- clasificar testabilidad como `HIGH`;
- detectar que Programming Model v4 ya está cumplido;
- no proponer migración del Programming Model;
- no proponer Clean Architecture adicional;
- identificar únicamente los tests faltantes si existe un gap observable;
- clasificar Durable Functions como `NOT_APPLICABLE`;
- mantener el refactor requerido como `NONE` cuando no exista necesidad real.

---

## Caso 2 — Handler acoplado a Azure SDK

### Entrada

Function que:

- crea `CosmosClient` dentro del handler;
- lee `process.env` directamente;
- contiene validación y lógica de negocio;
- no tiene tests.

### Esperado

El skill debe:

- identificar el comportamiento actual antes de proponer cambios;
- registrar creación directa del cliente SDK;
- registrar uso directo de configuración;
- clasificar testabilidad como `LOW` o `MEDIUM` con justificación;
- proponer tests de caracterización o unitarios para preservar comportamiento;
- clasificar el refactor como `MINIMAL` cuando baste con aislar configuración, cliente y lógica;
- clasificar esos cambios como `REQUIRED_TESTABILITY`;
- no convertir automáticamente el caso en una arquitectura completa por capas;
- no modificar código.

---

## Caso 3 — Function legacy que requiere Programming Model v4

### Entrada

Function con:

- `function.json`;
- handler basado en `context`;
- Programming Model legacy confirmado;
- lógica de negocio mezclada con el adapter Azure.

### Esperado

El skill debe:

- identificar Programming Model legacy;
- registrar los puntos de acoplamiento relevantes con Azure Functions;
- indicar que la migración del Programming Model será necesaria posteriormente;
- no ejecutar la transformación;
- proponer únicamente el refactor mínimo requerido para testabilidad;
- diferenciar `REQUIRED_PLATFORM` de `REQUIRED_TESTABILITY`;
- preservar el comportamiento actual como referencia para tests.

---

## Caso 4 — Function ya en Programming Model v4

### Entrada

Function registrada mediante `app.http`, `app.timer`, `app.serviceBusQueue` u otro registro v4.

La Function presenta problemas de testabilidad o estructura interna.

### Esperado

El skill debe:

- registrar Programming Model v4 como ya satisfecho;
- no proponer `migrate-programming-model-v4`;
- analizar igualmente testabilidad, dependencias y compatibilidad Node.js 24;
- permitir refactor cuando esté justificado;
- separar claramente modernización estructural de migración de plataforma.

---

## Caso 5 — Durable Orchestrator

### Entrada

Orchestrator Durable que:

- llama varias Activities;
- contiene decisiones de flujo;
- utiliza APIs de Durable Functions;
- forma parte de un workflow con starter y activities.

### Esperado

El skill debe:

- identificar el rol `orchestrator`;
- analizarlo dentro del contexto mínimo de su workflow;
- identificar las Activities invocadas cuando exista evidencia;
- no tratar las Activities como lógica totalmente independiente cuando el comportamiento dependa del orchestrator;
- revisar restricciones de determinismo relevantes;
- proponer tests centrados en decisiones y secuencia observable;
- no migrar Durable Functions;
- no analizar toda la Function App si no es necesario.

---

## Caso 6 — Durable Activity

### Entrada

Activity Durable que:

- recibe datos del orchestrator;
- usa un repositorio;
- devuelve un resultado;
- no contiene decisiones complejas.

### Esperado

El skill debe:

- identificar el rol `activity`;
- comprender el contrato de entrada y salida;
- analizar únicamente las relaciones necesarias con el workflow;
- no cargar todo el grafo Durable si no es necesario;
- proponer unit tests sobre su comportamiento;
- evitar sobrearquitectura si la Activity ya está correctamente aislada.

---

## Caso 7 — Compatibilidad Node.js 24 no confirmable

### Entrada

Function que utiliza:

- una dependencia legacy;
- una API Node.js cuya compatibilidad con Node.js 24 no puede confirmarse con la evidencia disponible.

### Esperado

El skill debe:

- no afirmar compatibilidad;
- no afirmar incompatibilidad sin evidencia;
- registrar `REQUIRES_VALIDATION`;
- indicar qué evidencia oficial o validación falta;
- mantener la incertidumbre visible en `analysis.json`;
- no usar compilación exitosa como prueba suficiente de compatibilidad runtime.

---

## Caso 8 — Dependencia compatible pero antigua

### Entrada

Function que usa una librería antigua, pero no existe evidencia de que bloquee Node.js 24 ni la migración.

### Esperado

El skill debe:

- no clasificar automáticamente la antigüedad como `CHANGE_REQUIRED`;
- registrar como `TECHNICAL_DEBT` cuando corresponda;
- separar deuda técnica de cambio obligatorio;
- no recomendar actualización solo por disponer de una versión más reciente.

---

## Caso 9 — Optimización detectada durante el análisis

### Entrada

Function donde se observa:

- posibilidad de cache;
- batching;
- paralelización;
- mejora de queries;
- reducción potencial de llamadas externas.

### Esperado

El skill debe:

- registrar la observación como `OPTIMIZATION`;
- mantenerla fuera del alcance de la migración;
- no convertirla en requisito;
- no modificar comportamiento para aplicarla.

---

## Caso 10 — Slice demasiado grande

### Entrada

Function que depende de varias carpetas, pero solo una parte del código es necesaria para comprender su comportamiento.

### Esperado

El skill debe:

- aplicar progressive disclosure;
- leer primero el entrypoint y dependencias directas;
- ampliar el contexto únicamente cuando exista una razón;
- no cargar toda la Function App por defecto;
- registrar una lección si fue necesario leer contexto innecesario debido a una limitación del skill.

---

## Caso 11 — Inconsistencia con inventory

### Entrada

`inventory.json` indica Programming Model legacy, pero el código analizado presenta evidencia directa de registro v4.

### Esperado

El skill debe:

- no sobrescribir silenciosamente el inventario;
- registrar la inconsistencia;
- marcar la conclusión correspondiente como `UNKNOWN` o pendiente de validación;
- recomendar refrescar `discover-function-app` cuando la evidencia indique que el inventario está desactualizado;
- no continuar basándose en una premisa contradictoria.

---

## Caso 12 — Sin tests, pero código ya aislado

### Entrada

Function con:

- handler delgado;
- lógica separada;
- dependencias sustituibles;
- cero tests.

### Esperado

El skill debe:

- distinguir ausencia de tests de baja testabilidad;
- poder clasificar testabilidad como `HIGH`;
- proponer tests mínimos;
- no proponer refactor innecesario;
- mantener `refactor = NONE` cuando la estructura ya permite probar el comportamiento.

---

# Criterio general de éxito

Para todos los casos, el skill debe:

- distinguir hechos, inferencias y unknowns;
- preservar el comportamiento actual como referencia;
- separar cambios obligatorios de deuda técnica y optimización;
- no modificar código;
- no leer valores sensibles;
- consumir primero `inventory.json` y `assessment.json`;
- generar `analysis.json`;
- generar `analysis.md`;
- generar lecciones aprendidas;
- evitar análisis global innecesario.
