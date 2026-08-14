---
name: analyze-function
description: Analiza una Function concreta para documentar comportamiento, dependencias, testabilidad, compatibilidad, acoplamientos e impacto técnico o estructural de su migración sin modificar código ni generar el plan de ejecución.
---

# Analyze Function

## Objetivo

Comprender una Function concreta y determinar qué implica migrarla al target técnico aprobado.

Debe identificar cuando corresponda:

- comportamiento observable que debe preservarse;
- slice funcional relevante;
- dependencias y consumidores;
- impacto de Node.js;
- impacto de Programming Model;
- impacto de Azure SDKs y otras dependencias;
- testabilidad;
- necesidades de pruebas;
- acoplamientos legacy;
- recursos compartidos;
- impacto fuera del scope solicitado;
- necesidades técnicas o estructurales potenciales.

No modifica código.

No genera el plan de ejecución.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

`architecture-policy.md` se utiliza únicamente para evaluar límites estructurales relevantes para la migración.

No evaluar convergencia hacia una arquitectura ideal.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

La Function objetivo debe existir en inventory.

Aplicar `security-policy.md` antes de toda inspección adicional de source.

## Entradas

Recibir una Function objetivo.

Consumir primero:

- inventory;
- assessment;
- catálogo BEFORE cuando exista;
- shared resource candidates relevantes.

Consultar `dependency-baseline.json` únicamente cuando sea necesario verificar un target aprobado o metadata que
assessment no haya materializado.

No utilizarlo para volver a seleccionar versiones.

Analizar una Function por ejecución.

Puede inspeccionarse contexto relacionado únicamente cuando sea necesario para comprender su slice o impacto.

## Progressive disclosure

Preferir:

```text
existing artifacts
→ selected Function entrypoint
→ direct dependencies
→ required transitive slice
→ related consumers only when necessary
```

Leer únicamente el contexto necesario para comprender:

- entrypoint;
- comportamiento;
- dependencias directas;
- dependencias transitivas relevantes;
- infraestructura;
- recursos compartidos;
- pruebas existentes;
- relaciones relevantes.

No analizar todo el repositorio por defecto.

No construir un call graph completo salvo que sea imprescindible para resolver una incertidumbre concreta.

## Comportamiento actual

Documentar cuando aplique:

- trigger;
- input;
- validaciones;
- decisiones;
- persistencia;
- mensajería;
- almacenamiento;
- llamadas externas;
- side effects;
- output;
- errores relevantes.

No inferir comportamiento de negocio por naming.

Identificar el contrato observable que deberá preservarse:

```text
same input
same output
same relevant errors
same observable side effects
```

Referenciar el catálogo BEFORE cuando contenga suficiente detalle.

No duplicarlo completamente.

## Slice actual

Representar únicamente el flujo relevante para la Function.

Ejemplo conceptual:

```text
trigger
→ entrypoint
→ service/use case
→ repository/publisher/gateway
→ external system
```

Distinguir cuando corresponda:

- responsabilidad específica de la Function;
- responsabilidad compartida;
- responsabilidad fuera del scope solicitado.

## Configuración

Registrar únicamente nombres de claves utilizadas por el slice.

Ejemplo:

`process.env.COSMOS_DATABASE`

Registrar:

- key name;
- ubicación de uso;
- ownership observable cuando exista evidencia.

Nunca registrar valores.

No resolver valores desde archivos protegidos.

## Estructura y acoplamiento actual

Evaluar únicamente aspectos relevantes para la migración:

- responsabilidad del entrypoint;
- mezcla entre runtime y lógica funcional;
- acceso directo a SDKs;
- configuración;
- separación funcional;
- contracts existentes;
- infraestructura;
- organización observable por capability;
- dependencias compartidas.

No evaluar estructura por cantidad de carpetas.

No exigir reorganización física únicamente por convención.

## Impacto estructural de migración

Identificar únicamente límites estructurales cuya modificación pueda ser necesaria para:

- compatibilidad técnica;
- preservación de comportamiento;
- testabilidad requerida;
- adaptación de una dependencia;
- aislamiento mínimo necesario del runtime o infraestructura.

Ejemplos cuando exista evidencia:

