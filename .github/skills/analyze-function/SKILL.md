---
name: analyze-function
description: Analiza una Function concreta para documentar su comportamiento actual, dependencias, arquitectura, recursos compartidos, testabilidad, compatibilidad con Node.js 24 y acciones necesarias para converger hacia la arquitectura objetivo antes de migrarla.
---

# Analyze Function

## Objetivo

Comprender una Function concreta y determinar las acciones necesarias para:

- preservar comportamiento;
- alcanzar testabilidad;
- converger hacia la arquitectura objetivo;
- preparar migración de plataforma;
- reducir dependencia futura del runtime y SDKs.

Este skill no modifica código.

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

La Function debe existir en el inventario.

## Entrada

Recibir una Function objetivo.

Analizar una sola Function o unidad funcional coherente por ejecución.

## Reutilización

Consumir primero:

- inventory;
- assessment;
- catálogo actual cuando sea útil.

No reconstruir el repositorio completo.

## Slice

Leer únicamente el código necesario para comprender:

- entrypoint;
- comportamiento;
- dependencias;
- infraestructura;
- recursos compartidos;
- tests;
- relaciones.

Ampliar contexto solo cuando sea necesario.

## Comportamiento actual

Documentar cuando corresponda:

- trigger;
- input;
- validaciones;
- decisiones;
- servicios;
- persistencia;
- mensajería;
- almacenamiento;
- llamadas externas;
- efectos secundarios;
- output;
- errores.

No inferir comportamiento de negocio únicamente por naming.

## Arquitectura actual

Describir cómo está implementada actualmente la Function.

Evaluar:

- responsabilidad del entrypoint;
- mezcla entre runtime y lógica;
- dependencia directa de SDKs;
- acceso a configuración;
- separación de dominio/aplicación/infraestructura;
- contratos existentes;
- organización por capability.

## Arquitectura objetivo

Determinar cómo debe encajar la Function en la arquitectura definida por:

`../_shared/architecture-policy.md`

La arquitectura objetivo es requerida para código refactorizado.

No significa crear todas las capas.

Definir únicamente las piezas necesarias.

## Architecture gap

Identificar el delta entre estado actual y arquitectura objetivo.

Ejemplos:

- mover lógica fuera de Azure entrypoint;
- aislar Cosmos detrás de un contrato;
- mover implementación a capability;
- separar configuración;
- consolidar recurso compartido;
- crear composition root.

Generar acciones `STRUCTURAL` cuando corresponda.

## Recursos compartidos

Usar candidatos detectados por discovery.

Confirmar para la Function:

- qué recursos consume;
- cómo los usa;
- ownership observable;
- si el recurso es realmente compartido;
- configuración asociada.

Ejemplo conceptual:

    {
      "resourceId": "SR-COSMOS-REPORTS",
      "usage": "Persist report request",
      "status": "CONFIRMED"
    }

No planificar aquí modificaciones duplicadas del recurso.

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

- lógica mezclada con entrypoint;
- `context`;
- `process.env`;
- SDK clients directos;
- side effects;
- globals;
- funciones puras;
- dependencias sustituibles.

Clasificar:

- `HIGH`
- `MEDIUM`
- `LOW`

La ausencia de tests no implica baja testabilidad.

## Tests existentes

Registrar:

- framework;
- archivos;
- comportamiento observable cubierto;
- gaps.

## Tests propuestos

Proponer el conjunto mínimo para preservar comportamiento.

Priorizar:

1. comportamiento principal;
2. validaciones;
3. decisiones;
4. errores;
5. interacciones externas relevantes.

No proponer integration tests.

## Compatibilidad Node.js 24

Evaluar el slice relevante.

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

identificar puntos que deberá transformar el skill correspondiente.

## Durable

Identificar rol cuando aplique.

Considerar contexto mínimo del workflow.

No migrar Durable.

## Deuda técnica

Registrar deuda no bloqueante separadamente.

## Optimización

Registrar oportunidades cuando aparezcan, pero mantenerlas fuera de alcance.

## Categorías

Usar:

- `REQUIRED_PLATFORM`
- `REQUIRED_NODE`
- `REQUIRED_TESTABILITY`
- `STRUCTURAL`
- `TECHNICAL_DEBT`
- `OPTIMIZATION`

## requiredActions

Generar acciones concretas para esta Function.

Cada acción debe contener como mínimo:

- id;
- type;
- action;
- reason;
- evidence;
- status.

Las acciones arquitectónicas necesarias deben aparecer como `STRUCTURAL`.

Las acciones relacionadas con un recurso compartido deben referenciar su `resourceId` cuando corresponda.

## Salidas

Crear:

`.migration/functions/<FunctionName>/analysis.json`

`.migration/functions/<FunctionName>/analysis.md`

## Catálogo por Function

Crear o actualizar:

`.migration/catalog/functions/<FunctionName>.md`

Este documento representa el estado actual anterior a la migración.

Debe incluir:

- resumen;
- trigger;
- Programming Model;
- capability;
- entrada;
- comportamiento actual;
- salida;
- dependencias;
- recursos compartidos;
- configuración;
- relaciones;
- arquitectura actual;
- patrones;
- tests actuales;
- testabilidad;
- compatibilidad;
- deuda;
- riesgos;
- unknowns.

No convertirlo en documentación del estado futuro.

## analysis.json

Debe contener como mínimo:

- metadata;
- Function;
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
- optimization;
- risks;
- unknowns;
- evidence.

## analysis.md

Debe explicar:

- qué hace;
- de qué depende;
- cómo está estructurada hoy;
- qué gap arquitectónico existe;
- qué comportamiento debe preservarse;
- qué tests necesita;
- qué acciones necesita;
- qué recursos compartidos consume;
- qué riesgos permanecen.

## Lecciones

Crear:

`.migration/lessons/analyze-function/<FunctionName>.json`

`.migration/lessons/analyze-function/<FunctionName>.md`

Aplicar `lessons-policy.md`.

## Criterio de cierre

El skill termina cuando:

- el comportamiento actual fue documentado;
- arquitectura actual y target fueron comparadas;
- recursos compartidos fueron confirmados;
- testabilidad fue evaluada;
- tests fueron propuestos;
- compatibilidad Node.js 24 fue evaluada;
- requiredActions fueron generadas;
- el catálogo individual fue creado;
- deuda y optimización quedaron separadas;
- se generaron analysis y lessons.

## Fuera de alcance

Este skill no debe:

- modificar código;
- crear tests;
- aplicar arquitectura;
- actualizar dependencias;
- migrar Runtime;
- migrar Programming Model;
- migrar Durable;
- optimizar.

El siguiente skill sugerido es:

`plan-function-migration`
