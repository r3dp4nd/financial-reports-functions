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

## Precondiciones

Deben existir:

`.migration/repository/inventory.json`

`.migration/repository/assessment.json`

La Function debe existir en el inventory.

## Entradas

Recibir una Function objetivo.

Consumir primero:

- inventory;
- assessment;
- catálogo actual cuando sea útil;
- shared resources detectados.

Analizar una Function o unidad funcional coherente por ejecución.

## Progressive disclosure

Leer únicamente el slice necesario para comprender:

- entrypoint;
- comportamiento;
- dependencias directas;
- infraestructura;
- recursos compartidos;
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
- corregir ownership de un recurso compartido.

Registrar acciones `STRUCTURAL` cuando corresponda.

## Recursos compartidos

Confirmar para la Function:

- resourceId;
- usage;
- ownership;
- status;
- configuración asociada.

No planificar aquí una segunda modificación de un shared resource.

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

Clasificar hallazgos como:

- `CONFIRMED_COMPATIBLE`
- `CHANGE_REQUIRED`
- `REQUIRES_VALIDATION`
- `NOT_APPLICABLE`

No asumir compatibilidad por compilación.

## Programming Model

Si ya está v4:

no generar acción de migración.

Si es legacy:

identificar puntos de adaptación requeridos.

## Durable

Identificar rol y contexto mínimo del workflow cuando aplique.

No migrar Durable.

## Categorías

Usar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

## requiredActions

Cada acción debe contener como mínimo:

- id;
- type;
- action;
- reason;
- evidence;
- status.

Referenciar `resourceId` cuando afecte un recurso compartido.

No convertir deuda u optimización en acción obligatoria.

## Salidas estructuradas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

`analysis.json` es el owner de:

- behavior;
- dependencies;
- sharedResources;
- currentArchitecture;
- targetArchitecture;
- architectureGap;
- configuration;
- relationships;
- testability;
- tests;
- compatibility;
- requiredActions;
- debt;
- risks;
- unknowns.

## Catálogo por Function

Crear:

`.migration/catalog/functions/<FunctionName>.md`

Usar:

`../_shared/templates/function-current-state.template.md`

Este documento representa el BEFORE.

No actualizarlo posteriormente para representar el estado migrado.

## Lecciones

Crear:

`.migration/lessons/analyze-function/<FunctionName>.json`

`.migration/lessons/analyze-function/<FunctionName>.md`

## Criterio de cierre

El skill termina cuando:

- comportamiento fue documentado;
- arquitectura actual y target fueron comparadas;
- resources fueron confirmados;
- testabilidad fue evaluada;
- tests fueron propuestos;
- compatibilidad fue evaluada;
- requiredActions fueron generadas;
- ficha BEFORE fue creada;
- deuda y optimización quedaron separadas;
- se generaron analysis y lessons.

## Fuera de alcance

No debe:

- modificar código;
- agregar tests;
- aplicar arquitectura;
- actualizar dependencias;
- generar el plan;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar.

Siguiente skill sugerido:

`plan-function-migration`