- separar lógica funcional del Azure adapter;
- aislar construcción de un cliente externo;
- encapsular acceso a configuración;
- introducir un boundary real;
- introducir un seam mínimo para pruebas.

No diseñar una arquitectura target completa.

No generar todavía acciones `FN-*`.

La decisión final de ejecutar un cambio estructural y su `requiredForMigration` pertenece a planning.

## Dependencias

Registrar únicamente dependencias relevantes del slice.

Clasificar cuando corresponda:

- internal;
- Azure SDK;
- database;
- messaging;
- storage;
- HTTP;
- configuration;
- third-party;
- Node runtime.

Cada conclusión de compatibilidad debe utilizar la semántica de evidencia definida en `evidence-policy.md`.

## Dependencias y baseline

El owner del target aprobado es:

`../_shared/dependency-baseline.json`

`assessment.json` determina si existe necesidad global de cambio.

Este analysis determina únicamente el impacto local sobre la Function.

Para dependencias con:

`impactAnalysisRequired = true`

y:

`actionStatus = REQUIRED`

analizar únicamente los consumidores relevantes del slice actual.

Determinar cuando corresponda:

- imports;
- APIs utilizadas;
- construcción de cliente;
- configuración;
- métodos;
- opciones;
- tipos;
- recursos compartidos relacionados;
- adaptación local potencialmente necesaria.

Ejemplo de necesidad:

    {
      "type": "REQUIRED_DEPENDENCY",
      "need": "Adaptar el consumidor de Cosmos al SDK target.",
      "reason": "La API utilizada por la Function presenta impacto respecto del target aprobado.",
      "dependency": "@azure/cosmos",
      "resourceId": "SR-COSMOS-REPORTS",
      "evidenceStatus": "CONFIRMED",
      "evidence": []
    }

No asignar `FN-*` durante analysis.

Si la dependencia cambia globalmente pero el consumidor no necesita modificación local:

no registrar una necesidad local artificial.

## Dependencias no incluidas en baseline

Si assessment no identificó impacto:

preservar.

Si assessment indica:

`actionStatus = REQUIRES_VALIDATION`

analizar únicamente el uso relevante para esta Function.

Cuando la incertidumbre dependa de una API concreta utilizada por el slice, puede consultarse evidencia oficial mínima
conforme a `evidence-policy.md`.

No seleccionar arbitrariamente una versión target.

## Recursos compartidos

Confirmar únicamente el uso observado por esta Function.

Registrar cuando corresponda:

- `resourceId` o candidate id;
- usage;
- consumers observados;
- ownership observable;
- configuration keys;
- `evidenceStatus`;
- evidence.

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "usage": "Persist report request",
      "evidenceStatus": "CONFIRMED"
    }

Un mismo SDK o tecnología no demuestra que exista un único recurso compartido.

No consolidar definitivamente ownership.

No crear aquí la acción propietaria del recurso.

Planning consolida recursos, ownership y acciones `SR-ACTION-*`.

## Testabilidad

Evaluar cuando corresponda:

- lógica mezclada con runtime;
- `context`;
- `process.env`;
- SDK clients;
- side effects;
- globals;
- funciones puras;
- dependencias sustituibles;
- seams existentes.

Usar:

- `HIGH`
- `MEDIUM`
- `LOW`
- `REQUIRES_REVIEW`

Esta clasificación no reemplaza `evidenceStatus`.

La ausencia de pruebas no determina por sí sola la testabilidad.

### Bloqueadores

-

### Seams existentes

-

### Seams mínimos potencialmente necesarios

-

No diseñar aquí una refactorización completa.

## Necesidades de pruebas

Registrar pruebas existentes relevantes.

Identificar únicamente comportamiento que necesite protección adicional, como:

1. flujo principal;
2. validaciones relevantes;
3. decisiones;
4. errores;
5. efectos observables;
6. boundaries externos relevantes.

No generar pruebas.

No diseñar tests orientados a detalles internos de implementación.

No proponer integration tests en el alcance actual.

La generación de pruebas pertenece a la capability de testing correspondiente.

## Node.js 24

Evaluar el slice utilizando:

`evidenceStatus`

y:

`actionStatus`

