---
name: analyze-function
description: Analiza una Function concreta para documentar comportamiento, dependencias, arquitectura, recursos compartidos, testabilidad, compatibilidad y acciones necesarias para alcanzar el target sin modificar código.
---

# Analyze Function

## Objetivo

Comprender una Function concreta y determinar las acciones necesarias para:

- preservar comportamiento;
- alcanzar testabilidad;
- converger hacia arquitectura objetivo;
- preparar migración de plataforma;
- reducir dependencia futura del runtime y SDKs.

No modifica código.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/status-policy.md`

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

La Function debe existir en inventory.

## Entradas

Recibir una Function objetivo.

Consumir primero:

- inventory;
- assessment;
- catálogo actual cuando sea útil;
- shared resource candidates.

No leer directamente `dependency-baseline.json` para volver a decidir versiones ya resueltas por assessment.

Analizar una Function o unidad funcional coherente por ejecución.

## Progressive disclosure

Leer únicamente el slice necesario para comprender:

- entrypoint;
- comportamiento;
- dependencias directas;
- infraestructura;
- shared resources;
- tests;
- relaciones.

Ampliar contexto únicamente cuando sea necesario.

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
- errores.

No inferir comportamiento de negocio por naming.

## Arquitectura actual

Evaluar:

- responsabilidad del entrypoint;
- mezcla runtime/lógica;
- acceso a SDKs;
- configuración;
- separación funcional;
- contracts;
- infraestructura;
- organización por capability.

## Arquitectura objetivo

Determinar cómo debe encajar la Function según:

`../_shared/architecture-policy.md`

La arquitectura es requerida para código refactorizado.

No significa crear todas las capas.

## Architecture gap

Identificar únicamente cambios necesarios.

Ejemplos:

- extraer lógica del Azure adapter;
- aislar infraestructura;
- encapsular configuración;
- introducir un contract;
- mover implementación hacia capability;
- corregir ownership.

Registrar acciones `STRUCTURAL` cuando corresponda.

## Recursos compartidos

Confirmar para la Function:

- `resourceId`;
- usage;
- ownership observable;
- `evidenceStatus`;
- configuración asociada.

Ejemplo:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "usage": "Persist report request",
      "evidenceStatus": "CONFIRMED"
    }

No planificar aquí una segunda modificación del recurso.

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

Cada hallazgo de compatibilidad debe utilizar `evidenceStatus` cuando sea necesario.

## Dependencias y baseline

Consumir:

`assessment.dependencyAssessment`

La versión target aprobada pertenece al assessment y a la baseline de la campaña.

No volver a seleccionar una versión distinta.

Para cada dependencia con:

`impactAnalysisRequired = true`

y:

`actionStatus = REQUIRED`

analizar únicamente los consumidores relevantes de la Function actual.

Determinar cuando corresponda:

- imports;
- API utilizada;
- construcción de cliente;
- configuración;
- métodos;
- opciones;
- tipos;
- shared resources relacionados;
- cambios necesarios en el slice.

Registrar una acción `FN-*` únicamente cuando la Function necesite adaptación local.

Ejemplo:

    {
      "id": "FN-REQUESTREPORT-003",
      "type": "REQUIRED_NODE",
      "action": "Adaptar el consumidor al SDK Cosmos target.",
      "reason": "El cambio aprobado de SDK afecta una API utilizada por la Function.",
      "dependency": "@azure/cosmos",
      "targetVersion": "4.10.0",
      "resourceId": "SR-COSMOS-REPORTS",
      "evidenceStatus": "CONFIRMED",
      "evidence": []
    }

Si la dependencia cambia pero el consumidor no necesita modificación de código:

no crear una acción local.

La actualización puede permanecer como acción global o shared.

## Dependencias no incluidas en baseline

Si assessment no detectó incompatibilidad:

preservar.

Si assessment indica:

`actionStatus = REQUIRES_VALIDATION`

analizar únicamente el impacto relevante.

No seleccionar arbitrariamente una versión target.

## Testabilidad

Evaluar:

- lógica mezclada con runtime;
- `context`;
- `process.env`;
- SDK clients;
- side effects;
- globals;
- funciones puras;
- dependencias sustituibles.

Usar:

- `HIGH`
- `MEDIUM`
- `LOW`

Este valor es una clasificación específica de testabilidad.

No reemplaza `evidenceStatus`.

La ausencia de tests no determina por sí sola la testabilidad.

## Tests

Registrar tests existentes.

Proponer el conjunto mínimo necesario para preservar:

1. comportamiento principal;
2. validaciones;
3. decisiones;
4. errores;
5. interacciones externas relevantes.

No proponer integration tests.

## Node.js 24

Cada hallazgo puede usar una clasificación específica:

- `CONFIRMED_COMPATIBLE`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`
- `NOT_APPLICABLE`

