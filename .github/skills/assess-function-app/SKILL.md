---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones técnicas, arquitectónicas, dependencias y recursos compartidos requieren cambio o validación para alcanzar el target sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el gap global entre el estado actual de la Function App y el target.

Debe responder qué dimensiones:

- ya cumplen;
- requieren cambio;
- requieren validación;
- presentan gap arquitectónico;
- presentan riesgo transversal.

No analiza todavía comportamiento detallado por Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

Usar como referencia de dependencias:

`../_shared/dependency-baseline.json`

La baseline contiene:

- targets Azure aprobados;
- recomendaciones aprendidas aprobadas;
- reglas de investigación y promoción.

No implica upgrade automático.

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/catalog/current-state.md`

Si existen contradicciones o información insuficiente:

- registrarlas;
- no reconstruir discovery;
- utilizar los estados definidos en `status-policy.md`.

## Entradas

Consumir primero:

- inventory;
- catálogo BEFORE;
- dependency baseline;
- shared resource candidates.

Consultar source únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión.

No cargar el repositorio completo.

## Target

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependency baseline aprobada;
- capacidad de build y tests;
- arquitectura objetivo;
- recursos compartidos con ownership y límites coherentes.

El target no implica optimización.

## Modelo de dimensión

Cada dimensión evaluada debe separar cuando corresponda:

- `current`;
- `target`;
- `evidenceStatus`;
- `actionStatus`;
- `evidence`.

No utilizar `status` para representar evidencia interna.

## Dimensiones técnicas

Evaluar independientemente:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- testing;
- capacidad global de validación.

## Node.js

Determinar:

- versión declarada;
- target;
- necesidad de cambio;
- riesgos globales.

No considerar una declaración de Node.js como evidencia suficiente de compatibilidad del source.

## Azure Functions Runtime

Determinar la versión cuando exista evidencia suficiente.

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

Si está confirmado v4:

    {
      "current": "v4",
      "target": "v4",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "NOT_REQUIRED"
    }

Si está confirmado legacy:

`actionStatus = REQUIRED`

cuando el target exige v4.

Si existe evidencia contradictoria:

- mantener la contradicción;
- no seleccionar silenciosamente una versión.

## Durable Functions

Si no existe:

`evidenceStatus = NOT_APPLICABLE`

Si existe:

evaluar globalmente:

- package;
- versión actual;
- versión target aprobada cuando exista;
- modelo;
- workflows observables;
- necesidad de migración especializada.

El impacto detallado pertenece al análisis posterior.

## Dependencias

Evaluar únicamente dependencias relevantes para:

- Node.js 24;
- Azure Functions;
- Durable;
- Azure SDK;
- build;
- tests;
- infraestructura;
- comportamiento afectado por la migración.

No investigar todo `package.json` indiscriminadamente.

## Clasificación

Cada dependencia relevante debe clasificarse como:

- `AZURE_BASELINED`
- `AZURE_UNMAPPED`
- `LEARNED`
- `UNMAPPED`

La clasificación no reemplaza:

- `evidenceStatus`;
- `actionStatus`.

## Azure package

Considerar Azure package cuando:

- coincide con `azurePolicy.packagePatterns`;
- aparece en `azurePolicy.additionalPackages`;
- existe en `azurePackages`.

El campo `azurePackage` producido por inventory puede utilizarse como señal determinista.

## AZURE_BASELINED

Cuando una dependencia existe en:

`dependency-baseline.azurePackages`

usar la versión target aprobada.

Registrar cuando corresponda:

- package;
- classification;
- currentVersion;
- targetVersion;
- baselineId;
- impactAnalysisRequired;
- recommendationSource;
- evidenceStatus;
- actionStatus.

Ejemplo:

    {
      "package": "@azure/cosmos",
      "classification": "AZURE_BASELINED",
      "currentVersion": "^3.10.5",
      "targetVersion": "4.10.0",
      "baselineId": "node24-azure-functions-v4",
      "impactAnalysisRequired": true,
      "recommendationSource": "BASELINE",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRED"
    }

No volver a investigar una versión diferente salvo evidencia de que la baseline puede estar inválida.

Ante contradicción:

- registrar la evidencia;
- no actualizar baseline;
- usar `REQUIRES_REVIEW`.

## AZURE_UNMAPPED

Cuando una dependencia Azure no exista todavía en:

`azurePackages`

investigar únicamente fuentes oficiales.

Priorizar:

1. Microsoft Learn;
2. documentación Azure SDK;
3. repositorio oficial;
4. documentación oficial del package.

Determinar cuando sea posible:

- versión estable;
- soporte de Node.js target;
- engines;
- breaking changes relevantes;
- migration guidance;
- compatibilidad con APIs usadas.

No usar `latest` como criterio suficiente.

La salida es una recomendación.

Ejemplo:

    {
      "package": "@azure/keyvault-secrets",
      "classification": "AZURE_UNMAPPED",
      "currentVersion": "^4.7.0",
      "targetVersion": "4.x.y",
      "recommendationSource": "OFFICIAL_RESEARCH",
      "impactAnalysisRequired": true,
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION",
      "recommendationStatus": "PROPOSED"
    }

Assessment nunca agrega automáticamente esta recomendación a la baseline.

## LEARNED

Cuando una dependencia no Azure exista en:

`dependency-baseline.learnedPackages`

usar la experiencia previa como evidencia inicial.

Registrar:

- package;
- classification;
- currentVersion;
- targetVersion;
- recommendationSource;
- previousSuccessfulMigrations;
- evidenceStatus;
- actionStatus.

Ejemplo:

    {
      "package": "uuid",
      "classification": "LEARNED",
      "currentVersion": "^8.3.2",
      "targetVersion": "x.y.z",
      "recommendationSource": "LEARNED_BASELINE",
      "previousSuccessfulMigrations": 2,
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION"
    }

Una recomendación aprendida no implica upgrade automático.

Debe volver a evaluarse contra el repositorio actual.

## UNMAPPED

Cuando una dependencia no Azure:

- no exista en `learnedPackages`;
- y exista evidencia de que puede afectar la migración;

investigar opciones compatibles y estables.

Priorizar:

1. documentación oficial;
2. repositorio oficial;
3. release notes;
4. package metadata;
5. fuentes secundarias solo cuando las anteriores sean insuficientes.

Evaluar:

- soporte de Node.js 24;
- mantenimiento;
- versión estable;
- breaking changes;
- compatibilidad con APIs utilizadas;
- reemplazo solo cuando exista evidencia suficiente.

No sustituir una librería únicamente por preferencia tecnológica.

Ejemplo:

    {
      "package": "some-library",
      "classification": "UNMAPPED",
      "currentVersion": "1.2.0",
      "targetVersion": "3.1.0",
      "recommendationSource": "EXTERNAL_RESEARCH",
      "evidenceStatus": "CONFIRMED",
      "actionStatus": "REQUIRES_VALIDATION",
      "recommendationStatus": "PROPOSED"
    }

## Dependencias no relevantes

Si una dependencia:

- no tiene target aprobado;
- no tiene recomendación aprendida;
- no presenta evidencia de incompatibilidad;

preservarla.

No investigar ni actualizar por antigüedad.

## Recommendation status

Las recomendaciones pueden usar:

- `PROPOSED`
- `VALIDATED`
- `REPEATED`
- `APPROVED`

Estos valores pertenecen al conocimiento de dependencias.

No forman parte de `status-policy.md`.

### PROPOSED

Existe investigación suficiente para sugerirla.

### VALIDATED

Fue utilizada en una migración que superó los gates requeridos.

### REPEATED

Fue validada en más de una migración independiente.

### APPROVED

Fue aprobada explícitamente como conocimiento reutilizable del toolkit.

## Regla de promoción

`assess-function-app` nunca modifica:

`dependency-baseline.json`

Flujo:

`research → proposal → migration → verification → lesson → review → human approval → baseline`

## Impact analysis

Cuando una dependencia tenga:

`impactAnalysisRequired = true`

y requiera cambio o validación:

el análisis de consumidores pertenece a:

`analyze-function`

## TypeScript

Determinar:

- versión actual;
- necesidad de cambio;
- riesgos relevantes.

Si no existe target aprobado:

no inventarlo.

## Testing global

Registrar:

- framework;
- scripts;
- presencia general de tests;
- coverage observable;
- capacidad aparente de baseline.

No evaluar todavía testabilidad detallada por Function.

## Architecture assessment

Evaluar globalmente frente a:

`../_shared/architecture-policy.md`

Usar:

- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`