Ejemplos:

```text
evidenceStatus: CONFIRMED
actionStatus: NOT_REQUIRED
```

o:

```text
evidenceStatus: CONFIRMED
actionStatus: REQUIRED
```

o:

```text
evidenceStatus: UNKNOWN
actionStatus: REQUIRES_VALIDATION
```

Registrar únicamente APIs, sintaxis, módulos o dependencias relevantes para la Function.

No asumir compatibilidad por compilación.

## Programming Model

Registrar el estado observado conforme a discovery:

- `V3`;
- `V4`;
- `MIXED`;
- `UNKNOWN`.

Evaluar la necesidad mediante `actionStatus`.

Ejemplos conceptuales:

```text
V4
→ NOT_REQUIRED

V3
→ REQUIRED

UNKNOWN
→ REQUIRES_VALIDATION
```

Cuando exista migración requerida, identificar únicamente los puntos de adaptación relevantes.

No generar todavía una acción de migración.

## Durable

Identificar cuando corresponda:

- workflow;
- rol;
- participantes observables relevantes;
- dependencias necesarias;
- implicaciones potenciales sobre scope.

Roles posibles:

- `CLIENT`;
- `STARTER`;
- `ORCHESTRATOR`;
- `ACTIVITY`;
- `SUB_ORCHESTRATOR`;
- `ENTITY`.

No migrar Durable.

No analizar todo el workflow en profundidad salvo lo necesario para identificar la relación de esta Function.

Si la Function pertenece a un workflow Durable, registrar que planning debe evaluar si el workflow completo constituye
el scope efectivo mínimo.

## Acoplamiento legacy

Registrar únicamente cuando exista evidencia relevante.

Clasificación:

- `NONE`;
- `LEGACY_COUPLING`;
- `LEGACY_MONOLITH_CANDIDATE`;
- `REQUIRES_REVIEW`.

Registrar también:

`evidenceStatus`

Considerar cuando corresponda:

- consumidores;
- responsabilidades observadas;
- acceso a configuración;
- persistencia;
- mensajería;
- APIs externas;
- orquestación;
- métodos utilizados por otras Functions.

El tamaño del archivo o servicio es una señal.

No es evidencia suficiente por sí sola para clasificar un monolito.

No proponer la descomposición completa del componente legacy desde analysis.

## Impacto fuera del scope solicitado

Registrar consumidores o unidades afectadas que no formen parte de la Function solicitada.

| Function / workflow | Relación | Impacto | Evidence status |
|---------------------|----------|---------|-----------------|
|                     |          |         |                 |

Detectar impacto fuera del scope no incorpora automáticamente ese consumidor a la migración.

Planning determina:

- `requestedScope`;
- `effectiveScope`;
- `affectedFunctionsOutsideScope`.

## Categorías de necesidad

Usar cuando corresponda:

- `REQUIRED_PLATFORM`;
- `REQUIRED_NODE`;
- `REQUIRED_DEPENDENCY`;
- `REQUIRED_TESTABILITY`;
- `STRUCTURAL`.

Registrar separadamente:

- `TECHNICAL_DEBT`;
- `OPTIMIZATION`.

### REQUIRED_PLATFORM

Necesidad derivada de Azure Functions Runtime o Programming Model.

### REQUIRED_NODE

Necesidad derivada específicamente de Node.js 24.

### REQUIRED_DEPENDENCY

Necesidad derivada de compatibilidad o adaptación de una dependencia aprobada.

### REQUIRED_TESTABILITY

Necesidad mínima para poder proteger comportamiento requerido por la migración.

### STRUCTURAL

Necesidad estructural potencialmente requerida para completar o verificar la migración.

Planning determina si finalmente utiliza:

`requiredForMigration: true`

o:

`requiredForMigration: false`.

### TECHNICAL_DEBT

Problema conocido que no es necesario resolver para completar la migración.

### OPTIMIZATION

Mejora no requerida para la migración.

## migrationNeeds

Cada necesidad debe contener como mínimo cuando corresponda:

- `type`;
- `need`;
- `reason`;
- `evidenceStatus`;
- `evidence`.

Puede referenciar:

- `dependency`;
- `resourceId`;
- Functions relacionadas;
- workflow.

