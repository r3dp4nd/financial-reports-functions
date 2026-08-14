---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones técnicas, dependencias, tooling y condiciones transversales requieren cambio o validación para alcanzar el target aprobado sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el gap global entre el estado actual de una Function App y el target técnico aprobado.

Debe identificar qué dimensiones:

- ya cumplen el target;
- requieren cambio;
- requieren validación;
- presentan riesgo transversal;
- requieren análisis posterior por Function.

No analiza todavía comportamiento detallado ni impacto local profundo por Function.

No genera acciones de migración.

## Políticas

Aplicar siempre:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`

Aplicar cuando corresponda:

- `../_shared/architecture-policy.md`
- `../_shared/lessons-policy.md`

Usar como referencia técnica:

`../_shared/dependency-baseline.json`

El baseline define targets aprobados.

No implica upgrade automático.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/catalog/current-state.md`

Si existen contradicciones o información insuficiente:

- registrarlas;
- no reconstruir discovery;
- no reemplazar incertidumbre por supuestos;
- utilizar los estados definidos en `status-policy.md`.

## Entradas

Consumir primero:

- `inventory.json`;
- catálogo BEFORE;
- `dependency-baseline.json`;
- shared resource candidates relevantes.

Consultar source únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión global.

No cargar el repositorio completo.

Aplicar `security-policy.md` antes de toda inspección adicional.

## Dependency baseline

Registrar la referencia del baseline utilizado:

```text
baselineId
baselineRevision
```

El baseline es owner de:

- target técnico;
- package targets aprobados.

Assessment determina:

`¿Necesita esta Function App cambiar para alcanzar esos targets?`

Assessment no:

- redefine targets aprobados;
- modifica el baseline;
- adopta automáticamente versiones más recientes;
- convierte investigación externa en target aprobado.

## Target técnico

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- package targets aprobados aplicables desde el baseline.

Otras dimensiones como testing, TypeScript, tooling, estructura o recursos compartidos se evalúan por su impacto sobre
la migración.

No constituyen por sí solas un target arquitectónico global.

## Modelo de dimensión

Cada dimensión evaluada debe separar cuando corresponda:

- `current`;
- `target`;
- `evidenceStatus`;
- `actionStatus`;
- `evidence`.

No utilizar `status` para representar evidencia interna.

## Dimensiones técnicas

Evaluar independientemente cuando corresponda:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript y tooling;
- testing;
- capacidad global de validación.

## Node.js

Determinar:

- versión declarada;
- target;
- necesidad global de cambio;
- riesgos globales observables.

No considerar una declaración de Node.js como evidencia suficiente de compatibilidad del source.

El impacto concreto de Node.js 24 sobre una Function pertenece a:

`analyze-function`

## Azure Functions Runtime

Determinar la versión actual únicamente cuando exista evidencia suficiente.

No confundir Runtime con Programming Model.

Cuando no pueda observarse:

    {
      "current": null,
      "target": "v4",
      "evidenceStatus": "UNKNOWN",
      "actionStatus": "REQUIRES_VALIDATION"
    }

No leer CI/CD protegido para resolverlo.

## Programming Model

Usar las clasificaciones provenientes de discovery:

- `V3`;
- `V4`;
- `MIXED`;
- `UNKNOWN`.

Ejemplos conceptuales:

```text
V4
→ actionStatus: NOT_REQUIRED

V3
→ actionStatus: REQUIRED

UNKNOWN
→ actionStatus: REQUIRES_VALIDATION
```

Cuando exista `MIXED`, conservar la evidencia y determinar si existe cambio requerido o validación adicional.

No seleccionar silenciosamente una clasificación cuando exista evidencia contradictoria.

## Durable Functions

Si no existe Durable:

`evidenceStatus = NOT_APPLICABLE`

Si existe, evaluar globalmente:

- package;
- versión actual;
- target aprobado cuando exista;
- modelo observable;
- workflows detectados;
- necesidad de migración especializada.

El impacto detallado del workflow pertenece al análisis y migración posteriores.

## Dependencias

Evaluar únicamente dependencias relevantes para:

- Node.js 24;
- Azure Functions;
- Durable Functions;
- Azure SDK;
- build;
- tests;
- tooling;
- infraestructura;
- comportamiento potencialmente afectado por la migración.

No investigar todo `package.json` indiscriminadamente.

Antigüedad no implica incompatibilidad.

## Clasificación de dependencias

Cada dependencia relevante puede clasificarse como:

- `BASELINED`;
- `AZURE_UNMAPPED`;
- `UNMAPPED`.

La clasificación no reemplaza:

- `evidenceStatus`;
- `actionStatus`.

## BASELINED

Una dependencia es `BASELINED` cuando existe en:

`dependency-baseline.managedPackages`

Usar exclusivamente el target aprobado del baseline.

Registrar cuando corresponda:

- package;
- classification;
- currentVersion;
- targetVersion;
- baselineId;
- baselineRevision;
- category;
- impactAnalysisRequired;
- recommendationSource;
- evidenceStatus;
- actionStatus.

Ejemplo conceptual:

    {
      "package": "@azure/cosmos",
      "classification": "BASELINED",
      "currentVersion": "<declared-version>",
      "targetVersion": "<approved-target>",
      "baselineId": "node24-azure-functions-v4",
      "baselineRevision": 1,
      "impactAnalysisRequired": true,
      "recommendationSource": "BASELINE",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRED"
    }

No investigar una versión alternativa salvo que exista evidencia suficiente de posible invalidación del baseline.

Ante contradicción:

- registrar la evidencia;
- no modificar el baseline;
- mantener la incertidumbre correspondiente;
- utilizar `REQUIRES_REVIEW` cuando sea necesaria decisión humana.

## Azure package

Considerar una dependencia como parte del ecosistema Azure cuando:

- coincide con `azurePolicy.packagePatterns`;
- aparece en `azurePolicy.additionalPackages`;
- está clasificada como Azure por metadata determinista del inventory.

El campo `azurePackage` producido por discovery puede utilizarse como señal determinista.

## AZURE_UNMAPPED

Cuando una dependencia Azure relevante no exista todavía en:

`managedPackages`

investigar únicamente cuando sea necesario para determinar el camino de migración.

Aplicar `evidence-policy.md` y priorizar fuentes oficiales.

Determinar cuando sea posible:

- soporte del target técnico;
- versiones soportadas;
- engines;
- breaking changes relevantes;
- migration guidance;
- compatibilidad conocida con APIs relevantes.

No usar `latest` como criterio de selección.

Cuando exista evidencia suficiente puede registrarse:

`candidateTarget`

Un `candidateTarget` no es un target aprobado.

Ejemplo conceptual:

    {
      "package": "@azure/example",
      "classification": "AZURE_UNMAPPED",
      "currentVersion": "<declared-version>",
      "candidateTarget": "<researched-candidate>",
      "recommendationSource": "OFFICIAL_RESEARCH",
      "impactAnalysisRequired": true,
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION"
    }

Assessment nunca agrega automáticamente el candidato al baseline.

Si la aprobación de un target es necesaria antes de continuar, registrarlo como decisión pendiente.

## UNMAPPED

Una dependencia no gestionada por baseline permanece `UNMAPPED`.

Investigar únicamente cuando exista evidencia de que puede afectar la migración.

Evaluar únicamente lo necesario, por ejemplo:

- soporte del target Node.js;
- mantenimiento cuando afecte soporte;
- breaking changes relevantes;
- compatibilidad con APIs utilizadas;
- necesidad real de reemplazo.

No sustituir una librería únicamente por:

- antigüedad;
- preferencia tecnológica;
- disponibilidad de una alternativa más nueva.

Cuando no exista evidencia de incompatibilidad:

preservar.

Si una investigación produce un candidato:

registrarlo como `candidateTarget`, no como `targetVersion` aprobado.

## Impact analysis

Cuando una dependencia tenga:

`impactAnalysisRequired = true`

y:

`actionStatus = REQUIRED`

o:

`actionStatus = REQUIRES_VALIDATION`

identificar que el análisis de consumidores relevantes pertenece a:

`analyze-function`

Assessment no inspecciona exhaustivamente todos sus consumidores.

## TypeScript y tooling

Determinar cuando corresponda:

- versión actual;
- tooling observado;
- compatibilidad global conocida;
- necesidad de cambio o validación;
- riesgos relevantes.

Si no existe target aprobado:

no inventarlo.

Cuando falte evidencia suficiente:

usar `REQUIRES_VALIDATION`.

## Testing global

Registrar únicamente información global como:

- framework;
- scripts;
- presencia general de tests;
- coverage observable;
- capacidad aparente de obtener una baseline.

No evaluar todavía testabilidad detallada por Function.

La ausencia de tests no produce `BLOCKED` automáticamente.

## Capacidad global de validación

Identificar si existen mecanismos observables para ejecutar cuando corresponda:

- install;
- typecheck;
- build;
- tests;
- coverage.

No ejecutar todavía el gate global final.

No afirmar que una capacidad funciona únicamente porque exista un script declarado.

## Condiciones estructurales globales

Aplicar `architecture-policy.md` únicamente cuando existan observaciones transversales relevantes para la migración.

Registrar condiciones como:

- runtime y lógica fuertemente mezclados en múltiples Functions;
- construcción repetida de clientes externos;
- recurso compartido potencialmente afectado;
- configuración transversal;
- boundary global que pueda afectar múltiples consumidores.

No clasificar toda la Function App como:

- `ALIGNED`;
- `PARTIALLY_ALIGNED`;
- `CHANGE_REQUIRED`.

No exigir convergencia hacia una arquitectura objetivo.

La necesidad estructural concreta pertenece al análisis por Function y posteriormente a planning.