Cuando sea útil, acompañarla de:

`evidenceStatus`

No asumir compatibilidad por compilación.

## Programming Model

Si ya está v4:

no generar acción de migración.

Si es legacy:

identificar puntos de adaptación.

## Durable

Identificar rol y contexto mínimo del workflow cuando aplique.

No migrar Durable.

## Categorías de acciones

Usar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

## IDs de acciones

Las acciones propias de una Function usan:

`FN-<FUNCTION>-NNN`

Ejemplos:

- `FN-REQUESTREPORT-001`
- `FN-REQUESTREPORT-002`
- `FN-COMPLETEREPORT-001`

El ID no codifica el tipo de acción.

El tipo vive en:

`type`

## requiredActions

Cada acción debe contener como mínimo:

- `id`;
- `type`;
- `action`;
- `reason`;
- `evidenceStatus`;
- `evidence`.

Ejemplo:

    {
      "id": "FN-REQUESTREPORT-001",
      "type": "STRUCTURAL",
      "action": "Extraer lógica funcional del Azure adapter.",
      "reason": "El entrypoint contiene comportamiento funcional.",
      "evidenceStatus": "CONFIRMED",
      "evidence": []
    }

Referenciar `resourceId` cuando la acción esté relacionada con un recurso compartido.

No utilizar:

`status: CONFIRMED`

dentro de una acción.

Utilizar:

`evidenceStatus: CONFIRMED`

## Acción vs recurso compartido

Si la Function consume un recurso compartido que necesita transformación global:

la acción Function debe expresar únicamente su dependencia o adaptación local.

No duplicar la transformación propietaria del recurso.

## Technical debt

Registrar separadamente.

No convertir automáticamente en `requiredActions`.

## Optimization

Registrar separadamente.

Siempre fuera de alcance de migración salvo cambio explícito del proyecto.

## Salidas estructuradas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

## analysis.json

Debe ser owner de:

- function;
- capability;
- behavior;
- dependencies;
- sharedResources;
- currentArchitecture;
- targetArchitecture;
- architectureGap;
- configuration;
- relationships;
- testability;
- existingTests;
- proposedTests;
- node24Compatibility;
- programmingModel;
- durableRole;
- requiredActions;
- technicalDebt;
- optimizations;
- risks;
- unknowns;
- evidence.

No necesita un `status` principal mientras el análisis haya podido completarse.

Si el análisis completo no puede realizarse, registrar:

- blocker;
- unknown;
- review requirement;

sin inventar conclusiones.

## Catálogo por Function

Crear:

`.migration/catalog/functions/<FunctionName>.md`

Usar:

`../_shared/templates/function-current-state.template.md`

Este documento representa BEFORE.

No incluir como estado implementado lo que solo pertenece al target.

## Lecciones

Crear:

`.migration/lessons/analyze-function/<FunctionName>.json`

`.migration/lessons/analyze-function/<FunctionName>.md`

## Criterio de cierre

El skill termina cuando:

- comportamiento fue documentado;
- arquitectura actual y target fueron comparadas;
- shared resources fueron confirmados cuando existía evidencia;
- dependency impacts relevantes fueron analizados;
- versiones target aprobadas no fueron redefinidas;
- testabilidad fue evaluada;
- tests fueron propuestos;
- compatibilidad fue evaluada;
- requiredActions usan IDs `FN-*`;
- evidencia interna usa `evidenceStatus`;
- ficha BEFORE fue creada;
- deuda y optimización quedaron separadas;
- se generaron analysis y lessons.

## Fuera de alcance

No debe:

- modificar código;
- instalar dependencias;
- seleccionar nuevas versiones target;
- agregar tests;
- aplicar arquitectura;
- actualizar dependencias;
- generar planes;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar.

Siguiente skill sugerido:

`plan-function-migration`