La clasificación arquitectónica no reemplaza el status principal.

## Shared resources assessment

Evaluar candidatos detectados durante discovery.

Para cada recurso usar cuando corresponda:

- `evidenceStatus`;
- `actionStatus`.

No fusionar recursos únicamente porque compartan tecnología.

## Riesgos globales

Registrar únicamente riesgos relevantes.

Ejemplos:

- salto major de SDK;
- dependencia compartida;
- workflow Durable complejo;
- estado legacy/v4 mixto;
- ausencia de tests;
- dependencia desconocida crítica.

Un riesgo no es automáticamente blocker.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

## assessment.json

Debe contener como mínimo:

- schemaVersion;
- target;
- technicalDimensions;
- dependencyAssessment;
- architectureAssessment;
- sharedResourcesAssessment;
- testingAssessment;
- risks;
- unknowns;
- externalEvidence;
- status.

## Estado principal

Usar:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

## Markdown

`assessment.md` debe responder:

- qué ya cumple;
- qué necesita cambio;
- qué necesita validación;
- qué targets provienen de baseline;
- qué recomendaciones provienen de experiencia;
- qué dependencias requirieron investigación;
- cuáles requieren impact analysis;
- estado arquitectónico;
- riesgos;
- unknowns.

No generar plan.

## Catálogo

No modificar las secciones BEFORE de:

`.migration/catalog/current-state.md`

## Lecciones

Crear:

`.migration/lessons/assess-function-app/lessons.json`

`.migration/lessons/assess-function-app/lessons.md`

## Criterio de cierre

El skill termina cuando:

- inventory fue consumido;
- dependency baseline fue consumida;
- dimensiones técnicas fueron evaluadas;
- dependencias relevantes fueron clasificadas;
- Azure baseline fue aplicada cuando existía;
- Azure unmapped fue investigado oficialmente cuando era necesario;
- learned recommendations fueron reutilizadas como evidencia inicial;
- third-party unmapped fue investigado solo cuando era relevante;
- dependencias irrelevantes fueron preservadas;
- impact analysis requerido quedó identificado;
- arquitectura global fue evaluada;
- shared resources fueron considerados;
- unknowns permanecen explícitos;
- no se modificó código;
- no se modificó la baseline.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- actualizar dependency baseline;
- convertir una propuesta en conocimiento aprobado;
- generar planes;
- analizar impacto detallado por Function;
- agregar tests;
- migrar;
- optimizar.

Siguiente skill sugerido:

`analyze-function`