Ejemplo:

    {
      "type": "STRUCTURAL",
      "need": "Separar la construcción del cliente externo del comportamiento funcional.",
      "reason": "El acoplamiento actual impide sustituir el boundary requerido para proteger comportamiento.",
      "evidenceStatus": "CONFIRMED",
      "evidence": []
    }

No asignar:

- `FN-*`;
- `dependsOn`;
- orden de ejecución;
- `executionStatus`.

Esos conceptos pertenecen a planning y execution.

## Technical debt

Registrar separadamente.

No convertir automáticamente deuda en necesidad obligatoria de migración.

## Optimization

Registrar separadamente.

Mantener fuera del alcance de migración salvo decisión posterior explícita.

## Salidas estructuradas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

Usar para la vista humana:

`../_shared/templates/function-analysis.template.md`

## Estado

`analysis.json` y `analysis.md` deben utilizar un estado principal:

- `READY`;
- `PARTIAL`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

### READY

Existe evidencia suficiente para continuar a planning.

### PARTIAL

Existen incertidumbres pendientes, pero existe trabajo independiente que puede planificarse de forma segura.

### BLOCKED

Falta información necesaria para planificar el trabajo requerido de forma segura.

### REQUIRES_REVIEW

Una decisión humana impide cerrar el análisis.

El significado formal debe mantenerse alineado con:

`../_shared/status-policy.md`

## analysis.json

Es owner de la interpretación técnica de esta Function.

Debe contener cuando corresponda:

- function;
- capability;
- status;
- analyzedSlice;
- behavior;
- configuration;
- dependencies;
- dependencyImpact;
- sharedResources;
- currentStructure;
- structuralNeeds;
- relationships;
- affectedFunctionsOutsideScope;
- legacyCoupling;
- testability;
- existingTests;
- testingNeeds;
- node24;
- programmingModel;
- durable;
- migrationNeeds;
- technicalDebt;
- optimizations;
- risks;
- unknowns;
- reviewRequirements;
- evidence.

No debe contener:

- acciones definitivas `FN-*`;
- orden de ejecución;
- `dependsOn`;
- migration plan;
- target architecture completa;
- cambios ejecutados.

## Catálogo por Function

Si todavía no existe, crear:

`.migration/catalog/functions/<FunctionName>.md`

Usar:

`../_shared/templates/function-current-state.template.md`

Este documento representa BEFORE.

Si ya existe un catálogo BEFORE válido:

- consumirlo;
- referenciarlo;
- no regenerarlo únicamente para reflejar el análisis.

Si el repositorio fue modificado después de crear el BEFORE:

no sobrescribirlo silenciosamente para representar el estado posterior.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No generar artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

El skill termina cuando:

- el comportamiento observable relevante fue identificado;
- el slice necesario fue analizado;
- dependencias e impactos relevantes fueron evaluados;
- versiones target aprobadas no fueron redefinidas;
- testabilidad fue evaluada;
- necesidades de protección mediante pruebas fueron identificadas;
- compatibilidad Node.js relevante fue evaluada o quedó explícitamente pendiente;
- Programming Model fue evaluado;
- rol Durable e impacto potencial sobre scope fueron registrados cuando aplique;
- recursos compartidos relevantes fueron confirmados para esta Function cuando exista evidencia;
- acoplamientos legacy relevantes fueron registrados;
- impacto fuera del scope solicitado fue registrado cuando exista;
- necesidades de migración fueron registradas sin `FN-*`;
- deuda y optimizaciones quedaron separadas;
- evidencia utiliza `evidenceStatus`;
- se creó `analysis.json`;
- se creó `analysis.md`;
- el estado principal permite determinar si puede continuar planning;
- no se modificó código.

La ausencia de lessons no impide cerrar analysis.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- seleccionar nuevas versiones target;
- agregar pruebas;
- aplicar cambios estructurales;
- asignar acciones `FN-*`;
- decidir `effectiveScope`;
- consolidar definitivamente ownership de shared resources;
- generar migration plans;
- actualizar dependencias;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- modernizar componentes legacy;
- optimizar.

Siguiente skill sugerido:

`plan-function-migration`