## Shared resources assessment

Evaluar únicamente los candidatos detectados durante discovery que sean relevantes para la migración.

Para cada candidato utilizar cuando corresponda:

- `evidenceStatus`;
- `actionStatus`;
- consumidores observados;
- ownership observable;
- evidencia.

No consolidar definitivamente ownership.

No crear `SR-ACTION-*`.

No fusionar recursos únicamente porque compartan tecnología o SDK.

La consolidación definitiva pertenece a:

`plan-function-migration`

## Functions que requieren análisis

Identificar Functions que necesiten análisis posterior.

Registrar cuando corresponda:

- Function;
- motivo;
- dimensiones afectadas;
- dependencia o workflow relacionado;
- prioridad o dependencia técnica observable.

Ejemplo conceptual:

    {
      "function": "RequestReport",
      "reasons": [
        "PROGRAMMING_MODEL_V3",
        "DEPENDENCY_IMPACT"
      ]
    }

No ejecutar análisis profundo desde assessment.

No crear `FN-*`.

## Riesgos globales

Registrar únicamente riesgos relevantes.

Ejemplos:

- salto major de una dependencia aprobada;
- dependencia compartida;
- workflow Durable complejo;
- Programming Model mixto;
- ausencia general de tests;
- dependencia desconocida crítica.

Un riesgo no es automáticamente blocker.

## Incertidumbres

Mantener explícitamente las dimensiones que no puedan determinarse con evidencia suficiente.

No sustituir `UNKNOWN` por una recomendación.

Registrar la validación necesaria cuando corresponda.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

Usar para la vista humana:

`../_shared/templates/assessment.template.md`

## assessment.json

Debe ser owner del gap global respecto del target.

Debe contener cuando corresponda:

- `schemaVersion`;
- `baselineRef`;
- `target`;
- `technicalDimensions`;
- `dependencyAssessment`;
- `toolingAssessment`;
- `testingAssessment`;
- `validationCapability`;
- `structuralObservations`;
- `sharedResourcesAssessment`;
- `functionsRequiringAnalysis`;
- `risks`;
- `unknowns`;
- `reviewRequirements`;
- `externalEvidence`;
- `status`.

No debe contener:

- acciones `FN-*`;
- acciones `GLOBAL-*`;
- acciones `SR-ACTION-*`;
- migration plan;
- target architecture;
- cambios ejecutados.

## Estado principal

Usar:

- `READY_FOR_ANALYSIS`;
- `PARTIAL`;
- `BLOCKED`;
- `REQUIRES_REVIEW`.

Aplicar la semántica de:

`../_shared/status-policy.md`

`READY_FOR_ANALYSIS` no significa que todas las dimensiones estén resueltas.

Significa que existe evidencia suficiente para comenzar el análisis seguro de las Functions necesarias.

## Catálogo

No modificar las secciones BEFORE de:

`.migration/catalog/current-state.md`

Assessment consume el catálogo.

No lo convierte en documentación del target.

## Lecciones

Aplicar cuando corresponda:

`../_shared/lessons-policy.md`

Registrar lessons únicamente cuando exista aprendizaje relevante.

No crear artifacts de lessons vacíos como requisito de cierre.

## Criterio de cierre

El skill termina cuando:

- inventory fue consumido;
- catálogo BEFORE fue consumido;
- dependency baseline y su revisión fueron identificados;
- target técnico fue evaluado;
- dimensiones técnicas relevantes fueron evaluadas;
- dependencias relevantes fueron clasificadas;
- package targets aprobados fueron aplicados cuando existían;
- dependencias Azure no mapeadas fueron investigadas únicamente cuando era necesario;
- third-party unmapped fueron investigadas únicamente cuando existía impacto potencial;
- dependencias irrelevantes fueron preservadas;
- necesidades de impact analysis quedaron identificadas;
- TypeScript y tooling fueron evaluados al nivel global necesario;
- testing global fue evaluado sin inferir testabilidad por Function;
- condiciones estructurales globales relevantes fueron registradas cuando existían;
- shared resource candidates fueron considerados sin consolidar ownership;
- Functions que requieren analysis fueron identificadas;
- unknowns permanecen explícitos;
- el estado principal fue determinado;
- no se modificó código;
- no se modificó dependency baseline;
- no se generaron acciones ni planes.

La ausencia de lessons no impide cerrar assessment.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- actualizar dependency baseline;
- aprobar un `candidateTarget`;
- convertir investigación en target permanente;
- crear acciones `GLOBAL-*`;
- crear acciones `FN-*`;
- crear acciones `SR-ACTION-*`;
- decidir `effectiveScope`;
- consolidar definitivamente shared resources;
- diseñar cambios estructurales por Function;
- analizar impacto detallado por Function;
- agregar pruebas;
- generar migration plans;
- migrar;
- modernizar;
- optimizar.

Siguiente skill sugerido:

`analyze-function`
