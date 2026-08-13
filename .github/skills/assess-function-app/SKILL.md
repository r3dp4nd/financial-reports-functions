---
name: assess-function-app
description: Evalúa una Azure Function App descubierta previamente y determina qué dimensiones técnicas, arquitectónicas y de recursos compartidos requieren cambio o validación para alcanzar el target sin modificar código.
---

# Assess Function App

## Objetivo

Determinar el estado técnico global de la Function App frente al target de migración.

El assessment debe responder qué dimensiones:

- ya cumplen;
- requieren cambio;
- requieren validación;
- presentan una brecha arquitectónica global;
- presentan riesgos por recursos compartidos.

Este skill no analiza comportamiento detallado por Function.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`
- `../_shared/architecture-policy.md`

## Precondición

Debe existir:

`.migration/repository/inventory.json`

Debe existir también la fotografía inicial:

`.migration/catalog/current-state.md`

Si el inventario es insuficiente o contradictorio:

- registrar el problema;
- no reconstruir discovery desde cero;
- usar `REQUIRES_VALIDATION` cuando corresponda.

## Entradas

Consumir primero:

- `.migration/repository/inventory.json`;
- `.migration/catalog/current-state.md`;
- shared resource candidates detectados.

Consultar el repositorio únicamente cuando falte evidencia concreta necesaria para evaluar una dimensión.

No cargar source completo.

## Target

Evaluar frente a:

- Node.js 24;
- Azure Functions Runtime v4;
- Programming Model v4;
- dependencias compatibles;
- capacidad de build y test;
- arquitectura objetivo definida en `architecture-policy.md`;
- shared resources con ownership y límites coherentes.

El target no implica optimización.

## Dimensiones técnicas

Evaluar independientemente:

- Node.js;
- Azure Functions Runtime;
- Programming Model;
- Durable Functions;
- dependencias;
- TypeScript;
- tooling de tests;
- capacidad global de validación.

No inferir que una dimensión necesita cambio porque otra esté desactualizada.

## Acción

Para cada dimensión usar:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Node.js

Determinar:

- versión declarada actual;
- target;
- necesidad de actualización;
- riesgos globales conocidos.

No considerar cambio de `engines.node` como evidencia de compatibilidad del source.

La compatibilidad detallada se analiza Function por Function.

## Azure Functions Runtime

Determinar la versión actual cuando exista evidencia suficiente.

No confundir Runtime con Programming Model.

Si depende de infraestructura externa no observable:

`REQUIRES_VALIDATION`

No inspeccionar CI/CD protegido para resolverlo.

## Programming Model

Si está confirmado v4:

`NOT_REQUIRED`

Si está confirmado legacy:

`REQUIRED`

cuando el target exige v4.

Si existe mezcla o contradicción:

`REQUIRES_VALIDATION`

No asumir que toda Function App requiere remigración.

## Durable Functions

Si no existe evidencia Durable:

`NOT_APPLICABLE`

Si existe:

evaluar globalmente:

- versión del paquete;
- compatibilidad esperada con target;
- necesidad de migración especializada;
- presencia de workflows.

El análisis de cada workflow pertenece a etapas posteriores.

## Dependencias

Evaluar únicamente dependencias relevantes para:

- Node.js 24;
- Azure Functions;
- Durable Functions;
- Azure SDK;
- build;
- tests;
- shared infrastructure.

No recomendar actualización solo por antigüedad.

## TypeScript

Determinar:

- versión actual;
- necesidad de actualización;
- riesgos relevantes para target.

No modificar configuración.

## Testing global

Registrar:

- framework existente;
- scripts;
- cobertura observable;
- ausencia o presencia general de tests;
- capacidad de ejecutar baseline.

No analizar todavía tests específicos por Function.

## Architecture assessment

Evaluar el estado arquitectónico global observable comparándolo con:

`../_shared/architecture-policy.md`

La evaluación debe ser global, no Function por Function.

## Dimensiones arquitectónicas

Evaluar cuando exista evidencia:

- ubicación de Azure adapters;
- mezcla general entre runtime y lógica funcional;
- organización por capability;
- dependencia directa de SDKs desde lógica;
- aislamiento de configuración;
- existencia de contratos internos;
- infraestructura compartida;
- ownership de shared resources.

## Estado arquitectónico

Usar:

- `ALIGNED`
- `PARTIALLY_ALIGNED`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`

### ALIGNED

La estructura observable ya sigue suficientemente la arquitectura objetivo.

### PARTIALLY_ALIGNED

Existen elementos correctos y otros que deberán revisarse Function por Function.

### CHANGE_REQUIRED

Existe una brecha global clara.

Ejemplos:

- toda la lógica vive dentro de Azure entrypoints;
- infraestructura transversal está mezclada sin límites;
- no existe separación observable entre runtime y comportamiento.

### REQUIRES_VALIDATION

La evidencia global no es suficiente.

## Importante

El assessment arquitectónico no debe decidir todavía exactamente:

- qué archivo mover;
- qué interfaz crear;
- qué capability modificar;
- qué carpetas crear.

Eso pertenece a `analyze-function` y al plan.

## Shared resources assessment

Consumir los candidatos detectados durante discovery.

Evaluar globalmente:

- cantidad;
- tipo;
- consumidores;
- ownership observable;
- riesgo de cambio transversal;
- compatibilidad técnica relevante.

## Estado por shared resource

Usar cuando corresponda:

- `CONFIRMED`
- `INFERRED`
- `UNKNOWN`
- `NOT_APPLICABLE`

Y acción:

- `REQUIRED`
- `NOT_REQUIRED`
- `REQUIRES_VALIDATION`

## Ejemplo

Un repository Cosmos utilizado por tres Functions puede resultar:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "status": "CONFIRMED",
      "ownership": "CAPABILITY",
      "action": "REQUIRES_VALIDATION"
    }

si todavía no se conoce si la implementación necesita cambio para Node.js 24.

## No consolidar prematuramente

Dos recursos que utilizan la misma tecnología no son necesariamente el mismo shared resource.

Ejemplo:

- `CustomerRepository` con Cosmos;
- `ReportRepository` con Cosmos.

No fusionarlos por compartir SDK.

## Riesgos globales

Registrar riesgos como:

- dependencia compartida con muchos consumidores;
- cliente SDK construido en múltiples lugares;
- configuración transversal acoplada;
- workflow Durable extenso;
- estructura mixta legacy/v4;
- ausencia de baseline;
- arquitectura altamente acoplada.

No convertir automáticamente cada riesgo en blocker.

## Salidas

Crear:

`.migration/repository/assessment.json`

`.migration/repository/assessment.md`

Y:

`.migration/lessons/assess-function-app/lessons.json`

`.migration/lessons/assess-function-app/lessons.md`

## assessment.json

Debe contener como mínimo:

- metadata;
- target;
- technicalDimensions;
- architectureAssessment;
- sharedResourcesAssessment;
- testingAssessment;
- risks;
- unknowns;
- externalEvidence;
- status.

Ejemplo conceptual:

    {
      "technicalDimensions": {
        "node": {
          "current": "20",
          "action": "REQUIRED"
        },
        "runtime": {
          "current": "v4",
          "action": "NOT_REQUIRED"
        },
        "programmingModel": {
          "current": "v4",
          "action": "NOT_REQUIRED"
        }
      },
      "architectureAssessment": {
        "status": "PARTIALLY_ALIGNED"
      }
    }

## assessment.md

Debe explicar brevemente:

- qué plataforma ya cumple;
- qué debe cambiar;
- qué necesita validación;
- estado arquitectónico global;
- shared resources relevantes;
- riesgos;
- unknowns.

No debe generar el plan.

## Catálogo

No reescribir:

`.migration/catalog/current-state.md`

para introducir conclusiones futuras.

El catálogo conserva la fotografía inicial.

El assessment puede referenciarlo.

## Estado general

Usar:

- `READY_FOR_ANALYSIS`
- `PARTIAL`
- `BLOCKED`
- `REQUIRES_REVIEW`

### READY_FOR_ANALYSIS

Existe evidencia suficiente para comenzar análisis Function por Function.

No significa que la migración esté lista para ejecutarse.

### PARTIAL

Algunas dimensiones permanecen inciertas, pero es seguro continuar con análisis independientes.

### BLOCKED

Falta evidencia imprescindible incluso para realizar análisis seguro.

### REQUIRES_REVIEW

Existen contradicciones globales que necesitan evaluación humana.

## Lecciones

Aplicar:

`../_shared/lessons-policy.md`

## Criterio de cierre

El skill termina cuando:

- inventory y catálogo fueron consumidos;
- dimensiones técnicas fueron evaluadas independientemente;
- arquitectura global fue evaluada;
- shared resources candidatos fueron considerados;
- lo ya satisfecho quedó como `NOT_REQUIRED`;
- lo desconocido permanece explícito;
- los riesgos globales fueron registrados;
- no se modificó código;
- se generaron assessment y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- generar plan de migración;
- analizar comportamiento detallado por Function;
- decidir estructura concreta por Function;
- crear contracts;
- mover shared resources;
- agregar tests;
- actualizar dependencias;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar.

El siguiente skill sugerido es:

`analyze-function`
